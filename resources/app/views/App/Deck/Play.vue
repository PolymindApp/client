<template>
    <v-container class="fill-height pa-0 d-flex flex-column" fluid v-bind="$attrs" v-on="$listeners" v-touch="{
        left: handleSwipeLeft,
        right: handleSwipeRight,
    }">

        <!-- SHORTCUTS -->
        <Keypress v-if="canGoPrevious" key-event="keyup" :key-code="37" @success="handlePrevClick" />
        <Keypress v-if="canGoNext" key-event="keyup" :key-code="39" @success="handleNextClick" />
        <Keypress v-if="canRemove" key-event="keyup" :key-code="27" @success="handleRemoveClick" />
        <Keypress v-if="canPlay" key-event="keyup" :key-code="32" @success="handlePlayClick" />
        <Keypress v-else-if="canPause" key-event="keyup" :key-code="32" @success="handlePauseClick" />

        <!-- TITLE -->
        <portal v-if="$vuetify.breakpoint.smAndDown" to="title">
            <v-app-bar-title>
                <span v-text="deckName"></span>
            </v-app-bar-title>
        </portal>

        <!-- BREADCRUMBS -->
        <portal to="desktop_nav">
            <div class="d-flex align-center" style="gap: 1rem">
                <DeckSelect v-model="deck" route="deck.play" style="width: 25rem" outlined dense global />
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
        <Modal v-model="playbackSettingsDialog.visible" :title="$t('deck.play.playbackSettingsDialog.title')" max-width="500" :fullscreen="$vuetify.breakpoint.smAndDown" scrollable>
            <template #body>
                <v-row>
                    <v-col cols="12" md="6" class="d-flex align-center">
                        <label v-text="$tc('deck.play.playbackSettings.mode.title')"></label>
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
                <v-row v-if="playbackSettingsDialog.data.mode === null">
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
                        <label v-text="$t('deck.play.playbackSettings.frontVoiceEnabled')"></label>
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
                <v-row>
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

        <!-- EXPORT SESSION SETTINGS -->
        <Modal v-model="exportSessionDialog.visible" :title="$t('deck.play.exportSessionDialog.title')" max-width="500" :fullscreen="$vuetify.breakpoint.smAndDown" scrollable>
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
        <div style="flex: 1" class="w-100 fill-height d-flex flex-column align-content-between justify-center">
            <v-container style="flex: 0" class="pa-4" fluid>
                <v-row>
                    <v-col cols="4"></v-col>
                    <v-col cols="4" class="text-center"></v-col>
                    <v-col cols="4"></v-col>
                </v-row>
            </v-container>
            <div style="flex: 1" class="pa-4 d-flex align-center justify-space-between">
                <v-btn v-if="showNavigation" :disabled="!canGoPrevious" height="30vh" text x-large @click="handlePrevClick">
                    <v-icon size="7.5vh">mdi-chevron-left</v-icon>
                </v-btn>
                <div class="d-flex align-center justify-center fill-height" style="flex: 1; position: relative">
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
                    <div v-else class="px-4 text-center abs_middle">
                        <transition name="slide">
                            <div v-if="!firstPlay && showFront">
                                <h1 class="text-capitalize-first text-h4 text-md-h3 text-lg-h2" v-text="_cards[index].front"></h1>
                            </div>
                        </transition>
                        <transition name="slide">
                            <div v-if="!firstPlay && showBack">
                                <h1 class="text-capitalize-first text-h3 text-md-h2 text-lg-h1 primary--text" v-text="_cards[index].back"></h1>
                            </div>
                        </transition>
                    </div>
                </div>
                <v-btn v-if="showNavigation" :disabled="!canGoNext" height="30vh" text x-large @click="handleNextClick">
                    <v-icon size="7.5vh">mdi-chevron-right</v-icon>
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
                        <span v-else-if="cards.length > 0" v-text="$t('deck.play.indexOf', {
                            current: index + 1,
                            total: cards.length,
                        })"></span>
                        <span v-else-if="cards.length < originalCards.length" v-text="$t('deck.play.noCardsLeft')"></span>
                    </v-col>
                    <v-col cols="3" class="d-flex align-center justify-end">
                        <v-expand-transition>
                            <v-btn v-if="!firstPlay" icon :disabled="!canRemove" @click="handleRemoveClick">
                                <v-icon>mdi-close-box-outline</v-icon>
                            </v-btn>
                        </v-expand-transition>
                    </v-col>
                </v-row>
            </v-container>
            <v-expand-transition>
                <v-progress-linear v-if="showProgress" :value="progress" height="5" />
            </v-expand-transition>
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
import Services from "@/utils/Services";
import Keypress from 'vue-keypress';

