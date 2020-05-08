<template>
	<v-navigation-drawer app :hide-overlay="hideOverlay" :temporary="temporary" :permanent="permanent" v-model="sidebar.opened" width="300" :mini-variant="sidebar.miniVariant">
		<v-card :dark="$root.user.settings.theme === 'dark'" tile height="100%" class="d-flex flex-column">
			<div style="flex: 0">
				<v-img tile class="py-5 lightbox default-gradient user-tile" transition="fade" :src="backgroundImage" :gradient="gradient" max-height="180">
					<v-layout class="px-5" align-center>
						<v-flex>
							<UserAvatar :user="$root.user" :size="64" :editable="false" />
						</v-flex>
						<v-flex>
							<v-layout align-end fill-height>
								<v-list-item :href="'/account/' + this.$root.user.id">
									<v-list-item-content>
										<v-list-item-title class="white--text font-weight-bold">{{ $root.user | userScreenName }}</v-list-item-title>
										<v-list-item-subtitle class="white--text font-italic font-weight-light">
											{{ $t('role.' + $root.user.role.name.toLowerCase()) }}
										</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>
							</v-layout>
						</v-flex>
					</v-layout>
					<v-list-item class="mt-5">
						<v-text-field ref="search" v-model="filter" @keyup="handleKeyDown($event)" clearable solo-inverted dark :label="$t('sidebar.filterPlaceholder')" prepend-inner-icon="mdi-magnify" autocomplete="off" hide-details />
					</v-list-item>

					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon small v-on="on" class="white--text sidebar-button" v-if="$vuetify.breakpoint.mdAndUp" absolute top right @click="toggleSidebar()">
								<v-icon small v-if="sidebar.permanent">mdi-pin</v-icon>
								<v-icon small v-if="!sidebar.permanent">mdi-pin-off</v-icon>
							</v-btn>
						</template>
						<span>{{$t('toolbar.tooltip.pinSidebar')}}</span>
					</v-tooltip>
				</v-img>

				<v-divider></v-divider>
			</div>
			<div style="flex: 1">

				<v-alert v-if="filteredMenuItems.length > 0 && (filter && filter.length > 0)" text type="info" tile class="ma-0">
					{{$t('sidebar.hasFilter')}}
				</v-alert>

				<v-alert v-if="filteredMenuItems.length === 0" text tile type="warning" class="ma-0">
					{{$t('sidebar.searchEmpty')}}
				</v-alert>

				<v-sheet tile :key="group.title" v-if="group.canAdd || group.getItems().length > 0" v-for="group in filteredMenuItems">
					<v-subheader v-if="group.name">
						<span style="flex: 1">
							{{ $t('app.menuGroup.' + group.name) }}
							<span class="font-weight-bold primary--text" v-if="group.canAdd && group.getItems().length > 0">({{group.getItems().length}})</span>
						</span>

						<v-tooltip v-if="group.canAdd" bottom>
							<template v-slot:activator="{ on }">
								<v-btn icon @click="toggleSection(group.name)" v-on="on" icon>
									<v-icon v-if="$root.user.settings.sidebar[group.name]">mdi-chevron-down</v-icon>
									<v-icon class="mdi-rotate-90" v-else>mdi-chevron-up</v-icon>
								</v-btn>
							</template>
							<span>
								<span v-if="$root.user.settings.sidebar[group.name]" v-text="$t('toolbar.tooltip.collapse')"></span>
								<span v-else v-text="$t('toolbar.tooltip.expand')"></span>
							</span>
						</v-tooltip>

						<v-tooltip v-if="group.canAdd" bottom>
							<template v-slot:activator="{ on }">
								<v-btn class="ml-2" icon v-on="on" :to="group.addTo" icon color="primary">
									<v-icon>mdi-plus</v-icon>
								</v-btn>
							</template>
							<span>{{$t('toolbar.tooltip.add' + group.name)}}</span>
						</v-tooltip>
					</v-subheader>

					<v-expand-transition>
						<template v-if="!group.canAdd || ($root.user.settings.sidebar[group.name] || filter)">
							<div>
								<v-progress-linear v-if="loaded[group.name] === false" indeterminate></v-progress-linear>
								<v-alert v-else-if="group.canAdd && group.getItems().length === 0" text tile type="warning" class="ma-0">
									{{$t('sidebar.' + group.name + 'Empty')}}
								</v-alert>
								<v-list v-else-if="group.getItems().length > 0" shaped v-bind:class="group.className" dense>
									<v-list-item color="primary" :key="item.name || item.title" :to="item.link" :exact="item.exact" @click="item.signOut ? signOut() : null" :disabled="item.disabled" v-for="item in group.getItems()">
										<v-list-item-icon>
											<v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
										</v-list-item-icon>

										<v-list-item-content>
											<v-list-item-title>{{ item.title || (item.name && $t('title.' + item.name)) }}</v-list-item-title>
										</v-list-item-content>

										<v-list-item-action v-if="item.badge">
											<v-chip :color="item.badgeColor">
												{{ item.badge }}
											</v-chip>
										</v-list-item-action>

										<v-list-item-action class="flex-row justify-end">
											<v-icon v-if="item.valid === false" class="ml-2" color="error" x-small>mdi-alert</v-icon>
