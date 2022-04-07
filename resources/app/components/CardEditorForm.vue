<template>
    <v-form v-bind="$attrs" v-on="$listeners" @submit.prevent="handleSubmit">
        <v-card :flat="$vuetify.breakpoint.smAndDown" :tile="$vuetify.breakpoint.smAndDown">
            <v-expand-transition>
                <v-row v-if="!$vuetify.breakpoint.smAndDown || !$root.inputFocused" style="position: relative" no-gutters>
                    <v-col cols="6" class="d-flex align-center pr-6 pr-2">
                        <v-skeleton-loader v-if="skeleton" style="flex: 1" height="48" type="text" class="ml-2 pt-4 pb-3"></v-skeleton-loader>
                        <component
                            v-else
                            v-model="_voiceFront"
                            :is="$vuetify.breakpoint.mdAndUp ? VAutocomplete : VSelect"
                            :items="_voices"
                            :placeholder="$t('translateForm.voice')"
                            :loading="loading"
                            :prepend-inner-icon="$vuetify.breakpoint.mdAndUp ? 'mdi-volume-high' : null"
                            item-text="name"
                            item-value="id"
                            class="ma-0 pa-0"
                            solo
                            flat
                            hide-details
                        />
                    </v-col>
                    <v-tooltip bottom>
                        <template #activator="{ attrs, on }">
                            <v-btn v-bind="attrs" v-on="on" style="position: absolute; z-index: 1; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%)" :disabled="!canFlip" icon @click="handleFlipClick">
                                <v-icon class="mdi-rotate-90">mdi-menu-swap</v-icon>
                            </v-btn>
                        </template>
                        <span v-text="$t('translateForm.flipTooltip')"></span>
                    </v-tooltip>
                    <v-col cols="6" class="d-flex align-center pl-6">
                        <v-skeleton-loader v-if="skeleton" style="flex: 1" height="48" type="text" class="mr-2 pt-4 pb-3"></v-skeleton-loader>
                        <component
                            v-else
                            v-model="_voiceBack"
                            :is="$vuetify.breakpoint.mdAndUp ? VAutocomplete : VSelect"
                            :items="_voices"
                            :placeholder="$t('translateForm.voice')"
                            :loading="loading"
                            :prepend-inner-icon="$vuetify.breakpoint.mdAndUp ? 'mdi-volume-high' : null"
                            item-text="name"
                            item-value="id"
                            class="ma-0 pa-0"
                            solo
                            flat
                            hide-details
                        />
                    </v-col>
                </v-row>
            </v-expand-transition>
            <v-divider v-if="!$vuetify.breakpoint.smAndDown || !$root.inputFocused" /> <!-- NEEDS TO BE HERE -->
                <v-row no-gutters>
                    <v-col cols="12" md="6" class="pa-3 d-flex d-md-block">
                        <v-text-field
                            ref="front"
                            v-model="_front"
                            :placeholder="$t('translateForm.frontPlaceholder')"
                            :style="style"
                            :autofocus="autofocus"
                            :height="$vuetify.breakpoint.mdAndUp ? 100 : 70"
                            :loading="loading"
                            :disabled="loading"
                            class="main-input"
                            no-resize
                            solo
                            flat
                            hide-details
                            @focus="handleFocus"
                            @blur="handleBlur"
                        />
                        <div style="flex: 0" class="ml-3 ml-md-0 d-flex align-center justify-space-between">
                            <div>
                                <v-tooltip bottom>
                                    <template #activator="{ attrs, on }">
                                        <MicAudioRecorder v-model="_frontSynthesized" tabindex="-1" v-bind="attrs" v-on="on" :on-before-record="() => handleBeforeRecord(_voiceFront, () => _voiceFront = null)" :disabled="!canRecord(_voiceFront)" icon />
                                    </template>
                                    <span v-text="$t('btn.record')"></span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template #activator="{ attrs, on }">
                                        <PlayAudioBtn v-model="_frontSynthesized" tabindex="-1" v-bind="attrs" v-on="on" />
                                    </template>
                                    <span v-text="$t('btn.listen')"></span>
                                </v-tooltip>
                            </div>
                            <v-tooltip v-if="$vuetify.breakpoint.mdAndUp" bottom>
                                <template #activator="{ attrs, on }">
                                    <v-btn tabindex="-1" v-bind="attrs" v-on="on" :disabled="!canCopyClipboard(_front)" icon @mousedown.stop.prevent="handleCopyClipboardClick(_front)">
                                        <v-icon>mdi-content-copy</v-icon>
                                    </v-btn>
                                </template>
                                <span v-text="$t('btn.copyClipboard')"></span>
                            </v-tooltip>
                        </div>
                    </v-col>
                    <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12">
                        <v-divider />
                    </v-col>
                    <v-divider v-if="$vuetify.breakpoint.mdAndUp" vertical />

                    <v-expand-transition>
                        <v-col v-if="$root.inputFocused || $vuetify.breakpoint.mdAndUp" cols="12" md="6">
                            <div class="pa-3 d-flex d-md-block">
                                <v-text-field
                                    ref="back"
                                    v-model="_back"
                                    :placeholder="$t('translateForm.backPlaceholder')"
                                    :style="style"
                                    :height="$vuetify.breakpoint.mdAndUp ? 100 : 70"
                                    :loading="loading"
                                    :disabled="loading"
                                    class="main-input"
                                    no-resize
                                    solo
                                    flat
                                    hide-details
                                    @focus="handleFocus"
                                    @blur="handleBlur"
                                />
                                <div style="flex: 0" class="ml-3 ml-md-0 d-flex align-center justify-space-between">
                                    <div>
                                        <v-tooltip bottom>
                                            <template #activator="{ attrs, on }">
                                                <MicAudioRecorder v-model="_backSynthesized" tabindex="-1" v-bind="attrs" v-on="on" :on-before-record="() => handleBeforeRecord(_voiceBack, () => _voiceBack = null)" :disabled="!canRecord(_voiceBack)" icon />
                                            </template>
                                            <span v-text="$t('btn.record')"></span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template #activator="{ attrs, on }">
                                                <PlayAudioBtn v-model="_backSynthesized" tabindex="-1" v-bind="attrs" v-on="on" />
                                            </template>
                                            <span v-text="$t('btn.listen')"></span>
                                        </v-tooltip>
                                    </div>
                                    <v-tooltip v-if="$vuetify.breakpoint.mdAndUp" bottom>
                                        <template #activator="{ attrs, on }">
                                            <v-btn tabindex="-1" v-bind="attrs" v-on="on" :disabled="!canCopyClipboard(_back)" icon @mousedown.stop.prevent="handleCopyClipboardClick(_back)">
                                                <v-icon>mdi-content-copy</v-icon>
                                            </v-btn>
                                        </template>
                                        <span v-text="$t('btn.copyClipboard')"></span>
                                    </v-tooltip>
                                </div>
                            </div>
                        </v-col>
                    </v-expand-transition>
                </v-row>
            <v-expand-transition>
                <v-sheet v-if="$root.inputFocused || $vuetify.breakpoint.mdAndUp" color="surface">
                    <div class="pa-3 d-flex align-center justify-space-between">
                        <div class="w-100 d-flex d-md-block" style="gap: 1rem">
                            <v-btn type="submit" style="flex: 1" color="primary" :disabled="!canAdd" :loading="adding" @click="handleSubmit">
                                <v-icon left>mdi-plus</v-icon>
                                <span v-text="$t('btn.add')"></span>
                            </v-btn>
                            <v-btn style="flex: 1" text :disabled="!canClear" @click="handleClearClick">
                                <span v-text="$t('btn.clear')"></span>
                            </v-btn>
                        </div>
        <!--                <div>-->
        <!--                    <v-btn color="error" :disabled="!canDelete" outlined @click="handleDeleteCard">-->
        <!--                        <span v-text="$t('btn.delete')"></span>-->
        <!--                    </v-btn>-->
        <!--                </div>-->
                    </div>
                </v-sheet>
            </v-expand-transition>
        </v-card>
    </v-form>
