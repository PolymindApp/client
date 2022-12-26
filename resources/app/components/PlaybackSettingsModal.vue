<template>
    <Modal v-model="_visible" :title="$t('session.playbackSettingsDialog.title')" v-bind="$attrs" v-on="$listeners">
        <template #body>
            <v-row>
                <v-col cols="12" md="6">
                    <v-row>
                        <v-col cols="12" class="d-flex align-center">
                            <label v-text="$t('session.playbackSettings.ambience.title')"></label>
                        </v-col>
                        <v-col cols="12" class="d-flex align-center">
                            <v-select
                                v-if="ambiences.length > 0"
                                v-model="_model.data.ambience"
                                :items="ambiences"
                                outlined
                                hide-details
                            >
                                <template #selection="{ item }">
                                    <div class="d-flex align-center" style="gap: 1rem">
                                        <v-img :src="item.thumbnail" width="48" height="48" class="d-flex align-center justify-center text-center">
                                            <v-icon v-if="item.value === null" x-large>mdi-close</v-icon>
                                        </v-img>
                                        <span v-text="item.text"></span>
                                    </div>
                                </template>
                                <template #item="{ item }">
                                    <div class="d-flex align-center" style="gap: 1rem">
                                        <v-img :src="item.thumbnail" width="64" height="64" class="d-flex align-center justify-center text-center">
                                            <v-icon v-if="item.value === null" x-large>mdi-close</v-icon>
                                        </v-img>
                                        <span v-text="item.text"></span>
                                    </div>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" class="d-flex flex-wrap align-center" style="gap: 1rem">
                            <v-switch
                                v-model="_model.data.music"
                                :label="$t('playbackSettingsModel.music')"
                                class="mt-0 pt-0 ml-1"
                                inset
                                hide-details
                            ></v-switch>
                            <v-switch
                                v-model="_model.data.animation"
                                :label="$t('playbackSettingsModel.animation')"
                                class="mt-0 pt-0 ml-1"
                                inset
                                hide-details
                            ></v-switch>
                            <v-switch
                                v-model="_model.data.wallpaper"
                                :label="$t('playbackSettingsModel.wallpaper')"
                                class="mt-0 pt-0 ml-1"
                                inset
                                hide-details
                            ></v-switch>
                        </v-col>
                    </v-row>
                    <v-row v-if="!deck.data.single">
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <label v-text="$t('session.playbackSettings.side.title')"></label>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <v-select
                                v-model="_model.data.side"
                                :items="[
                                { text: $t('session.playbackSettings.side.both'), value: null },
                                { text: $t('session.playbackSettings.side.front'), value: 'front' },
                                { text: $t('session.playbackSettings.side.back'), value: 'back' },
                            ]"
                                outlined
                                hide-details
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <label v-text="$tc('session.playbackSettings.delay', _model.data.delay, {
                            amount: _model.data.delay,
                        })"></label>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <v-slider
                                v-model="_model.data.delay"
                                min="1"
                                max="20"
                                thumb-label
                                hide-details
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <label v-text="$tc('session.playbackSettings.repeat', _model.data.repeat, {
                            amount: _model.data.repeat,
                        })"></label>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <v-slider
                                v-model="_model.data.repeat"
                                min="1"
                                max="5"
                                thumb-label
                                hide-details
                            />
                        </v-col>
                    </v-row>
                    <v-row v-if="!deck.data.single && _model.data.side === null">
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <label v-text="$t('session.playbackSettings.flipped')"></label>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <v-switch
                                v-model="_model.data.flipped"
                                class="mt-0 pt-0 ml-1"
                                inset
                                hide-details
                            ></v-switch>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <label v-text="$t('session.playbackSettings.reversed')"></label>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <v-switch
                                v-model="_model.data.reversed"
                                class="mt-0 pt-0 ml-1"
                                inset
                                hide-details
                            ></v-switch>
                        </v-col>
                    </v-row>
                    <v-row v-if="_model.data.side !== 'back'">
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <label v-text="$t('session.playbackSettings.' + (deck.data.single ? 'voiceEnabled' : 'frontVoiceEnabled'))"></label>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <v-switch
                                v-model="_model.data.frontVoiceEnabled"
                                class="mt-0 pt-0 ml-1"
                                inset
                                hide-details
                            ></v-switch>
                        </v-col>
                    </v-row>
                    <v-row v-if="!deck.data.single && _model.data.side !== 'front'">
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <label v-text="$t('session.playbackSettings.backVoiceEnabled')"></label>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <v-switch
                                v-model="_model.data.backVoiceEnabled"
                                class="mt-0 pt-0 ml-1"
                                inset
                                hide-details
                            ></v-switch>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <label v-text="$t('session.playbackSettings.imageEnabled')"></label>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <v-switch
                                v-model="_model.data.imageEnabled"
                                class="mt-0 pt-0 ml-1"
                                inset
                                hide-details
                            ></v-switch>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="6">
                    <v-row>
                        <v-col cols="6" class="d-flex align-center">
                            <label v-text="$t('session.playbackSettings.cardRange')"></label>
                        </v-col>
                        <v-col cols="6" class="d-flex align-center justify-end">
                            <v-btn :disabled="!canResetCardRange" outlined small @click="handleResetCardRange">
                                <span v-text="$t('btn.clear')"></span>
                            </v-btn>
                        </v-col>
                        <v-col cols="12">
                            <v-range-slider
                                v-model="_cardRange"
                                :max="cardRangeMax"
                                :min="0"
                                hide-details
                                class="align-center"
                            >
                                <template v-slot:prepend>
                                    {{_cardRange[0] + 1}}
                                </template>
                                <template v-slot:append>
                                    {{_cardRange[1] + 1}}
                                </template>
                            </v-range-slider>

                            <v-select
                                v-model="_model.data.cardRangeMode"
                                :label="$t('session.playbackSettings.cardRangeMode.label')"
                                :items="[
                                    { icon: 'mdi-refresh', text: $t('session.playbackSettings.cardRangeMode.repeat'), desc: $t('session.playbackSettings.cardRangeMode.repeatDesc'), value: null },
                                    { icon: 'mdi-numeric-9-plus-circle-outline', text: $t('session.playbackSettings.cardRangeMode.progressive'), desc: $t('session.playbackSettings.cardRangeMode.progressiveDesc'), value: 'progressive' },
                                ]"
                                class="mt-6"
                                outlined
                                height="64"
                                hide-details
                            >
                                <template #selection="{ item }">
                                    <div style="height: 64px" class="d-flex align-center">
                                        <v-icon v-if="item.icon" v-text="item.icon" left></v-icon>
                                        <div>
                                            <div v-text="item.text"></div>
                                            <p v-if="item.desc" v-text="item.desc" class="mb-0 caption opacity-66"></p>
                                        </div>
                                    </div>
                                </template>
                                <template #item="{ item }">
                                    <div style="height: 64px" class="d-flex align-center">
                                        <v-icon v-if="item.icon" v-text="item.icon" left></v-icon>
                                        <div>
                                            <div v-text="item.text"></div>
                                            <p v-if="item.desc" v-text="item.desc" class="mb-0 caption opacity-66"></p>
                                        </div>
                                    </div>
                                </template>
                            </v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6" class="d-flex align-center">
                            <label v-text="$t('session.playbackSettings.dateRange')"></label>
                        </v-col>
                        <v-col cols="6" class="d-flex align-center justify-end">
                            <v-btn :disabled="_model.data.fromDate === null" outlined small @click="_model.data.fromDate = null">
                                <span v-text="$t('btn.clear')"></span>
                            </v-btn>
                        </v-col>
                        <v-col cols="12">
                            <v-date-picker
                                v-model="date"
                                :events="events"
                                event-color="primary"
                                color="primary"
                                no-title
                                full-width
                                range
                            ></v-date-picker>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6" class="d-flex align-center">
                            <label v-text="$t('session.playbackSettings.ejected')"></label>
                        </v-col>
                        <v-col cols="6" class="d-flex align-center justify-end">
                            <v-btn :disabled="_model.data.ejected.length === 0" outlined small @click="_model.data.ejected = []">
                                <span v-text="$t('btn.clear')"></span>
                            </v-btn>
                        </v-col>
                        <v-col cols="12">
                            <template v-if="_model.data.ejected.length === 0">
                                <v-alert type="info" outlined text>
                                    <span v-text="$t('session.playbackSettings.ejectedEmpty')"></span>
                                </v-alert>
                            </template>
                            <div v-else class="d-flex flex-wrap" style="gap: 0.5rem">
                                <v-chip :key="item" v-for="(item, itemIdx) in _model.data.ejected" close @click:close="handleReinjectClick(item, itemIdx)">
                                    <span class="text-truncate" v-text="getEjectedTitle(item)"></span>
                                </v-chip>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </template>
        <template #buttons>
            <v-btn :block="$vuetify.breakpoint.smAndDown" :loading="saving" :disabled="!canSave" color="primary" large @click="handleSavePlaybackSettings">
                <span v-text="$t('btn.apply')"></span>
            </v-btn>
            <v-btn :block="$vuetify.breakpoint.smAndDown" :disabled="saving" outlined large @click="_visible = false">
                <span v-text="$t('btn.cancel')"></span>
            </v-btn>
        </template>
    </Modal>
