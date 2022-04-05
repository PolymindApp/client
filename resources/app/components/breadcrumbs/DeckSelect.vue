<template>
    <v-select
        v-model="_value"
        :items="_decks"
        :placeholder="'- ' + $t('placeholder.select') + ' -'"
        item-text="name"
        item-value="id"
        prepend-inner-icon="mdi-cards"
        hide-details
        return-object
        v-bind="$attrs"
        v-on="$listeners"
        @change="handleDeckSelect"
    />
</template>

<script>
export default {
    name: "DeckSelect",

    props: {
        value: {
            type: Object,
            default: () => ({}),
        },
        route: {
            type: String,
            default: null,
        },
        skipCurrent: {
            type: Boolean,
            default: false,
        },
        exclude: {
            type: Array,
            default: null,
        },
        global: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        _value: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
        _decks() {
            const decks = (this.skipCurrent
                ? this.$root.decks.filter(deck => deck.id !== (this.value && this.value.id))
                : this.$root.decks);
            return this.exclude
                ? decks.filter(deck => this.exclude.indexOf(deck.id) === -1)
                : decks;
        }
    },

    methods: {
        handleDeckSelect(value) {
            if (this.global) {
                localStorage.setItem('deck', value ? value.id : null);
                value.id
                    ? this.$router.replace({ name: this.route, params: { uuid: value.id } })
                    : this.$router.replace({ name: this.route, params: { uuid: 'unclassified' } })
            }
        },
    },
}
</script>
