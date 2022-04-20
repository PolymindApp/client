<template>
    <v-container class="fill-height pa-0 d-flex flex-column" fluid v-bind="$attrs" v-on="$listeners" v-touch="{
        left: handleSwipeLeft,
        right: handleSwipeRight,
    }">

        <!-- SHORTCUTS -->
        <Keypress v-if="canGoPrevious" key-event="keyup" :key-code="37" @success="handlePrevClick" />
        <Keypress v-if="canGoNext" key-event="keyup" :key-code="39" @success="handleNextClick" />
        <Keypress v-if="canRemove" key-event="keyup" :key-code="46" @success="handleRemoveClick" />
        <Keypress v-if="canPlay" key-event="keyup" :key-code="32" @success="handlePlayClick" />
        <Keypress v-else-if="canPause" key-event="keyup" :key-code="32" @success="handlePauseClick" />
        <Keypress v-if="canFullscreen" key-event="keyup" :key-code="70" @success="() => setFullscreen(!fullscreen)" />

        <!-- TITLE -->
        <portal v-if="$vuetify.breakpoint.smAndDown" to="title">
            <v-app-bar-title>
                <span v-text="deckName"></span>
            </v-app-bar-title>
        </portal>

        <!-- BREADCRUMBS -->
        <portal to="desktop_nav">
            <div class="d-flex align-center" style="gap: 1rem">
                <DeckSelect v-model="deck" route="deck.play" style="min-width: 15rem; width: 15rem" outlined dense global />
                <DesktopNav :deck="deck" background-color="transparent" />
            </div>
        </portal>

        <!-- OPTIONS -->
        <portal to="options">
            <v-list-item :disabled="!canAdjustPlaybackSettings" @click="handlePlaybackSettingsClick">
                <v-list-item-icon>
                    <v-icon>mdi-headphones-settings</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-text="$t('btn.playbackSettings')"></v-list-item-content>
            </v-list-item>
            <v-divider class="my-2" />
            <v-list-item :disabled="!canResetSession" @click="handleResetSessionClick">
                <v-list-item-icon>
                    <v-icon>mdi-reload</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-text="$t('btn.reset')"></v-list-item-content>
            </v-list-item>
            <v-list-item :disabled="!canExport" @click="handleExportClick">
                <v-list-item-icon>
                    <v-icon>mdi-cloud-download-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-text="$t('btn.exportSession')"></v-list-item-content>
            </v-list-item>
            <v-divider class="my-2" />
        </portal>

        <!-- PLAYBACK SETTINGS -->
        <Modal v-model="playbackSettingsDialog.visible" :title="$t('deck.play.playbackSettingsDialog.title')" max-width="500" :fullscreen="$vuetify.breakpoint.smAndDown" persistent scrollable>
            <template #body>
                <v-row v-if="!deck.data.single">
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <label v-text="$t('deck.play.playbackSettings.mode.title')"></label>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <v-select
                            v-model="playbackSettingsDialog.data.mode"
                            :items="[
                                { text: $t('deck.play.playbackSettings.mode.both'), value: null },
                                { text: $t('deck.play.playbackSettings.mode.front'), value: 'front' },
                                { text: $t('deck.play.playbackSettings.mode.back'), value: 'back' },
                            ]"
                            outlined
                            hide-details
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <label v-text="$tc('deck.play.playbackSettings.delay', playbackSettingsDialog.data.delay, {
                            amount: playbackSettingsDialog.data.delay,
                        })"></label>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <v-slider
                            v-model="playbackSettingsDialog.data.delay"
                            min="1"
                            max="20"
                            thumb-label
                            hide-details
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <label v-text="$tc('deck.play.playbackSettings.repeat', playbackSettingsDialog.data.repeat, {
                            amount: playbackSettingsDialog.data.repeat,
                        })"></label>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <v-slider
                            v-model="playbackSettingsDialog.data.repeat"
                            min="1"
                            max="5"
                            thumb-label
                            hide-details
                        />
                    </v-col>
                </v-row>
                <v-row v-if="!deck.data.single && playbackSettingsDialog.data.mode === null">
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <label v-text="$t('deck.play.playbackSettings.flipped')"></label>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <v-switch
                            v-model="playbackSettingsDialog.data.flipped"
                            class="mt-0 pt-0 ml-1"
                            inset
                            hide-details
                        ></v-switch>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <label v-text="$t('deck.play.playbackSettings.reversed')"></label>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <v-switch
                            v-model="playbackSettingsDialog.data.reversed"
                            class="mt-0 pt-0 ml-1"
                            inset
                            hide-details
                        ></v-switch>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <label v-text="$t('deck.play.playbackSettings.' + (deck.data.single ? 'voiceEnabled' : 'frontVoiceEnabled'))"></label>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <v-switch
                            v-model="playbackSettingsDialog.data.frontVoiceEnabled"
                            class="mt-0 pt-0 ml-1"
                            inset
                            hide-details
                        ></v-switch>
                    </v-col>
                </v-row>
                <v-row v-if="!deck.data.single">
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <label v-text="$t('deck.play.playbackSettings.backVoiceEnabled')"></label>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <v-switch
                            v-model="playbackSettingsDialog.data.backVoiceEnabled"
                            class="mt-0 pt-0 ml-1"
                            inset
                            hide-details
                        ></v-switch>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="d-flex align-center">
                        <label v-text="$t('deck.play.playbackSettings.ambience.title')"></label>
                    </v-col>
                    <v-col cols="12" class="d-flex align-center">
                        <v-select
                            v-model="playbackSettingsDialog.data.ambience"
                            :items="ambiences"
                            outlined
                            hide-details
                        >
                            <template #selection="{ item }">
                                <div class="d-flex align-center" style="gap: 1rem">
                                    <v-img :src="item.thumbnail" width="48" height="48"></v-img>
                                    <span v-text="item.text"></span>
                                </div>
                            </template>
                            <template #item="{ item }">
                                <div class="d-flex align-center" style="gap: 1rem">
                                    <v-img :src="item.thumbnail" width="64" height="64"></v-img>
                                    <span v-text="item.text"></span>
                                </div>
                            </template>
                        </v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6" class="d-flex align-center">
                        <label v-text="$t('deck.play.playbackSettings.fromDate')"></label>
                    </v-col>
                    <v-col cols="6" class="d-flex align-center justify-end">
                        <v-btn :disabled="playbackSettingsDialog.data.fromDate === null" outlined small @click="playbackSettingsDialog.data.fromDate = null">
                            <span v-text="$t('btn.clear')"></span>
                        </v-btn>
                    </v-col>
                    <v-col cols="12">
                        <v-date-picker
                            v-model="playbackSettingsDialog.data.fromDate"
                            :events="events"
                            :max="playbackSettingsDialog.data.toDate"
                            event-color="primary"
                            no-title
                            full-width
                        ></v-date-picker>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6" class="d-flex align-center">
                        <label v-text="$t('deck.play.playbackSettings.toDate')"></label>
                    </v-col>
                    <v-col cols="6" class="d-flex align-center justify-end">
                        <v-btn :disabled="playbackSettingsDialog.data.toDate === null" outlined small @click="playbackSettingsDialog.data.toDate = null">
                            <span v-text="$t('btn.clear')"></span>
                        </v-btn>
                    </v-col>
                    <v-col cols="12">
                        <v-date-picker
                            v-model="playbackSettingsDialog.data.toDate"
                            :events="events"
                            :min="playbackSettingsDialog.data.fromDate"
                            event-color="primary"
                            no-title
                            full-width
                        ></v-date-picker>
                    </v-col>
                </v-row>
            </template>
            <template #buttons>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :loading="playbackSettingsDialog.saving" :disabled="playbackSettingsDialog.saving" color="primary" large @click="handleSavePlaybackSettings">
                    <span v-text="$t('btn.apply')"></span>
                </v-btn>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :disabled="playbackSettingsDialog.saving" outlined large @click="playbackSettingsDialog.visible = false">
                    <span v-text="$t('btn.cancel')"></span>
                </v-btn>
            </template>
        </Modal>

        <!-- EXPORT TO MP3 SETTINGS -->
        <Modal v-model="exportSessionDialog.visible" :disabled="exportSessionDialog.loading" :title="$t('deck.play.exportSessionDialog.title')" max-width="500" :fullscreen="$vuetify.breakpoint.smAndDown" persistent scrollable>
            <template #body>
                <div v-text="$t('deck.play.exportSessionDialog.desc')"></div>
            </template>
            <template #buttons>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :loading="exportSessionDialog.loading" :disabled="exportSessionDialog.loading" color="primary" large @click="exportSession">
                    <span v-text="$t('btn.export')"></span>
                </v-btn>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :disabled="exportSessionDialog.loading" outlined large @click="exportSessionDialog.visible = false">
                    <span v-text="$t('btn.cancel')"></span>
                </v-btn>
            </template>
        </Modal>

        <!-- LAYOUT -->
        <div ref="layout" :style="layoutStyle" class="w-100 fill-height background">
            <v-overlay v-if="background" :color="$vuetify.theme.dark ? 'black' : 'white'" :opacity="opacity" z-index="0" absolute></v-overlay>
            <div style="z-index: 1; position: relative" class="w-100 fill-height d-flex flex-column align-content-between justify-center">
                <v-container style="flex: 0" class="pa-4" fluid>
                    <v-row>
                        <v-col cols="4"></v-col>
                        <v-col cols="4" class="text-center"></v-col>
                        <v-col cols="4" class="d-flex align-center justify-end">
                            <v-expand-transition>
                                <v-tooltip v-if="!firstPlay" left>
                                    <template #activator="{ attrs, on }">
                                        <v-btn v-bind="attrs" v-on="on" icon :disabled="!canRemove" @click="handleRemoveClick">
                                            <v-icon>mdi-eject-outline</v-icon>
                                        </v-btn>
                                    </template>
                                    <span v-text="$t('deck.play.eject')"></span>
                                </v-tooltip>
                            </v-expand-transition>
                        </v-col>
                    </v-row>
                </v-container>
                <div style="flex: 1" class="pa-4 d-flex align-center justify-space-between">
                    <v-btn v-if="showNavigation" :disabled="!canGoPrevious" height="30vh" text x-large @click="handlePrevClick">
                        <v-icon size="7.5vh" v-text="$vuetify.rtl ? 'mdi-chevron-right' : 'mdi-chevron-left'"></v-icon>
                    </v-btn>
                    <div class="d-flex flex-nowrap align-center justify-center fill-height" style="flex: 1; position: relative">
                        <v-progress-circular v-if="skeleton" color="primary" size="64" indeterminate></v-progress-circular>
                        <div v-else-if="originalCards.length === 0" class="text-center" style="max-width: 15rem">
                            <v-icon color="warning" x-large>mdi-alert</v-icon>
                            <h3 class="mt-2" v-text="$t('deck.play.emptyWarning')"></h3>
                        </div>
                        <v-btn v-else-if="completed" height="15vh" width="15vh" text fab x-large @click="handleResetClick">
                            <v-icon size="7.5vh">mdi-refresh</v-icon>
                        </v-btn>
                        <v-btn v-else-if="firstPlay" height="15vh" width="15vh" text fab x-large :disabled="playing ? !canPause : !canPlay" @click="() => playing ? handlePauseClick() : handlePlayClick()">
                            <v-icon size="7.5vh" v-text="playing ? 'mdi-pause' : 'mdi-play'"></v-icon>
                        </v-btn>
                        <div v-else-if="filteredCards[index]" class="px-4 text-center abs_middle">
                            <transition name="slide">
                                <v-card v-if="!firstPlay && showFront">
                                    <h1 v-ripple @click="handleClickCard(filteredCards[index], 'front')" :class="{
                                        'text-capitalize-first text-h4 text-md-h3 text-lg-h2': !_settings.flipped,
                                        'text-capitalize-first text-h3 text-md-h2 text-lg-h1 primary--text': _settings.flipped,
                                    }" v-text="filteredCards[index].front"></h1>
                                </v-card>
                            </transition>
                            <transition name="slide">
                                <v-card v-if="!firstPlay && showBack">
                                    <h1 v-ripple @click="handleClickCard(filteredCards[index], 'back')" :class="{
                                        'text-capitalize-first text-h4 text-md-h3 text-lg-h2': _settings.flipped,
                                        'text-capitalize-first text-h3 text-md-h2 text-lg-h1 primary--text': !_settings.flipped,
                                    }" v-text="filteredCards[index].back"></h1>
                                </v-card>
                            </transition>
                        </div>
                    </div>
                    <v-btn v-if="showNavigation" :disabled="!canGoNext" height="30vh" text x-large @click="handleNextClick">
                        <v-icon size="7.5vh" v-text="$vuetify.rtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"></v-icon>
                    </v-btn>
                </div>
                <v-container style="flex: 0" class="pa-4" fluid>
                    <v-row>
                        <v-col cols="3" class="d-flex align-center justify-start">
                            <v-expand-transition>
                                <v-btn v-if="!firstPlay" icon :disabled="playing ? !canPause : !canPlay" @click="() => playing ? handlePauseClick() : handlePlayClick()">
                                    <v-icon v-text="playing ? 'mdi-pause' : 'mdi-play'"></v-icon>
                                </v-btn>
                            </v-expand-transition>
                        </v-col>
                        <v-col cols="6" class="d-flex align-center justify-center text-center">
                            <span v-if="firstPlay"></span>
                            <span v-else-if="filteredCards.length > 0" v-text="$t('deck.play.indexOf', {
                                current: index + 1,
                                total: filteredCards.length,
                            })"></span>
                            <span v-else-if="filteredCards.length < originalCards.length" v-text="$t('deck.play.noCardsLeft')"></span>
                        </v-col>
                        <v-col cols="3" class="d-flex align-center justify-end">
                            <v-expand-transition>
                                <v-btn v-if="!firstPlay" icon :disabled="!canFullscreen" @click="() => fullscreen ? handleExitFullScreenClick() : handleEnterFullScreenClick()">
                                    <v-icon v-if="!fullscreen">mdi-fullscreen</v-icon>
                                    <v-icon v-else>mdi-fullscreen-exit</v-icon>
                                </v-btn>
                            </v-expand-transition>
                        </v-col>
                    </v-row>
                </v-container>
                <v-expand-transition>
                    <v-progress-linear v-if="showProgress" v-once id="progress_bar" :value="progress" height="5" />
                </v-expand-transition>
            </div>
        </div>

        <!-- MOBILE FOOTER -->
        <v-expand-transition>
            <MobileNav v-if="showMobileNav" class="w-100" />
        </v-expand-transition>
    </v-container>
