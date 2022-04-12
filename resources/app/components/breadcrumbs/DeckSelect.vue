<template>
    <v-select
        v-model="_value"
        :items="_decks"
        :placeholder="'- ' + $t('placeholder.select') + ' -'"
        :prepend-inner-icon="_value && _value.id === '__new__' ? 'mdi-plus-circle' : 'mdi-cards'"
        item-text="name"
        item-value="id"
        hide-details
        return-object
        v-bind="$attrs"
        v-on="$listeners"
        @change="handleDeckSelect"
    >
        <template #selection="{ item }">
            {{ item.i18n ? $t(item.i18n) : item.name }}
        </template>
        <template #item="{ item }">
            <template v-if="item.id === '__new__'">
                <v-icon color="primary" left>mdi-plus-circle</v-icon>
                <span v-text="item.i18n ? $t(item.i18n) : item.name"></span>
            </template>
            <template v-else>
                {{ item.i18n ? $t(item.i18n) : item.name }}
            </template>
        </template>
    </v-select>
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
        includeNew: {
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
            let decks = (this.skipCurrent
                ? this.$root.decks.filter(deck => deck.id !== (this.value && this.value.id))
                : this.$root.decks);

            if (this.exclude) {
                decks = decks.filter(deck => this.exclude.indexOf(deck.id) === -1);
            }

            if (this.includeNew) {
                decks.push({
                    name: this.$i18n.t('deckSelect.new'),
                    id: '__new__'
                });
            }

            return decks;
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
