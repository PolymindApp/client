<template>
	<div v-resize="handleWindowResize" @contextmenu="handleContextMenu">
		<v-app>
			<ErrorDialog :response="$root.error"></ErrorDialog>

			<!-- COPIED TO CLIPBOARD -->
			<v-snackbar v-model="$root.copiedToClipboard">
				<v-icon class="white--text" left>mdi-check</v-icon>
				{{$t('snackbar.copiedToClipboard')}}
				<v-btn text @click="$root.copiedToClipboard = false">
					{{$t('modal.close')}}
				</v-btn>
			</v-snackbar>

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
			<CommentDrawer ref="comments" />

			<!-- IS DELETE -->
			<v-snackbar color="success" v-model="$root.isDeleted">
				<v-icon class="white--text" left>mdi-delete-circle-outline</v-icon>
				{{$t('snackbar.deleted')}}
				<v-btn text @click="$root.isDeleted = false">
					{{$t('modal.close')}}
				</v-btn>
			</v-snackbar>

			<v-scroll-x-transition>
				<Sidebar ref="sidebar" v-model="sidebar" class="no-select"></Sidebar>
			</v-scroll-x-transition>
			<v-scroll-y-transition>
				<Toolbar ref="toolbar" :sidebar="sidebar" class="no-select"></Toolbar>
			</v-scroll-y-transition>

			<v-scroll-y-transition>
				<v-content class="main-content">
					<v-card color="transparent" :disabled="$root.isLoading" class="fill-height" :dark="$root.user.settings.theme === 'dark'" tile>
<!--						<Chat />-->
						<v-layout fill-height>
							<v-slide-x-transition mode="out-in">
								<router-view></router-view>
							</v-slide-x-transition>
						</v-layout>
					</v-card>
				</v-content>
			</v-scroll-y-transition>
		</v-app>
	</div>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';
import Dashboard from './App/Dashboard.vue';
import News from './App/News.vue';
import Account from './App/Account.vue';
import Error404 from './Error/Error404.vue';
import Toolbar from '../components/Toolbar.vue';
import Sidebar from '../components/Sidebar.vue';
import Shortcuts from '../components/Shortcuts.vue';
import Help from '../components/Help.vue';
import ErrorDialog from '../components/ErrorDialog.vue';
import About from './App/About.vue';
import Component from "./App/Component";
import Strategy from "./App/Strategy";
import Dataset from "./App/Dataset";
import CommentDrawer from "../components/CommentDrawer";
// import Chat from "../components/Chat";

export const routes = [
	{path: '/', component: Dashboard, name: 'dashboard'},
	{path: '/login', redirect: '/'},
	{path: '/locked', redirect: '/'},
	{path: '/news/:locale/:slug', component: News, name: 'news' },
	{path: '/account/:id', redirect: '/account/:id/wall' },
	{path: '/account/:id/:section', component: Account, name: 'account'},
	{path: '/account/:id/:section/:key', component: Account, name: 'accountMessaging'},
	{path: '/about', component: About, name: 'about'},
	{path: '/about/:section', component: About},
	{path: '/strategy/:id', name: 'strategy', beforeEnter: (to, from, next) => {
		let route = '/strategy/' + to.params.id + '/' + (to.params.id === 'new' ? 'settings' : (from.name && from.name.indexOf(to.name) === 0) ? from.params.section : 'assembly');
		next(route);
	}},
	{path: '/strategy/:id/:section', name: 'strategySection', titleKey: 'strategy', component: Strategy},
	{path: '/component/:id', name: 'component', beforeEnter: (to, from, next) => {
		let route = '/component/' + to.params.id + '/' + (to.params.id === 'new' ? 'settings' : (from.name && from.name.indexOf(to.name) === 0) ? from.params.section : 'settings');
		next(route);
	}},
	{path: '/component/:id/:section', name: 'componentSection', titleKey: 'component', component: Component},
	{path: '/dataset/:id', name: 'dataset', beforeEnter: (to, from, next) => {
		let route = '/dataset/' + to.params.id + '/' + (to.params.id === 'new'? 'settings' : (from.name && from.name.indexOf(to.name) === 0) ? from.params.section : 'data');
		next(route);
	}},
	{path: '/dataset/:id/:section', name: 'datasetSection', titleKey: 'dataset', component: Dataset},
	{path: '/contact', redirect: '/about/contact'},
	{path: '/terms', redirect: '/about/terms'},
	{path: '/privacy', redirect: '/about/privacy'},
	{path: '*', component: Error404, name: 'error404'},
];

