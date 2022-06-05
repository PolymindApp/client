import Vue from 'vue';
import globalVariables from '@/global';
import DeckModel from "../models/DeckModel";

export default Vue.extend({
    data: () => ({
        deck: new DeckModel(),
    }),

    computed: {
        deckName() {
            return this.deck.data.name || this.$i18n.t('state.unclassified').toString();
        },
    },

    created() {
        this.deck = globalVariables.decks.find((deck: DeckModel) => deck.data.id === this.$route.params.uuid) || new DeckModel();
    },
});
