<template>
    <v-navigation-drawer v-model="_value" v-bind="$attrs" v-on="$listeners">
        <template #prepend>
            <v-sheet :color="$vuetify.breakpoint.smAndDown ? 'primary' : null" :dark="$vuetify.breakpoint.smAndDown">
                <v-list-item class="pt-4 d-flex align-center">
                    <div class="d-flex align-center justify-center no-select" style="gap: 1rem; flex: 1">
                        <img :src="logo" height="37" />
                        <div class="title mb-n1">Polymind</div>
                    </div>
                    <v-btn @click.prevent="_value = false" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-list-item>

                <v-list-item v-if="$root.user.id" class="mt-2">
                    <v-menu offset-y>
                        <template #activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" text outlined>
                                <span class="text-truncate caption" style="width: 180px" v-text="$root.user.email"></span>
                                <v-icon right>mdi-chevron-down</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="$emit('logout')">
                                <v-list-item-icon>
                                    <v-icon color="secondaryDark" left>mdi-logout-variant</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <span v-text="$t('accountMenu.logout')"></span>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-list-item>
                <v-divider class="mt-4"></v-divider>
            </v-sheet>
        </template>

        <v-list dense>
            <div class="px-2 pb-4">
                <v-text-field
                    v-model="search"
                    :placeholder="$t('sidebar.decks.title')"
                    prepend-inner-icon="mdi-magnify"
                    solo
                    dense
                    clearable
                    hide-details
                ></v-text-field>
            </div>
            <DeckTree v-model="_decks" />
            <div v-if="_decks.length === 0 && _search.length > 0" class="px-2">
                <v-alert type="info" text outlined>
                    <span v-text="$t('sidebar.decks.noResults')"></span>
                </v-alert>
            </div>
        </v-list>

        <template #append>
            <v-sheet color="background">
                <v-divider></v-divider>
                <div class="pa-4">
                    <div v-if="socialLinks.length > 0" class="d-flex align-center justify-center">
                        <v-tooltip :key="linkIdx" v-for="(link, linkIdx) in socialLinks" bottom>
                            <template #activator="{ attrs, on }">
                                <v-btn :href="link.href" target="_blank" v-bind="attrs" v-on="on" icon>
                                    <v-icon color="secondaryDark" v-text="link.icon"></v-icon>
                                </v-btn>
                            </template>
                            <span v-text="link.tooltip"></span>
                        </v-tooltip>
                    </div>

                    <div class="mt-2">
                        <LanguageSwitcher v-model="$i18n.locale" btn-class="px-0" color="secondaryDark" outlined dense hide-details @input="handleLanguageSwitch" />
                    </div>

                    <div class="caption opacity-75 text-center mt-2">
                        <span v-text="$t('footer.copyright', {
                            name: 'Polymind',
                            version,
                            year,
                        })"></span>
                        <span v-text="$t('footer.allRights')"></span>
                    </div>
                </div>
            </v-sheet>
        </template>
    </v-navigation-drawer>
</template>

<script>
import logoLight from '@/assets/images/polymind-light.svg'
import logoDark from '@/assets/images/polymind-dark.svg'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import DeckTree from '@/components/DeckTree'
import EventBus from '@/utils/EventBus'
import packageJson from "../../../../package.json";

export default {
    name: "Sidebar",

    components: { LanguageSwitcher, DeckTree },

    props: {
        value: {
            type: Boolean,
            default: false,
        },
        socialLinks: {
            type: Array,
            default: () => ([]),
        },
    },

    data: () => ({
        search: '',
        year: new Date().getFullYear(),
        version: packageJson.version,
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

        _search() {
            return (this.search || '').trim();
        },

        _decks() {
            return this.$root.decks.filter(deck => this._search.length === 0 || (deck.data.name || this.$i18n.t(deck.data.i18n)).trim().toLowerCase().indexOf(this._search.toLowerCase()) !== -1)
        },

        logo() {
            return this.$vuetify.breakpoint.smAndDown ? logoLight : logoDark;
        },
    },

    methods: {
        handleLanguageSwitch(value) {
            EventBus.publish('LANGUAGE_SWITCH', value);
        },
    },
}
</script>
