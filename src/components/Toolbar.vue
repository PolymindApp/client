<template>
	<v-app-bar dark src="https://polymind.s3.ca-central-1.amazonaws.com/assets/img/login-background.jpg" app :class="collapse ? 'fullscreen' : null" :flat="collapse" :color="collapse ? 'transparent' : null" :collapse="collapse" :clipped-right="sidebar.permanent">

		<template v-slot:img="{ props }">
			<v-img v-bind="props" gradient="to bottom, rgba(86, 190, 187, 0.75), rgba(27, 142, 138, 0.75)"></v-img>
		</template>

		<!-- LEFT -->
		<v-tooltip bottom v-if="(!sidebar.permanent && !collapse) || this.$vuetify.breakpoint.smAndDown">
			<template v-slot:activator="{ on }">
				<v-btn v-on="on" icon @click.stop="sidebar.opened = !sidebar.opened" class="mr-4">
					<v-icon v-if="!sidebar.opened">mdi-menu</v-icon>
					<v-icon v-if="sidebar.opened">mdi-window-close</v-icon>
				</v-btn>
			</template>
			<span>{{$t('toolbar.tooltip.menu')}}</span>
		</v-tooltip>

		<!-- LOGO -->
		<v-scale-transition mode="in-out" v-if="$vuetify.breakpoint.smAndUp">
			<img class="mr-4" v-show="showAppTitle" src="../assets/images/polymind-light.svg" height="48" />
		</v-scale-transition>

		<!-- TITLE -->
		<v-toolbar-title class="headline text-uppercase">
			<span v-if="$root.breadcrumbs.length === 0" class="font-weight-light">{{ $router.currentRoute.name && $t('title.' + $router.currentRoute.name) }}</span>

			<template v-for="(breadcrumb, index) in $root.breadcrumbs">
				<div class="d-inline">
					<span v-if="typeof breadcrumb === 'string'">
						<span v-if="index === 0" v-show="showTitle" :key="index + '_item'">{{ breadcrumb }}</span>
						<span v-if="index > 0" v-show="showTitle" :key="index + '_item'" class="font-weight-light">{{ breadcrumb }}</span>
					</span>

					<template v-if="typeof breadcrumb !== 'string'">
						<component class="d-inline" :is="breadcrumb[0]" v-bind="breadcrumb[1]" v-if="typeof breadcrumb === 'object'"></component>
						<component class="d-inline" :is="breadcrumb" v-else></component>
					</template>
				</div>

				<v-icon v-if="index + 1 < $root.breadcrumbs.length" :key="index + '_chevron'">mdi-chevron-right</v-icon>
			</template>
		</v-toolbar-title>

		<v-spacer></v-spacer>

		<template v-if="$vuetify.breakpoint.mdAndUp">
			<template v-if="contextualComponent.component">
				<component :is="contextualComponent.component"></component>
				<v-divider v-if="!collapse" inset vertical class="ml-8"></v-divider>
			</template>

			<!-- HELP -->
			<v-tooltip v-if="!collapse" bottom>
				<template v-slot:activator="{ on }">
					<v-btn class="ml-4" v-on="on" text @click="toggleHelp()">
						<v-icon :left="$vuetify.breakpoint.smAndUp">mdi-help-circle-outline</v-icon>
						<span v-if="$vuetify.breakpoint.smAndUp">{{$t('toolbar.help')}}</span>
					</v-btn>
				</template>
				<span>{{$t('toolbar.tooltip.help')}}</span>
			</v-tooltip>

			<!-- SHORTCUTS -->
			<v-tooltip v-if="!collapse" bottom>
				<template v-slot:activator="{ on }">
					<v-btn :class="$vuetify.breakpoint.smAndUp ? 'ml-4' : null" @click="toggleShortcut()" v-on="on" icon>
						<v-icon>mdi-keyboard</v-icon>
					</v-btn>
				</template>
				<span>{{$t('toolbar.tooltip.shortcuts')}}</span>
			</v-tooltip>

			<!-- NOTIFICATIONS -->
			<v-menu v-if="!collapse" transition="slide-y-transition">
				<template v-slot:activator="{ on: menu }">
					<v-tooltip bottom>
						<template v-slot:activator="{ on: tooltip }">
							<v-btn :disabled="notifications.length === 0" :class="$vuetify.breakpoint.smAndUp ? 'ml-4 mr-0' : null" icon v-on="{ ...tooltip, ...menu }">
								<v-badge color="error" v-if="newNotifications.length > 0">
									<template v-slot:badge>{{ newNotifications.length }}</template>
									<v-icon>mdi-bell</v-icon>
								</v-badge>
								<v-icon v-else>mdi-bell</v-icon>
							</v-btn>
						</template>
						<span>{{$t('toolbar.tooltip.notification')}}</span>
					</v-tooltip>
				</template>
				<v-card>
					<v-list>
						<template v-for="(notification, i) in notifications">
							<v-list-item :key="'item_' + i" @click="" :class="(!notification.aknowledged_on ? 'v-list-item--active primary--text' : '') + ' align-center'">
								<v-list-item-avatar>
									<UserAvatar :size="48" :user="notification.from" />
								</v-list-item-avatar>

								<v-list-item-content>
									<v-list-item-title>{{notification.from.first_name}} {{notification.from.last_name}}</v-list-item-title>
									<v-list-item-subtitle>{{notification.title}}</v-list-item-subtitle>
								</v-list-item-content>

								<v-list-item-icon v-if="!notification.aknowledged_on">
									<v-icon color="primary" xSmall>
										mdi-checkbox-blank-circle
									</v-icon>
								</v-list-item-icon>
							</v-list-item>
						</template>

						<v-divider class="my-4" v-if="notifications.length > 0"></v-divider>

						<v-list-item v-if="notifications.length > 0" :to="'/account/' + $root.user.id + '/notifications'" class="text-center">
							<v-list-item-content>
								<v-list-item-title>
									{{$t('toolbar.seeAllNotif')}}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
			</v-menu>
		</template>

		<!-- CONTEXTUAL OPTIONS -->
		<v-menu v-if="$vuetify.breakpoint.smAndDown" transition="slide-y-transition" bottom>
			<template v-slot:activator="{ on: menu }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on: tooltip }">
						<v-btn icon v-on="{ ...tooltip, ...menu }">
							<v-icon>mdi-dots-vertical</v-icon>
						</v-btn>
					</template>
					<span>{{$t('toolbar.tooltip.options')}}</span>
				</v-tooltip>
			</template>
			<v-list>
				<template v-if="contextualComponent.component">
					<component :is="contextualComponent.component"></component>
					<v-divider class="my-4"></v-divider>
				</template>

				<v-list-item @click="toggleHelp()">
					<v-icon left>mdi-help-circle-outline</v-icon>
					<v-list-item-title>{{$t('toolbar.help')}}</v-list-item-title>
				</v-list-item>
				<v-list-item :disabled="notifications.length === 0" :to="'/account/' + $root.user.id + '/notifications'">
					<v-icon left>mdi-bell</v-icon>
					<v-list-item-title>{{$t('toolbar.tooltip.notification')}}</v-list-item-title>

						<v-chip color="primary" small class="ml-4 text-center">5</v-chip>

				</v-list-item>
			</v-list>
		</v-menu>
	</v-app-bar>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';
