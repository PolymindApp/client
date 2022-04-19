<template>
    <v-select
        v-model="_value"
        :items="_decks"
        :placeholder="'- ' + $t('placeholder.select') + ' -'"
        :prepend-inner-icon="_value && _value.id === '__new__' ? 'mdi-plus-circle' : 'mdi-cards'"
        item-text="data.name"
        item-value="data.id"
        hide-details
        return-object
        v-bind="$attrs"
        v-on="$listeners"
        @change="handleDeckSelect"
    >
        <template #selection="{ item }">
            <span class="v-select__selection v-select__selection--comma" v-text="item.data.i18n ? $t(item.data.i18n) : item.data.name"></span>
        </template>
        <template #item="{ item }">
            <template v-if="item.data.id === '__new__'">
                <v-icon color="primary" :left="!$vuetify.rtl" :right="$vuetify.rtl">mdi-plus-circle</v-icon>
                <span v-text="item.data.i18n ? $t(item.data.i18n) : item.data.name"></span>
            </template>
            <template v-else>
                <div class="d-flex align-center w-100" style="gap: 1rem">
                    <span style="flex: 1" v-text="item.data.i18n ? $t(item.data.i18n) : item.data.name"></span>
                    <v-chip v-if="item.data.total_card !== undefined" x-small v-text="item.data.total_card"></v-chip>
                </div>
            </template>
        </template>
    </v-select>
</template>

<script>
import DeckModel from '@/models/DeckModel';

export default {
    name: "DeckSelect",

    props: {
        value: {
            type: Object,
            default: () => new DeckModel(),
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
                ? this.$root.decks.filter(deck => deck.data.id !== (this.value && this.value.id))
                : this.$root.decks);

            if (this.exclude) {
                decks = decks.filter(deck => this.exclude.indexOf(deck.data.id) === -1);
            }

            if (this.includeNew) {
                decks.push(new DeckModel({
                    i18n: 'deckSelect.new',
                    id: '__new__'
                }));
            }

            return decks;
        }
    },

    methods: {
        handleDeckSelect(value) {
            if (this.global) {
                localStorage.setItem('deck', value ? value.data.id : null);
                value.data.id
                    ? this.$router.replace({ name: this.route, params: { uuid: value.data.id } })
                    : this.$router.replace({ name: this.route, params: { uuid: 'unclassified' } })
            }
        },
    },
}
</script>
