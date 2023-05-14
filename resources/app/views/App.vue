<template>
	<v-app>
        <Snack v-model="$root.snack.visible" :body="$root.snack.body" v-bind="$root.snack" transition="slide-y-reverse-transition" bottom left />
        <ErrorHandler :value="$root.error" max-width="500" icon="mdi-alert" color="error" dark scrollable :fullscreen="$vuetify.breakpoint.smAndDown" />
        <GlobalModal v-model="$root.modal.visible" v-bind="{ ...$root.modal, ...$root.modal.attrs }" v-on="$root.modal.on" scrollable />
        <Intro v-if="false" :first.sync="tourFirst" />

        <v-fade-transition>
            <v-overlay v-if="!loaded" style="z-index: 25">
                <v-progress-circular indeterminate />
            </v-overlay>
        </v-fade-transition>

        <v-expand-transition>
            <Toolbar
                v-if="showToolbar"
                :color="$vuetify.breakpoint.smAndDown ? 'primary' : null"
                :dark="$vuetify.breakpoint.smAndDown"
                :flat="$vuetify.breakpoint.smAndDown"
                class="px-2"
                app
                @drawer="drawer = true"
                @logout="handleLogoutClick"
            />
        </v-expand-transition>

        <Sidebar
            v-if="showSidebar"
            v-model="drawer"
            :social-links="$root.socialLinks"
            width="270"
            fixed
            temporary
            :right="$vuetify.rtl"
            @logout="handleLogoutClick"
        />

		<v-main>
			<v-sheet v-if="loaded" class="fill-height" color="background">
                <router-view :key="$route.fullPath" />
			</v-sheet>
		</v-main>

        <Footer
            v-if="$vuetify.breakpoint.mdAndUp"
            :social-links="$root.socialLinks"
        />
	</v-app>
</template>

<script>
import Vue from 'vue';
import Intro from "@/components/Intro";
import Sidebar from "@/components/layout/Sidebar";
import Toolbar from "@/components/layout/Toolbar";
import Footer from "@/components/layout/Footer";
import ErrorHandler from "@/components/generic/ErrorHandler";
import GlobalModal from "@/components/generic/Modal";
import Snack from "@/components/generic/Snack";
import DeckModel from "@/models/DeckModel";
import Services from "@/utils/Services";
import EventBus from "@/utils/EventBus";
import { rtlLanguages } from "@/locales";

let languageSwitchBus;
let checkFocusTimeout;

export default Vue.extend({
	name: 'App',

    components: { Sidebar, Toolbar, Footer, ErrorHandler, GlobalModal, Snack, Intro },

    data: () => ({
        loading: true,
        loaded: false,
        drawer: false,
        tourFirst: true,
    }),

    computed: {
        showToolbar() {
            return this.loaded && ((!this.$root.inputFocused && !this.$root.lockFocus) || this.$vuetify.breakpoint.mdAndUp)
            && (this.$vuetify.breakpoint.mdAndUp || this.$root.orientation === 'portrait');
        },
        showSidebar() {
            return this.loaded;
        },
        hideMobileFocus() {
            return (this.$root.inputFocused || this.$root.lockFocus) && this.$vuetify.breakpoint.smAndDown;
        },
    },

	methods: {
        handleOrientationChange() {
            switch(window.orientation) {
                case -90: case 90:
                    this.$root.orientation = 'landscape';
                    break;
                default:
                    this.$root.orientation = 'portrait';
                    break;
            }
        },
        handleCheckFocus(args) {
            clearTimeout(checkFocusTimeout);
            checkFocusTimeout = setTimeout(() => {
                const focused = ['input', 'textarea'].indexOf(document.activeElement.nodeName.toLowerCase()) !== -1 && !document.activeElement.getAttribute('readonly');
                const id = document.activeElement.getAttribute('id');
                this.$root.inputFocused = focused && id ? id : focused;
                this.$forceUpdate();
            }, args.type === 'focusout' ? 100 : 0);
        },
		handleLogoutClick() {
            this.$confirm(
                this.$i18n.t('app.logoutConfirm.title'),
                this.$i18n.t('app.logoutConfirm.body'),
                this.$i18n.t('btn.logout'),
                (modal, btn) => {
                    btn.attrs.loading = true;
                    modal.disabled = true;
                    Services.logout()
                        .then(() => {
                            modal.visible = false;
                            this.$store.commit('user', null);
                            EventBus.publish('RENDER_RESTRICTED');
                        })
                        .catch(this.$handleError)
                        .finally(() => btn.attrs.loading = false);
                }
            );
		},
        handleWindowUnload() {
            this.$settings.saveLocal(this.$store.state.settings);
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'settings',
                    data: this.$store.state.settings,
                });
            }
        },
        load() {
            this.loading = true;
            return Promise.all([
                Services.syncData(),
                this.$settings.loadRemote(),
            ])
                .then(([data, settings]) => {
                    data.decks.unshift(new DeckModel({ i18n: 'state.unclassified', id: null }));
                    this.$store.commit('dictionaries', data.dictionaries);
                    this.$store.commit('decks', data.decks);
                    Object.assign(this.$root, { decks: data.decks });
                    this.$store.commit('settings', settings);
                })
                .catch(this.$handleError)
                .finally(() => {
                    this.loading = false;
                    this.loaded = true;
                });
        },
	},

    created() {
        window.addEventListener('orientationchange', this.handleOrientationChange);

        this.load();
        this.$store.commit('accounts', this.$accounts.load());

        document.addEventListener('focusin', this.handleCheckFocus);
        document.addEventListener('focusout', this.handleCheckFocus);
        window.addEventListener('unload', this.handleWindowUnload);

        languageSwitchBus = EventBus.subscribe('LANGUAGE_SWITCH', lang => {
            this.$vuetify.rtl = rtlLanguages.indexOf(lang) !== -1;
        });

        this.$router.beforeEach((to, from, next) => {
            document.title = this.$i18n.t('route.' + to.name);
            next();
        });
        document.title = this.$i18n.t('route.' + this.$route.name);
    },

    destroyed() {
        window.removeEventListener('orientationchange', this.handleOrientationChange);
        document.removeEventListener('focusin', this.handleCheckFocus);
        document.removeEventListener('focusout', this.handleCheckFocus);
        languageSwitchBus.unsubscribe();
        this.handleWindowUnload();
    }
});
</script>
