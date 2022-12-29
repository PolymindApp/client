<template>
    <Page :title="deckName"
        class="fill-height pa-0 d-flex flex-column"
        tabindex="0"
        fluid
        v-bind="$attrs"
        v-on="$listeners"
        v-touch="{
            up: handleSwipeUp,
            down: handleSwipeDown,
            left: handleSwipeLeft,
            right: handleSwipeRight,
        }"
        v-on-mouse-inactive="{
            delay: 5000,
            callback: handleOnMouseInactive,
        }"
        v-hotkey="keymap"
        v-window-focus="onWindowFocus"
        v-window-blur="onWindowBlur"
        @mousemove="handleMouseMouse"
    >

        <!-- BREADCRUMBS -->
        <portal to="desktop_nav">
            <DesktopNav :deck="deck" background-color="transparent" hide-slider />
        </portal>

        <!-- ACTIONS -->
        <portal v-if="$vuetify.breakpoint.mdAndUp" to="toolbar_right">
            <ShortcutDialog
                :title="$t('shortcutDialog.title')"
                :visible.sync="shortcutDialog.visible"
                :shortcuts="shortcuts"
                max-width="600"
                scrollable
            />
            <v-btn outlined text @click="handleShortcutClick">
                <v-icon left>mdi-keyboard</v-icon>
                <span v-text="$t('session.shortcuts.btn')"></span>
            </v-btn>
        </portal>

        <!-- OPTIONS -->
        <portal to="options">
            <v-list-item :disabled="!canAdjustPlaybackSettings" @click="handlePlaybackSettingsClick">
                <v-list-item-icon>
                    <v-icon>mdi-headphones-settings</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-text="$t('btn.playbackSettings')"></v-list-item-content>
            </v-list-item>
            <v-list-item v-if="isDictionary" @click="onDictionaryLanguageChange">
                <v-list-item-icon>
                    <v-icon>mdi-translate</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-text="$t('session.language.btn')"></v-list-item-content>
            </v-list-item>
            <v-divider class="my-2" />
            <v-list-item :disabled="!canResetSession" @click="handleResetSessionClick">
                <v-list-item-icon>
                    <v-icon>mdi-reload</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-text="$t('btn.reset')"></v-list-item-content>
            </v-list-item>
<!--            <v-list-item :disabled="!canExport" @click="handleExportClick">-->
<!--                <v-list-item-icon>-->
<!--                    <v-icon>mdi-cloud-download-outline</v-icon>-->
<!--                </v-list-item-icon>-->
<!--                <v-list-item-content v-text="$t('btn.exportSession')"></v-list-item-content>-->
<!--            </v-list-item>-->
            <v-divider class="my-2" />
        </portal>

        <!-- PLAYBACK SETTINGS -->
        <PlaybackSettingsModal
            :data.sync="playbackSettingsDialog.data"
            :original="settings"
            :visible.sync="playbackSettingsDialog.visible"
            :ambiences="ambiences"
            :events="events"
            :cards="originalCards"
            :deck="deck"
            :fullscreen="$vuetify.breakpoint.smAndDown"
            :max-width="900"
            persistent
            scrollable
            attach="#layout"
            @update="handleUpdateSettings"
        />

        <!-- EXPORT TO MP3 SETTINGS -->
