import Vue from "vue";

export default Vue.extend({
    computed: {
        routeDictionary() {
            return this.$store.state.navigation.dictionary === null
                ? { name: 'dictionary' }
                : { name: 'dictionary.view', params: { uuid: this.$store.state.navigation.dictionary } };
        },
        deckUuid() {
            return this.$store.state.navigation.deck === null
                ? 'unclassified'
                : this.$store.state.navigation.deck;
        },
        routeSession() {
            return this.$store.state.navigation.session;
        },
    },
});
