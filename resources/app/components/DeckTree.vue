<template>
    <v-treeview
        v-bind="$attrs"
        v-on="$listeners"
        :items="groups"
        :active.sync="actives"
        item-key="id"
        activatable
        open-on-click
        dense
        class="ml-n6"
        @update:active="onActiveUpdate"
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
            this.update();
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
        onActiveUpdate(actives) {
            if (actives.length > 0) {
                const params = {
                    name: ['custom', 'session'].indexOf(this.$route.name) === -1 ? 'session' : this.$route.name,
                    params: { uuid: actives[0] || 'unclassified' }
                };
                const newRoute = this.$router.resolve(params);
                if (this.$route.fullPath !== newRoute.route.fullPath && newRoute.route.name !== 'session.dictionary') {
                    this.$router.push(params);
                }
            }
        },

        update() {
            this.actives = [];
            this.deck = this.$root.decks.find(deck => deck.data.id === this.$route.params.uuid) || new DeckModel();

            if (['custom', 'session'].includes(this.$route.name)) {
                setTimeout(() => {
                    this.actives = [this.deck.data.id];
                }, 500);
            }
        },
    },

    mounted() {
        this.update();
    },
}
</script>
