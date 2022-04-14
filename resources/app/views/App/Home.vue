<template>
    <div class="fill-height">

        <!-- ADD/EDIT DECK -->
        <v-form ref="form" :disabled="deckModal.loading" v-model="deckModal.formIsValid" @submit="handleDeckFormSubmit" lazy-validation>
            <Modal v-model="deckModal.visible" :title="$t('deckModal.title' + (deckModal.clonedData.id ? 'Edit' : 'New'))" max-width="500" scrollable :fullscreen="$vuetify.breakpoint.smAndDown">
                <template #body>
                    <v-text-field
                        v-model="deckModal.clonedData.name"
                        :error-messages="deckModal.formErrors.name"
                        :label="$t('placeholder.name')"
                        :rules="[rules.required]"
                        :autofocus="deckModal.visible && $vuetify.breakpoint.mdAndUp"
                        outlined
                        required
                        @input="handleInput"
                    />
                    <v-autocomplete
                        v-model="deckModal.clonedData.default_front_voice_id"
                        :is="$vuetify.breakpoint.mdAndUp ? VAutocomplete : VSelect"
                        :items="_voices"
                        :label="$t('deck.defaultVoiceFront')"
                        :loading="loading"
                        :messages="$t('field.optional')"
                        prepend-inner-icon="mdi-volume-high"
                        item-text="name"
                        item-value="id"
                        class="ma-0 pa-0"
                        outlined
                        clearable
                        @input="handleInput"
                    />
                    <v-autocomplete
                        v-model="deckModal.clonedData.default_back_voice_id"
                        :is="$vuetify.breakpoint.mdAndUp ? VAutocomplete : VSelect"
                        :items="_voices"
                        :label="$t('deck.defaultVoiceBack')"
                        :loading="loading"
                        :messages="$t('field.optional')"
                        prepend-inner-icon="mdi-volume-high"
                        item-text="name"
                        item-value="id"
                        class="ma-0 pa-0"
                        outlined
                        clearable
                        @input="handleInput"
                    />
                </template>
                <template #buttons>
                    <v-btn color="primary" large type="submit" :loading="deckModal.loading" :disabled="deckModal.loading" :block="$vuetify.breakpoint.smAndDown" @click="handleDeckFormSubmit">
                        <span v-text="$t('btn.' + (deckModal.clonedData.id ? 'save' : 'create'))"></span>
                    </v-btn>
                    <v-btn outlined large :block="$vuetify.breakpoint.smAndDown" @click="deckModal.visible = false">
                        <span v-text="$t('btn.cancel')"></span>
                    </v-btn>
                </template>
            </Modal>
        </v-form>

        <!-- TITLE -->
        <portal to="title">
            <v-app-bar-title>
                <span v-text="title"></span>
            </v-app-bar-title>
        </portal>

        <!-- DESKTOP NAV -->
        <portal to="desktop_nav">
            <div class="d-flex align-center" style="gap: 1rem">
                <DeckSelect v-model="deck" route="deck.edit" style="min-width: 15rem; width: 15rem" outlined dense global />
                <DesktopNav :deck="deck" background-color="transparent" />
            </div>
        </portal>

        <!-- OPTIONS -->
        <portal to="options">
            <template v-if="showBulkActionMenu">
                <v-list-item :disabled="selected.length === cards.length" @click="handleSelectAll">
                    <v-list-item-icon>
                        <v-icon>mdi-checkbox-marked-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content v-text="$t('btn.selectAll')"></v-list-item-content>
                </v-list-item>
                <v-list-item :disabled="selected.length === 0" @click="handleDeselectAll">
                    <v-list-item-icon>
                        <v-icon>mdi-checkbox-blank-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content v-text="$t('btn.deselectAll')"></v-list-item-content>
                </v-list-item>
                <v-divider class="my-2" />
            </template>
            <v-list-item @click="handleNewDeckClick">
                <v-list-item-icon>
                    <v-icon>mdi-plus</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-text="$t('btn.newDeck')"></v-list-item-content>
            </v-list-item>
            <v-list-item :disabled="!canEditDeck" @click="handleEditDeckClick(deck)">
                <v-list-item-icon>
                    <v-icon>mdi-pencil</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-text="$t('btn.edit')"></v-list-item-content>
            </v-list-item>
            <v-list-item :disabled="!canEditDeck" @click="handleDeleteDeckClick(deck)">
                <v-list-item-icon>
                    <v-icon>mdi-delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-text="$t('btn.delete')"></v-list-item-content>
            </v-list-item>
            <v-divider class="my-2" />
        </portal>

        <div v-if="$vuetify.breakpoint.mdAndUp" style="margin-bottom: -97.5px">
            <v-sheet color="surface" height="130px"></v-sheet>
            <v-divider />
        </div>

        <v-container class="pa-0 pa-md-3 d-flex d-md-block flex-column fill-height">
            <v-expand-transition>
                <CardEditorForm
                    v-if="showCardEditorForm"
                    :deck="deck"
                    :voices="voices"
                    :front.sync="front"
                    :back.sync="back"
                    :voice-front.sync="voiceFront"
                    :voice-back.sync="voiceBack"
                    :front-synthesized.sync="frontSynthesized"
                    :back-synthesized.sync="backSynthesized"
                    :loading="loading"
                    :skeleton="skeleton"
                    :autofocus="$vuetify.breakpoint.mdAndUp"
                    class="mb-md-8"
                    @add="handleAddCardClick"
                />
            </v-expand-transition>

            <div :class="{
                'w-100 pa-3 px-md-0': true,
                'overflow-y-auto': $vuetify.breakpoint.smAndDown,
            }" :style="{
                flexGrow: $vuetify.breakpoint.smAndDown ? 1 : null,
                height: $vuetify.breakpoint.smAndDown ? 0 : null,
            }">
                <CardListing
                    :cards.sync="cards"
                    :voices="_voices"
                    :loading="loading"
                    :skeleton="skeleton"
                    :selected.sync="selected"
                    @update="resetVoices"
                    @selected="handleSelected"
                />
            </div>

            <!-- MOBILE FOOTER -->
            <MobileNav
                v-if="showMobileNav"
                :loading="loading"
                class="w-100"
            />
            <v-sheet v-if="showBulkActionMenu" class="w-100">
                <v-divider />
                <v-sheet class=" py-2 px-3">
                    <BulkActionMenu
                        :cards.sync="cards"
                        :selected.sync="selected"
                        :voices="_voices"
                        :btn-attrs="{ block: true, large: true, outlined: !$vuetify.theme.dark }"
                        top
                        offset-y
                        @update="resetVoices"
                    />
                    <v-btn class="mt-2" text large block @click="selected = []">
                        <span v-text="$t('btn.cancel')"></span>
                    </v-btn>
                </v-sheet>
            </v-sheet>
        </v-container>
    </div>
