<template>
    <div>

        <!--FLIP -->
        <Modal v-model="flipDialog.visible" :title="$t('bulkActionMenu.confirmFlip.title')" max-width="500" :fullscreen="$vuetify.breakpoint.smAndDown" scrollable>
            <template #body>
                <p v-text="$t('bulkActionMenu.confirmFlip.body')"></p>
                <v-checkbox
                    v-model="flipDialog.includeVoices"
                    :label="$t('bulkActionMenu.confirmFlip.includeVoices')"
                    hide-details
                ></v-checkbox>
            </template>
            <template #buttons>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :loading="bulking" :disabled="bulking" color="primary" large @click="handleFlipComplete">
                    <span v-text="$t('btn.flip')"></span>
                </v-btn>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :disabled="bulking" outlined large @click="flipDialog.visible = false">
                    <span v-text="$t('btn.cancel')"></span>
                </v-btn>
            </template>
        </Modal>

        <!-- BULK EDIT -->
        <Modal v-model="editDialog.visible" :title="$t('bulkActionMenu.editDialog.title')" max-width="500" :fullscreen="$vuetify.breakpoint.smAndDown" scrollable>
            <template v-if="editDialog.data[index]" #body>

                <v-text-field
                    v-model="editDialog.data[index].front"
                    :error-messages="editDialog.formErrors.front"
                    :label="$t('header.front')"
                    :rules="[rules.required]"
                    :loading="loading"
                    outlined
                    required
                    clearable
                >
                    <template #append>
                        <div class="d-flex align-center" style="margin-top: -6px">
                            <v-tooltip bottom>
                                <template #activator="{ attrs, on }">
                                    <MicAudioRecorder v-model="editDialog.data[index].front_synthesized" tabindex="-1" v-bind="attrs" v-on="on" :on-before-record="() => handleBeforeRecord(editDialog.data[index].front_voice_id, () => editDialog.data[index].front_voice_id = null)" :disabled="!canRecord(editDialog.data[index].front_voice_id)" icon />
                                </template>
                                <span v-text="$t('btn.record')"></span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template #activator="{ attrs, on }">
                                    <PlayAudioBtn v-model="editDialog.data[index].front_synthesized" tabindex="-1" v-bind="attrs" v-on="on" />
                                </template>
                                <span v-text="$t('btn.listen')"></span>
                            </v-tooltip>
                        </div>
                    </template>
                </v-text-field>

                <v-text-field
                    v-model="editDialog.data[index].back"
                    :error-messages="editDialog.formErrors.back"
                    :label="$t('header.back')"
                    :rules="[rules.required]"
                    :loading="loading"
                    outlined
                    required
                    clearable
                >
                    <template #append>
                        <div class="d-flex align-center" style="margin-top: -6px">
                            <v-tooltip bottom>
                                <template #activator="{ attrs, on }">
                                    <MicAudioRecorder v-model="editDialog.data[index].back_synthesized" tabindex="-1" v-bind="attrs" v-on="on" :on-before-record="() => handleBeforeRecord(editDialog.data[index].back_voice_id, () => editDialog.data[index].back_voice_id = null)" :disabled="!canRecord(editDialog.data[index].back_voice_id)" icon />
                                </template>
                                <span v-text="$t('btn.record')"></span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template #activator="{ attrs, on }">
                                    <PlayAudioBtn v-model="editDialog.data[index].back_synthesized" tabindex="-1" v-bind="attrs" v-on="on" />
                                </template>
                                <span v-text="$t('btn.listen')"></span>
                            </v-tooltip>
                        </div>
                    </template>
                </v-text-field>

                <component
                    v-model="editDialog.data[index].front_voice_id"
                    :is="$vuetify.breakpoint.mdAndUp ? VAutocomplete : VSelect"
                    :items="voices"
                    :label="$t('deck.voiceFront')"
                    :loading="loading"
                    prepend-inner-icon="mdi-volume-high"
                    item-text="name"
                    item-value="id"
                    class="ma-0 pa-0"
                    outlined
                    clearable
                />

                <component
                    v-model="editDialog.data[index].back_voice_id"
                    :is="$vuetify.breakpoint.mdAndUp ? VAutocomplete : VSelect"
                    :items="voices"
                    :label="$t('deck.voiceBack')"
                    :loading="loading"
                    prepend-inner-icon="mdi-volume-high"
                    item-text="name"
                    item-value="id"
                    class="ma-0 pa-0"
                    outlined
                    clearable
                />
            </template>
            <template #buttons>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :loading="bulking" :disabled="!canBulkSave" color="primary" large @click="handleEditComplete">
                    <span v-text="$t('btn.save')"></span>
                </v-btn>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :disabled="bulking" outlined large @click="editDialog.visible = false">
                    <span v-text="$t('btn.cancel')"></span>
                </v-btn>
                <template v-if="selected.length > 1">
                    <v-divider v-if="$vuetify.breakpoint.smAndDown" class="my-3" />
                    <v-spacer v-else />
                    <div class="d-flex align-center" style="gap: 1rem">
                        <v-btn :disabled="bulking" icon @click="handlePrevious">
                            <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                        <span class="text-center" style="flex: 1">
                            {{ index + 1 }} or {{ selected.length }}
                        </span>
                        <v-btn :disabled="bulking" icon @click="handleNext">
                            <v-icon>mdi-arrow-right</v-icon>
                        </v-btn>
                    </div>
                </template>
            </template>
        </Modal>

        <!-- BULK MOVE TO -->
        <Modal v-model="moveToDialog.visible" :title="$t('bulkActionMenu.moveToDialog.title')" max-width="500" :fullscreen="$vuetify.breakpoint.smAndDown" scrollable>
            <template #body>
                <DeckSelect v-model="moveToDialog.deck" :exclude="moveToDialog.exclude" outlined include-new />
                <template v-if="moveToDialog.deck && moveToDialog.deck.id === '__new__'">
                    <v-text-field
                        v-model="moveToDialog.newDeck.name"
                        :error-messages="moveToDialog.formErrors.newDeck"
                        :label="$t('field.name')"
                        :rules="[rules.required]"
                        :loading="bulking"
                        autofocus
                        class="mt-8"
                        outlined
                        required
                        clearable
                    />
                </template>
            </template>
            <template #buttons>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :loading="bulking" :disabled="!canMoveTo" color="primary" large @click="handleMoveToComplete">
                    <span v-text="$t('btn.move')"></span>
                </v-btn>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :disabled="bulking" outlined large @click="moveToDialog.visible = false">
                    <span v-text="$t('btn.cancel')"></span>
                </v-btn>
            </template>
        </Modal>

        <!-- BULK COPY TO -->
        <Modal v-model="copyToDialog.visible" :title="$t('bulkActionMenu.copyToDialog.title')" max-width="500" :fullscreen="$vuetify.breakpoint.smAndDown" scrollable>
            <template #body>
                <DeckSelect v-model="copyToDialog.deck" :exclude="copyToDialog.exclude" outlined include-new />
                <template v-if="copyToDialog.deck && copyToDialog.deck.id === '__new__'">
                    <v-text-field
                        v-model="copyToDialog.newDeck.name"
                        :error-messages="copyToDialog.formErrors.newDeck"
                        :label="$t('field.name')"
                        :rules="[rules.required]"
                        :loading="bulking"
                        autofocus
                        class="mt-8"
                        outlined
                        required
                        clearable
                    />
                </template>
            </template>
            <template #buttons>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :loading="bulking" :disabled="!canCopyTo" color="primary" large @click="handleCopyToComplete">
                    <span v-text="$t('btn.copy')"></span>
                </v-btn>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :disabled="bulking" outlined large @click="copyToDialog.visible = false">
                    <span v-text="$t('btn.cancel')"></span>
                </v-btn>
            </template>
        </Modal>

        <!-- BULK MENU -->
        <v-menu v-bind="$attrs" v-on="$listeners" transition="slide-y-reverse-transition" nudge-top="15">
            <template #activator="{ on, attrs }">
                <v-btn v-bind="{ ...attrs, ...btnAttrs }" v-on="{ ...on, ...btnOn }" :disabled="disabled || selected.length === 0">
                    <span v-text="$t('menu.bulk')"></span>
                    <v-icon right>mdi-chevron-up</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-item @click="handleEdit">
                    <v-list-item-icon>
                        <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title v-text="$t('btn.edit')"></v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleFlip">
                    <v-list-item-icon>
                        <v-icon class="mdi-rotate-90">mdi-menu-swap</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title v-text="$t('btn.flip')"></v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleMoveTo">
                    <v-list-item-icon>
                        <v-icon>mdi-file-move-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title v-text="$t('btn.moveTo')"></v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleCopyTo">
                    <v-list-item-icon>
                        <v-icon>mdi-content-copy</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title v-text="$t('btn.copyTo')"></v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleDelete">
                    <v-list-item-icon>
                        <v-icon>mdi-trash-can-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title v-text="$t('btn.delete')"></v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