</template>

<script>
import PlaybackSettingsModel from "@/models/PlaybackSettingsModel";
import DeckModel from "@/models/DeckModel";
import Modal from "@/components/generic/Modal";
import Services from "../utils/Services";

export default {
    name: "PlaybackSettingsModal",

    components: { Modal },

    props: {
        data: {
            type: PlaybackSettingsModel,
            default: () => new PlaybackSettingsModel(),
        },
        original: {
            type: PlaybackSettingsModel,
            default: () => new PlaybackSettingsModel(),
        },
        visible: {
            type: Boolean,
            default: false,
        },
        deck: {
            type: DeckModel,
            default: () => new DeckModel(),
        },
        cards: {
            type: Array,
            default: () => ([]),
        },
        ambiences: {
            type: Array,
            default: () => ([]),
        },
        events: {
            type: Array,
            default: () => ([]),
        },
        skeleton: {
            type: Boolean,
            default: false,
        },
    },

    data: () => ({
        saving: false,
    }),

    computed: {
        canResetCardRange() {
            return this._model.data.cardRangeFrom || this._model.data.cardRangeTo;
        },
        canSave() {
            return !this.saving && JSON.stringify(this.original.data) !== JSON.stringify(this._model.data);
        },
        cardRangeMax() {
            return this.cards.length - 1;
        },
        _model: {
            get() {
                return this.data;
            },
            set(value) {
                this.$emit('update:data', value);
            },
        },
        _visible: {
            get() {
                return this.visible;
            },
            set(value) {
                this.$emit('update:visible', value);
            },
        },
        date: {
            get() {
                const date = [];
                if (this._model.data.fromDate) {
                    date.push(this._model.data.fromDate);
                }
                if (this._model.data.toDate && this._model.data.toDate !== this._model.data.fromDate) {
                    date.push(this._model.data.toDate);
                }
                return date;
            },
            set(value) {
                const fromDate = (value[0] && value[0] > value[1] ? value[1] : value[0]) || null;
                const toDate = (value[1] && value[1] < value[0] ? value[0] : value[1]) || null;
                this._model.data.fromDate = fromDate;
                this._model.data.toDate = toDate;
            },
        },
        _cardRange: {
            get() {
                const range = [
                    this._model.data.cardRangeFrom ? this._model.data.cardRangeFrom : 0,
                    this._model.data.cardRangeTo ? this._model.data.cardRangeTo : this.cardRangeMax
                ];
                return range;
            },
            set(value) {
                const cardRangeFrom = (value[0] && value[0] > value[1] ? value[1] : value[0]) || null;
                const cardRangeTo = (value[1] && value[1] < value[0] ? value[0] : value[1]) || null;
                this._model.data.cardRangeFrom = cardRangeFrom;
                this._model.data.cardRangeTo = cardRangeTo;
            },
        },
    },

    methods: {
        handleResetCardRange() {
            this._model.data.cardRangeFrom = null;
            this._model.data.cardRangeTo = null;
        },
        handleReinjectClick(item, index) {
            this._model.data.ejected.splice(index, 1);
        },

        handleSavePlaybackSettings() {
            const clone = this._model.clone();
            const callback = () => {
                this.$emit('update', clone);
                this._visible = false;
            };
            if (this.deck.data.id) {
                this.saving = true;
                const deck = this.deck.clone();
                deck.data.playback_settings.data = clone.data;
                return Services.updateDeck(this.deck.data.id, deck)
                    .then(response => {
                        callback();
                        return response;
                    })
                    .catch(this.$handleError)
                    .finally(() => this.saving = false);
            } else {
                callback();
            }
        },

        getEjectedTitle(id) {
            const card = this.cards.find(card => card.id === id);
            return card
                ? (card.front + ' / ' + card.back)
                : id;
        },
    },
}
</script>

<style lang="scss" scoped>
.v-select.v-text-field ::v-deep input {
    position: absolute;
}
</style>