<!--        <Modal v-model="exportSessionDialog.visible" :disabled="exportSessionDialog.loading" :title="$t('session.exportSessionDialog.title')" max-width="500" :fullscreen="$vuetify.breakpoint.smAndDown" persistent scrollable>-->
<!--            <template #body>-->
<!--                <div v-text="$t('session.exportSessionDialog.desc')"></div>-->
<!--            </template>-->
<!--            <template #buttons>-->
<!--                <v-btn :block="$vuetify.breakpoint.smAndDown" :loading="exportSessionDialog.loading" :disabled="exportSessionDialog.loading" color="primary" large @click="exportSession">-->
<!--                    <span v-text="$t('btn.export')"></span>-->
<!--                </v-btn>-->
<!--                <v-btn :block="$vuetify.breakpoint.smAndDown" :disabled="exportSessionDialog.loading" outlined large @click="exportSessionDialog.visible = false">-->
<!--                    <span v-text="$t('btn.cancel')"></span>-->
<!--                </v-btn>-->
<!--            </template>-->
<!--        </Modal>-->

        <!-- DICTIONARY LANGUAGE SELECTION -->
        <Modal v-model="showDictionaryLanguageSelection.visible" :title="$t('session.dictionaryLanguageSelection.title')" max-width="500" persistent scrollable>
            <template #body>
                <div v-text="$t('session.dictionaryLanguageSelection.desc')"></div>

                <!-- LANGUAGES: DESKTOP -->
                <div v-if="$vuetify.breakpoint.mdAndUp" class="mt-3 d-flex justify-center flex-wrap" style="gap: 0.5rem">
                    <v-chip-group v-model="showDictionaryLanguageSelection.data" color="primary" column multiple>
                        <v-chip :value="i18n.language.data.code" :key="i18n.id" v-for="i18n in allLanguages" label outlined small>
                            <span v-text="i18n.language.data.name"></span>
                        </v-chip>
                    </v-chip-group>
                </div>

                <!-- LANGUAGES: MOBILE -->
                <v-select
                    v-else
                    v-model="showDictionaryLanguageSelection.data"
                    :placeholder="$t('label.languages')"
                    :items="allLanguages"
                    class="my-3"
                    item-text="language.data.name"
                    item-value="language.data.code"
                    outlined
                    multiple
                    hide-details
                />

                <v-expand-transition>
                    <div v-if="showDictionaryLanguageSelection.data.length > 2">
                        <v-alert
                            text
                            type="warning"
                            colored-border
                            class="mt-3 mb-0"
                        >
                            No more than two languages!
                        </v-alert>
                    </div>
                </v-expand-transition>
            </template>
            <template #buttons>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :disabled="!canStartDictionarySession" color="primary" large @click="onDictionaryLanguageSelectionConfirm">
                    <span v-text="$t('btn.apply')"></span>
                </v-btn>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :disabled="showDictionaryLanguageSelection.loading" outlined large @click="onDictionaryLanguageSelectionCancel">
                    <span v-text="$t('btn.cancel')"></span>
                </v-btn>
            </template>
        </Modal>

        <!-- LAYOUT -->
        <div id="layout" ref="layout" :style="layoutStyle" :class="{
            'w-100 fill-height background': true,
            'paused': !playing,
            'animated': _settings.data.animation,
        }">
            <v-overlay v-if="hasBackground" :color="$vuetify.theme.dark ? 'black' : 'white'" :opacity="opacity" z-index="1" absolute></v-overlay>

            <v-fade-transition
                v-for="range in indexes"
                :key="'media_' + filteredCards[range].id"
                class="fill-height w-100"
            >
                <v-img
                    v-if="_settings.data.imageEnabled && filteredCards[range].media && isWithinExtendedRange(range, 2)"
                    :key="'media_img_' + filteredCards[index].id"
                    :src="filteredCards[range].media"
                    :style="{
                        position: 'absolute',
                        opacity: index === range ? 1 : 0.01,
                    }"
                    class="w-100 fill-height align-center text-center justify-center"
                >
                    <template #placeholder>
                        <v-progress-circular
                            :color="!$vuetify.theme.dark ? 'black' : 'white'"
                            indeterminate
                            size="128"
                        />
                    </template>
                </v-img>
            </v-fade-transition>

            <div style="z-index: 1; position: relative" class="w-100 fill-height d-flex flex-column align-content-between justify-center">
                <v-container style="flex: 0" class="pa-4" fluid>
                    <v-row>
                        <v-col cols="4">

                        </v-col>
                        <v-col cols="4" class="text-center"></v-col>
                        <v-col cols="4" class="d-flex align-center justify-end">
                            <v-tooltip attach="#layout" left>
                                <template #activator="{ attrs, on }">
                                    <v-expand-transition>
                                        <v-btn v-if="showControls" v-bind="attrs" v-on="on" icon :disabled="!canEject" @click="handleEjectClick">
                                            <v-icon>mdi-eject-outline</v-icon>
                                        </v-btn>
                                    </v-expand-transition>
                                </template>
                                <span v-text="$t('session.eject')"></span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                </v-container>
                <div style="flex: 1" class="pa-4 d-flex align-center justify-space-between">
                    <v-btn v-if="showNavigation" :disabled="!canGoPrevious" height="30vh" text x-large @click="handlePrevClick">
                        <v-icon size="7.5vh" v-text="$vuetify.rtl ? 'mdi-chevron-right' : 'mdi-chevron-left'"></v-icon>
                    </v-btn>
                    <div class="d-flex flex-nowrap align-center justify-center fill-height" style="flex: 1; position: relative">
                        <v-progress-linear v-if="skeleton" color="primary" style="width: 10rem" indeterminate></v-progress-linear>
                        <v-btn v-else-if="completed" height="15vh" width="15vh" text fab x-large @click="handleResetClick">
                            <v-icon size="7.5vh">mdi-refresh</v-icon>
                        </v-btn>
                        <div v-else-if="originalCards.length === 0" class="text-center" style="max-width: 15rem">
                            <v-icon color="warning" x-large>mdi-alert</v-icon>
                            <h3 class="mt-2" v-text="$t('session.emptyWarning')"></h3>
                        </div>
                        <div v-else-if="filteredCards.length === 0 && !ready" class="text-center" style="max-width: 15rem">
                            <v-icon color="warning" x-large>mdi-alert</v-icon>
                            <h3 class="mt-2" v-text="$t('session.emptyFiltersWarning')"></h3>
                        </div>
                        <div v-else-if="filteredCards[index]" :class="{
                            'px-4 text-center abs_middle': true,
                            'clickable': currentSideHasAudio
                        }">
                            <template v-for="range in indexes">
                                <transition :key="'front_' + filteredCards[range].id" :name="transition">
                                    <v-card v-if="ready && showFront && index === range">
                                        <h1 v-ripple="currentSideHasAudio" @click="currentSideHasAudio ? handleClickCard(filteredCards[range], 'front') : undefined" :class="{
                                            'text-capitalize-first text-h4 text-md-h3 text-lg-h2': !_settings.data.flipped,
                                            'text-capitalize-first text-h3 text-md-h2 text-lg-h1 primary--text': _settings.data.flipped,
                                        }" v-text="filteredCards[range].front"></h1>
                                    </v-card>
                                </transition>
                                <transition :key="'back_' + filteredCards[range].id" :name="transition">
                                    <v-card v-if="ready && showBack && index === range">
                                        <h1 v-ripple="currentSideHasAudio" @click="currentSideHasAudio ? handleClickCard(filteredCards[range], 'back') : undefined" :class="{
                                            'text-capitalize-first text-h4 text-md-h3 text-lg-h2': _settings.data.flipped,
                                            'text-capitalize-first text-h3 text-md-h2 text-lg-h1 primary--text': !_settings.data.flipped,
                                        }" v-text="filteredCards[range].back"></h1>
                                    </v-card>
                                </transition>
                            </template>
                        </div>
                    </div>
                    <v-btn v-if="showNavigation" :disabled="!canGoNext" height="30vh" text x-large @click="handleNextClick">
                        <v-icon size="7.5vh" v-text="$vuetify.rtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"></v-icon>
                    </v-btn>
                </div>
                <v-container style="flex: 0" class="pa-4" fluid>
                    <v-row>
                        <v-col cols="3" class="d-flex align-center justify-start" style="gap: 0.5rem">
                            <v-expand-transition>
                                <v-btn v-if="showControls" icon :disabled="playing ? !canPause : !canPlay" @click="() => playing ? handlePauseClick() : handlePlayClick()">
                                    <v-icon v-text="playing ? 'mdi-pause' : 'mdi-play'"></v-icon>
                                </v-btn>
                            </v-expand-transition>
                            <v-expand-transition>
                                <v-btn v-if="showControls" icon :disabled="muted ? !canUnmute : !canMute" @click="() => muted ? handleUnmuteClick() : handleMuteClick()">
                                    <v-icon v-text="muted ? 'mdi-volume-off' : 'mdi-volume-high'"></v-icon>
                                </v-btn>
                            </v-expand-transition>
                        </v-col>
                        <v-col cols="6" class="d-flex align-center justify-center text-center text-no-wrap" style="gap: 1rem">
                            <v-btn v-if="showControls && originalCards.length > 0" :disabled="!canGoFirst" icon @click="goFirst">
                                <v-icon>mdi-page-first</v-icon>
                            </v-btn>
                            <div v-if="showControls" style="position: relative">
                                <v-slide-y-reverse-transition>
                                    <div v-if="showProgressiveIncrementation" class="text-center third--text font-weight-black" style="position: absolute; top: -2rem; right: 0">
                                        +1
                                    </div>
                                </v-slide-y-reverse-transition>
                                <div>
                                    <span v-if="!ready"></span>
                                    <span v-else-if="filteredCards.length > 0" v-text="$t('session.indexOf', {
                                        current: index + 1,
                                        total: filteredCards.length,
                                    })"></span>
                                    <span v-else-if="filteredCards.length < originalCards.length" v-text="$t('session.noCardsLeft')"></span>
                                </div>
                                <div v-if="hasRange">
                                    <v-progress-linear
                                        :value="((index - minIndex + 1) * 100) / (maxIndex - minIndex + 1)"
                                        color="third"
                                        height="3"
                                    ></v-progress-linear>
                                </div>
                            </div>
                            <v-btn v-if="showControls && originalCards.length > 0" :disabled="!canGoLast" icon @click="goLast">
                                <v-icon>mdi-page-last</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols="3" class="d-flex align-center justify-end" style="gap: 0.5rem">
                            <v-expand-transition>
                                <v-btn v-if="showControls" icon :disabled="!canFullscreen" @click="() => fullscreen ? handleExitFullScreenClick() : handleEnterFullScreenClick()">
                                    <v-icon v-if="!fullscreen">mdi-fullscreen</v-icon>
                                    <v-icon v-else>mdi-fullscreen-exit</v-icon>
                                </v-btn>
                            </v-expand-transition>
                        </v-col>
                    </v-row>
                </v-container>
                <v-expand-transition>
                    <v-progress-linear v-once id="progress_bar" :value="progress" height="5" />
                </v-expand-transition>
            </div>
        </div>
    </Page>