import LanguageSwitcher from "../components/LanguageSwitcher.vue";
import NotificationService from "../services/Notification";
import UserAvatar from "./UserAvatar";

export default Vue.extend({
	name: 'Toolbar',
	props: ['sidebar'],
	components: { LanguageSwitcher, UserAvatar },

	mounted() {
		setTimeout(() => {this.showAppTitle = true; }, 500);
		setTimeout(() => {this.showTitle = true; }, 750);

		this.$root.$on('FULLSCREEN', this.fullScreenEvent);

		this.init();
	},

	destroyed() {
		this.$root.$off('FULLSCREEN', this.fullScreenEvent);
	},

	methods: {

	    init() {

	        NotificationService.get.bind(this)()
				.then(response => {
				    this.notifications = response.data;
				})
				.catch(error => this.$handleError(this, error));
		},

		fullScreenEvent(active) {
			this.collapse = active;
		},

        toggleShortcut() {
		    this.$root.shortcuts.visible = !this.$root.shortcuts.visible;
		},

        toggleHelp() {
		    this.$root.help.visible = !this.$root.help.visible;
		},

		setSearchFocus() {
			setTimeout(() => {
				this.$refs.searchInput.focus();
			}, 250);
		},
	},

	computed: {

	    newNotifications() {
	        return this.notifications.filter(notification => {
	            return notification.aknowledged_on === undefined;
			});
		},
	},

	data() {
		return {
			collapse: false,
			env: process.env.NODE_ENV,
			options: [],
			contextualComponent: {
				component: false,
			},
			showAppTitle: false,
			showTitle: false,
			searchMenuOpened: false,
			notifications: [],
			searchItems: [
				// { title: 'Search result #1', subtitle: 'Category of content', icon: 'mdi-contacts' },
				// { title: 'Search result #2', subtitle: 'Category of content', icon: 'mdi-notebook' },
				// { title: 'Search result #3', subtitle: 'Category of content', icon: 'mdi-clipboard-account' },
			],
		};
	},

	watch: {
		'$root.toolbarOptions': function(options) {
			this.options = options;
		},
		'$root.toolbarContextual.component': function(component) {
			this.contextualComponent.component = component;
		},
		$route(to, from) {
			this.$root.toolbarOptions = [];
			this.$root.toolbarContextual = {
				component: false,
			};
		}
	},
});
</script>

<style lang="scss" scoped>
	.v-toolbar {
		z-index: 4;
	}
	.v-toolbar__title {
		span {
			display: inline-block;
		}
	}
</style>
