<template>
    <div>
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
    </div>
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
            return this.skipCurrent
                ? this.$root.decks.filter(deck => deck.id !== (this.value && this.value.id))
                : this.$root.decks;
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