</template>

<script>
import DeckSelect from '@/components/breadcrumbs/DeckSelect';
import MobileNav from '@/components/layout/MobileNav';
import DesktopNav from '@/components/layout/DesktopNav';
import Page from '@/components/layout/Page';
import PlaybackSettingsModal from '@/components/PlaybackSettingsModal';
import Modal from '@/components/generic/Modal';
import ShortcutDialog from '@/components/ShortcutDialog';
import PlaybackSettingsModel from '@/models/PlaybackSettingsModel';
import DictionaryModel from '@/models/DictionaryModel';
import Services from "@/utils/Services";
import ambiencesJson from '../../../../.ambiences.json';
import DeckMixin from "@/mixins/deck.mixin";
import {IDictionarySettings} from "@/models/SettingsModel";
// import audioDecode from 'audio-decode';
// import Crunker from 'crunker';

export default {
    name: "Play",

    mixins: [DeckMixin],

    components: { DeckSelect, MobileNav, Modal, DesktopNav, PlaybackSettingsModal, ShortcutDialog, Page },

    data: () => ({
        loading: false,
        skeleton: true,
        playing: false,
        ready: false,
        firstPlay: true,
        autoPlay: false,
        completed: false,
        showFront: false,
        showBack: false,
        fullscreen: false,
        mustSaveSettings: false,
        settingsHasBeenUpdated: false,
        showProgressiveIncrementation: false,
        wasPaused: false,
        muted: false,
        active: true,
        cards: [],
        filteredCards: [],
        originalCards: [],
        index: -1,
        progress: 0,
        repeat: 0,
        settings: new PlaybackSettingsModel(),
        audios: {},
        ambience: new Audio(),
        startTime: null,
        pauseTime: null,
        playbackSettingsDialog: {
            visible: false,
            data: new PlaybackSettingsModel(),
        },
        shortcutDialog: {
            visible: false,
        },
        showDictionaryLanguageSelection: {
            visible: false,
            loading: false,
            changingLanguage: false,
            data: [],
            callback: () => {},
        },
        dictionary: new DictionaryModel(),
        // exportSessionDialog: {
        //     visible: false,
        //     loading: false,
        //     data: {},
        // },
        buffer: null,
        transition: 'slide',
    }),

    computed: {

        shortcuts() {
            const noop = () => null;
            return [
                { key: 'left', i18n: 'shortcut.previous', callback: this.canGoPrevious ? this.handlePrevClick : noop },
                { key: 'right', i18n: 'shortcut.next', callback: this.canGoNext ? this.handleNextClick : noop },
                { key: 'up', i18n: 'shortcut.flipFirst', callback: this.canFlip ? this.flipFirst : noop },
                { key: 'down', i18n: 'shortcut.flipOther', callback: this.canFlip ? this.flipOther : noop },
                { key: 'backspace', i18n: 'shortcut.eject', callback: this.canEject ? this.handleEjectKeyDown : noop },
                { key: 'space', i18n: 'shortcut.togglePlayPause', callback: this.canPlay ? this.handlePlayClick : this.canPause ? this.handlePauseClick : noop },
                { key: 'pageup', i18n: 'shortcut.moveForward', callback: this.canMoveForward ? () => this.moveForward(20) : noop },
                { key: 'pagedown', i18n: 'shortcut.moveBackward', callback: this.canMoveBackward ? () => this.moveBackward(20) : noop },
                { key: 'home', i18n: 'shortcut.first', callback: this.canGoFirst ? this.goFirst : noop },
                { key: 'end', i18n: 'shortcut.last', callback: this.canGoLast ? this.goLast : noop },
                { key: 'm', i18n: 'shortcut.toggleMute', callback: this.toggleMute },
                { key: 'r', i18n: 'shortcut.repeatCurrentWordAudio', callback: this.repeatCurrentWordAudio },
                { key: 'f', i18n: 'shortcut.toggleFullscreen', callback: this.canFullscreen ? () => this.setFullscreen(!this.fullscreen) : noop },
            ];
        },

        keymap() {
            const keymap = {};
            this.shortcuts.forEach(shortcut => {
                keymap[shortcut.key] = shortcut.callback;
            });
            return keymap;
        },

        _settings() {
            return new PlaybackSettingsModel({
                ...this.settings.data,
                music: this.settings.data.music && this.settings.data.ambience,
                mode: this.deck.data.single ? 'front' : this.settings.data.side,
                backVoiceEnabled: this.deck.data.single ? false : this.settings.data.backVoiceEnabled,
                flipped: this.deck.data.single ? false : this.settings.data.flipped,
            });
        },

        canGoPrevious() {
            return !this.loading && !this.skeleton && this.filteredCards.length > 1 && this.ready;
        },

        canGoNext() {
            return !this.loading && !this.skeleton && this.filteredCards.length > 1 && this.ready;
        },

        canPlay() {
            return !this.loading && !this.skeleton && !this.playing && !this.completed && this.filteredCards.length > 0;
        },

        canPause() {
            return !this.loading && !this.skeleton && this.playing;
        },

        canUnmute() {
            return this.muted;
        },

        canMute() {
            return !this.muted;
        },

        canFullscreen() {
            return document.documentElement.requestFullscreen
                || document.documentElement.mozRequestFullScreen
                || document.documentElement.webkitRequestFullScreen
                || document.documentElement.msRequestFullscreen;
        },

        canEject() {
            return !this.skeleton && this.ready && this.filteredCards.length > 0;
        },

        canResetSession() {
            return !this.skeleton && this.originalCards.length !== this.filteredCards.length;
        },

        canAdjustPlaybackSettings() {
            return !this.skeleton && this.originalCards.length > 0;
        },

        canExport() {
            return !this.skeleton && this.originalCards.length > 0;
        },

        canFlip() {
            return !this.skeleton && this.ready && this.filteredCards.length > 0 && this._settings.data.side === null;
        },

        canGoFirst() {
            return !this.skeleton && this.ready && this.filteredCards.length > 1 && this.index !== this.minIndex;
        },

        canGoLast() {
            return !this.skeleton && this.ready && this.filteredCards.length > 1 && this.index !== this.maxIndex;
        },

        canMoveBackward() {
            return !this.skeleton && this.ready && this.filteredCards.length > 1;
        },

        canMoveForward() {
            return !this.skeleton && this.ready && this.filteredCards.length > 1;
        },

        canStartDictionarySession() {
            const langParams = [];
            ['lang_front', 'lang_back'].forEach(key => {
                if (this.$route.params[key]) {
                    langParams.push(this.$route.params[key]);
                }
            });
            return !this.showDictionaryLanguageSelection.loading &&
                this.showDictionaryLanguageSelection.data.length > 0 &&
                this.showDictionaryLanguageSelection.data.length <= 2 &&
                JSON.stringify(this.showDictionaryLanguageSelection.data.sort()) !== JSON.stringify(langParams.sort())
        },

        isDictionary() {
            return this.$route.name === 'session.dictionary';
        },

        events() {
            return this.cards.map(card => new Date(card.created_at).toISOString().substr(0, 10));
        },

        showNavigation() {
            return !this.skeleton && this.originalCards.length > 0 && (this.$vuetify.breakpoint.mdAndUp || this.$root.orientation === 'landscape') && this.showControls;
        },

        showProgress() {
            return this.ready && !this.completed && this.showControls;
        },

        showControls() {
            return true;//this.ready && (this.active || !this.playing);
        },

        hasRange() {
            return this.minIndex > 0 || (this.maxIndex !== this.filteredCards.length - 1);
        },

        firstDelay() {
            return this._settings.data.side !== 'back'
                ? this._settings.data.delay * 1000
                    + (((this.currentAudio.front || {}).duration || 0) * 1000)
                : 0;
        },

        otherDelay() {
            return this._settings.data.side !== 'front'
                ? this._settings.data.delay * 1000
                    + (((this.currentAudio.back || {}).duration || 0) * 1000)
                : 0;
        },

        totalDelay() {
            return this.firstDelay + this.otherDelay;
        },

        isFirstSide() {
            return (!this._settings.data.flipped && this.showFront)
                || (this._settings.data.flipped && this.showBack);
        },

        currentSideHasAudio() {
            return this.currentAudio[this.showFront ? 'front' : 'back'] ? true : false;
        },

        isOtherSide() {
            return (!this._settings.data.flipped && this.showBack)
                || (this._settings.data.flipped && this.showFront);
        },

        currentAudio() {
            return (this.audios[(this.filteredCards[this.index] || {}).id] || {});
        },

        background() {
            return this._settings.data.wallpaper && !(this.filteredCards[this.index] || {}).media ? (this.ambiences.find(ambience => ambience.value === this._settings.data.ambience) || {}).bg : null;
        },

        hasBackground() {
            return this.background || (this.filteredCards[this.index] || {}).media;
        },

        opacity() {
            return (this.ambiences.find(ambience => ambience.value === this._settings.data.ambience) || {}).opacity || (this.$vuetify.theme.dark ? 0.85 : 0.75);
        },

        volume() {
            return this.muted ? 0 : 1;
        },

        ambienceVolume() {
            return (this.ambiences.find(ambience => ambience.value === this._settings.data.ambience) || {}).volume || 0.2;
        },

        layoutStyle() {
            return {
                flex: 1,
                backgroundImage: 'url(' + this.background + ')',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
            };
        },

        ambiences() {
            const ambiences = [{
                text: this.$i18n.t('state.none'),
                value: null,
            }];
            ambiences.push(...ambiencesJson.map(ambience => ({
                ...ambience,
                text: ambience.title,
                value: ambience.url,
            })));
            return ambiences;
        },

        indexes() {
            const indexes = [];
            for (let i = 0; i < this.filteredCards.length; i++) {
                indexes.push(i);
            }
            return indexes;
        },

        minIndex() {
            return this._settings.data.cardRangeFrom
                ? this._settings.data.cardRangeFrom < 0
                    ? 0
                    : this._settings.data.cardRangeFrom
                : 0;
        },

        maxIndex() {
            const totalCards = this.filteredCards.length - 1;
            return this._settings.data.cardRangeTo
                ? this._settings.data.cardRangeTo > totalCards
                    ? totalCards
                    : this._settings.data.cardRangeTo
                : totalCards;
        },

        allLanguages() {
            return this.dictionary.languages()
        }
    },

    watch: {
        index: {
            handler(newValue, oldValue) {

                this.resetTime();

                if (oldValue) {
                    const audio = this.audios[(this.filteredCards[oldValue] || {}).id] || {};
                    if (audio.front) {
                        audio.front.element.pause();
                    }
                    if (audio.back) {
                        audio.back.element.pause();
                    }
                }

                const currentCardId = (this.filteredCards[this.index] || {}).id || null;
                if (this._settings.data.lastCardId !== currentCardId) {
                    this.mustSaveSettings = true;
                    this.settings.data.lastCardId = currentCardId;
                }

                this.setFirstSide(this._settings.data.side !== 'back');
                this.setOtherSide(this._settings.data.side === 'back');
            },
        },
        'playbackSettingsDialog.visible'(visible) {
            if (visible && this.playing) {
                this.pause();
            } else if (!visible && this.pauseTime && !this.wasPaused) {
                if (this.settingsHasBeenUpdated) {
                    this.resetTime();
                    this.playCurrentWordAudio();
                    this.settingsHasBeenUpdated = false;
                }
                this.play(false);
            } else if (visible) {
                this.wasPaused = true;
            } else if (!visible) {
                this.wasPaused = false;
            }
        }
    },

    methods: {
        handleShortcutClick() {
            this.shortcutDialog.visible = true;
        },

        handleKeyDown() {
            this.active = true;
        },

        handleMouseMouse() {
            this.active = true;
        },

        handleOnMouseInactive() {
            this.active = false;
        },

        handleUnmuteClick() {
            this.unmute();
        },

        handleMuteClick() {
            this.mute();
        },

        handleUpdateSettings(settings) {
            this.settings = settings;
            this.applySettings();
            this.$snack(this.$i18n.t('session.playbackSettings.applied'));

            this.deck.data.playback_settings = settings.clone();
            this.settingsHasBeenUpdated = true;

            this.filteredCards = this.filterCards(this.cards);
            this.calculateAudioLength(this.filteredCards);

            if (this.index > this.maxIndex) {
                this.index = this.maxIndex;
            }
        },
        handleEnterFullScreenClick() {
            this.setFullscreen(true);
        },
        handleExitFullScreenClick() {
            this.setFullscreen(false);
        },
        handleClickCard(card, side) {
            if (this.audios[card.id] && this.audios[card.id][side]) {
                this.audios[card.id][side].element.currentTime = 0;
                this.audios[card.id][side].element.play();
            }
        },

        handleSwipeUp() {
            if (this.canFlip) {
                this.flipFirst();
            }
        },

        handleSwipeDown() {
            if (this.canFlip) {
                this.flipOther();
            }
        },

        handleSwipeLeft() {
            if (this.canGoNext) {
                this.transition = 'slide-left';
                this.next(true);
                setTimeout(() => {
                    this.transition = 'slide';
                }, 400);
            }
        },

        handleSwipeRight() {
            if (this.canGoPrevious) {
                this.transition = 'slide-right';
                this.prev();
                setTimeout(() => {
                    this.transition = 'slide';
                }, 400);
            }
        },

        // handleExportClick() {
        //     Object.assign(this.exportSessionDialog, {
        //         visible: true,
        //         loading: false,
        //         data: {},
        //     });
        // },

        handleResetSessionClick() {
            this.reset();
            this.pause();
        },

        handlePlaybackSettingsClick() {
            Object.assign(this.playbackSettingsDialog, {
                visible: true,
                data: new PlaybackSettingsModel(this.$deepClone(this.settings.data)),
            });
        },

        handlePrevClick() {
            this.transition = 'slide-right';
            this.prev();
            setTimeout(() => {
                this.transition = 'slide';
            }, 400);
        },

        handleNextClick() {
            this.transition = 'slide-left';
            this.next(true);
            setTimeout(() => {
                this.transition = 'slide';
            }, 400);
        },

        handlePlayClick() {
            if (this.firstPlay) {
                this.$sound.play('play', 0.15);
                this.firstPlay = false;
                this.playing = true;

                setTimeout(() => {
                    this.playCurrentWordAudio();
                    this.play();
                }, 500);
            } else {
                this.play();
            }
        },

        handlePauseClick() {
            this.pause();
        },

        handleEjectKeyDown() {
            this.handleEjectClick();
        },

        handleEjectClick() {

            this.$sound.play('remove', 0.5);

            const card = this.filteredCards[this.index];
            this.settings.data.ejected.push(card.id);

            this.filteredCards = this.filterCards(this.cards);
            this.mustSaveSettings = true;
            this.resetTime();

            if (this.index > this.maxIndex) {
                this.index = this.maxIndex;
            }
            if (this.index === -1) {
                this.playing = false;
                this.completed = true;
                this.$sound.play('completed');
            } else {
                this.setFirstSide(this._settings.data.side !== 'back');
                this.setOtherSide(this._settings.data.side === 'back');
            }
        },

        handleResetClick() {
            this.reset();
            this.pause();
        },

        onWindowFocus() {
        },

        onWindowBlur() {
        },

        onDictionaryLanguageSelectionConfirm() {
            const params = {
                uuid: this.$route.params.uuid,
            };
            params.lang_front = this.showDictionaryLanguageSelection.data[0];
            if (this.showDictionaryLanguageSelection.data.length > 1) {
                params.lang_back = this.showDictionaryLanguageSelection.data[1];
            }
            this.$router.replace({ name: 'session.dictionary', params });
            // this.showDictionaryLanguageSelection.callback(...this.showDictionaryLanguageSelection.data);
        },

        onDictionaryLanguageSelectionCancel() {
            if (this.showDictionaryLanguageSelection.changingLanguage) {
                this.showDictionaryLanguageSelection.visible = false;
            } else {
                this.$router.back();
            }
        },

        onDictionaryLanguageChange() {
            this.showDictionaryLanguageSelection.visible = true;
            this.showDictionaryLanguageSelection.changingLanguage = true;
            this.showDictionaryLanguageSelection.data = [];
            if (this.$route.params.lang_front) {
                this.showDictionaryLanguageSelection.data.push(this.$route.params.lang_front);
            }
            if (this.$route.params.lang_back) {
                this.showDictionaryLanguageSelection.data.push(this.$route.params.lang_back);
            }
        },

        isWithinExtendedRange(index, range) {
            const valid = [];
            for (let i = range; i > 0; i--) {
                const downward = this.index - i;
                if (downward >= this.minIndex) {
                    valid.push(downward);
                } else {
                    valid.push(this.maxIndex + (this.minIndex + downward + 1));
                }
            }
            valid.push(this.index);
            for (let i = 1; i <= range + 1; i++) {
                const upward = this.index + i;
                if (upward <= this.maxIndex) {
                    valid.push(upward);
                } else {
                    valid.push(upward - this.maxIndex);
                }
            }
            return valid.indexOf(index) !== -1;
        },

        checkSaveSettings() {
            if (this.mustSaveSettings && this.deck.data.id) {
                return this.saveSettings();
            }
        },

        saveSettings() {
            this.deck.data.playback_settings = new PlaybackSettingsModel(this.$deepClone(this._settings.data));
            return Services.updateDeck(this.deck.data.id, this.deck)
                .then(() => {
                    this.mustSaveSettings = false;
                })
                .catch(this.$handleError)
                .finally(() => this.saving = false);
        },

        setFullscreen(state) {
            if (state) {
                const element = this.$refs.layout;
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }

                this.fullscreen = true;
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }

                const element = this.$refs.layout;
                if (element.exitFullscreen) {
                    element.exitFullscreen();
                } else if (element.webkitExitFullscreen) {
                    element.webkitExitFullscreen();
                } else if (element.mozCancelFullScreen) {
                    element.mozCancelFullScreen();
                } else if (element.msExitFullscreen) {
                    element.msExitFullscreen();
                }

                this.fullscreen = false;
            }
        },

        filterCards(cards) {
            const from = this._settings.data.fromDate ? new Date(this._settings.data.fromDate) : null;
            const to = this._settings.data.toDate ? new Date(this._settings.data.toDate).setDate(new Date(this._settings.data.toDate).getDate() + 1) : null;
            const result = cards.filter(card => (!from || new Date(card.created_at) >= from) && (!to || new Date(card.created_at) <= to) && this._settings.data.ejected.indexOf(card.id) === -1)
                .sort((a, b) => a.created_at < b.created_at ? -1 : 1);
            return this._settings.data.reversed ? result.reverse() : result;
        },

        resetTime(date = new Date()) {
            this.startTime = date;
            this.endTime = new Date(date.getTime() + this.totalDelay);
            this.progress = 0;
            this.pauseTime = null;

            const progressBarElement = document.getElementById('progress_bar');
            if (progressBarElement) {
                progressBarElement.querySelector('.v-progress-linear__determinate').style.width = this.progress + '%';
            }
        },

        onFrame(progressBarElement) {
            if (!this.playing || this._isBeingDestroyed) {
                return false;
            }

            const nowTime = new Date().getTime();
            const remainingTime = this.endTime.getTime() - nowTime;
            const originalRange = this.endTime.getTime() - this.startTime.getTime();
            if (remainingTime <= 0) {
                this.next();
                this.setFirstSide(this._settings.data.side !== 'back');
                this.setOtherSide(this._settings.data.side === 'back');
            } else {
                this.progress = (this.totalDelay - remainingTime) * 100 / this.totalDelay;
                if (progressBarElement) {
                    progressBarElement.style.width = this.progress + '%';
                }

                if (this._settings.data.side === null) {
                    const midProgress = originalRange - (((this.currentAudio.front || {}).duration || 0) * 1000) - (this._settings.data.delay * 1000);
                    if (!this.isOtherSide && remainingTime < midProgress) {
                        this.setFirstSide(this._settings.data.side === 'back');
                        this.setOtherSide(this._settings.data.side !== 'back');
                    }
                }
            }

            requestAnimationFrame(() => this.onFrame(progressBarElement));
        },

        prev() {
            this.repeat = 0;
            this.index--;
            if (this.index < this.minIndex) {
                this.index = this.maxIndex;
            }

            this.resetTime();
        },

        next(forced = false) {
            if (!forced && this.repeat < this._settings.data.repeat - 1) {
                this.repeat++;
            } else {
                this.repeat = 0;
                this.index++;
                if (this.index > this.maxIndex) {
                    if (this._settings.data.cardRangeMode === 'progressive') {
                        this.settings.data.cardRangeFrom++;
                        this.settings.data.cardRangeTo++;
                        this.showProgressiveIncrementation = true;
                        setTimeout(() => {
                            this.showProgressiveIncrementation = false;
                        }, 1500);

                        if (this._settings.data.cardRangeFrom > this.cards.length - 1) {
                            this.settings.data.cardRangeFrom = 0;
                        }
                        if (this._settings.data.cardRangeTo > this.cards.length - 1) {
                            this.settings.data.cardRangeTo = 0;
                        }
                    }

                    this.index = this.minIndex;
                }
            }

            this.resetTime();
        },

        play(playAudio = true) {
            this.playing = true;

            if (this._settings.data.music) {
                this.ambience.play();
            }

            const date = new Date();
            if (this.pauseTime) {
                const pauseTime = this.pauseTime.getTime() - this.startTime.getTime();
                date.setTime(date.getTime() - pauseTime);
                this.pauseTime = null;

                if (playAudio) {
                    this.playAudio();
                }
            }
            this.resetTime(date);

            this.$nextTick(() => {
                const progressBarElement = document.getElementById('progress_bar');
                requestAnimationFrame(() => this.onFrame(
                    progressBarElement
                        ? progressBarElement.querySelector('.v-progress-linear__determinate')
                        : null
                ));
            });
        },

        pause() {
            this.playing = false;
            this.pauseTime = new Date();
            this.pauseAudio();
        },

        playAudio() {

            if (this._settings.data.music) {
                this.ambience.play();
            }

            const side = this.showFront ? 'front' : 'back';
            if (this.currentAudio[side] && this.currentAudio[side].element.currentTime > 0) {
                this.currentAudio[side].element.play();
            }
        },

        playCurrentWordAudio() {
            const side = this.showFront ? 'front' : 'back';
            if (this.currentAudio[side]) {
                this.currentAudio[side].element.currentTime = 0;
                this.currentAudio[side].element.play();
            }
        },

        pauseAudio() {
            this.ambience.pause();

            if (this.currentAudio.front) {
                this.currentAudio.front.element.pause();
            }
            if (this.currentAudio.back) {
                this.currentAudio.back.element.pause();
            }
        },

        load() {
            this.loading = true;
            (this.$route.name === 'session.dictionary'
                ? Services.getDictionaryItems(this.$route.params.uuid)
                : Services.getCards(this.deck ? this.deck.data.id : undefined))
                .then(response => {
                    if (this.$route.name === 'session.dictionary') {
                        return new Promise((resolve, reject) => {
                            const callback = (response, front_lang, back_lang) => {
                                const result = response.map(item => {
                                    const card = {
                                        id: item.data.id,
                                        media: item.data.cover.url,
                                        created_at: item.data.created_at,
                                    };
                                    const frontIdx = item.data.i18n.findIndex(i18n => i18n.language.data.code === (this.$route.params.lang_front || front_lang));
                                    if (frontIdx !== -1) {
                                        Object.assign(card, {
                                            front: item.data.i18n[frontIdx].text,
                                            front_synthesized: item.data.i18n[frontIdx].text_synthesized,
                                        });
                                    }
                                    if (this.$route.params.lang_back || back_lang) {
                                        const backIdx = item.data.i18n.findIndex(i18n => i18n.language.data.code === (this.$route.params.lang_back || back_lang));
                                        if (backIdx !== -1) {
                                            Object.assign(card, {
                                                back: item.data.i18n[backIdx].text,
                                                back_synthesized: item.data.i18n[backIdx].text_synthesized,
                                            });
                                        }
                                    }
                                    return card;
                                }).sort((a, b) => a.created_at > b.created_at ? 1 : -1);
                                this.showDictionaryLanguageSelection.visible = false;
                                resolve(result);
                            };

                            Services.getDictionary(this.$route.params.uuid)
                                .then(dictionary => {
                                    Object.assign(this, { dictionary });
                                })
                                .catch(this.$handleError)
                                .finally(() => this.showDictionaryLanguageSelection.loading = false);
                            if (!this.$route.params.lang_front && !this.$route.params.lang_back) {
                                this.showDictionaryLanguageSelection.visible = true;
                                this.showDictionaryLanguageSelection.loading = true;
                                this.showDictionaryLanguageSelection.callback = (front_lang, back_lang) => callback(response, front_lang, back_lang);
                            } else {
                                return callback(response);
                            }
                        });
                    }
                    return response;
                })
                .then(cards => {
                    Object.assign(this, {
                        cards,
                        originalCards: this.$deepClone(cards),
                    });
                    this.filteredCards = this.filterCards(cards);
                    this.calculateAudioLength(this.filteredCards);

                    if (this.originalCards.length > 0 && this.originalCards.length === this.settings.data.ejected.length) {
                        this.completed = true;
                    } else {
                        const indexFound = this.filteredCards.findIndex(card => card.id === this._settings.data.lastCardId);
                        this.index = indexFound !== -1
                            ? this.filteredCards[indexFound]
                                ? indexFound < this.minIndex
                                    ? this.minIndex
                                    : indexFound > this.maxIndex
                                        ? this.maxIndex
                                        : indexFound
                                : this.minIndex
                            : this.minIndex;

                        setTimeout(() => {
                            this.ready = true;
                        });
                    }

                    return this.filteredCards;
                })
                .then(() => this.skeleton = false)
                .catch(this.$handleError)
                .finally(() => this.loading = false);
        },

        reset() {
            this.settings.data.ejected = [];

            if (this.deck.data.id) {
                this.saveSettings();
            }

            this.cards = this.$deepClone(this.originalCards);
            this.filteredCards = this.filterCards(this.cards);
            this.calculateAudioLength(this.filteredCards);

            this.ready = true;
            this.completed = false;
            this.index = this.minIndex;
            this.ambience.pause();
            this.resetTime();
        },

        setFirstSide(visible) {
            if (this._settings.data.flipped) {
                this.showBack = visible;
                this.showFront = !visible;
                if (visible && this._settings.data.backVoiceEnabled && this.ready) {
                    const audio = this.currentAudio.back;
                    if (audio) {
                        audio.element.currentTime = 0;
                        audio.element.play();
                    }

                    if (this.filteredCards[this.index]) {
                        document.title = this.filteredCards[this.index].back + ' | ' + this.deckName;
                    }
                }
            } else {
                this.showFront = visible;
                this.showBack = !visible;
                if (visible && this._settings.data.frontVoiceEnabled && this.ready) {
                    const audio = this.currentAudio.front;
                    if (audio) {
                        audio.element.currentTime = 0;
                        audio.element.play();
                    }

                    if (this.filteredCards[this.index]) {
                        document.title = this.filteredCards[this.index].front + ' | ' + this.deckName;
                    }
                }
            }
        },

        setOtherSide(visible) {
            if (this._settings.data.flipped) {
                this.showFront = visible;
                this.showBack = !visible;
                if (visible && this._settings.data.frontVoiceEnabled) {
                    const audio = this.currentAudio.front;
                    if (audio) {
                        audio.element.currentTime = 0;
                        audio.element.play();
                    }

                    document.title = this.filteredCards[this.index].front + ' | ' + this.deckName;
                }
            } else {
                this.showBack = visible;
                this.showFront = !visible;
                if (visible && this._settings.data.backVoiceEnabled) {
                    const audio = this.currentAudio.back;
                    if (audio) {
                        audio.element.currentTime = 0;
                        audio.element.play();
                    }

                    document.title = this.filteredCards[this.index].back + ' | ' + this.deckName;
                }
            }
        },

        flipFirst() {
            this.resetTime();
            this.setFirstSide(true);
        },

        flipOther() {
            this.resetTime();
            this.startTime = new Date();
            this.startTime.setTime(this.startTime.getTime() - this.firstDelay);
            this.endTime = new Date(this.startTime.getTime() + this.totalDelay);
            this.setOtherSide(true);
        },

        goFirst() {
            this.index = this.minIndex;
        },

        goLast() {
            this.index = this.maxIndex;
        },

        calculateAudioLength(cards) {
            return new Promise((resolve, reject) => {
                let toDo = 0;
                let completed = 0;
                cards.forEach(card => {
                    ['front', 'back'].forEach(side => {
                        const key = side + '_synthesized';
                        if (card[key]) {
                            toDo++;

                            const element = new Audio(card[key]);
                            if (!this.audios[card.id]) {
                                this.audios[card.id] = {};
                            }

                            this.audios[card.id][side] = {
                                element,
                                duration: 0,
                            }

                            element.onloadedmetadata = () => {
                                this.audios[card.id][side].duration = element.duration;
                                completed++;

                                if (completed === toDo) {
                                    resolve();
                                }
                            };
                        }

                        if (completed === toDo) {
                            resolve();
                        }
                    });
                });

                if (cards.length === 0) {
                    resolve();
                }
            });
        },

        // exportSession() {
        //     this.exportSessionDialog.loading = true;
        //
        //     const promises = [];
        //     this.filteredCards.forEach(card => {
        //         promises.push(audioDecode(atob(card.front_synthesized.substring(22))));
        //         promises.push(audioDecode(atob(card.back_synthesized.substring(22))));
        //     });
        //     return Promise.all(promises)
        //         .then(buffers => {
        //             let buffer = new AudioBuffer({
        //                 length: 1,
        //                 sampleRate: 44100,
        //             });
        //             const crunker = new Crunker();
        //             crunker.fetchAudio(this._settings.data.ambience ? [
        //                 this._settings.data.ambience,
        //             ] : []).then(ambiences => {
        //                 this.filteredCards.forEach((card, cardIdx) => {
        //                     buffer = crunker.concatAudio([buffer, buffers[cardIdx]]);
        //                     buffer = crunker.padAudio(buffer, buffer.duration - 0.0001, this._settings.data.delay);
        //                 });
        //                 ambiences.forEach((ambience, ambienceIdx) => {
        //                     const newBuffer = new AudioBuffer({
        //                         length: ambience.length,
        //                         numberOfChannels: ambience.numberOfChannels,
        //                         sampleRate: ambience.sampleRate
        //                     });
        //                     for (let channel = 0; channel < ambience.numberOfChannels; channel += 1) {
        //                         const channelData = ambience.getChannelData(channel);
        //                         const newChannelData = newBuffer.getChannelData(channel);
        //
        //                         for (let sample = 0; sample < channelData.length; sample += 1) {
        //                             newChannelData[sample] = channelData[sample] * this.volume;
        //                         }
        //                     }
        //                     ambiences[ambienceIdx] = newBuffer;
        //                 });
        //                 buffer = crunker.mergeAudio([buffer, ...ambiences]);
        //                 this.buffer = buffer;
        //
        //                 const output = crunker.export(this.buffer, 'audio/wav');
        //                 crunker.download(output.blob, this.deckName);
        //                 this.exportSessionDialog.loading = false;
        //                 this.exportSessionDialog.visible = false;
        //
        //                 this.$snack(this.$i18n.t('snack.exportSessionCompleted'));
        //             })
        //         });
        // },

        applySettings() {
            this.ambience.volume = this.ambienceVolume;
            this.ambience.loop = true;
            this.ambience.src = this._settings.data.ambience;

            if (this._settings.data.ambience) {
                if (this._settings.data.music && this.playing) {
                    this.ambience.play();
                } else {
                    this.ambience.pause();
                }
            } else {
                this.ambience.pause();
            }

            if (this.index > this.maxIndex) {
                this.index = this.maxIndex;
            } else if (this.index < this.minIndex) {
                this.index = this.minIndex;
            }
        },

        checkFullscreen() {
            this.fullscreen = this.$refs.layout.offsetHeight === window.screen.availHeight;
        },

        moveBackward(amount = 1) {
            const totalCards = this.maxIndex;
            let tempIdx = this.index - amount;
            while (tempIdx < this.minIndex) {
                tempIdx = totalCards - -tempIdx + 1;
            }
            this.index = tempIdx;
        },

        moveForward(amount = 1) {
            const totalCards = this.maxIndex;
            let tempIdx = this.index + amount;
            while (tempIdx > totalCards) {
                tempIdx = tempIdx - totalCards - 1;
            }
            this.index = tempIdx;
        },

        unmute() {
            this.muted = false;

            if (this._settings.data.music) {
                this.ambience.volume = this.ambienceVolume;
            }

            if (this.currentAudio.front) {
                this.currentAudio.front.volume = this.volume;
            }
            if (this.currentAudio.back) {
                this.currentAudio.back.volume = this.volume;
            }

            this.adjustCardVolume();
        },

        toggleMute() {
            this.muted ? this.unmute() : this.mute();
        },

        mute() {
            this.muted = true;

            if (this._settings.data.music) {
                this.ambience.volume = 0;
            }

            if (this.currentAudio.front) {
                this.currentAudio.front.volume = 0;
            }
            if (this.currentAudio.back) {
                this.currentAudio.back.volume = 0;
            }

            this.adjustCardVolume();
        },

        adjustCardVolume() {
            this.filteredCards.forEach(card => {
                ['front', 'back'].forEach(side => {
                    if (this.audios[card.id] && this.audios[card.id][side]) {
                        this.audios[card.id][side].element.volume = this.volume;
                    }
                });
            });
        },

        repeatCurrentWordAudio() {
            const card = this.filteredCards[this.index];
            const side = this.showFront ? 'front' : 'back';
            if (this.audios[card.id] && this.audios[card.id][side]) {
                this.audios[card.id][side].element.currentTime = 0;
                this.audios[card.id][side].element.play();
            }
        }
    },

    created() {
        if (!this.$route.params.uuid) {
            this.$router.replace({ name: 'custom', params: { uuid: 'unclassified' } })
        }

        if (this.$route.name === 'session') {
            this.$store.commit('navigation', {
                type: 'deck',
                params: this.$route.params.uuid,
            });
        }

        this.$store.commit('navigation', {
            type: 'session',
            params: {
                name: this.$route.name,
                params: this.$route.params,
            }
        });

        window.addEventListener('resize', this.checkFullscreen, false);
        window.addEventListener("beforeunload", this.checkSaveSettings, false);
        document.addEventListener("keydown", this.handleKeyDown, false);

        this.settings = new PlaybackSettingsModel(this.$deepClone(this.deck ? this.deck.data.playback_settings.data : {}));
        console.log(this.settings.data);

        this.load();
        this.applySettings();
    },

    mounted() {
        this.checkFullscreen();
    },

    destroyed() {
        this.pauseAudio();

        this.checkSaveSettings();

        window.removeEventListener('resize', this.checkFullscreen, false);
        window.removeEventListener("beforeunload", this.checkSaveSettings, false);
        document.removeEventListener("keydown", this.handleKeyDown, false);
    }
}
</script>

