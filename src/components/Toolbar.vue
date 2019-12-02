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

			<!-- SEARCH -->
			<v-menu v-model="searchMenuOpened" transition="scroll-x-reverse-transition" max-width="450" min-width="450" :close-on-content-click="false" :nudge-width="300" offset-x>
				<template v-slot:activator="{ on: menu }">
					<v-tooltip bottom>
						<template v-slot:activator="{ on: tooltip }">
							<v-btn icon :class="$vuetify.breakpoint.smAndUp ? 'ml-4 mr-0' : null" v-on="{ ...tooltip, ...menu }" @click="setSearchFocus()">
								<v-icon>mdi-magnify</v-icon>
							</v-btn>
						</template>
						<span>{{$t('toolbar.tooltip.search')}}</span>
					</v-tooltip>
				</template>
				<v-card>
					<div class="pa-2">
						<v-text-field ref="searchInput" :loading="searchIsLoading" @change="search(searchQuery)" v-model="searchQuery" outlined :placeholder="$t('toolbar.searchPlaceholder')" append-icon="mdi-magnify" hide-details />
					</div>

					<v-scroll-y-transition leave-absolute>
						<EmptyView class="mt-3" v-if="searchHasCompleted && !hasSearchResults" :image="false" :desc="$t('toolbar.search.noResults')" />
					</v-scroll-y-transition>

					<v-expand-transition>
						<v-list v-if="!searchIsLoading && hasSearchResults" max-height="400" style="overflow: auto">
							<v-scroll-y-transition>
								<v-list-group value="true" v-if="searchResults.users.length > 0" prepend-icon="mdi-account-circle">
									<template v-slot:activator>
										<v-list-item-title v-text="$t('toolbar.search.users')"></v-list-item-title>
										<v-list-item-action>
											<v-badge color="primary">
												{{searchResults.users.length}}
											</v-badge>
										</v-list-item-action>
									</template>

									<template v-for="(user, index) in searchResults.users">
										<v-list-item :key="index + '-item'" :to="'/account/' + user.id">
											<v-list-item-avatar>
												<UserAvatar :user="user" :size="48" />
											</v-list-item-avatar>

											<v-list-item-content>
												<v-list-item-title>{{ user | userScreenName }}</v-list-item-title>
												<v-list-item-subtitle>{{ $t('role.' + user.role.name.toLowerCase()) }}</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>

										<v-divider v-if="(index + 1) < searchResults.users.length" :key="index + '-sep'"></v-divider>
									</template>
								</v-list-group>
							</v-scroll-y-transition>
							<v-scroll-y-transition>
								<v-list-group value="true" v-if="searchResults.pages.length > 0" prepend-icon="mdi-file-multiple-outline">
									<template v-slot:activator>
										<v-list-item-title v-text="$t('toolbar.search.pages')"></v-list-item-title>
										<v-list-item-action>
											<v-badge dark color="primary">
												{{ searchResults.pages.length }}
											</v-badge>
										</v-list-item-action>
									</template>

									<template v-for="(page, index) in searchResults.pages">
										<v-list-item :key="index + '-item'" :to="'/' + page.slug">
											<v-list-item-content class="text-truncate">
												<v-list-item-title v-html="page.title"></v-list-item-title>
												<v-list-item-subtitle v-html="$options.filters.plainExcerpt(page.content)"></v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>

										<v-divider v-if="(index + 1) < searchResults.pages.length" :key="index + '-sep'"></v-divider>
									</template>
								</v-list-group>
							</v-scroll-y-transition>
						</v-list>
					</v-expand-transition>
				</v-card>
			</v-menu>

			<!-- MESSAGING -->
			<v-menu v-if="!collapse" transition="slide-y-transition">
				<template v-slot:activator="{ on: menu }">
					<v-tooltip bottom>
						<template v-slot:activator="{ on: tooltip }">
							<v-btn :disabled="messages.length === 0" :class="$vuetify.breakpoint.smAndUp ? 'ml-4 mr-0' : null" icon v-on="{ ...tooltip, ...menu }">
								<v-badge color="error" v-if="newMessages.length > 0">
									<template v-slot:badge>{{ newMessages.length }}</template>
									<v-icon>mdi-comment</v-icon>
								</v-badge>
								<v-icon v-else>mdi-comment</v-icon>
							</v-btn>
						</template>
						<span>{{$t('toolbar.tooltip.messaging')}}</span>
					</v-tooltip>
				</template>
				<v-card>
					<v-list>
						<template v-for="(message, i) in messages">
							<v-list-item :key="'item_' + i" @click="" :class="(!message.is_read ? 'v-list-item--active primary--text' : '') + ' align-center'">
								<v-list-item-avatar>
									<UserAvatar :size="48" :user="message.created_by" />
								</v-list-item-avatar>

								<v-list-item-content>
									<v-list-item-title>{{message.created_by | userScreenName }}</v-list-item-title>
									<v-list-item-subtitle>{{message.content}}</v-list-item-subtitle>
								</v-list-item-content>

								<v-list-item-icon v-if="!message.is_read">
									<v-icon color="primary" xSmall>
										mdi-checkbox-blank-circle
									</v-icon>
								</v-list-item-icon>
							</v-list-item>
						</template>

						<v-divider class="my-4" v-if="messages.length > 0"></v-divider>

						<v-list-item v-if="messages.length > 0" :to="'/account/' + $root.user.id + '/messaging'" class="text-center">
							<v-list-item-content>
								<v-list-item-title>
									{{$t('toolbar.seeAllMessages')}}
								</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
			</v-menu>

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
									<v-list-item-title>{{notification.from | userScreenName}}</v-list-item-title>
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
					<v-chip color="primary" small class="ml-4 text-center" v-text="notifications.length"></v-chip>
				</v-list-item>
			</v-list>
		</v-menu>
	</v-app-bar>
