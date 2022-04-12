<template>
	<v-app>
        <Snack v-model="$root.snack.visible" v-bind="$root.snack" transition="slide-y-reverse-transition" bottom left />
        <ErrorHandler :value="$root.error" max-width="500" icon="mdi-alert" color="error" dark scrollable :fullscreen="$vuetify.breakpoint.smAndDown" />
        <GlobalModal v-model="$root.modal.visible" v-bind="{ ...$root.modal, ...$root.modal.attrs }" scrollable />

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
            v-model="drawer"
            :social-links="$root.socialLinks"
            width="270"
            fixed
            temporary
            :right="$vuetify.rtl"
            @logout="handleLogoutClick"
        />

		<v-main v-if="loaded">
			<v-sheet class="fill-height" color="background">
				<router-view :key="$route.path" />
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
import Sidebar from "@/components/layout/Sidebar";
import Toolbar from "@/components/layout/Toolbar";
import Footer from "@/components/layout/Footer";
import ErrorHandler from "@/components/generic/ErrorHandler";
import GlobalModal from "@/components/generic/Modal";
import Snack from "@/components/generic/Snack";
import Services from "@/utils/Services";
import EventBus from "@/utils/EventBus";
import {rtlLanguages} from "@/locales";

let languageSwitchBus;
let checkFocusTimeout;

export default Vue.extend({
	name: 'App',

    components: { Sidebar, Toolbar, Footer, ErrorHandler, GlobalModal, Snack },

    data: () => ({
        loading: true,
        loaded: false,
        drawer: false,
    }),

    computed: {
        showToolbar() {
            return (!this.$root.inputFocused || this.$vuetify.breakpoint.mdAndUp)
            && (this.$vuetify.breakpoint.mdAndUp || this.$root.orientation === 'portrait');
        },
        hideMobileFocus() {
            return this.$root.inputFocused && this.$vuetify.breakpoint.smAndDown;
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
                this.$root.inputFocused = ['input', 'textarea'].indexOf(document.activeElement.nodeName.toLowerCase()) !== -1 && !document.activeElement.getAttribute('readonly');
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
                            this.$root.user = {};
                            EventBus.publish('RENDER_RESTRICTED');

                            // Clear v-main padding-top on logout
                            this.$vuetify.application.top = 0;
                            Object.keys(this.$vuetify.application.application.top).forEach(key => {
                                this.$vuetify.application.application.top[key] = 0;
                            });
                        })
                        .catch(this.$handleError)
                        .finally(() => btn.attrs.loading = false);
                }
            );
		},
        load() {
            this.loading = true;
            Promise.all([
                Services.getDecks(),
            ])
                .then(([decks]) => {
                    decks.unshift({ i18n: 'state.unclassified', id: null });
                    Object.assign(this.$root, { decks });
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

        document.addEventListener('focusin', this.handleCheckFocus);
        document.addEventListener('focusout', this.handleCheckFocus);

        languageSwitchBus = EventBus.subscribe('LANGUAGE_SWITCH', lang => {
            this.$vuetify.rtl = rtlLanguages.indexOf(lang) !== -1;
        });
    },

    destroyed() {
        window.removeEventListener('orientationchange', this.handleOrientationChange);
        document.removeEventListener('focusin', this.handleCheckFocus);
        document.removeEventListener('focusout', this.handleCheckFocus);
        languageSwitchBus.unsubscribe();
    }
});
</script>