</template>

<script>
import DeckSelect from '@/components/breadcrumbs/DeckSelect';
import MobileNav from '@/components/layout/MobileNav';
import DesktopNav from '@/components/layout/DesktopNav';
import Modal from '@/components/generic/Modal';
import DeckModel from '@/models/DeckModel';
import PlaybackSettingsModel from '@/models/PlaybackSettingsModel';
import Services from "@/utils/Services";
import Keypress from 'vue-keypress';
import audioDecode from 'audio-decode';
import Crunker from 'crunker';
import ambiencesJson from '../../../../../.ambiences.json';

let autoPlayBus;

export default {
    name: "Play",

    components: { DeckSelect, MobileNav, Modal, DesktopNav, Keypress },

    data: () => ({
        loading: false,
        skeleton: true,
        playing: false,
        firstPlay: true,
        autoPlay: false,
        completed: false,
        showFront: false,
        showBack: false,
        fullscreen: false,
        cards: [],
        filteredCards: [],
        originalCards: [],
        index: -1,
        progress: 0,
        repeat: 0,
        deck: new DeckModel(),
        settings: {},
        audios: {},
        ambience: new Audio(),
        startTime: new Date(),
        pauseTime: new Date(),
        playbackSettingsDialog: {
            visible: false,
            saving: false,
            data: {},
        },
        exportSessionDialog: {
            visible: false,
            loading: false,
            data: {},
        },
        buffer: null,
    }),

    computed: {
        _settings() {
            return {
                ...this.settings,
                mode: this.deck.data.single ? 'front' : this.settings.mode,
                backVoiceEnabled: this.deck.data.single ? false : this.settings.backVoiceEnabled,
                flipped: this.deck.data.single ? false : this.settings.flipped,
            };
        },

        canGoPrevious() {
            return !this.loading && !this.skeleton && this.filteredCards.length > 1 && !this.firstPlay;
        },

        canPlay() {
            return !this.loading && !this.skeleton && !this.playing && !this.completed && this.filteredCards.length > 0;
        },

        canPause() {
            return !this.loading && !this.skeleton && this.playing;
        },

        canFullscreen() {
            return true;
        },

        canGoNext() {
            return !this.loading && !this.skeleton && this.filteredCards.length > 1 && !this.firstPlay;
        },

        canRemove() {
            return this.filteredCards.length > 0;
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

        events() {
            return this.cards.map(card => new Date(card.created_at).toISOString().substr(0, 10));
        },

        showMobileNav() {
            return this.$vuetify.breakpoint.smAndDown
                && !this.$root.inputFocused
                && !this.$root.lockFocus
                && this.$root.orientation === 'portrait';
        },

        showNavigation() {
            return !this.skeleton && this.originalCards.length > 0 && (this.$vuetify.breakpoint.mdAndUp || this.$root.orientation === 'landscape');
        },

        showProgress() {
            return !this.firstPlay && !this.completed;
        },

        totalDelay() {
            return (this._settings.delay
                * (this._settings.mode === null ? 2 : 1) * 1000)
                + (((this.currentAudio.front || {}).duration || 0) * 1000)
                + (((this.currentAudio.back || {}).duration || 0) * 1000);
        },

        isFirstSide() {
            return (!this._settings.flipped && this.showFront)
                || (this._settings.flipped && this.showBack);
        },

        isOtherSide() {
            return (!this._settings.flipped && this.showBack)
                || (this._settings.flipped && this.showFront);
        },

        currentAudio() {
            return (this.audios[(this.filteredCards[this.index] || {}).id] || {});
        },

        deckName() {
            return this.deck.data.name || this.$i18n.t('state.unclassified');
        },

        background() {
            return (this.ambiences.find(ambience => ambience.value === this._settings.ambience) || {}).bg;
        },

        opacity() {
            return (this.ambiences.find(ambience => ambience.value === this._settings.ambience) || {}).opacity || (this.$vuetify.theme.dark ? 0.85 : 0.75);
        },

        volume() {
            return (this.ambiences.find(ambience => ambience.value === this._settings.ambience) || {}).volume || 0.2;
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
    },

    watch: {
        '$i18n.locale'() {
            this.title = this.deckName;
            document.title = this.deckName;
        },
        index: {
            immediate: true,
            handler(newValue, oldValue) {

                if (oldValue) {
                    const audio = this.audios[(this.filteredCards[oldValue] || {}).id] || {};
                    if (audio.front) {
                        audio.front.element.pause();
                    }
                    if (audio.back) {
                        audio.back.element.pause();
                    }
                }

                this.setFirstSide(this._settings.mode !== 'back');
                this.setOtherSide(this._settings.mode === 'back');
            },
        },
    },

    methods: {
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

        handleSwipeLeft() {
            if (this.canGoPrevious) {
                this.next();
            }
        },

        handleSwipeRight() {
            if (this.canGoNext) {
                this.prev();
            }
        },

        handleExportClick() {
            Object.assign(this.exportSessionDialog, {
                visible: true,
                loading: false,
                data: {},
            });
        },

        handleResetSessionClick() {
            this.reset();
            this.pause();
        },

        handlePlaybackSettingsClick() {
            Object.assign(this.playbackSettingsDialog, {
                visible: true,
                saving: false,
                data: this.$deepClone(this.settings),
            });
        },

        handleSavePlaybackSettings() {
            const callback = () => {
                this.settings = new this.$deepClone(this.playbackSettingsDialog.data);
                this.applySettings();

                this.playbackSettingsDialog.visible = false;
                this.$snack(this.$i18n.t('deck.play.playbackSettings.applied'));

                this.filteredCards = this.filterCards(this.cards);
                this.calculateAudioLength(this.filteredCards);

                if (this.index > this.filteredCards.length - 1) {
                    this.index = this.filteredCards.length - 1;
                }

                return this.filteredCards;
            };

            if (this.deck.data.id) {
                this.deck.data.playback_settings = new PlaybackSettingsModel(this.$deepClone(this.playbackSettingsDialog.data));
                this.playbackSettingsDialog.saving = true;
                return Services.updateDeck(this.deck.data.id, this.deck)
                    .then(response => {
                        callback();
                        return response;
                    })
                    .catch(this.$handleError)
                    .finally(() => this.playbackSettingsDialog.saving = false);
            } else {
                callback();
            }
        },

        handlePrevClick() {
            this.prev();
        },

        handleNextClick() {
            this.next(true);
        },

        handlePlayClick() {
            if (this.firstPlay) {
                this.$sound.play('play', 0.15);
                this.index = 0;
            }

            this.play();
        },

        handlePauseClick() {
            this.pause();
        },

        handleRemoveClick() {

            this.$sound.play('remove', 0.5);

            this.filteredCards.splice(this.index, 1);
            if (this.index > this.filteredCards.length - 1) {
                this.index = this.filteredCards.length - 1;
            }
            if (this.index === -1) {
                this.playing = false;
                this.completed = true;
                this.$sound.play('completed');
            } else {
                this.setFirstSide(this._settings.mode !== 'back');
                this.setOtherSide(this._settings.mode === 'back');
            }

            this.resetTime(new Date());
        },

        handleResetClick() {
            this.reset();
            this.play();
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
            const from = this._settings.fromDate ? new Date(this._settings.fromDate) : null;
            const to = this._settings.toDate ? new Date(this._settings.toDate) : null;
            const result = cards.filter(card => (!from || new Date(card.created_at) >= from) && (!to || new Date(card.created_at) <= to));
            return this._settings.reversed ? result.reverse() : result;
        },

        resetTime(date) {
            this.startTime = date;
            this.endTime = new Date(date.getTime() + this.totalDelay);
            this.progress = 0;
            this.pauseTime = null;
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
                this.setFirstSide(this._settings.mode !== 'back');
                this.setOtherSide(this._settings.mode === 'back');
            } else {
                this.progress = (this.totalDelay - remainingTime) * 100 / this.totalDelay;
                progressBarElement.style.width = this.progress + '%';

                if (this._settings.mode === null) {
                    const midProgress = originalRange - (((this.currentAudio.front || {}).duration || 0) * 1000) - (this._settings.delay * 1000);
                    if (!this.isOtherSide && remainingTime < midProgress) {
                        this.setFirstSide(this._settings.mode === 'back');
                        this.setOtherSide(this._settings.mode !== 'back');
                    }
                }
            }

            requestAnimationFrame(() => this.onFrame(progressBarElement));
        },

        prev() {
            this.repeat = 0;
            this.index--;
            if (this.index < 0) {
                this.index = this.filteredCards.length - 1;
            }

            this.resetTime(new Date());
        },

        next(forced = false) {
            if (!forced && this.repeat < this._settings.repeat - 1) {
                this.repeat++;
            } else {
                this.repeat = 0;
                this.index++;
                if (this.index > this.filteredCards.length - 1) {
                    this.index = 0;
                }
            }

            this.resetTime(new Date());
        },

        play() {
            this.playing = true;
            this.firstPlay = false;
            this.ambience.play();

            const date = new Date();
            if (this.pauseTime) {
                const pauseTime = this.pauseTime.getTime() - this.startTime.getTime();
                date.setTime(date.getTime() - pauseTime);
                this.pauseTime = null;
                this.playAudio();
            }
            this.resetTime(date);

            this.$nextTick(() => {
                const progressBarElement = document.getElementById('progress_bar').querySelector('.v-progress-linear__determinate');
                requestAnimationFrame(() => this.onFrame(progressBarElement));
            });
        },

        pause() {
            this.playing = false;
            this.pauseTime = new Date();
            this.pauseAudio();
        },

        playAudio() {
            this.ambience.play();

            const side = this.showFront ? 'front' : 'back';
            if (this.currentAudio[side] && this.currentAudio[side].element.currentTime > 0) {
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
            Services.getCards(this.deck ? this.deck.data.id : undefined)
                .then(cards => {
                    Object.assign(this, {
                        cards,
                        originalCards: this.$deepClone(cards),
                    });
                    this.filteredCards = this.filterCards(cards);
                    this.calculateAudioLength(this.filteredCards);
                    return this.filteredCards;
                })
                .then(() => this.skeleton = false)
                .catch(this.$handleError)
                .finally(() => this.loading = false);
        },

        reset() {
            this.cards = this.$deepClone(this.originalCards);
            this.filteredCards = this.filterCards(this.cards);
            this.calculateAudioLength(this.filteredCards);
            this.firstPlay = true;
            this.completed = false;
            this.index = 0;
            this.ambience.pause();
            this.resetTime(new Date());
        },

        setFirstSide(visible) {
            if (this._settings.flipped) {
                this.showBack = visible;
                if (visible && this._settings.backVoiceEnabled) {
                    const audio = this.currentAudio.back;
                    if (audio) {
                        audio.element.currentTime = 0;
                        audio.element.play();
                    }

                    document.title = this.filteredCards[this.index].back + ' | ' + this.deckName;
                }
            } else {
                this.showFront = visible;
                if (visible && this._settings.frontVoiceEnabled) {
                    const audio = this.currentAudio.front;
                    if (audio) {
                        audio.element.currentTime = 0;
                        audio.element.play();
                    }

                    document.title = this.filteredCards[this.index].front + ' | ' + this.deckName;
                }
            }
        },

        setOtherSide(visible) {
            if (this._settings.flipped) {
                this.showFront = visible;
                if (visible && this._settings.frontVoiceEnabled) {
                    const audio = this.currentAudio.front;
                    if (audio) {
                        audio.element.currentTime = 0;
                        audio.element.play();
                    }

                    document.title = this.filteredCards[this.index].front + ' | ' + this.deckName;
                }
            } else {
                this.showBack = visible;
                if (visible && this._settings.backVoiceEnabled) {
                    const audio = this.currentAudio.back;
                    if (audio) {
                        audio.element.currentTime = 0;
                        audio.element.play();
                    }

                    document.title = this.filteredCards[this.index].back + ' | ' + this.deckName;
                }
            }
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

        exportSession() {
            this.exportSessionDialog.loading = true;

            const promises = [];
            this.filteredCards.forEach(card => {
                promises.push(audioDecode(atob(card.front_synthesized.substring(22))));
                promises.push(audioDecode(atob(card.back_synthesized.substring(22))));
            });
            return Promise.all(promises)
                .then(buffers => {
                    let buffer = new AudioBuffer({
                        length: 1,
                        sampleRate: 44100,
                    });
                    const crunker = new Crunker();
                    crunker.fetchAudio(this._settings.ambience ? [
                        this._settings.ambience,
                    ] : []).then(ambiences => {
                        this.filteredCards.forEach((card, cardIdx) => {
                            buffer = crunker.concatAudio([buffer, buffers[cardIdx]]);
                            buffer = crunker.padAudio(buffer, buffer.duration - 0.0001, this._settings.delay);
                        });
                        ambiences.forEach((ambience, ambienceIdx) => {
                            const newBuffer = new AudioBuffer({
                                length: ambience.length,
                                numberOfChannels: ambience.numberOfChannels,
                                sampleRate: ambience.sampleRate
                            });
                            for (let channel = 0; channel < ambience.numberOfChannels; channel += 1) {
                                const channelData = ambience.getChannelData(channel);
                                const newChannelData = newBuffer.getChannelData(channel);

                                for (let sample = 0; sample < channelData.length; sample += 1) {
                                    newChannelData[sample] = channelData[sample] * this.volume;
                                }
                            }
                            ambiences[ambienceIdx] = newBuffer;
                        });
                        buffer = crunker.mergeAudio([buffer, ...ambiences]);
                        this.buffer = buffer;

                        const output = crunker.export(this.buffer, 'audio/wav');
                        crunker.download(output.blob, this.deckName);
                        this.exportSessionDialog.loading = false;
                        this.exportSessionDialog.visible = false;

                        this.$snack(this.$i18n.t('snack.exportSessionCompleted'));
                    })
                });
        },

        applySettings() {
            this.ambience.volume = this.volume;
            this.ambience.loop = true;
            if (this._settings.ambience) {
                this.ambience.src = this._settings.ambience;

                if (this.playing) {
                    this.ambience.play();
                }
            } else {
                this.ambience.pause();
            }
        },

        checkFullscreen() {
            this.fullscreen = this.$refs.layout.offsetHeight === window.screen.availHeight;
        },
    },

    created() {
        if (!this.$route.params.uuid) {
            this.$router.replace({ name: 'deck.edit', params: { uuid: 'unclassified' } })
        }
        this.deck = this.$root.decks.find(deck => deck.data.id === this.$route.params.uuid) || new DeckModel();
        document.title = this.deckName;

        window.addEventListener('resize', this.checkFullscreen, false);

        this.settings = this.$deepClone(this.deck ? this.deck.data.playback_settings.data : new PlaybackSettingsModel().data);
        this.load();
        this.applySettings();
    },

    mounted() {
        this.checkFullscreen();
    },

    destroyed() {
        this.pauseAudio();

        window.removeEventListener('resize', this.checkFullscreen, false);
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
    width: 100%;
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
.background {
    animation: background 240s infinite;
    background-size: cover;
}
@keyframes background {
    0% { background-position: 50% 50%; }
    20% { background-position: 0 100%; }
    40% { background-position: 100% 0; }
    60% { background-position: 100% 100%; }
    80% { background-position: 0 0; }
}
.v-select.v-text-field ::v-deep input {
    position: absolute;
}
</style>