</template>

<script>
import Modal from '@/components/generic/Modal';
import CardEditorForm from '@/components/CardEditorForm';
import CardListing from '@/components/CardListing';
import DeckSelect from '@/components/breadcrumbs/DeckSelect';
import MobileNav from '@/components/layout/MobileNav';
import DesktopNav from '@/components/layout/DesktopNav';
import BulkActionMenu from '@/components/BulkActionMenu';
import VAutocomplete from 'vuetify/lib/components/VAutocomplete/VAutocomplete';
import VSelect from 'vuetify/lib/components/VSelect/VSelect';
import Services from '@/utils/Services';
import Rules from "@/utils/Rules";

export default {
	name: 'Home',

    components: { Modal, CardEditorForm, DeckSelect, CardListing, MobileNav, BulkActionMenu, DesktopNav },

    data: () => ({
        skeleton: true,
        loading: false,
        deleting: false,
        selected: [],
        deck: null,
        cards: [],
        voices: [],
        voiceFront: null,
        voiceBack: null,
        front: '',
        back: '',
        frontSynthesized: null,
        backSynthesized: null,
        title: null,
        deckModal: {
            visible: false,
            loading: false,
            formIsValid: false,
            clonedData: {},
            referencedData: {},
            formErrors: {},
        },
        VAutocomplete,
        VSelect,
        rules: {},
    }),

    computed: {
        _voices() {
            return this.$formatVoices(this.voices);
        },
        canEditDeck() {
            return this.deck && this.deck.id;
        },
        showCardEditorForm() {
            return !this.fullCardView;
        },
        showMobileNav() {
            return this.$vuetify.breakpoint.smAndDown
                && !this.$root.inputFocused
                && !this.fullCardView
                && window.innerHeight > window.innerWidth;
        },
        showBulkActionMenu() {
            return this.$vuetify.breakpoint.smAndDown && this.fullCardView;
        },
        fullCardView() {
            return this.$vuetify.breakpoint.smAndDown && this.selected.length > 0;
        },
        deckName() {
            return this.deck && this.deck.name || this.$i18n.t('state.unclassified');
        },
    },

    watch: {
        '$i18n.locale'() {
            document.title = this.deckName;
        },
        selected: {
            deep: true,
            handler(value) {
                if (value.length > 0) {
                    this.title = this.$i18n.t('home.selected', {
                        amount: value.length,
                    });
                } else {
                    this.title = this.deckName;
                }
                document.title = this.title;
            },
        },
    },

    methods: {

        handleSelectAll() {
            this.selected = this.cards.map(item => ({...item}));
        },

        handleDeselectAll() {
            this.selected = [];
        },

        handleSelected(selected) {
            this.selected = selected;
        },

        handleInput() {
            this.deckModal.formErrors = {};
        },

        handleAddCardClick(card) {
            this.cards.unshift(card);
        },

        handleNewDeckClick() {
            this.editDeck({
                name: '',
            });
        },

        handleEditDeckClick(deck) {
            this.editDeck(deck);
        },

        handleDeckFormSubmit() {
            this.saveDeck(this.deckModal.clonedData, this.deckModal.referencedData)
        },

        handleDeleteDeckClick(deck) {
            this.$confirm(
                this.$i18n.t('deck.deleteConfirm.title'),
                this.$i18n.t('deck.deleteConfirm.body'),
                this.$i18n.t('btn.delete'),
                (modal, btn) => {
                    btn.attrs.loading = true;
                    modal.disabled = true;
                    this.deleteDeck(deck).then(() => {
                        this.deck = null;
                        this.$snack(this.$i18n.t('deck.deleteConfirm.deleted'));
                        modal.visible = false;
                    });
                }
            );
        },

        editDeck(deck) {
            Object.assign(this.deckModal, {
                visible: true,
                loading: false,
                formIsValid: false,
                formErrors: {},
                clonedData: this.$deepClone(deck),
                referencedData: deck,
            });
        },

        saveDeck(deck, refDeck) {
            this.deckModal.loading = true;
            return (deck.id ? Services.updateDeck(deck.id, deck) : Services.createDeck(deck))
                .then(response => {
                    Object.assign(refDeck, response);
                    if (!deck.id && response.id) {
                        this.$root.decks.push(response);
                        this.$router.replace({ name: 'deck.edit', params: { uuid: response.id } });
                        this.$snack(this.$i18n.t('deckModal.created'));
                    } else {
                        this.deck = refDeck;
                        this.$snack(this.$i18n.t('deckModal.saved'));
                    }
                    this.deckModal.visible = false;
                })
                .catch(reason => this.$handleError(reason, this.deckModal.formErrors))
                .finally(() => this.deckModal.loading = false);
        },

        load() {
            this.loading = true;
            Promise.all([
                Services.getVoices(),
                Services.getCards(this.deck ? this.deck.id : undefined),
            ])
                .then(([voices, cards]) => {
                    Object.assign(this, { voices, cards });
                    this.resetVoices();
                    this.skeleton = false;
                })
                .catch(this.$handleError)
                .finally(() => this.loading = false);
        },

        resetVoices() {
            this.voiceFront = (this.deck && this.deck.default_front_voice_id) || (this.cards.length > 0 && this.cards[this.cards.length - 1].front_voice_id) || null;
            this.voiceBack = (this.deck && this.deck.default_back_voice_id) || (this.cards.length > 0 && this.cards[this.cards.length - 1].back_voice_id) || null;
        },

        deleteDeck(deck) {
            this.deleting = deck.id;
            return Services.deleteDeck(deck.id)
                .then(response => {
                    this.$root.decks = this.$root.decks.filter(item => item.id !== deck.id);
                    this.$router.replace({ name: 'deck.edit', params: { uuid: 'unclassified' } });
                })
                .catch(this.$handleError)
                .finally(() => this.deleting = false);
        },
    },

    created() {
        this.rules = {
            required: value => Rules.required(value) || this.$t('rules.required'),
        };

        if (!this.$route.params.uuid) {
            this.$router.replace({ name: 'deck.edit', params: { uuid: 'unclassified' } })
        }
        this.deck = this.$root.decks.find(deck => deck.id === this.$route.params.uuid) || null;
        this.title = this.deckName;
        document.title = this.title;

        this.load();
    },
}
</script>