</template>

<script>
import Vue from 'vue';
import LanguageSwitcher from "../components/LanguageSwitcher.vue";
import NotificationService from "../services/Notification";
import MessagingService from "../services/Messaging";
import UserAvatar from "./UserAvatar";
import SearchService from "../services/Search";
import EmptyView from "./EmptyView";

export default Vue.extend({
	name: 'Toolbar',
	props: ['sidebar'],
	components: { LanguageSwitcher, UserAvatar, EmptyView },

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

            MessagingService.getUsers.bind(this)()
				.then(response => {
				    this.messages = response.data;
				})
				.catch(error => this.$handleError(this, error));
		},

		search(query) {

	        if (this.searchLastQuery === query.trim() || query.trim().length < 3) {
	            return;
			}

	        this.searchLastQuery = query.trim();

	        this.searchIsLoading = true;
	        SearchService.query.bind(this)(query)
                .then(response => {
                    let keys = Object.keys(response.data);
                    keys.forEach(key => {
                        this.searchResults[key] = response.data[key];
					});
                })
                .catch(error => this.$handleError(this, error))
				.finally(() => {
				    this.searchIsLoading = false;
				    this.searchHasCompleted = true;
                });
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

        newMessages() {
	        return this.messages.filter(message => {
	            return message.aknowledged_on === undefined;
			});
		},

		hasSearchResults() {
	        return this.searchResults.users.length > 0
				|| this.searchResults.pages.length > 0;
		}
	},

	data() {
		return {
			collapse: false,
			options: [],
			contextualComponent: {
				component: false,
			},
			showAppTitle: false,
			showTitle: false,
			notifications: [],
            messages: [],
            searchLastQuery: '',
            searchIsLoading: false,
            searchHasCompleted: false,
            searchQuery: '',
            searchMenuOpened: false,
            searchResults: {
			    users: [],
				pages: [],
			},
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
		    this.searchMenuOpened = false;
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
