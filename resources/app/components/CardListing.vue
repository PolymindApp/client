<template>
    <v-card v-if="$vuetify.breakpoint.mdAndUp" v-bind="$attrs" v-on="$listeners">
        <v-data-table
            v-model="_selected"
            :headers="[
                { text: $t('header.front'), value: 'front', width: '50%' },
                { text: $t('header.back'), value: 'back', width: '50%' },
                { text: $t('header.createdAt'), value: 'created_at', width: '14em' },
                { text: '', value: '_action', width: 'auto', sortable: false, },
            ]"
            :items="cards"
            :footer-props="{
                itemsPerPageText: $t('table.itemsPerPageText'),
                itemsPerPageOptions: [10,25,50,100,-1],
            }"
            :loading="loading"
            :items-per-page="50"
            sort-by="created_at"
            sort-desc
            show-select
        >
            <template #footer.prepend>
                <BulkActionMenu
                    :cards.sync="_cards"
                    :selected.sync="_selected"
                    :voices="voices"
                    :btn-attrs="{ outlined: true }"
                    top
                    offset-y
                    @update="handleUpdate"
                />

                <!-- HIDDEN BULK ACTION FOR SINGLE ACTION -->
                <BulkActionMenu
                    ref="bulkAction"
                    v-show="false"
                    :cards.sync="_cards"
                    :selected.sync="singleSelected"
                    :voices="voices"
                    :btn-attrs="{ outlined: true }"
                    top
                    offset-y
                    @update="handleUpdate"
                />
            </template>
            <template #loading>
                {{ $t('table.loading') }}
            </template>
            <template #no-data>
                {{ $t('table.noData') }}
            </template>
            <template #no-results>
                {{ $t('table.noResults') }}
            </template>
            <template #item.front="{ item }">
                <ItemSide v-model="item.front" :audio="item.front_synthesized" :voice="item.front_voice" />
            </template>
            <template #item.back="{ item }">
                <ItemSide v-model="item.back" :audio="item.back_synthesized" :voice="item.back_voice" primary />
            </template>
            <template #item.created_at="{ item }">
                {{ item.created_at | moment('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template #item._action="{ item }">
                <div class="d-flex">
                    <v-tooltip left>
                        <template #activator="{ attrs, on }">
                            <v-btn v-bind="attrs" v-on="on" icon @click.stop="handleEditCardClick(item)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </template>
                        <span v-text="$t('btn.edit')"></span>
                    </v-tooltip>
                    <v-tooltip left>
                        <template #activator="{ attrs, on }">
                            <v-btn v-bind="attrs" v-on="on" icon @click.stop="handleDeleteCardClick(item)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </template>
                        <span v-text="$t('btn.delete')"></span>
                    </v-tooltip>
                </div>
            </template>
        </v-data-table>
    </v-card>
    <v-sheet v-else color="transparent" v-bind="$attrs" v-on="$listeners">
        <v-card :color="isSelected(card) ? 'primary' : null" :dark="isSelected(card)" :key="card.id" v-for="(card, cardIdx) in _cards" :class="{
            'mt-3': cardIdx > 0,
        }" @click="handleCardClick(card)">
            <v-card-text class="text-break">
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-skeleton-loader v-if="skeleton" type="text" class="mb-n2"></v-skeleton-loader>
                        <ItemSide v-else v-model="card.front" :audio="card.front_synthesized" :voice="card.front_voice" :selected="isSelected(card)" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-skeleton-loader v-if="skeleton" type="text" class="mb-n2"></v-skeleton-loader>
                        <ItemSide v-else v-model="card.back" :audio="card.back_synthesized" :voice="card.back_voice" primary :selected="isSelected(card)" />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-sheet>
</template>

<script>
import BulkActionMenu from '@/components/BulkActionMenu';
import PlayAudioBtn from '@/components/audio/PlayAudioBtn';
import Services from "../utils/Services";

const ItemSide = {
    props: {
        value: {
            type: String,
            default: null,
        },
        voice: {
            type: Object,
            default: () => ({}),
        },
        audio: {
            type: String,
            default: null,
        },
        primary: {
            type: Boolean,
            default: false,
        },
        selected: {
            type: Boolean,
            default: false,
        },
    },
    components: { PlayAudioBtn },
    template: `<div class="d-flex align-center">
      <div v-if="audio" class="mr-3">
        <PlayAudioBtn v-model="audio" tabindex="-1" />
      </div>
      <div style="line-height: 1rem" class="overflow-hidden">
        <div class="font-weight-bold two-lines-truncate">
            <span :class="{
              'd-inline-block text-capitalize-first': true,
              'primary--text': primary && !selected
            }" v-text="value"></span>
        </div>
        <div v-if="voice" class="mb-n1">
          <small :class="{
            'opacity-33': !selected
          }">
            <span v-text="voice.language.name"></span>
            - <span v-text="voice.name"></span>
          </small>
        </div>
      </div>
    </div>`,
};

export default {
    name: "CardListing",

    components: { BulkActionMenu, ItemSide },

    props: {
        cards: {
            type: Array,
            default: () => ([]),
        },
        loading: {
            type: Boolean,
            default: false,
        },
        selected: {
            type: Array,
            default: () => ([]),
        },
        voices: {
            type: Array,
            default: () => ([]),
        },
        skeleton: {
            type: Boolean,
            default: false,
        },
    },

    data: () => ({
        singleSelected: [],
    }),

    computed: {
        _cards: {
            get() {
                return this.skeleton ? [{},{},{}] : this.cards;
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

    methods: {
        handleUpdate(args) {
            if (this.singleSelected.length > 0) {
                this.singleSelected = [];
            }

            this.$emit('update', args);
        },
        handleCardClick(card) {
            const index = this.selected.findIndex(item => item.id === card.id);
            if (index === -1) {
                this._selected.push(this.$deepClone(card));
            } else {
                this._selected.splice(index, 1);
            }

            this.$emit('selected', this._selected);
        },

        handleEditCardClick(card) {
            this.singleSelected = [card];
            this.$nextTick(() => this.$refs.bulkAction.handleEdit());
        },

        handleDeleteCardClick(card) {
            this.$confirm(
                this.$i18n.t('card.deleteConfirm.title'),
                this.$i18n.t('card.deleteConfirm.body'),
                this.$i18n.t('btn.delete'),
                (modal, btn) => {
                    btn.attrs.loading = true;
                    modal.disabled = true;
                    this.deleteCard(card).then(() => {
                        modal.visible = false;
                        this.$snack(this.$i18n.t('snack.cardDeleted'));
                    });
                }
            );
        },

        deleteCard(card) {
            this.deleting = card.id;
            return Services.deleteCard(card.id)
                .then(response => {
                    this._cards = this.cards.filter(item => item.id !== card.id);
                    this.$emit('update');
                })
                .catch(this.$handleError)
                .finally(() => this.deleting = false);
        },

        isSelected(card) {
            return this.selected.findIndex(item => item.id === card.id) !== -1;
        },
    }
}
</script>

<style lang="scss" scoped>
.v-data-table ::v-deep .v-data-table__wrapper>table>tbody>tr>td,
.v-data-table ::v-deep .v-data-table__wrapper>table>tfoot>tr>td,
.v-data-table ::v-deep .v-data-table__wrapper>table>thead>tr>td {
    height: auto;
    padding: 0.5rem 1rem;
}
</style>
