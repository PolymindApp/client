<template>
    <div>

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
                />

                <v-text-field
                    v-model="editDialog.data[index].back"
                    :error-messages="editDialog.formErrors.back"
                    :label="$t('header.back')"
                    :rules="[rules.required]"
                    :loading="loading"
                    outlined
                    required
                    clearable
                />

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
                <v-btn :block="$vuetify.breakpoint.smAndDown" :loading="bulking" :disabled="bulking" color="primary" large @click="handleEditComplete">
                    <v-icon left>mdi-content-save</v-icon>
                    <span v-text="$t('btn.save')"></span>
                </v-btn>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :disabled="bulking" outlined large @click="editDialog.visible = false">
                    <span v-text="$t('btn.cancel')"></span>
                </v-btn>
                <template v-if="selected.length > 1">
                    <v-divider class="my-3" />
                    <div class="d-flex align-center" style="gap: 1rem">
                        <v-btn :disabled="bulking" outlined large @click="handlePrevious">
                            <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                        <span class="text-center" style="flex: 1">
                            {{ index + 1 }} or {{ selected.length }}
                        </span>
                        <v-btn :disabled="bulking" outlined large @click="handleNext">
                            <v-icon>mdi-arrow-right</v-icon>
                        </v-btn>
                    </div>
                </template>
            </template>
        </Modal>

        <!-- BULK MOVE TO -->
        <Modal v-model="moveToDialog.visible" :title="$t('bulkActionMenu.moveToDialog.title')" max-width="500" :fullscreen="$vuetify.breakpoint.smAndDown" scrollable>
            <template #body>
                <DeckSelect v-model="moveToDialog.deck" :exclude="moveToDialog.exclude" outlined />
            </template>
            <template #buttons>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :loading="bulking" :disabled="bulking || moveToDialog.deck === moveToDialog.exclude[0]" color="primary" large @click="handleMoveToComplete">
                    <v-icon left>mdi-file-move-outline</v-icon>
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
                <DeckSelect v-model="copyToDialog.deck" :exclude="copyToDialog.exclude" outlined />
            </template>
            <template #buttons>
                <v-btn :block="$vuetify.breakpoint.smAndDown" :loading="bulking" :disabled="bulking || copyToDialog.deck === copyToDialog.exclude[0]" color="primary" large @click="handleCopyToComplete">
                    <v-icon left>mdi-content-copy</v-icon>
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
                <v-btn v-bind="{ ...attrs, ...btnAttrs }" v-on="{ ...on, ...btnOn }" :disabled="selected.length === 0">
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
import Services from "../utils/Services";
import VAutocomplete from 'vuetify/lib/components/VAutocomplete/VAutocomplete';
import VSelect from 'vuetify/lib/components/VSelect/VSelect';
import Rules from "@/utils/Rules";

export default {
    name: "BulkActionMenu",

    components: { Modal, DeckSelect },

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
    },

    data: () => ({
        index: 0,
        loading: false,
        bulking: false,
        editDialog: {
            visible: false,
            formErrors: {},
            data: [],
        },
        moveToDialog: {
            visible: false,
            formErrors: {},
            exclude: [],
            deck: null,
        },
        copyToDialog: {
            visible: false,
            formErrors: {},
            exclude: [],
            deck: null,
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
                data: this.$deepClone(this.selected)
            });
        },

        handleEditComplete() {
            this.edit((selected, index) => ({
                ...selected,
                ...this.editDialog.data[index],
            }))
                .then(() => {
                    this.editDialog.visible = false;
                });
        },

        handleFlip() {
            this.$confirm(
                this.$i18n.t('bulkActionMenu.confirmFlip.title'),
                this.$i18n.t('bulkActionMenu.confirmFlip.body'),
                this.$i18n.t('btn.flip'),
                (modal, btn) => {
                    modal.disabled = true;
                    btn.attrs.loading = true;
                    this.flip().then(() => {
                        modal.visible = false;
                    });
                }
            );
        },

        handleMoveTo() {
            Object.assign(this.moveToDialog, {
                visible: true,
                deck: null,
                exclude: [this.selected[0].deck_id],
            });
        },

        handleCopyTo() {
            Object.assign(this.copyToDialog, {
                visible: true,
                deck: null,
                exclude: [this.selected[0].deck_id],
            });
        },

        handleMoveToComplete() {
            const deckId = this.moveToDialog.deck && this.moveToDialog.deck.id || null;
            this.edit(selected => ({
                ...selected,
                deck_id: deckId,
            }))
                .then(() => {
                    this.moveToDialog.visible = false;
                    this.removeSelected();
                });
        },

        handleCopyToComplete() {
            const deckId = this.copyToDialog.deck && this.copyToDialog.deck.id || null;
            this.create(selected => ({
                ...selected,
                deck_id: deckId,
            }))
                .then(() => {
                    this.copyToDialog.visible = false;
                });
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

        update(mapper = item => item) {
            const cards = this.selected.map(mapper);

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
                })
                .catch(this.$handleError)
                .finally(() => this.bulking = false);
        },

        edit(mapper) {
            return this.update(mapper)
                .then(() => {
                    this.$snack(this.$i18n.t('snack.cardBulkEdited'));
                });
        },

        create(mapper) {
            const cards = this.selected.map(mapper);

            this.bulking = true;
            return Services.bulkCreateCards(cards)
                .then(() => {
                    this.$snack(this.$i18n.t('snack.cardBulkCopied'));
                })
                .catch(this.$handleError)
                .finally(() => this.bulking = false);
        },

        flip() {
            return this.update(selected => ({
                ...selected,
                front: selected.back,
                front_voice_id: selected.back_voice_id,
                front_synthesized: selected.back_synthesized,
                back: selected.front,
                back_voice_id: selected.front_voice_id,
                back_synthesized: selected.front_synthesized,
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
                })
                .catch(this.$handleError)
                .finally(() => this.bulking = false);
        },

        removeSelected() {
            this._cards = this.cards.filter(item => !this.selected.find(selected => selected.id === item.id));
            this._selected = [];
        },
    },

    created() {
        this.rules = {
            required: value => Rules.required(value) || this.$t('rules.required'),
        };
    },
}
</script>
