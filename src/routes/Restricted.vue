<template>
	<v-app>

		<ErrorDialog :response="$root.error" />
		<Modal :settings="$root.error" />

		<div class="top-left" v-if="$route.name !== 'login'">
			<v-btn class="white--text" to="/login" text>
				<v-icon :left="$vuetify.breakpoint.smAndUp">mdi-arrow-left</v-icon>
				<span class="d-none d-sm-inline">{{ $t("restricted.backLogin") }}</span>
			</v-btn>
		</div>

		<div class="top-right">
			<LanguageSwitcher v-model="currentLang" :hide-lang="this.$vuetify.breakpoint.xsOnly" text dark auto-apply />
		</div>

		<v-overlay :absolute="false" :value="$root.isLoading">
			<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
		</v-overlay>

		<v-fade-transition>
			<v-container v-if="hasLoaded" fluid class="default-gradient pa-4 fill-height d-flex flex-column main-container" style="width: 100%; background-image: url('https://polymind.s3.ca-central-1.amazonaws.com/assets/img/login-background.jpg');">

				<div class="overlay"></div>

				<v-container class="page main-content fill-height flex-column d-flex align-center justify-space-between">

					<div style="flex: 3" class="d-flex align-end mb-4">
						<div class="d-flex align-center">
							<img transition="fade-transition" src="../assets/images/polymind-light.svg" height="96" />
							<h3 class="ml-4 mb-0 display-2 font-weight-thin white--text">Polymind</h3>
						</div>
					</div>

					<v-sheet style="flex: 6; width: 100%" dark color="transparent" class="inner">
						<router-view></router-view>
					</v-sheet>

					<div class="footer d-flex align-end" style="flex: 1">
<!--						<div class="text-center">-->
<!--							<v-btn class="white&#45;&#45;text" to="/terms" text>-->
<!--								{{ $t("restricted.termsLink") }}-->
<!--							</v-btn>-->
<!--							<v-btn class="white&#45;&#45;text" to="/policies" text>-->
<!--								{{ $t("restricted.policiesLink") }}-->
<!--							</v-btn>-->
<!--						</div>-->
					</div>
				</v-container>
			</v-container>
		</v-fade-transition>
	</v-app>
</template>

<script>

import Vue from 'vue';
import Login from './Restricted/Login.vue';
import Register from './Restricted/Register.vue';
import Activate from './Restricted/Activate.vue';
import ForgotPassword from './Restricted/ForgotPassword.vue';
import ResetPassword from './Restricted/ResetPassword.vue';
import LanguageSwitcher from "../components/LanguageSwitcher.vue";
import Terms from "./Restricted/Terms.vue";
import Policies from "./Restricted/Policies.vue";
import ErrorDialog from '../components/ErrorDialog.vue';
import Contact from './Restricted/Contact.vue';
import Modal from "../components/Modal";

export const routes = [
	{path: '/', redirect: '/login'},
	{path: '/login', component: Login, name: 'login'},
	{path: '/register', component: Register, name: 'register'},
	{path: '/user/activate/:token/:lookup', component: Activate, name: 'activate'},
	{path: '/user/forgot-password', component: ForgotPassword, name: 'forgotPassword'},
	{path: '/user/reset-password/:token', component: ResetPassword, name: 'resetPassword'},
	{path: '/terms', component: Terms, name: 'terms'},
	{path: '/policies', component: Policies, name: 'policies'},
	{path: '/contact', component: Contact, name: 'contact'},
	{path: '*', redirect: '/login'},
];

export default Vue.extend({
	name: 'Restricted',
	components: {
		LanguageSwitcher, ErrorDialog, Modal
	},

	created() {

		setTimeout(() => { this.showLogo = true; }, 500);
		setTimeout(() => { this.showPanel = true; }, 750);
		setTimeout(() => { this.hasLoaded = true; }, 0);
	},

	methods: {
		switchLang() {
			const currentLang = this.$i18n.locale;
			const newLang = currentLang === 'en' ? 'fr' : 'en';
			localStorage.setItem('lang', newLang);
			this.$i18n.locale = newLang;
		},
	},

	data: function() {
	    return {
			showLogo: false,
			showPanel: false,
            hasLoaded: false,
			currentLang: this.$i18n.locale,
		};
	},
});
</script>

<style lang="scss" scoped>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
		background-color: rgba(0, 0, 0, 0.5);
	}
	.main-container {
		background-attachment: fixed;
		background-size: cover;
		background-position: center center;
		position: relative;
		z-index: 1;
	}
	.main-content::v-deep a {
		color: white;
	}
	.top-right {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
	.top-left {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 4;
	}
	.top-right,
	.footer {
		opacity: 0.5;
		z-index: 4;
	}
	.main-content {
		position: relative;
		max-width: 50rem;
		z-index: 3;
	}
</style>
