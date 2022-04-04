<template>
    <v-container class="fill-height pa-0 d-flex flex-column" fluid v-bind="$attrs" v-on="$listeners">

        <!-- BREADCRUMBS -->
        <portal to="toolbar_left">
            <div class="d-flex align-center">
                <DeckSelect v-model="deck" route="deck.play" class="mr-4" style="width: 15rem" outlined dense global />
                <v-btn color="primary" :to="{ name: 'deck.edit', params: { uuid: deck && deck.id || 'unclassified' } }">
                    <v-icon left>mdi-pencil</v-icon>
                    <span v-text="$t('btn.edit')"></span>
                </v-btn>
            </div>
        </portal>

        <div style="flex: 1" class="fill-height w-100 d-flex flex-column align-content-between justify-center">
            <div class="pa-4 d-flex align-center justify-space-between">
                &nbsp;
            </div>
            <div style="flex: 1" class="pa-4 d-flex align-center justify-space-between">
                <v-btn v-if="$vuetify.breakpoint.mdAndUp" height="30vh" text x-large>
                    <v-icon size="7.5vh">mdi-chevron-left</v-icon>
                </v-btn>
                <div class="d-flex justify-center" style="flex: 1">
                    <v-btn height="15vh" width="15vh" text fab x-large>
                        <v-icon size="7.5vh">mdi-play</v-icon>
                    </v-btn>
                </div>
                <v-btn v-if="$vuetify.breakpoint.mdAndUp" height="30vh" text x-large>
                    <v-icon size="7.5vh">mdi-chevron-right</v-icon>
                </v-btn>
            </div>
            <div class="pa-4 d-flex align-center justify-space-between">

            </div>
            <v-progress-linear indeterminate height="5" />
        </div>

        <!-- MOBILE FOOTER -->
        <v-expand-transition>
            <MobileNav v-if="showMobileNav" class="w-100" />
        </v-expand-transition>
    </v-container>
</template>

<script>
import DeckSelect from '@/components/breadcrumbs/DeckSelect';
import MobileNav from '@/components/layout/MobileNav';

export default {
    name: "Play",

    components: { DeckSelect, MobileNav },

    props: {
        value: {
            type: String,
            default: null,
        },
        skeleton: {
            type: Boolean,
            default: false,
        },
    },

    data: () => ({
        deck: null,
    }),

    computed: {
        _value: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
        showMobileNav() {
            return this.$vuetify.breakpoint.smAndDown
                && !this.$root.inputFocused
                && window.innerHeight > window.innerWidth;
        },
    },

    methods: {
        init() {
            console.log('Play');
        },
    },

    created() {

        if (this.$route.params.uuid !== localStorage.getItem('deck')
            && [null, 'null'].indexOf(localStorage.getItem('deck')) === -1
            && this.$route.params.uuid !== 'unclassified') {
            this.$router.replace({ name: 'deck.play', params: { uuid: localStorage.getItem('deck') } })
        }
        this.deck = this.$root.decks.find(deck => deck.id === this.$route.params.uuid) || null;

        this.init();
    },
}
</script>