export default Vue.extend({
	name: 'App',

	components: {
		Toolbar, Sidebar, ErrorDialog, Shortcuts, Help, CommentDrawer
	},

	created() {
		this.$help.setVueRef(this);
        this.$shortcuts.attach(document.body);
	},

	destroyed() {
		this.$shortcuts.remove(this.shortcutEscape);
		this.$shortcuts.remove(this.shortcutHelp);
		// this.$shortcuts.remove(this.shortcutSearch);
		this.$shortcuts.remove(this.shortcutSidebar);
		this.$shortcuts.remove(this.shortcutDashboard);
		this.$shortcuts.remove(this.shortcutProfile);
	},

	mounted() {

		moment.updateLocale(this.$i18n.locale, {
			week: {
				dow: 0
			}
		});

		this.sidebar.permanent = this.$root.user.settings.sidebar.fixed;
		this.sidebar.opened = this.$root.user.settings.sidebar.fixed;
		// this.$i18n.locale = user.language_abbreviation;

        this.$shortcuts.add(this.$t('shortcuts.main.escape.title'), this.$t('shortcuts.main.escape.desc'), 'main', 'Escape', this.shortcutEscape);
        this.$shortcuts.add(this.$t('shortcuts.main.help.title'), this.$t('shortcuts.main.help.desc'), 'main', 'F1', this.shortcutHelp, true);
        // this.$shortcuts.add(this.$t('shortcuts.main.search.title'), this.$t('shortcuts.main.search.desc'), 'main', ['ControlLeft', 'KeyF'], this.shortcutSearch, true);
        this.$shortcuts.add(this.$t('shortcuts.main.sidebar.title'), this.$t('shortcuts.main.sidebar.desc'), 'main', ['AltLeft', 'KeyS'], this.shortcutSidebar, true);
        this.$shortcuts.add(this.$t('shortcuts.navigation.dashboard.title'), this.$t('shortcuts.navigation.dashboard.desc'), 'navigation', ['AltLeft', 'KeyD'], this.shortcutDashboard, true);
        this.$shortcuts.add(this.$t('shortcuts.navigation.profile.title'), this.$t('shortcuts.navigation.profile.desc'), 'navigation', ['AltLeft', 'KeyP'], this.shortcutProfile, true);

        this.$help.setCompRef(this.$refs.help);
        this.$comments.setRef(this.$refs.comments);
	},

	methods: {

		handleWindowResize() {
			this.$root.isMobile = this.$vuetify.breakpoint.smAndDown;
		},

		handleContextMenu(event) {

			var getClosest = function (elem, selector) {

				// Element.matches() polyfill
				if (!Element.prototype.matches) {
					Element.prototype.matches =
							Element.prototype.matchesSelector ||
							Element.prototype.mozMatchesSelector ||
							Element.prototype.msMatchesSelector ||
							Element.prototype.oMatchesSelector ||
							Element.prototype.webkitMatchesSelector ||
							function(s) {
								var matches = (this.document || this.ownerDocument).querySelectorAll(s),
										i = matches.length;
								while (--i >= 0 && matches.item(i) !== this) {}
								return i > -1;
							};
				}

				// Get the closest matching element
				for ( ; elem && elem !== document; elem = elem.parentNode ) {
					if ( elem.matches( selector ) ) return elem;
				}
				return null;

			};

			if (!event.target.classList.contains('allow-contextual-menu') && !getClosest(event.target, '.allow-contextual-menu') && ['textarea', 'input'].indexOf(event.target.nodeName.toLowerCase()) === -1 && !getClosest(event.target, '[contenteditable]')) {
				event.preventDefault();
			}
		},

	    shortcutEscape() {
			this.$root.help.visible = false;
			this.$root.shortcuts.visible = false;
            this.$refs.sidebar.closeSidebar();
        },

	    shortcutHelp(event) {
            this.$root.help.visible = !this.$root.help.visible;
			event.preventDefault();
        },

	    shortcutDashboard() {
            this.$router.push('/');
        },

	    shortcutProfile() {
            this.$router.push('/account/' + this.$root.user.id);
        },

        shortcutSearch(event) {

	        if (this.$refs.toolbar) {
				this.$refs.toolbar.searchMenuOpened = true;
				this.$refs.toolbar.setSearchFocus();
				event.preventDefault();
			}
        },

        shortcutSidebar() {

	        if (this.$refs.sidebar) {
				this.$refs.sidebar.openSidebar();
				this.$refs.sidebar.focusSearch();
			}
        },
	},

	data() {
		return {
			assetsLoaded: false,
			sidebar: {
				opened: false,
				permanent: false,
				miniVariant: false,
				hideOverlay: false,
			},
		};
	},

	watch: {

		'$root.isLoading'(value) {
			document.body.style.cursor = value ? 'wait' : null;
		},

	    $route() {
			this.$root.breadcrumbs = [];
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
