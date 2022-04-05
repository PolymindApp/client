<template>
    <v-container class="fill-height pa-0 d-flex flex-column" fluid v-bind="$attrs" v-on="$listeners">

        <!-- BREADCRUMBS -->
        <portal to="desktop_nav">
            <div class="d-flex align-center" style="gap: 1rem">
<!--                <DeckSelect v-model="deck" route="deck.play" style="width: 15rem" outlined dense global />-->
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

        <!-- LAYOUT -->
        <div style="flex: 1" class="fill-height w-100 d-flex flex-column align-content-between justify-center">
            <v-row style="flex: 0" class="pa-4">
                <v-col cols="4"></v-col>
                <v-col cols="4" class="text-center">

                </v-col>
                <v-col cols="4"></v-col>
            </v-row>
            <div style="flex: 1" class="pa-4 d-flex align-center justify-space-between">
                <v-btn v-if="showNavigation" :disabled="!canGoPrevious" height="30vh" text x-large @click="handlePrevClick">
                    <v-icon size="7.5vh">mdi-chevron-left</v-icon>
                </v-btn>
                <div class="d-flex align-center justify-center fill-height" style="flex: 1">
                    <v-progress-circular v-if="skeleton" color="primary" size="64" indeterminate></v-progress-circular>
                    <template v-else-if="originalCards.length === 0">
                        <div class="text-center" style="max-width: 15rem">
                            <v-icon color="warning" x-large>mdi-alert</v-icon>
                            <h3 class="mt-2" v-text="$t('deck.play.emptyWarning')"></h3>
                        </div>
                    </template>
                    <v-btn v-else-if="completed" height="15vh" width="15vh" text fab x-large @click="handleResetClick">
                        <v-icon size="7.5vh">mdi-refresh</v-icon>
                    </v-btn>
                    <v-btn v-else-if="firstPlay" height="15vh" width="15vh" text fab x-large :disabled="playing ? !canPause : !canPlay" @click="() => playing ? handlePauseClick() : handlePlayClick()">
                        <v-icon size="7.5vh" v-text="playing ? 'mdi-pause' : 'mdi-play'"></v-icon>
                    </v-btn>
                    <template v-else>
                        <transition name="slide">
                            <h1 class="text-h4 text-md-h3 text-lg-h2 abs_middle" v-if="!firstPlay && showFront" v-text="_cards[index].front"></h1>
                        </transition>
                        <transition name="slide">
                            <h1 class="text-h3 text-md-h2 text-lg-h1 abs_middle primary--text" v-if="!firstPlay && showBack" v-text="_cards[index].back"></h1>
                        </transition>
                    </template>
                </div>
                <v-btn v-if="showNavigation" :disabled="!canGoNext" height="30vh" text x-large @click="handleNextClick">
                    <v-icon size="7.5vh">mdi-chevron-right</v-icon>
                </v-btn>
            </div>
            <v-row style="flex: 0" class="pa-4">
                <v-col cols="3" class="d-flex align-center justify-start">
                    <v-expand-transition>
                        <v-btn v-if="!firstPlay" icon :disabled="playing ? !canPause : !canPlay" @click="() => playing ? handlePauseClick() : handlePlayClick()">
                            <v-icon v-text="playing ? 'mdi-pause' : 'mdi-play'"></v-icon>
                        </v-btn>
                    </v-expand-transition>
                </v-col>
                <v-col cols="6" class="d-flex align-center justify-center text-center">
                    <span v-if="cards.length > 0" v-text="$t('deck.play.indexOf', {
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

    components: { DeckSelect, MobileNav, Modal, DesktopNav },

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
        index: 0,
        progress: 0,
        repeat: 0,
        deck: null,
        settings: {},
        startTime: new Date(),
        pauseTime: new Date(),
        playbackSettingsDialog: {
            visible: false,
            saving: false,
            data: {},
        },
    }),

    computed: {
        canGoPrevious() {
            return !this.loading && !this.skeleton && this.cards.length > 1 && this.playing;
        },

        canPlay() {
            return !this.loading && !this.skeleton && !this.playing && !this.completed && this.cards.length > 0;
        },

        canPause() {
            return !this.loading && !this.skeleton && this.playing;
        },

        canGoNext() {
            return !this.loading && !this.skeleton && this.cards.length > 1 && this.playing;
        },

        canRemove() {
            return this.cards.length > 0;
        },

        canAdjustPlaybackSettings() {
            return !this.skeleton && this.originalCards.length > 0;
        },

        showMobileNav() {
            return this.$vuetify.breakpoint.smAndDown
                && !this.$root.inputFocused
                && window.innerHeight > window.innerWidth;
        },

        showNavigation() {
            return !this.skeleton && this.originalCards.length > 0 && this.$vuetify.breakpoint.mdAndUp;
        },

        showProgress() {
            return !this.firstPlay && !this.completed;
        },

        totalDelay() {
            return this.settings.delay * (this.settings.mode === null ? 2 : 1)  * 1000;
        },

        _cards() {
            return this.settings.reversed ? this.cards.reverse() : this.cards;
        },
    },

    watch: {
        index: {
            immediate: true,
            handler() {
                this.setFirstSide(this.settings.mode !== 'back');
                this.setOtherSide(this.settings.mode === 'back');
            },
        },
    },

    methods: {
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
            this.play();
        },

        handlePauseClick() {
            this.playing = false;
            this.pauseTime = new Date();
        },

        handleRemoveClick() {
            this.cards.splice(this.index, 1);
            if (this.index > this.cards.length - 1) {
                this.index = this.cards.length - 1;
            }
            if (this.index === -1) {
                this.playing = false;
                this.completed = true;
            }
            this.resetTime(new Date());
        },

        handleResetClick() {
            this.reset();
        },

        resetTime(date) {
            this.startTime = date;
            this.endTime = new Date(date.getTime() + this.totalDelay);
        },

        onFrame() {
            if (!this.playing) {
                return false;
            }

            const nowTime = new Date().getTime();
            const remainingTime = this.endTime.getTime() - nowTime;
            if (remainingTime <= 0) {
                this.next();
                this.setFirstSide(this.settings.mode !== 'back');
                this.setOtherSide(this.settings.mode === 'back');
            } else {
                this.progress = (this.totalDelay - remainingTime) * 100 / this.totalDelay;

                if (this.progress >= 50 && this.settings.mode === null) {
                    this.setFirstSide(this.settings.mode === 'back');
                    this.setOtherSide(this.settings.mode !== 'back');
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
                    this.skeleton = false;
                })
                .catch(this.$handleError)
                .finally(() => this.loading = false);
        },

        reset() {
            this.cards = this.$deepClone(this.originalCards);
            this.firstPlay = true;
            this.completed = false
            this.index = 0;
            this.resetTime(new Date());
            this.play();
        },

        setFirstSide(visible) {
            if (this.settings.flipped) {
                this.showBack = visible;
                if (this.settings.backVoiceEnabled) {
                    //TODO
                }
            } else {
                this.showFront = visible;
                if (this.settings.frontVoiceEnabled) {
                    //TODO
                }
            }
        },

        setOtherSide(visible) {
            if (this.settings.flipped) {
                this.showFront = visible;
                if (this.settings.frontVoiceEnabled) {
                    //TODO
                }
            } else {
                this.showBack = visible;
                if (this.settings.backVoiceEnabled) {
                    //TODO
                }
            }
        },
    },

    created() {
        if (this.$route.params.uuid !== localStorage.getItem('deck')
            && [null, 'null'].indexOf(localStorage.getItem('deck')) === -1
            && this.$route.params.uuid !== 'unclassified') {
            this.$router.replace({ name: 'deck.play', params: { uuid: localStorage.getItem('deck') } })
        }
        this.deck = this.$root.decks.find(deck => deck.id === this.$route.params.uuid) || null;

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
}
.slide-enter-active,
.slide-leave-active {
    transition-duration: 0.2s;
    transition-property: opacity, transform;
    transition-timing-function: ease;
    transform: translateY(0px);
}
.slide-enter,
.slide-leave-active {
    opacity: 0;
    transform: translateY(1.5rem);
}
</style>
