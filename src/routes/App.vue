<template>
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

		<!-- IS DELETE -->
		<v-snackbar color="success" v-model="$root.isDeleted">
			<v-icon class="white--text" left>mdi-delete-circle-outline</v-icon>
			{{$t('snackbar.deleted')}}
			<v-btn text @click="$root.isDeleted = false">
				{{$t('modal.close')}}
			</v-btn>
		</v-snackbar>

		<!-- IS LOADING -->
		<v-overlay :absolute="false" :value="$root.isLoading">
			<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
		</v-overlay>

		<Sidebar v-if="$root.user.id" v-model="sidebar"></Sidebar>
		<Toolbar v-if="$root.user.id" :sidebar="sidebar"></Toolbar>

		<v-content v-if="$root.user.id" class="main-content">
			<v-layout fill-height>
				<router-view></router-view>
			</v-layout>
		</v-content>
	</v-app>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';

import Dashboard from './App/Dashboard.vue';
import Preferences from './App/Preferences.vue';
import Account from './App/Account.vue';
import Error404 from './Error/Error404.vue';
import Toolbar from '../components/Toolbar.vue';
import Sidebar from '../components/Sidebar.vue';
import Stats from "./App/Stats.vue";
import DeckView from "./App/Deck/View.vue";
import DeckEdit from "./App/Deck/Edit.vue";
import Shop from "./App/Shop.vue";
import Help from "./App/Help.vue";
import UserService from "../services/User";
import ErrorDialog from '../components/ErrorDialog.vue';
import Community from './App/Community.vue';
import About from './App/About.vue';
import Notifications from './App/Notifications.vue';
import Customize from "./App/Customize";
import Component from "./App/Component";
import Strategy from "./App/Strategy";
import DataSet from "./App/DataSet";

export const routes = [
	{path: '/', component: Dashboard, name: 'dashboard'},
	{path: '/login', redirect: '/'},
	// {path: '/shop', component: Shop, name: 'shop'},
	// {path: '/community', component: Community, name: 'community'},
	// {path: '/stats', component: Stats, name: 'stats'},
	{path: '/help', redirect: '/help/welcome'},
	{path: '/help/:section', component: Help, name: 'help'},
	{path: '/notifications', component: Notifications, name: 'notifications'},
	// {path: '/deck/:id', component: DeckView, name: 'deck'},
	// {path: '/deck/:id/edit', component: DeckEdit},
	// {path: '/deck/:id/edit/:section', component: DeckEdit},
	// {path: '/preferences', component: Preferences, name: 'preferences'},
	// {path: '/preferences/:section', component: Preferences},
	{path: '/account/:id', redirect: '/account/:id/wall' },
	{path: '/account/:id/:section', component: Account, name: 'account'},
	// {path: '/account/:id/decks', component: Account},
	// {path: '/customize', component: Customize, name: 'customize'},
	// {path: '/customize/:section', component: Customize},
	{path: '/about', component: About, name: 'about'},
	{path: '/about/:section', component: About},
	{path: '/strategy/:id', redirect: '/strategy/:id/settings'},
	{path: '/strategy/:id/:section', component: Strategy, name: 'strategy'},
	{path: '/component/:id', redirect: '/component/:id/settings'},
	{path: '/component/:id/:section', component: Component, name: 'component'},
	{path: '/dataset/:id', redirect: '/dataset/:id/settings'},
	{path: '/dataset/:id/:section', component: DataSet, name: 'dataset'},
	{path: '/contact', redirect: '/about/contact'},
	{path: '/terms', redirect: '/about/terms'},
	{path: '/privacy', redirect: '/about/privacy'},
	// {path: '/admin/users', component: AdminUsers, name: 'admin.users'},
	// {path: '/admin/roles', component: AdminRoles, name: 'admin.roles'},
	// {path: '/admin/groups', component: AdminGroups, name: 'admin.groups'},
	// {path: '/admin/permissions', component: AdminPermissions, name: 'admin.permissions'},
	{path: '*', component: Error404, name: 'error404'},
];

export default Vue.extend({
	name: 'App',

	components: {
		Toolbar, Sidebar, ErrorDialog,
	},

	mounted() {
		moment.locale(this.$i18n.locale);
		UserService.me.bind(this)().then(response => {
			this.$root.user = Object.assign({}, this.$root.user, response.data);
			// this.$i18n.locale = user.language_abbreviation;
			// this.$vuetify.theme.themes.light.primary = user.setting.colorFrom;
			this.$forceUpdate();
		});
	},

	methods: {

	},

	data() {
		return {
			sidebar: {
				opened: false,
				pinned: false,
				permanent: false,
				// opened: this.$vuetify.breakpoint.mdAndUp,
				// pinned: this.$vuetify.breakpoint.mdAndUp,
				// permanent: this.$vuetify.breakpoint.mdAndUp,
				miniVariant: false,
				hideOverlay: false,
			},
		};
	},

	watch: {
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
