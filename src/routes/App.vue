<template>
	<div @contextmenu.prevent="">
		<v-app>
			<ErrorDialog :response="$root.error"></ErrorDialog>

			<!-- IS SAVED -->
			<v-snackbar color="success" v-model="$root.isSaved">
				<v-icon class="white--text" left>mdi-check</v-icon>
				{{$t('snackbar.saved')}}
				<v-btn text @click="$root.isSaved = false">
					{{$t('modal.close')}}
				</v-btn>
			</v-snackbar>

			<!-- SHORTCUTS -->
			<Shortcuts :visible="$root.shortcuts.visible" />

			<!-- SHORTCUTS -->
			<Help ref="help" :visible="$root.help.visible" />

			<!-- COMMENTS -->
			<Comments ref="comments" />

			<!-- IS DELETE -->
			<v-snackbar color="success" v-model="$root.isDeleted">
				<v-icon class="white--text" left>mdi-delete-circle-outline</v-icon>
				{{$t('snackbar.deleted')}}
				<v-btn text @click="$root.isDeleted = false">
					{{$t('modal.close')}}
				</v-btn>
			</v-snackbar>

			<!-- IS LOADING -->
			<v-overlay :absolute="false" :value="$root.isLoading" z-index="100">
				<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
			</v-overlay>

			<v-scroll-x-transition>
				<Sidebar ref="sidebar" v-if="$root.user.id" v-model="sidebar" class="no-select"></Sidebar>
			</v-scroll-x-transition>
			<v-scroll-y-transition>
				<Toolbar ref="toolbar" v-if="$root.user.id" :sidebar="sidebar" class="no-select"></Toolbar>
			</v-scroll-y-transition>

			<v-scroll-y-transition>
				<v-content v-if="$root.user.id" class="main-content">
					<Chat />
					<v-layout fill-height>
						<v-fade-transition mode="out-in">
							<router-view></router-view>
						</v-fade-transition>
					</v-layout>
				</v-content>
			</v-scroll-y-transition>
		</v-app>
	</div>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';
import Dashboard from './App/Dashboard.vue';
import Account from './App/Account.vue';
import Error404 from './Error/Error404.vue';
import Toolbar from '../components/Toolbar.vue';
import Sidebar from '../components/Sidebar.vue';
import Shortcuts from '../components/Shortcuts.vue';
import Help from '../components/Help.vue';
import UserService from "../services/UserService";
import ErrorDialog from '../components/ErrorDialog.vue';
import About from './App/About.vue';
import Component from "./App/Component";
import Strategy from "./App/Strategy";
import Dataset from "./App/Dataset";
import User from "../models/User";
import Comments from "../components/Comments";
import Chat from "../components/Chat";

export const routes = [
	{path: '/', component: Dashboard, name: 'dashboard'},
	{path: '/login', redirect: '/'},
	{path: '/account/:id', redirect: '/account/:id/wall' },
	{path: '/account/:id/:section', component: Account, name: 'account'},
	{path: '/account/:id/:section/:key', component: Account, name: 'accountMessaging'},
	{path: '/about', component: About, name: 'about'},
	{path: '/about/:section', component: About},
	{path: '/strategy/:id', redirect: '/strategy/:id/settings'},
	{path: '/strategy/:id/:section', component: Strategy, name: 'strategy'},
	{path: '/component/:id', redirect: '/component/:id/settings'},
	{path: '/component/:id/:section', component: Component, name: 'component'},
	{path: '/dataset/:id', redirect: '/dataset/:id/settings'},
	{path: '/dataset/:id/:section', component: Dataset, name: 'dataset'},
	{path: '/contact', redirect: '/about/contact'},
	{path: '/terms', redirect: '/about/terms'},
	{path: '/privacy', redirect: '/about/privacy'},
	{path: '*', component: Error404, name: 'error404'},
];

