<template>
    <v-navigation-drawer v-model="_value" v-bind="$attrs" v-on="$listeners">
        <template #prepend>
            <v-sheet :color="$vuetify.breakpoint.smAndDown ? 'primary' : null" :dark="$vuetify.breakpoint.smAndDown">
                <v-list-item class="pt-4 d-flex align-center">
                    <div class="d-flex align-center justify-center no-select" style="gap: 1rem; flex: 1">
                        <img :src="logo" height="37" />
                        <div class="title">Polymind</div>
                    </div>
                    <v-btn @click.prevent="_value = false" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-list-item>

                <v-list-item v-if="$store.state.user.data.id" class="mt-2">
                    <v-menu offset-y>
                        <template #activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" text outlined>
                                <span class="text-truncate caption" style="width: 180px" v-text="$store.state.user.data.email"></span>
                                <v-icon right>mdi-chevron-down</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item :key="account.email" v-for="account in accounts" @click="() => handleSwitchAccountClick(account)">
                                <v-list-item-icon>
                                    <v-icon color="secondaryDark" left>mdi-account</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <span v-text="account.email"></span>
                                </v-list-item-content>
                            </v-list-item>
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
                    id="sidebar_search"
                    v-model="search"
                    :placeholder="$t('sidebar.search.placeholder')"
                    prepend-inner-icon="mdi-magnify"
                    :solo="$vuetify.theme.dark"
                    :outlined="!$vuetify.theme.dark"
                    dense
                    clearable
                    hide-details
                ></v-text-field>
            </div>

            <!-- DICTIONARIES -->
            <template v-if="_dictionaries.length !== 0 || _search.length === 0">
                <v-subheader v-text="$t('sidebar.dictionaries.title')"></v-subheader>
                <v-alert v-if="dictionaries.length === 0 && _search.length === 0" key="alert_dictionary" class="mx-2 caption" dense text>
                    <span v-text="$t('sidebar.dictionaries.noItems')"></span>
                </v-alert>
                <v-list-item v-else :key="dictionary.data.id" v-for="dictionary in dictionaries" :to="{ name: 'session.dictionary', params: { uuid: dictionary.data.id } }" color="primary">
                    <v-list-item-avatar tile size="32">
                        <v-img :src="dictionary.data.cover.data.url">
                            <template #placeholder>
                                <v-skeleton-loader type="image" height="32"></v-skeleton-loader>
                            </template>
                        </v-img>
                    </v-list-item-avatar>
                    <v-list-item-title>
                        <span v-text="dictionary.data.i18n[0].data.text"></span>
                    </v-list-item-title>
                </v-list-item>
            </template>

            <!-- DECKS -->
            <template v-if="_decks.length !== 0 || _search.length === 0">
                <v-subheader v-text="$t('sidebar.decks.title')"></v-subheader>
                <DeckTree
                    v-model="_decks"
                />
                <v-alert v-if="_decks.length === 0 && _search.length === 0" key="alert_deck" class="mx-2 caption" dense text>
                    <span v-text="$t('sidebar.decks.noItems')"></span>
                </v-alert>
            </template>

            <v-alert v-else-if="hasNoItemFound" key="alert_search" class="mx-2" type="info" text outlined>
                <span v-text="$t('sidebar.search.noResults')"></span>
            </v-alert>

            <!-- ADMIN -->
            <template v-if="$store.state.user.hasRole('admin')">
                <v-subheader v-text="$t('sidebar.admin.title')"></v-subheader>
                <v-list-item :to="{ name: 'admin.dictionaries' }" color="primary">
                    <v-list-item-icon>
                        <v-icon>mdi-book-multiple</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                        <span v-text="$t('sidebar.admin.dictionaries')"></span>
                    </v-list-item-title>
                </v-list-item>
                <v-list-item :to="{ name: 'admin.users' }" color="primary">
                    <v-list-item-icon>
                        <v-icon>mdi-account-multiple-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                        <span v-text="$t('sidebar.admin.users')"></span>
                    </v-list-item-title>
                </v-list-item>
            </template>
        </v-list>

        <!-- FOOTER -->
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
import UserModel from '@/models/UserModel'
import DeckTree from '@/components/DeckTree'
import EventBus from '@/utils/EventBus'
import Services from '@/utils/Services'
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
            return this.$store.state.decks.filter(deck => this._search.length === 0 || (deck.data.name || this.$i18n.t(deck.data.i18n)).trim().toLowerCase().indexOf(this._search.toLowerCase()) !== -1)
        },

        _dictionaries() {
            return this.$store.state.dictionaries.filter(dictionary => this.$store.state.settings.dictionary_settings.find(item => item.uuid === dictionary.data.id && item.bookmarked))
                .filter(dictionary => this._search.length === 0 || dictionary.data.i18n[0].text.trim().toLowerCase().indexOf(this._search.toLowerCase()) !== -1);
        },

        hasNoItemFound() {
            return this._decks.length === 0 &&
                this._dictionaries.length === 0 &&
                this._search.length > 0;
        },

        dictionaries() {
            return this.$store.state.dictionaries.filter(dictionary => this.$store.state.settings.dictionary_settings.find(item => item.uuid === dictionary.data.id && item.bookmarked));
        },

        logo() {
            return this.$vuetify.breakpoint.smAndDown ? logoLight : logoDark;
        },

        accounts() {
            return this.$store.state.accounts.filter(account => account.email !== this.$store.state.user.data.email);
        },
    },

    methods: {
        handleLanguageSwitch(value) {
            EventBus.publish('LANGUAGE_SWITCH', value);
        },
        handleSwitchAccountClick(account) {
            Services.switchToken(account.token);
            this.$store.commit('user', new UserModel(account));
            EventBus.publish('APP_RELOAD');
        },
    },
}
</script>
