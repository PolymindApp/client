<template>
    <v-form v-bind="$attrs" v-on="$listeners" @submit.prevent="handleSubmit">
        <v-card :flat="$vuetify.breakpoint.smAndDown" :tile="$vuetify.breakpoint.smAndDown">
            <v-expand-transition>
                <v-row v-if="(!$root.inputFocused || focusedOnCardEditorField) || !$vuetify.breakpoint.smAndDown" class="flex-nowrap" style="position: relative" no-gutters>
                    <v-col :cols="deck.data.single ? 12 : 6" :class="{
                        'd-flex align-center pr-2': true,
                        'pr-2': deck.data.single,
                        'pr-6': !deck.data.single,
                    }">
                        <v-skeleton-loader v-if="skeleton" style="flex: 1" height="48" type="text" class="ml-2 pt-4 pb-3"></v-skeleton-loader>
                        <component
                            v-else
                            id="card_editor_voice_front"
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
                    <template v-if="!deck.data.single">
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
                                id="card_editor_voice_back"
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
                    </template>
                </v-row>
            </v-expand-transition>
            <v-divider v-if="!$vuetify.breakpoint.smAndDown || (!$root.inputFocused && !$root.lockFocus)" /> <!-- NEEDS TO BE HERE -->
            <v-expand-transition>
                <v-row v-if="(!$root.inputFocused || focusedOnCardEditorField) || !$vuetify.breakpoint.smAndDown" no-gutters>
                    <v-col cols="12" :md="deck.data.single ? 12 : 6" class="pa-3 d-flex d-md-block" style="position: relative">
                        <v-text-field
                            ref="front"
                            id="card_editor_form_front"
                            v-model="_front"
                            :placeholder="frontPlaceholder"
                            :style="style"
                            :autofocus="autofocus"
                            :height="$vuetify.breakpoint.mdAndUp ? 100 : 90"
                            :disabled="loading"
                            class="main-input"
                            no-resize
                            solo
                            flat
                            hide-details
                            @focus="handleFocus"
                        />
                        <v-btn v-if="canPaste && !_front && $vuetify.breakpoint.smAndDown" class="paste-btn" color="discreet" outlined rounded small @click.stop="handlePasteClick('front')">
                            <v-icon left>mdi-clipboard-outline</v-icon>
                            <span v-text="$t('btn.paste')"></span>
                        </v-btn>
                        <div style="flex: 0" class="ml-3 ml-md-0 d-flex align-center justify-space-between">
                            <div>
                                <v-tooltip bottom>
                                    <template #activator="{ attrs, on }">
                                        <MicAudioRecorder v-model="_frontSynthesized" tabindex="-1" v-bind="attrs" v-on="on" :on-before-record="() => handleBeforeRecord(_voiceFront, _front, () => _voiceFront = null)" :disabled="!canRecord(_voiceFront, _front)" icon />
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
                            <div>
                                <v-btn v-if="canPaste && !_front && $vuetify.breakpoint.mdAndUp" color="discreet" outlined rounded small @click.stop="handlePasteClick('front')">
                                    <v-icon small left>mdi-clipboard-outline</v-icon>
                                    <span v-text="$t('btn.paste')"></span>
                                </v-btn>
                                <v-tooltip v-if="$vuetify.breakpoint.mdAndUp" bottom>
                                    <template #activator="{ attrs, on }">
                                        <v-btn tabindex="-1" v-bind="attrs" v-on="on" :disabled="!canCopyClipboard(_front)" icon @mousedown.stop.prevent="handleCopyClipboardClick(_front)">
                                            <v-icon>mdi-content-copy</v-icon>
                                        </v-btn>
                                    </template>
                                    <span v-text="$t('btn.copyClipboard')"></span>
                                </v-tooltip>
                            </div>
                        </div>
                    </v-col>
                    <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12">
                        <v-divider />
                    </v-col>
                    <template v-if="!deck.data.single">
                        <v-divider v-if="$vuetify.breakpoint.mdAndUp" vertical />

                        <v-expand-transition>
                            <v-col v-if="focusedOnCardEditorField || $vuetify.breakpoint.mdAndUp" cols="12" md="6">
                                <div class="pa-3 d-flex d-md-block" style="position: relative;">
                                    <v-text-field
                                        ref="back"
                                        id="card_editor_form_back"
                                        v-model="_back"
                                        :placeholder="backPlaceholder"
                                        :style="style"
                                        :height="$vuetify.breakpoint.mdAndUp ? 100 : 90"
                                        :disabled="loading"
                                        class="main-input"
                                        no-resize
                                        solo
                                        flat
                                        hide-details
                                        @focus="handleFocus"
                                    />
                                    <v-btn v-if="canPaste && !_back && $vuetify.breakpoint.smAndDown" class="paste-btn" color="discreet" outlined rounded small @click="handlePasteClick('back')">
                                        <v-icon left>mdi-clipboard-outline</v-icon>
                                        <span v-text="$t('btn.paste')"></span>
                                    </v-btn>
                                    <div style="flex: 0" class="ml-3 ml-md-0 d-flex align-center justify-space-between">
                                        <div>
                                            <v-tooltip bottom>
                                                <template #activator="{ attrs, on }">
                                                    <MicAudioRecorder v-model="_backSynthesized" tabindex="-1" v-bind="attrs" v-on="on" :on-before-record="() => handleBeforeRecord(_voiceBack, _back, () => _voiceBack = null)" :disabled="!canRecord(_voiceBack, _back)" icon />
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
                                        <div>
                                            <v-btn v-if="canPaste && !_back && $vuetify.breakpoint.mdAndUp" color="discreet" outlined rounded small @click="handlePasteClick('back')">
                                                <v-icon small left>mdi-clipboard-outline</v-icon>
                                                <span v-text="$t('btn.paste')"></span>
                                            </v-btn>
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
                                </div>
                            </v-col>
                        </v-expand-transition>
                    </template>
                </v-row>
            </v-expand-transition>
            <v-expand-transition>
                <v-sheet v-if="focusedOnCardEditorField || $vuetify.breakpoint.mdAndUp" color="surface">
                    <div class="pa-3 d-block d-md-flex align-center justify-space-between">
                        <div class="w-100 d-flex flex-column flex-md-row" style="gap: 0.5rem">
                            <v-btn type="submit" color="primary" :large="$vuetify.breakpoint.smAndDown" :block="$vuetify.breakpoint.smAndDown" :disabled="!canAdd || adding" :loading="adding" @click="handleSubmit">
                                <v-icon v-if="$vuetify.breakpoint.mdAndUp" left>mdi-plus</v-icon>
                                <span v-text="$t('btn.add')"></span>
                            </v-btn>
                            <v-btn v-if="$vuetify.breakpoint.mdAndUp" text :block="$vuetify.breakpoint.smAndDown" :disabled="!canClear" @click="handleClearClick">
                                <span v-text="$t('btn.clear')"></span>
                            </v-btn>
                            <v-btn v-else outlined large :block="$vuetify.breakpoint.smAndDown" @click="() => handleClearClick(false)">
                                <span v-text="$t('btn.cancel')"></span>
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
        frontPlaceholder() {
            const lang = this._voiceFront && this._voiceFront.language.code.substring(0, 2).toUpperCase();
            return this.$t('translateForm.frontPlaceholder') + (lang && this.$vuetify.breakpoint.smAndDown && (this.$root.inputFocused || this.$root.lockFocus) ? (' (' + lang + ')') : '')
        },
        backPlaceholder() {
            const lang = this._voiceBack && this._voiceBack.language.code.substring(0, 2).toUpperCase();
            return this.$t('translateForm.backPlaceholder') + (lang && this.$vuetify.breakpoint.smAndDown && (this.$root.inputFocused || this.$root.lockFocus) ? (' (' + lang + ')') : '')
        },
        canFlip() {
            return !this.loading && (this._front || '').length > 0 || (this._back || '').length > 0;
        },
        canAdd() {
            return !this.loading && (this._front || '').trim().length > 0 && (this.deck.data.single || (this._back || '').trim().length > 0 && !this.adding);
        },
        canClear() {
            return !this.loading && (this._front || '').length > 0 || (this._back || '').length > 0 || this.frontSynthesized || this.backSynthesized;
        },
        canDelete() {
            return !this.loading;
        },
        canPaste() {
            return ['iphone'].indexOf(navigator.platform.toLowerCase()) === -1;
        },
        focusedOnCardEditorField() {
            return [
                'card_editor_form_front',
                'card_editor_form_back',
            ].indexOf(this.$root.inputFocused) !== -1 || this.$root.lockFocus;
        }
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
            this.$root.lockFocus = true;
            this.$vuetify.goTo('#app');
        },
        handlePasteClick(side) {
            navigator.clipboard.readText().then(text => {
                if (text.trim().length > 0) {
                    this['_' + side] = text;
                    this.$refs[side].$el.querySelector('input').select();
                } else {
                    this.$snack(this.$i18n.t('snack.nothingToPaste'));
                }
            });
        },
        handleBeforeRecord(voice, text, callback = () => ({})) {
            return new Promise((resolve, reject) => {
                if (!voice) {
                    callback();
                    resolve();
                } else {
                    this.$confirm(
                        this.$i18n.t('cardEditorForm.confirmBeforeRecord.title'),
                        this.$i18n.t('cardEditorForm.confirmBeforeRecord.body'),
                        this.$i18n.t('btn.continue'),
                        (modal, btn) => {
                            callback();
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
                this.deck ? this.deck.data.id : null
            )
                .then(card => {
                    if (this.autofocus) {
                        this.$refs.front.$el.querySelector('input').focus();
                    }
                    this.$emit('add', card);
                    this.$emit('totalCard', 1);
                    this.clear();
                    this.$snack(this.$i18n.t('snack.cardAdded'));
                    this.$root.lockFocus = false;
                })
                .catch(this.$handleError)
                .finally(() => (this.adding = false));
        },

        handleClearClick(showSnack = true) {
            this.clear();
            if (showSnack) {
                this.$snack(this.$i18n.t('snack.itemsCleared'));
            }
            this.$root.lockFocus = false;
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

        canRecord(voice, text) {
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
.paste-btn {
    position: absolute;
    bottom: 1.25rem;
    left: 1.5rem;
}
.v-application--is-rtl .paste-btn {
    left: auto;
    right: 1.5rem;
}
</style>
