<template>
	<v-app style="background-color: #9DCD7A">

		<video class="background-video w-100" autoplay loop muted>
			<source :src="video" type="video/mp4">
			Your browser does not support the video tag.
		</video>

		<ErrorDialog :response="$root.error" />
		<Modal :settings="$root.error" />

		<div class="top-left">
			<v-btn v-if="hasBackLink" class="white--text" to="/login" text>
				<v-icon :left="$vuetify.breakpoint.smAndUp">mdi-arrow-left</v-icon>
				<span class="d-none d-sm-inline">{{ $t("restricted.backLogin") }}</span>
			</v-btn>
			<v-btn v-else class="white--text" :href="wwwUrl" text>
				<v-icon left>mdi-arrow-left</v-icon>
				<span>{{ $t("restricted.backWebsite") }}</span>
			</v-btn>
		</div>

		<div class="top-right">
			<LanguageSwitcher v-model="currentLang" :hide-lang="this.$vuetify.breakpoint.xsOnly" text dark auto-apply />
		</div>

		<v-overlay :absolute="false" :value="$root.isLoading">
			<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
		</v-overlay>

		<v-fade-transition>
			<v-container v-if="hasLoaded" fluid class="pa-4 fill-height d-flex flex-column main-container w-100">

				<div class="overlay"></div>

				<v-container class="page main-content fill-height flex-column d-flex align-center justify-center mt-10 mt-md-0 pt-4 pt-md-0">

					<v-sheet dark color="transparent" class="w-100">
						<v-scale-transition>
							<div class="d-flex align-center justify-center" v-if="hasLogo">
								<img src="../assets/images/polymind-light.svg" height="96" />
								<h3 class="ml-4 mb-0 display-2 font-weight-thin white--text">Polymind</h3>
							</div>
						</v-scale-transition>

						<div class="mt-8">
							<transition name="slide" mode="out-in">
								<router-view></router-view>
							</transition>
						</div>
					</v-sheet>
				</v-container>
			</v-container>
		</v-fade-transition>

		<div class="version overline d-none d-md-block">
			<span v-text="version"></span>
		</div>
	</v-app>
</template>

<script>

	import Vue from 'vue';
	import Login from './Restricted/Login.vue';
	import Locked from './Restricted/Locked.vue';
	import ForgotPassword from './Restricted/ForgotPassword.vue';
	import ResetPassword from './Restricted/ResetPassword.vue';
	import ForceChangePassword from './Restricted/ForceChangePassword.vue';
	import LanguageSwitcher from "../components/LanguageSwitcher.vue";
	import Terms from "./Restricted/Terms.vue";
	import Policies from "./Restricted/Policies.vue";
	import ErrorDialog from '../components/ErrorDialog.vue';
	import Contact from './Restricted/Contact.vue';
	import Modal from "../components/Modal";
	// import Register from './Restricted/Register.vue';
	// import Activate from './Restricted/Activate.vue';

	export const routes = [
		{path: '/', redirect: '/login'},
		{path: '/login', component: Login, name: 'login'},
		{path: '/update-access', component: ForceChangePassword, name: 'updateAccess'},
		{path: '/locked', component: Locked, name: 'locked'},
		// {path: '/register', component: Register, name: 'register'},
		{path: '/register', redirect: '/login'},
		// {path: '/user/activate/:token/:lookup', component: Activate, name: 'activate'},
		{path: '/user/forgot-password', component: ForgotPassword, name: 'forgotPassword'},
		{path: '/user/reset-password/:token', component: ResetPassword, name: 'resetPassword'},
		{path: '/terms', component: Terms, name: 'terms'},
		{path: '/policies', component: Policies, name: 'policies'},
		{path: '/contact', component: Contact, name: 'contact'},
		{path: '*', redirect: to => {
				if (!to.fullPath.startsWith('/issue/')) {
					localStorage.setItem('redirect_uri', to.fullPath);
				}
				return '/login';
			}},
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

			// this.backgroundIdx = Math.round(Math.random() * (this.backgrounds.length - 1));
			// this.backgroundInterval = setInterval(() => {
			// 	this.backgroundIdx++;
			// 	if (this.backgroundIdx > this.backgrounds.length - 1) {
			// 		this.backgroundIdx = 0;
			// 	}
			// }, 30 * 1000);
		},

		destroyed() {
			// clearInterval(this.backgroundInterval);
		},

		methods: {

		},

		computed: {

			hasBackLink() {
				return this.$route.name !== 'login' && this.$route.name !== 'locked';
			},

			hasLogo() {
				return this.$route.name !== 'locked';
			},
		},

		data: function() {
			return {
				video: 'https://polymind.s3.ca-central-1.amazonaws.com/assets/client/restricted-background.mp4',
				version: process.env.VERSION,
				// backgroundInterval: null,
				showLogo: false,
				showPanel: false,
				hasLoaded: false,
				wwwUrl: process.env.VUE_APP_WWW_URL,
				currentLang: this.$i18n.locale,
				// backgroundIdx: 0,
				// backgrounds: [
				// 	'https://polymind.s3.ca-central-1.amazonaws.com/assets/img/login-background.jpg',
				// 	// 'https://polymind.s3.ca-central-1.amazonaws.com/assets/img/login-background-2.jpg',
				// 	'https://polymind.s3.ca-central-1.amazonaws.com/assets/img/login-background-3.jpg',
				// 	'https://polymind.s3.ca-central-1.amazonaws.com/assets/img/login-background-4.jpg',
				// ],
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
		z-index: 2;
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

	.slide-enter-active,
	.slide-leave-active {
		transition-duration: 0.2s;
		transition-property: opacity, transform;
		transition-timing-function: ease;
		transform: translateY(0px);
	}

	.slide-enter,
	.slide-leave-active {
		opacity: 0;
		transform: translateY(2.5rem);
	}

	.version {
		position: absolute;
		bottom: 1rem;
		right: 1rem;
		z-index: 1;
		color: rgba(255, 255, 255, 0.1);
	}

	.background-video {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		z-index: 0;
	}
</style>