</template>

<script>
import Services from "@/utils/Services";
import MicAudioRecorder from "@/components/audio/MicAudioRecorder";
import PlayAudioBtn from "@/components/audio/PlayAudioBtn";
import VAutocomplete from 'vuetify/lib/components/VAutocomplete/VAutocomplete';
import VSelect from 'vuetify/lib/components/VSelect/VSelect';

export default {
    name: "CardEditorForm",

    components: { MicAudioRecorder, PlayAudioBtn, VAutocomplete, VSelect },

    props: {
        deck: {
            type: Object,
            default: null,
        },
        voices: {
            type: Array,
            default: () => ([]),
        },
        voiceFront: {
            type: Number,
            default: null,
        },
        voiceBack: {
            type: Number,
            default: null,
        },
        front: {
            type: String,
            default: null,
        },
        back: {
            type: String,
            default: null,
        },
        frontSynthesized: {
            type: String,
            default: null,
        },
        backSynthesized: {
            type: String,
            default: null,
        },
        autofocus: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        skeleton: {
            type: Boolean,
            default: false,
        },
    },

    data: () => ({
        adding: false,
        VAutocomplete,
        VSelect,
    }),

    computed: {
        _voices() {
            return this.$formatVoices(this.voices);
        },
        _front: {
            get() {
                return this.front;
            },
            set(value) {
                this.$emit('update:front', value);
            },
        },
        _back: {
            get() {
                return this.back;
            },
            set(value) {
                this.$emit('update:back', value);
            },
        },
        _voiceFront: {
            get() {
                return this._voices.find(voice => voice.id === this.voiceFront);
            },
            set(value) {
                this.$emit('update:voiceFront', value);
            },
        },
        _voiceBack: {
            get() {
                return this._voices.find(voice => voice.id === this.voiceBack);
            },
            set(value) {
                this.$emit('update:voiceBack', value);
            },
        },
        _frontSynthesized: {
            get() {
                return this.frontSynthesized;
            },
            set(value) {
                this.$emit('update:frontSynthesized', value);
            },
        },
        _backSynthesized: {
            get() {
                return this.backSynthesized;
            },
            set(value) {
                this.$emit('update:backSynthesized', value);
            },
        },
        _voicesFront() {
            return (this._voiceFront || { voices: [] }).voices.sort((a, b) => a.name > b.name ? 1 : -1);
        },
        _voicesBack() {
            return (this._voiceBack || { voices: [] }).voices.sort((a, b) => a.name > b.name ? 1 : -1);
        },
        style() {
            return {
                fontSize: '1.5rem',
            };
        },
        canFlip() {
            return !this.loading && (this._front || '').length > 0 || (this._back || '').length > 0;
        },
        canAdd() {
            return !this.loading && (this._front || '').trim().length > 0 && (this._back || '').trim().length > 0 && !this.adding;
        },
        canClear() {
            return !this.loading && (this._front || '').length > 0 || (this._back || '').length > 0 || this.frontSynthesized || this.backSynthesized;
        },
        canDelete() {
            return !this.loading;
        },
    },

    watch: {
        voiceFront() {
            window.dispatchEvent(new Event('resize'));
        },
        voiceBack() {
            window.dispatchEvent(new Event('resize'));
        },
    },

    methods: {
        handleFocus() {
            clearTimeout(this.inputFocusedTimeout);
            this.$root.inputFocused = true;
        },

        handleBlur() {
            this.inputFocusedTimeout = setTimeout(() => this.$root.inputFocused = false);
        },

        handleBeforeRecord(voice, callback = () => ({})) {
            return new Promise((resolve, reject) => {
                if (!voice) {
                    resolve();
                } else {
                    this.$confirm(
                        this.$i18n.t('cardEditorForm.confirmBeforeRecord.title'),
                        this.$i18n.t('cardEditorForm.confirmBeforeRecord.body'),
                        this.$i18n.t('btn.continue'),
                        (modal, btn) => {
                            callback()
                            modal.visible = false;
                            resolve();
                        }
                    )
                }
            });
        },

        handleCopyClipboardClick(text) {
            navigator.clipboard.writeText(text);
            this.$snack(this.$i18n.t('translateForm.copied'));
        },

        handleFlipClick() {
            const oldBack = this._back;
            const oldBackSynthesized = this._backSynthesized;
            const oldBackVoice = this.voiceBack;
            this._back = this._front;
            this._backSynthesized = this._frontSynthesized;
            this._voiceBack = this.voiceFront;
            this._front = oldBack;
            this._frontSynthesized = oldBackSynthesized;
            this._voiceFront = oldBackVoice;
        },

        handleSubmit() {
            this.adding = true;
            Services.createCard(
                this._front,
                this._back,
                this._voiceFront && this._voiceFront.id,
                this._voiceBack && this._voiceBack.id,
                this._frontSynthesized,
                this._backSynthesized,
                this.deck ? this.deck.id : null
            )
                .then(card => {
                    this.$emit('add', card);
                    this.clear();
                    this.$snack(this.$i18n.t('snack.cardAdded'));
                })
                .catch(this.$handleError)
                .finally(() => (this.adding = false));
        },

        handleClearClick() {
            this.clear();
            this.$snack(this.$i18n.t('snack.itemsCleared'));
        },

        handleDeleteCard() {
            this.$confirm(
                this.$i18n.t('translateForm.deleteCardConfirm.title'),
                this.$i18n.t('translateForm.deleteCardConfirm.body'),
                this.$i18n.t('btn.delete'),
                (modal, btn) => {
                    btn.attrs.loading = true;
                    modal.disabled = true;
                }
            );
        },

        clear() {
            this._front = '';
            this._frontSynthesized = null;
            this._back = '';
            this._backSynthesized = null;
        },

        canRecord(voice) {
            return !this.loading;
        },

        canListen(text, voice) {
            return !this.loading && text.length > 0 && voice !== undefined;
        },

        canCopyClipboard(text) {
            return text.length > 0;
        },
    },
}
</script>

<style lang="scss" scoped>
.main-input ::v-deep .v-input__slot {
    align-items: start;
    padding-top: 0.5rem !important;
}
</style>
