<template>
    <v-treeview
        v-bind="$attrs"
        v-on="$listeners"
        :items="groups"
        :active.sync="actives"
        item-key="id"
        open-on-click
        activatable
        dense
        @update:active="handleItemClick"
    >
        <template #prepend="{ item, open }">
            <v-icon v-if="item.children.length > 0" color="third">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
            <v-icon v-else>mdi-cards</v-icon>
        </template>
        <template #append="{ item, open }">
            <v-chip v-if="item.id" v-text="item.total_card" x-small></v-chip>
        </template>
    </v-treeview>
</template>

<script>
import DeckModel from '@/models/DeckModel';

export default {
    name: "DeckTree",

    props: {
        value: {
            type: Array,
            default: () => ([]),
        },
    },

    data: () => ({
        deck: new DeckModel(),
        actives: [],
    }),

    watch: {
        '$route'() {
            this.deck = this.$root.decks.find(deck => deck.data.id === this.$route.params.uuid) || new DeckModel();
        },
    },

    computed: {
        groups() {
            const groups = {
                total_card: 0,
                children: [],
            };
            const injectSerie = (serie, container, parents = []) => {
                serie.forEach((item, index) => {
                    const found = container.children.find(group => group.name === serie[index > 0 ? index - 1 : 0].name);
                    if (found) { // Found, inject into children array
                        const remaining = serie.splice(1, serie.length);
                        parents.push(found);
                        injectSerie(remaining, found, parents);
                    } else { // Not found, can add to the list
                        container.children.push(item);

                        // Update total_card
                        parents.forEach(parent => {
                            parent.total_card += item.total_card;
                        });
                    }
                });
            };
            this.value.forEach(deck => {
                const serie = [];
                const names = (deck.data.i18n ? this.$i18n.t(deck.data.i18n) : deck.data.name).split(' - ');
                names.forEach((name, depth) => {
                    serie.push({
                        id: deck.data.id
                            ? (deck.data.id + ((names.length - 1) === depth ? '' : depth))
                            : null,
                        total_card: ((names.length - 1) === depth) ? deck.data.total_card : 0,
                        name: name.trim(),
                        children: [],
                    });
                });
                injectSerie(serie, groups);
            });
            return groups.children;
        },
    },

    methods: {
        handleItemClick(id) {
            if (id.length > 0 && this.deck.data.id !== id[0]) {
                this.$router.push({
                    name: this.$route.name,
                    params: { uuid: id[0] || 'unclassified' }
                });
            }
        },
    },

    mounted() {
        this.deck = this.$root.decks.find(deck => deck.data.id === this.$route.params.uuid) || new DeckModel();
        setTimeout(() => {
            this.actives = [this.deck.data.id];
        }, 500);
    },
}
</script>