import Modal from "./generic/Modal";
import DeckSelect from "./breadcrumbs/DeckSelect";
import MicAudioRecorder from "./audio/MicAudioRecorder";
import PlayAudioBtn from "./audio/PlayAudioBtn";
import Services from "../utils/Services";
import VAutocomplete from 'vuetify/lib/components/VAutocomplete/VAutocomplete';
import VSelect from 'vuetify/lib/components/VSelect/VSelect';
import Rules from "@/utils/Rules";

export default {
    name: "BulkActionMenu",

    components: { Modal, DeckSelect, MicAudioRecorder, PlayAudioBtn },

    props: {
        selected: {
            type: Array,
            default: () => ([]),
        },
        cards: {
            type: Array,
            default: () => ([]),
        },
        voices: {
            type: Array,
            default: () => ([]),
        },
        btnAttrs: {
            type: Object,
            default: null,
        },
        btnOn: {
            type: Object,
            default: null,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },

    data: () => ({
        index: 0,
        loading: false,
        bulking: false,
        flipDialog: {
            visible: false,
            includeVoices: false,
        },
        editDialog: {
            visible: false,
            formErrors: {},
            data: [],
            originalData: [],
            originalDataStr: '',
        },
        moveToDialog: {
            visible: false,
            formErrors: {},
            exclude: [],
            deck: null,
            newDeck: {},
        },
        copyToDialog: {
            visible: false,
            formErrors: {},
            exclude: [],
            deck: null,
            newDeck: {},
        },
        VAutocomplete,
        VSelect,
        rules: {},
    }),

    computed: {
        _cards: {
            get() {
                return this.cards;
            },
            set(value) {
                this.$emit('update:cards', value);
            },
        },
        _selected: {
            get() {
                return this.selected;
            },
            set(value) {
                this.$emit('update:selected', value);
            },
        },
        canMoveTo() {
            const deckId = this.moveToDialog.deck ? this.moveToDialog.deck.id : null;
            return !this.bulking
                && this.moveToDialog.exclude.indexOf(deckId) === -1
                && (
                    deckId !== '__new__'
                    || (this.moveToDialog.newDeck.name || '').trim() !== ''
                );
        },
        canCopyTo() {
            const deckId = this.copyToDialog.deck ? this.copyToDialog.deck.id : null;
            return !this.bulking
                && this.copyToDialog.exclude.indexOf(deckId) === -1
                && (
                    deckId !== '__new__'
                    || (this.copyToDialog.newDeck.name || '').trim() !== ''
                );
        },
        canBulkSave() {
            return !this.bulking && JSON.stringify(this.editDialog.data) !== this.editDialog.originalDataStr;
        }
    },

    watch: {
        'editDialog.visible'(value) {
            if (value) {
                this.index = 0;
            }
        },
    },

    methods: {
        handlePrevious() {
            this.index--;
            if (this.index < 0) {
                this.index = this.selected.length - 1;
            }
        },

        handleNext() {
            this.index++;
            if (this.index > this.selected.length - 1) {
                this.index = 0;
            }
        },

        handleEdit() {
            Object.assign(this.editDialog, {
                visible: true,
                data: this.$deepClone(this.selected),
                originalData: this.$deepClone(this.selected),
            });
            this.editDialog.originalDataStr = JSON.stringify(this.editDialog.originalData);
        },

        handleEditComplete() {
            this.edit((selected, index) => ({
                ...selected,
                ...this.editDialog.data[index],
            }), (item, itemIdx) => {
                return JSON.stringify(item) !== JSON.stringify(this.editDialog.originalData[itemIdx]);
            })
                .then(() => {
                    this.editDialog.visible = false;
                });
        },

        handleFlip() {
            Object.assign(this.flipDialog, {
                visible: true,
                includeVoices: false,
            });
        },

        handleFlipComplete() {
            this.flip(this.flipDialog.includeVoices).then(() => {
                this.flipDialog.visible = false;
            });
        },

        handleMoveTo() {
            Object.assign(this.moveToDialog, {
                visible: true,
                deck: null,
                newDeck: {
                    name: null,
                    default_front_language_id: null,
                    default_back_language_id: null,
                },
                exclude: [this.selected[0].deck_id],
            });
        },

        handleCopyTo() {
            Object.assign(this.copyToDialog, {
                visible: true,
                deck: null,
                newDeck: {
                    name: null,
                    default_front_language_id: null,
                    default_back_language_id: null,
                },
                exclude: [this.selected[0].deck_id],
            });
        },

        handleMoveToComplete() {
            const callback = () => {
                const deckId = this.moveToDialog.deck && this.moveToDialog.deck.id || null;
                this.edit(selected => ({
                    ...selected,
                    deck_id: deckId,
                }))
                    .then(() => {
                        this.moveToDialog.visible = false;
                        this.removeSelected();
                    });
            }

            if (this.moveToDialog.deck && this.moveToDialog.deck.id === '__new__') {
                this.createDeck(this.moveToDialog.newDeck)
                    .then(deck => {
                        this.moveToDialog.deck = deck;
                        callback();
                    });
            } else {
                callback();
            }
        },

        handleCopyToComplete() {
            const callback = () => {
                const deckId = this.copyToDialog.deck && this.copyToDialog.deck.id || null;
                this.create(selected => ({
                    ...selected,
                    deck_id: deckId,
                }))
                    .then(() => {
                        this.copyToDialog.visible = false;
                    });
            }

            if (this.copyToDialog.deck && this.copyToDialog.deck.id === '__new__') {
                this.createDeck(this.copyToDialog.newDeck)
                    .then(deck => {
                        this.copyToDialog.deck = deck;
                        callback();
                    });
            } else {
                callback();
            }
        },

        handleDelete() {
            this.$confirm(
                this.$i18n.t('bulkActionMenu.confirmDelete.title'),
                this.$i18n.t('bulkActionMenu.confirmDelete.body'),
                this.$i18n.t('btn.delete'),
                (modal, btn) => {
                    modal.disabled = true;
                    btn.attrs.loading = true;
                    this.delete().then(() => {
                        modal.visible = false;
                    });
                }
            );
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

        createDeck(deck) {
            this.bulking = true;
            return Services.createDeck(deck)
                .then(deck => {
                    this.$root.decks.push(deck);
                    return deck;
                })
                .catch(this.$handleError)
                .finally(() => this.bulking = false);
        },

        update(mapper = item => item, filter = () => true) {
            const cards = this.selected.map(mapper).filter(filter);

            this.bulking = true;
            return Services.bulkUpdateCards(cards)
                .then(response => {
                    ['selected', 'cards'].forEach(type => {
                        this['_' + type] = this[type].map(card => {
                            const found = response.find(item => item.id === card.id);
                            return {
                                ...card,
                                ...(found ? found : {}),
                            };
                        });
                    });
                    this.$emit('update', response);
                    return response;
                })
                .catch(this.$handleError)
                .finally(() => this.bulking = false);
        },

        edit(mapper, filter) {
            return this.update(mapper, filter)
                .then(() => {
                    this.$snack(this.$i18n.t('snack.cardBulkEdited'));
                });
        },

        create(mapper) {
            const cards = this.selected.map(mapper);

            this.bulking = true;
            return Services.bulkCreateCards(cards)
                .then(response => {
                    this.$snack(this.$i18n.t('snack.cardBulkCreated'));
                    return response;
                })
                .catch(this.$handleError)
                .finally(() => this.bulking = false);
        },

        flip(includeVoices = false) {
            return this.update(selected => ({
                ...selected,
                front: selected.back,
                front_voice_id: includeVoices ? selected.back_voice_id : selected.front_voice_id,
                front_synthesized: includeVoices ? selected.back_synthesized : selected.front_synthesized,
                back: selected.front,
                back_voice_id: includeVoices ? selected.front_voice_id : selected.back_voice_id,
                back_synthesized: includeVoices ? selected.front_synthesized : selected.back_synthesized,
            }))
                .then(() => {
                    this.$snack(this.$i18n.t('snack.cardBulkFlipped'));
                });
        },

        moveTo(deckId) {
            return this.update(selected => ({
                ...selected,
                deck_id: deckId,
            }))
                .then(() => {
                    this.$snack(this.$i18n.t('snack.cardBulkMoved'));
                });
        },

        delete() {
            this.bulking = true;
            return Services.bulkDeleteCards(this.selected)
                .then(response => {
                    this.$emit('update', response);
                    this.$snack(this.$i18n.t('snack.cardBulkDeleted'));
                    this.removeSelected();
                    return response;
                })
                .catch(this.$handleError)
                .finally(() => this.bulking = false);
        },

        removeSelected() {
            this._cards = this.cards.filter(item => !this.selected.find(selected => selected.id === item.id));
            this._selected = [];
        },

        canRecord(voice) {
            return !this.loading;
        },
    },

    created() {
        this.rules = {
            required: value => Rules.required(value) || this.$t('rules.required'),
        };
    },
}
</script>