<!--											<v-icon v-if="item.isPrivate" class="ml-2" color="grey lighten-1" x-small>mdi-lock</v-icon>-->
										</v-list-item-action>
									</v-list-item>
								</v-list>
							</div>
						</template>
					</v-expand-transition>
				</v-sheet>
			</div>
			<div style="flex: 0">
				<v-footer class="px-5 py-3 overline justify-end" align="end">
					&copy; Polymind v{{ version }}
				</v-footer>
			</div>
		</v-card>
	</v-navigation-drawer>
</template>

<script>
import Vue from 'vue';
import UserAvatar from '../components/UserAvatar.vue';
import draggable from "vuedraggable";
import { UserService, EventBus } from "@polymind/sdk-js";

export default Vue.extend({
	name: 'Sidebar',
	props: ['sidebar'],
	components: { UserAvatar, draggable },

	model: {
		prop: 'sidebar',
		event: 'blur',
	},

	originalSidebar: null,

	mounted() {
	    this.$root.$on('FULLSCREEN', this.fullScreenEvent);
	},

	destroyed() {
	    this.$root.$off('FULLSCREEN', this.fullScreenEvent);
	},

	methods: {

	    focusSearch() {
	        this.$refs.search.$el.querySelector('input').focus();
	        this.$refs.search.$el.querySelector('input').select();
		},

	    toggleSection(name) {

            this.$root.user.settings.sidebar[name] = !this.$root.user.settings.sidebar[name];
            UserService.update(this.$root.user.id, {
                settings: this.$root.user.settings
            }).catch(error => this.$handleError(this, error));
		},

		openSidebar() {
			this.sidebar.opened = true;
		},

		closeSidebar() {
			this.sidebar.opened = false;
		},

	    toggleSidebar() {

	        this.sidebar.permanent = !this.sidebar.permanent;
	        this.$root.user.settings.sidebar.fixed = this.sidebar.permanent;
	        UserService.update(this.$root.user.id, {
	            settings: this.$root.user.settings
			}).catch(error => this.$handleError(this, error));

	        setTimeout(() => {
				window.dispatchEvent(new Event('resize'));
			}, 300);
		},

		fullScreenEvent(active) {
			if (active) {
				this.originalSidebar = this.$deepClone(this.sidebar);
				this.sidebar.hideOverlay = true;
				this.sidebar.permanent = !active;
				this.sidebar.opened = !active;
			} else {
				this.sidebar.hideOverlay = false;
				this.sidebar.permanent = this.originalSidebar.permanent;
				this.sidebar.opened = this.originalSidebar.opened;
				this.originalSidebar = null;
			}
		},

		signOut() {
			this.$polymind.logout().then(() => {
				EventBus.publish('LOGOUT', this.$route.fullPath);
			});
		},

		handleKeyDown(event) {
		    if (event.code === 'Enter') {
				if (this.filteredMenuItems.length > 0) {
				    const items = this.filteredMenuItems[0].getItems();
					if (items.length > 0) {
						this.$router.push(items[0].link || items[0].to);
					}

				}
			}
		}
	},

	computed: {

	    backgroundImage() {
            return this.$root.user.wallpaper
                ? this.$thumbnails(this.$root.user.wallpaper.private_hash, 'avatar')
                : '';
		},

		gradient() {
			return this.backgroundImage ? 'to top right, rgba(27, 142, 138, .7), rgba(27, 142, 138, .3)' : null;
		},

	    hideOverlay() {
	        return this.sidebar.hideOverlay || this.sidebar.permanent || !this.sidebar.opened;
		},

		temporary() {
	        return !this.sidebar.permanent || this.$vuetify.breakpoint.smAndDown;
		},

		permanent() {
			return this.sidebar.permanent && this.$vuetify.breakpoint.mdAndUp;
		},

		filteredMenuItems() {

			if (!this.filter) {
				return this.menuItems;
			}

			let groups = [];
			this.menuItems.forEach(item => {
				let group = this.$deepClone(item);
				let items = item.getItems();
				group.items = [];
				items.forEach(child => {
					const title = (child.title || (child.name && this.$t('title.' + child.name))).toLowerCase();
					const filter = this.filter.trim().toLowerCase();
					if (title.indexOf(filter) !== -1) {
						group.items.push(child);
					}
				});
				if (group.items.length > 0) {
				    group.getItems = () => {
						return group.items;
					};
					groups.push(group);
				}
			});

			return groups;
		}
	},

	data() {
		return {
			filter: '',
			user: false,
			version: process.env.VERSION,
			loaded: {
				components: true,
				dataset: true,
				strategies: true,
			},
			newItem: '',
			menuItems: [
				{
					name: null, canAdd: false, getItems: () => [
						{name: 'dashboard', icon: 'mdi-view-dashboard', link: '/'},
					],
				},
				{
					name: 'dataset', canAdd: true, addTo: '/dataset/new', getItems: () => {
						let items = [];
						this.$root.datasets.forEach(dataset => {
							items.push({
								title: dataset.name,
								isPrivate: dataset.is_private,
								icon: dataset.icon || (dataset.is_remote ? 'mdi-cloud-download' : 'mdi-database'),
								link: '/dataset/' + dataset.id,
								badge: dataset.totalItems,
								badgeColor: 'transparent',
							});
						});
						return items;
					},
				},
				{
                	name: 'strategies', canAdd: true, addTo: '/strategy/new', getItems: () => {
						let items = [];
						this.$root.strategies.forEach(strategy => {
							items.push({
								title: strategy.name,
								isPrivate: strategy.is_private,
								icon: strategy.icon || 'mdi-strategy',
								iconColor: strategy.color,
								link: '/strategy/' + strategy.id,
								badge: strategy.totalItems,
								badgeColor: 'transparent',
								valid: strategy.isValid(this.$root.components, this.$root.datasets),
							});
						});
						return items;
					},
				},
				{
                	name: 'components', canAdd: true, addTo: '/component/new', getItems: () => {
						let items = [];
						this.$root.components.forEach(component => {
							items.push({
								title: component.name,
								isPrivate: component.is_private,
								icon: component.icon || 'mdi-cube',
								link: '/component/' + component.id,
							});
						});
						return items;
					},
				},
				{
					name: 'others', canAdd: false, getItems: () => [
						{name: 'about', icon: 'mdi-information', link: '/about' },
						{name: 'signOut', icon: 'mdi-logout-variant', signOut: true},
					],
				}
			],
		};
	},
});
</script>

<style lang="scss" scoped>
	.lightbox {
		box-shadow: 0 -1rem 3rem -1.5rem inset rgba(0, 0, 0, 0.2);
	}
	.sidebar-button {
		top: 0 !important;
		right: 0 !important;
	}
	.user-tile {
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center center;
	}
</style>
