<template>
	<v-app>
        <Snack v-model="$root.snack.visible" v-bind="$root.snack" transition="slide-y-reverse-transition" bottom left />
        <ErrorHandler :value="$root.error" max-width="500" icon="mdi-alert" color="error" dark scrollable :fullscreen="$vuetify.breakpoint.smAndDown" />
        <GlobalModal v-model="$root.modal.visible" v-bind="{ ...$root.modal, ...$root.modal.attrs }" scrollable />
        <OfflineOverlay absolute />

		<v-main>
			<Modal v-model="termsModal"
				:title="$t('restricted.termsModal.title')"
				:body="$t('restricted.termsModal.body')"
				:buttons="[
					{ text: $t('btn.close'), attrs: { outlined: true }, events: { click: () => { this.termsModal = false } } },
				]"
				icon="mdi-gavel"
				max-width="600"
				scrollable
			/>

			<v-sheet class="h-100 d-flex flex-column py-4 py-md-0" :color="background">
				<v-sheet color="transparent" class="h-100 d-flex align-center justify-center" style="flex: 1">
					<v-card :max-width="maxWidth" class="text-center w-100" :tile="flat" :flat="flat">
                        <v-card-text :style="logoStyle">
                            <div class="d-flex flex-column align-center">
                                <v-img :src="logo" :max-width="logoSize" :height="logoSize" contain />
                                <h1 class="primary--text display-1 mt-2" style="flex: 1" v-text="$t('restricted.title.' + $route.name)">Polymind</h1>
                            </div>
                        </v-card-text>
						<v-card-text>
                            <v-fade-transition>
							    <router-view :key="$route.path" @terms="termsModal = true" />
                            </v-fade-transition>
						</v-card-text>
					</v-card>
				</v-sheet>

				<v-footer :color="$vuetify.theme.dark ? 'transparent' : background" class="d-block d-md-flex text-center justify-md-space-between justify-center caption">
                    <div v-if="$vuetify.breakpoint.smAndDown" class="d-flex flex-column align-center">
                        <LanguageSwitcher v-model="lang" class="mb-1 ml-1" style="max-width: 8rem" menu-props="auto" abbreviation dense hide-details @input="handleLanguageSwitch" />

                        <div v-if="$root.socialLinks.length > 0" class="d-flex align-center justify-center mb-4">
                            <v-tooltip :key="linkIdx" v-for="(link, linkIdx) in $root.socialLinks" top>
                                <template #activator="{ attrs, on }">
                                    <v-btn :href="link.href" target="_blank" v-bind="attrs" v-on="on" icon>
                                        <v-icon color="secondaryDark" v-text="link.icon"></v-icon>
                                    </v-btn>
                                </template>
                                <span v-text="link.tooltip"></span>
                            </v-tooltip>
                        </div>
                    </div>
					<span>
                        <span v-text="$t('footer.copyright', {
                            name: 'Polymind',
                            version,
                        })"></span>
                        <span v-text="$t('footer.allRights')"></span>
                    </span>
                    <div v-if="$vuetify.breakpoint.mdAndUp" class="d-inline d-md-flex align-center justify-center text-no-wrap" style="flex: 0; gap: 2rem">

                        <div v-if="$root.socialLinks.length > 0" class="d-flex align-center justify-center order-first">
                            <v-tooltip :key="linkIdx" v-for="(link, linkIdx) in $root.socialLinks" top>
                                <template #activator="{ attrs, on }">
                                    <v-btn :href="link.href" target="_blank" v-bind="attrs" v-on="on" icon>
                                        <v-icon color="secondaryDark" v-text="link.icon"></v-icon>
                                    </v-btn>
                                </template>
                                <span v-text="link.tooltip"></span>
                            </v-tooltip>
                        </div>

                        <LanguageSwitcher v-model="lang" class="mb-1 order-last" menu-props="left" abbreviation dense hide-details @input="handleLanguageSwitch" />
                    </div>
				</v-footer>
			</v-sheet>
		</v-main>
	</v-app>
</template>

<script>
import Vue from 'vue';
import ErrorHandler from "@/components/generic/ErrorHandler";
import GlobalModal from "@/components/generic/Modal";
import Snack from "@/components/generic/Snack";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import Modal from "@/components/generic/Modal.vue";
import OfflineOverlay from "@/components/layout/OfflineOverlay.vue";
import logo from '@/assets/images/polymind-dark.svg';
import packageJson from '../../../package.json';
import { rtlLanguages } from '@/locales';
import EventBus from "@/utils/EventBus";

let languageSwitchBus;
let checkFocusTimeout;

export default Vue.extend({
	name: 'Restricted',

	components: { OfflineOverlay, LanguageSwitcher, Modal, ErrorHandler, GlobalModal, Snack },

	data: () => ({
		logo,
		lang: '',
		version: packageJson.version,
		year: new Date().getFullYear(),
		termsModal: false,
	}),

	computed: {
		flat() {
			return this.$vuetify.breakpoint.smAndDown;
		},
		background() {
			return this.$vuetify.breakpoint.smAndDown
                ? (this.$vuetify.theme.dark ? null : 'white')
                : 'background';
		},
		maxWidth() {
			return this.$vuetify.breakpoint.mdAndUp ? 350 : null;
		},
		logoStyle() {
			return this.$vuetify.breakpoint.mdAndUp
				? 'transform: translateY(-75px); margin-bottom: -75px'
				: null;
		},
        logoSize() {
			return this.$vuetify.breakpoint.mdAndUp
				? 150
				: 75;
		},
        hideMobileFocus() {
            return this.$root.inputFocused && this.$vuetify.breakpoint.smAndDown;
        },
	},

	watch: {
		lang(value) {
			this.$i18n.locale = value;
			localStorage.setItem('lang', value);
		},
	},

    methods: {
        handleLanguageSwitch(value) {
            EventBus.publish('LANGUAGE_SWITCH', value);
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
    },

	created() {
		this.lang = this.$i18n.locale;
		localStorage.setItem('lang', this.lang);

        document.addEventListener('focusin', this.handleCheckFocus);
        document.addEventListener('focusout', this.handleCheckFocus);

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
        document.removeEventListener('focusin', this.handleCheckFocus);
        document.removeEventListener('focusout', this.handleCheckFocus);
        languageSwitchBus.unsubscribe();
    }
});
</script>