let autoPlayBus;
const defaultSettings = {
    mode: null,
    repeat: 1,
    delay: 5,
    flipped: false,
    reversed: false,
    frontVoiceEnabled: true,
    backVoiceEnabled: true,
};

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
        cards: [],
        originalCards: [],
        index: -1,
        progress: 0,
        repeat: 0,
        deck: null,
        settings: {},
        audios: {},
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
    }),

    computed: {
        canGoPrevious() {
            return !this.loading && !this.skeleton && this.cards.length > 1 && !this.firstPlay;
        },

        canPlay() {
            return !this.loading && !this.skeleton && !this.playing && !this.completed && this.cards.length > 0;
        },

        canPause() {
            return !this.loading && !this.skeleton && this.playing;
        },

        canGoNext() {
            return !this.loading && !this.skeleton && this.cards.length > 1 && !this.firstPlay;
        },

        canRemove() {
            return this.cards.length > 0;
        },

        canResetSession() {
            return !this.skeleton && this.originalCards.length !== this.cards.length;
        },

        canAdjustPlaybackSettings() {
            return !this.skeleton && this.originalCards.length > 0;
        },

        canExport() {
            return !this.skeleton && this.originalCards.length > 0;
        },

        showMobileNav() {
            return this.$vuetify.breakpoint.smAndDown
                && !this.$root.inputFocused
                && this.$root.orientation === 'portrait';
        },

        showNavigation() {
            return !this.skeleton && this.originalCards.length > 0 && this.$vuetify.breakpoint.mdAndUp;
        },

        showProgress() {
            return !this.firstPlay && !this.completed;
        },

        totalDelay() {
            return (this.settings.delay
                * (this.settings.mode === null ? 2 : 1) * 1000)
                + (((this.currentAudio.front || {}).duration || 0) * 1000)
                + (((this.currentAudio.back || {}).duration || 0) * 1000);
        },

        isFirstSide() {
            return (!this.settings.flipped && this.showFront)
                || (this.settings.flipped && this.showBack);
        },

        isOtherSide() {
            return (!this.settings.flipped && this.showBack)
                || (this.settings.flipped && this.showFront);
        },

        currentAudio() {
            return (this.audios[(this.cards[this.index] || {}).id] || {});
        },

        deckName() {
            return this.deck && this.deck.name || this.$i18n.t('state.unclassified');
        },

        _cards() {
            return this.settings.reversed ? this.cards.reverse() : this.cards;
        },
    },

    watch: {
        '$i18n.locale'() {
            document.title = this.deckName;
        },
        index: {
            immediate: true,
            handler(newValue, oldValue) {

                if (oldValue) {
                    const audio = this.audios[(this.cards[oldValue] || {}).id] || {};
                    if (audio.front) {
                        audio.front.element.pause();
                    }
                    if (audio.back) {
                        audio.back.element.pause();
                    }
                }

                this.setFirstSide(this.settings.mode !== 'back');
                this.setOtherSide(this.settings.mode === 'back');
            },
        },
    },

    methods: {
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
            this.settings = this.$deepClone(this.playbackSettingsDialog.data);
            this.playbackSettingsDialog.visible = false;
            this.$snack(this.$i18n.t('deck.play.playbackSettings.applied'));
        },

        handlePrevClick() {
            this.prev();
        },

        handleNextClick() {
            this.next();
        },

        handlePlayClick() {

            this.$sound.play('play');

            if (this.firstPlay) {
                this.index = 0;
            }

            this.play();
        },

        handlePauseClick() {
            this.pause();
        },

        handleRemoveClick() {

            this.$sound.play('remove');

            this.cards.splice(this.index, 1);
            if (this.index > this.cards.length - 1) {
                this.index = this.cards.length - 1;
            }
            if (this.index === -1) {
                this.playing = false;
                this.completed = true;
                this.$sound.play('completed');
            } else {
                this.setFirstSide(this.settings.mode !== 'back');
                this.setOtherSide(this.settings.mode === 'back');
            }

            this.resetTime(new Date());
        },

        handleResetClick() {
            this.$sound.play('play');
            this.reset();
            this.play();
        },

        resetTime(date) {
            this.startTime = date;
            this.endTime = new Date(date.getTime() + this.totalDelay);
            this.progress = 0;
            this.pauseTime = null;
        },

        onFrame() {
            if (!this.playing || this._isBeingDestroyed) {
                return false;
            }

            const nowTime = new Date().getTime();
            const remainingTime = this.endTime.getTime() - nowTime;
            const originalRange = this.endTime.getTime() - this.startTime.getTime();
            if (remainingTime <= 0) {
                this.next();
                this.setFirstSide(this.settings.mode !== 'back');
                this.setOtherSide(this.settings.mode === 'back');
            } else {
                this.progress = (this.totalDelay - remainingTime) * 100 / this.totalDelay;

                if (this.settings.mode === null) {
                    const midProgress = originalRange - (((this.currentAudio.front || {}).duration || 0) * 1000) - (this.settings.delay * 1000);
                    if (!this.isOtherSide && remainingTime < midProgress) {
                        this.setFirstSide(this.settings.mode === 'back');
                        this.setOtherSide(this.settings.mode !== 'back');
                    }
                }
            }

            requestAnimationFrame(this.onFrame);
        },

        prev() {
            this.index--;
            if (this.index < 0) {
                this.index = this.cards.length - 1;
            }

            if (this.playing) {
                this.resetTime(new Date());
            }
        },

        next() {
            if (this.repeat < this.settings.repeat - 1) {
                this.repeat++;
            } else {
                this.repeat = 0;
                this.index++;
                if (this.index > this.cards.length - 1) {
                    this.index = 0;
                }
            }

            if (this.playing) {
                this.resetTime(new Date());
            }
        },

        play() {
            this.playing = true;
            this.firstPlay = false;

            const date = new Date();
            if (this.pauseTime) {
                const pauseTime = this.pauseTime.getTime() - this.startTime.getTime();
                date.setTime(date.getTime() - pauseTime);
                this.pauseTime = null;
            }
            this.resetTime(date);

            requestAnimationFrame(this.onFrame);
        },

        pause() {
            this.playing = false;
            this.pauseTime = new Date();
        },

        load() {
            this.loading = true;
            Promise.all([
                Services.getCards(this.deck ? this.deck.id : undefined),
            ])
                .then(([cards]) => {
                    Object.assign(this, {
                        cards,
                        originalCards: this.$deepClone(cards),
                    });
                    return this.calculateAudioLength(cards);
                })
                .then(() => this.skeleton = false)
                .catch(this.$handleError)
                .finally(() => this.loading = false);
        },

        reset() {
            this.cards = this.$deepClone(this.originalCards);
            this.firstPlay = true;
            this.completed = false
            this.index = -1;
            this.resetTime(new Date());
        },

        setFirstSide(visible) {
            if (this.settings.flipped) {
                this.showBack = visible;
                if (visible && this.settings.backVoiceEnabled) {
                    const audio = this.currentAudio.back;
                    if (audio) {
                        audio.element.currentTime = 0;
                        audio.element.play();
                    }
                }
            } else {
                this.showFront = visible;
                if (visible && this.settings.frontVoiceEnabled) {
                    const audio = this.currentAudio.front;
                    if (audio) {
                        audio.element.currentTime = 0;
                        audio.element.play();
                    }
                }
            }
        },

        setOtherSide(visible) {
            if (this.settings.flipped) {
                this.showFront = visible;
                if (visible && this.settings.frontVoiceEnabled) {
                    const audio = this.currentAudio.front;
                    if (audio) {
                        audio.element.currentTime = 0;
                        audio.element.play();
                    }
                }
            } else {
                this.showBack = visible;
                if (visible && this.settings.backVoiceEnabled) {
                    const audio = this.currentAudio.back;
                    if (audio) {
                        audio.element.currentTime = 0;
                        audio.element.play();
                    }
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
            const ids = this._cards.map(card => card.id);
            Services.export(ids, 'audio', this.deck.name, this.settings)
                .then(() => {
                    this.exportSessionDialog.visible = false;
                })
                .catch(reason => this.$handleError(reason))
                .finally(() => this.exportSessionDialog.loading = false)
        },
    },

    created() {
        if (!this.$route.params.uuid) {
            this.$router.replace({ name: 'deck.edit', params: { uuid: 'unclassified' } })
        }
        this.deck = this.$root.decks.find(deck => deck.id === this.$route.params.uuid) || null;
        document.title = this.deckName;

        this.settings = this.$deepClone(defaultSettings);

        this.load();
    },
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
</style>