export default Vue.extend({
	name: 'App',

	components: {
		Toolbar, Sidebar, ErrorDialog, Shortcuts, Help, Comments, Chat
	},

	created() {
        this.$shortcuts.attach(document.body);
	},

	mounted() {

		moment.locale(this.$i18n.locale);
		UserService.me.bind(this)().then(response => {
			this.$root.user = new User(response.data);

			this.sidebar.permanent = this.$root.user.settings.sidebar.fixed;
			this.sidebar.opened = this.$root.user.settings.sidebar.fixed;
			// this.$i18n.locale = user.language_abbreviation;
			// this.$vuetify.theme.themes.light.primary = user.setting.colorFrom;
			this.$forceUpdate();
		});

        this.$shortcuts.add(this.$t('shortcuts.main.escape.title'), this.$t('shortcuts.main.escape.desc'), 'main', 'Escape', this.shortcutEscape);
        this.$shortcuts.add(this.$t('shortcuts.main.help.title'), this.$t('shortcuts.main.help.desc'), 'main', 'F1', this.shortcutHelp, true);
        this.$shortcuts.add(this.$t('shortcuts.main.search.title'), this.$t('shortcuts.main.search.desc'), 'main', ['ControlLeft', 'KeyF'], this.shortcutSearch, true);
        this.$shortcuts.add(this.$t('shortcuts.main.sidebar.title'), this.$t('shortcuts.main.sidebar.desc'), 'main', ['AltLeft', 'KeyS'], this.shortcutSidebar, true);
        this.$shortcuts.add(this.$t('shortcuts.navigation.dashboard.title'), this.$t('shortcuts.navigation.dashboard.desc'), 'navigation', ['AltLeft', 'KeyD'], this.shortcutDashboard, true);
        this.$shortcuts.add(this.$t('shortcuts.navigation.profile.title'), this.$t('shortcuts.navigation.profile.desc'), 'navigation', ['AltLeft', 'KeyP'], this.shortcutProfile, true);

        this.$help.setVueRef(this);
        this.$help.setCompRef(this.$refs.help);
        this.$comments.setRef(this.$refs.comments);
	},

	destroyed() {

		this.$shortcuts.remove(this.shortcutEscape);
		this.$shortcuts.remove(this.shortcutHelp);
		this.$shortcuts.remove(this.shortcutSearch);
		this.$shortcuts.remove(this.shortcutSidebar);
		this.$shortcuts.remove(this.shortcutDashboard);
		this.$shortcuts.remove(this.shortcutProfile);
	},

	methods: {

	    shortcutEscape() {
			this.$root.help.visible = false;
			this.$root.shortcuts.visible = false;
            this.$refs.sidebar.closeSidebar();
        },

	    shortcutHelp() {
            this.$root.help.visible = !this.$root.help.visible;
        },

	    shortcutDashboard() {
            this.$router.push('/');
        },

	    shortcutProfile() {
            this.$router.push('/account/' + this.$root.user.id);
        },

        shortcutSearch() {

	        if (this.$refs.toolbar) {
				this.$refs.toolbar.searchMenuOpened = true;
				this.$refs.toolbar.setSearchFocus();
			}
        },

        shortcutSidebar() {

	        if (this.$refs.sidebar) {
				this.$refs.sidebar.openSidebar();
				this.$refs.sidebar.focusSearch();
			}
        },
	},

	computed: {

	},

	data() {
		return {
			sidebar: {
				opened: false,
				permanent: false,
				miniVariant: false,
				hideOverlay: false,
			},
		};
	},

	watch: {
	    $route() {
			this.$root.breadcrumbs = [];

			// Scroll back to top
			// ISSUE: Sometimes, we don't want to scroll about (tabs)
            // this.$vuetify.goTo('html');
		},
	}
});
</script>

<style lang="scss">
	@import '~vuetify/src/styles/settings/_variables.scss';

	@media all and (max-width: #{map-get($grid-breakpoints, 'lg') - 1}) {
		.v-tabs .v-tab {
			margin-left: 0 !important;
			padding-top: 0 !important;
			padding-bottom: 0 !important;
		}
	}

	.container {
		padding: 24px;
	}

	@media all and (max-width: #{map-get($grid-breakpoints, 'md') - 1}) {
		.container.grid-list-lg .layout .flex,
		.container {
			padding: 0;
		}
	}

	.theme--dark.v-input:not(.v-input--is-disabled) input,
	.theme--dark.v-input:not(.v-input--is-disabled) textarea {
		caret-color: black;
	}
	.theme--dark.v-input:not(.v-input--is-disabled).v-input--is-focused i {
		color: black !important;
	}
</style>

<style lang="scss" scoped>
	.main-content {
		background-color: #eee;
	}
	.v-app-bar.fullscreen + .main-content {
		 padding-top: 0 !important;
	}
</style>