<style lang="scss" scoped>
.v-progress-linear {
    transition-duration: 0ms !important;
}
.abs_middle {
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    left: 0;
    width: 100%;
}
.abs_middle h1 {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
    width: auto;
    padding: 1rem 2rem;
}
.abs_middle.clickable h1 {
    cursor: pointer;
}
.slide-enter-active,
.slide-leave-active {
    transition-duration: 0.2s;
    transition-property: opacity, transform;
    transition-timing-function: ease;
    transform: translateY(-50%);
}
.slide-enter,
.slide-leave-active {
    opacity: 0;
    transform: translateY(calc(-50% + 1.5rem));
}
.slide-left-enter-active,
.slide-left-leave-active {
    transition-duration: 0.2s;
    transition-property: opacity, transform;
    transition-timing-function: ease;
    transform: translateY(-50%) translateX(0);
}
.slide-left-enter,
.slide-left-leave-active {
    opacity: 0;
    transform: translateY(-50%) translateX(1.5rem);
}
.slide-right-enter-active,
.slide-right-leave-active {
    transition-duration: 0.2s;
    transition-property: opacity, transform;
    transition-timing-function: ease;
    transform: translateY(-50%) translateX(0);
}
.slide-right-enter,
.slide-right-leave-active {
    opacity: 0;
    transform: translateY(-50%) translateX(-1.5rem);
}
.background {
    animation: background 240s infinite;
    background-size: cover;

    &.paused {
        animation-play-state: paused;
    }
}
#layout:not(.animated) {
    &.background {
        animation-play-state: paused !important;
    }
}
@keyframes background {
    0% { background-position: 50% 50%; }
    20% { background-position: 0 100%; }
    40% { background-position: 100% 0; }
    60% { background-position: 100% 100%; }
    80% { background-position: 0 0; }
}
</style>
