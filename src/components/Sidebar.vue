<template>
	<v-navigation-drawer app :hide-overlay="hideOverlay" :temporary="temporary" :permanent="permanent" v-model="sidebar.opened" width="300" :mini-variant="sidebar.miniVariant">
		<v-card tile height="100%" class="d-flex flex-column">
			<div style="flex: 0">
				<!--			<v-card tile class="py-5 lightbox default-gradient" v-bind:style="'background-image: linear-gradient(to bottom, ' + $root.user.setting.colorFrom + ', ' + $root.user.setting.colorTo + ')'">-->
				<v-card tile class="py-5 lightbox default-gradient user-tile" :style="{ backgroundImage: 'url(\'' + $root.user.profile.wallpaper.url + '\')' }">

					<v-overlay :absolute="false" :value="isLoading">
						<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
					</v-overlay>

					<v-layout class="px-5" align-center>
						<v-flex>
							<UserAvatar :user="$root.user" :size="64" />
						</v-flex>
						<v-flex>
							<v-layout align-end fill-height>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title class="title white--text">{{ $root.user.profile.screen_name }}</v-list-item-title>
										<v-list-item-subtitle class="white--text">
											<a class="my-account" :href="'/account/' + this.$root.user.id">
												{{ $t('sidebar.myAccount') }}
											</a>
										</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>
							</v-layout>
						</v-flex>
					</v-layout>
					<v-list-item class="mt-5">
						<v-text-field v-model="filter" @keyup="handleKeyDown($event)" clearable solo-inverted dark :label="$t('sidebar.filterPlaceholder')" prepend-inner-icon="mdi-magnify" hide-details />
					</v-list-item>

					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn icon small v-on="on" class="white--text sidebar-button" v-if="$vuetify.breakpoint.mdAndUp" absolute top right @click="sidebar.permanent = !sidebar.permanent">
								<v-icon small v-if="sidebar.permanent">mdi-pin</v-icon>
								<v-icon small v-if="!sidebar.permanent">mdi-pin-off</v-icon>
							</v-btn>
						</template>
						<span>{{$t('toolbar.tooltip.pinSidebar')}}</span>
					</v-tooltip>
				</v-card>

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
						<span style="flex: 1">{{ $t('app.menuGroup.' + group.name) }}</span>

						<v-tooltip v-if="group.canAdd" bottom>
							<template v-slot:activator="{ on }">
								<v-btn icon v-on="on" :to="group.addTo" icon color="primary">
									<v-icon>mdi-plus</v-icon>
								</v-btn>
							</template>
							<span>{{$t('toolbar.tooltip.add' + group.name)}}</span>
						</v-tooltip>
					</v-subheader>
					<v-alert v-if="group.canAdd && group.getItems().length === 0" text tile type="warning" class="ma-0">
						{{$t('sidebar.' + group.name + 'Empty')}}
					</v-alert>
					<v-list v-if="group.getItems().length > 0" shaped v-bind:class="group.className">
<!--						<draggable :disabled="$vuetify.breakpoint.smAndDown" class="draggable-list" :list="decks" v-bind="{ disabled: !group.sortable, animation: 200, }" @end="group.sortable && group.sortable.onEnd()">-->
							<v-list-item :color="item.color" :key="item.name || item.title" :to="item.link" :exact="item.exact" @click="item.signOut ? signOut() : null" :disabled="item.disabled" v-for="item in group.getItems()">
								<v-list-item-icon>
									<v-icon>{{ item.icon }}</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title>{{ item.title || (item.name && $t('title.' + item.name)) }}</v-list-item-title>
								</v-list-item-content>

								<v-list-item-action v-if="item.badge">
									<v-chip :color="item.badgeColor">
										{{ item.badge }}
									</v-chip>
								</v-list-item-action>
							</v-list-item>
<!--						</draggable>-->
					</v-list>
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
import ComponentService from "../services/Component";
import StrategyService from "../services/Strategy";
import DataSetService from "../services/DataSet";
// import DeckService from "../services/Deck";

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
	    // this.loadDecks();
		this.loadComponents();
		this.loadStrategies();
		this.loadDataSets();

	    // this.$root.$on('DECK_UPDATE', this.deckUpdateEvent);
	    this.$root.$on('FULLSCREEN', this.fullScreenEvent);
	},

	destroyed() {
	    // this.$root.$off('DECK_UPDATE', this.deckUpdateEvent);
	    this.$root.$off('FULLSCREEN', this.fullScreenEvent);
	},

	methods: {

		fullScreenEvent(active) {
			if (active) {
				this.originalSidebar = {...this.sidebar};
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

		// deckUpdateEvent()  {
		//     this.loadDecks();
		// },

		loadStrategies() {
			StrategyService.getAll.bind(this)().then(response => {
				this.strategies = response.data;
			})
				.catch(error => this.$handleError(this, error))
				// .finally(() => this.$root.isLoading = false);
		},

		loadComponents() {
			ComponentService.getAll.bind(this)().then(response => {
				this.components = response.data;
			})
				.catch(error => this.$handleError(this, error))
				// .finally(() => this.$root.isLoading = false);
		},

		loadDataSets() {
			DataSetService.getAll.bind(this)().then(response => {
				this.datasets = response.data;
			})
				.catch(error => this.$handleError(this, error))
			// .finally(() => this.$root.isLoading = false);
		},

	    // loadDecks() {
	    //     DeckService.getAll.bind(this)().then(decks => {
		// 		this.decks = decks;
		// 	});
		// },

		signOut() {
			localStorage.removeItem('jwt');
			this.$router.go(0);
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
				let group = {...item};
				group.items = [];
				group.getItems().forEach(child => {
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
			// cdnPrefix: process.env.VUE_APP_API_URL,
			filter: '',
			user: false,
			isLoading: false,
			version: process.env.VERSION,
			// decks: [],
			strategies: [],
			components: [],
			datasets: [],
			// data: [],
			newItem: '',
			menuItems: [
				{
					name: null, canAdd: false, getItems: () => [
						{name: 'dashboard', icon: 'mdi-view-dashboard', link: '/'},
						// {name: 'shop', icon: 'mdi-shopping-search', link: '/shop', disabled: true },
						// {name: 'community', icon: 'mdi-account-group', link: '/community', disabled: true },
						// {name: 'stats', icon: 'mdi-chart-bar', link: '/stats', disabled: true },
					],
				},
				// {
				// 	name: 'decks', canAdd: true, addTo: '/deck/new/edit', getItems: () => {
				//         let items = [];
				//         this.decks.forEach(deck => {
				//             if (deck.isArchived) {
				//                 return;
				// 			}
				//             items.push({
				//                 title: deck.name,
				//                 icon: deck.icon || 'mdi-cards-outline',
				//                 link: '/deck/' + deck.id,
				// 				badge: deck.totalCards,
				// 				badgeColor: 'transparent',
				// 				color: deck.setting.colorFrom,
				// 				dark: deck.setting.dark,
				//             });
				//         });
				//         return items;
				//     }, sortable: {
				// 	    onEnd: () => {
				//             // this.$root.isLoading = true;
				//             // DeckService.saveOrder.bind(this)(this.decks).then(decks => {
				//             //     // this.decks = decks;
				//             // }).finally(() => {
				//             //     this.$root.isLoading = false;
				//             // });
				// 		}
				// 	},
				// },
				// {
				//     name: 'data', canAdd: true, addTo: '/data/new/edit', getItems: () => {
				//         let items = [];
				//         this.data.forEach(data => {
				//             if (data.isArchived) {
				//                 return;
				//             }
				//             items.push({
				//                 title: data.name,
				//                 icon: 'mdi-database',
				//                 link: '/data/' + data.id,
				//                 badge: data.totalItems,
				//                 badgeColor: 'transparent',
				//             });
				//         });
				//         return items;
				//     }
				// },
				// {
				// 	name: 'shared', canAdd: false, getItems: () => [
				//
				// 	],
				// },
				// {
				// 	name: 'personal', canAdd: false, getItems: () => [
				//
				// 	],
				// },
				// {
				// 	name: 'advanced', canAdd: false, getItems: () => [
				// 		{name: 'preferences', icon: 'mdi-settings', link: '/preferences' },
				// 		// {name: 'customize', icon: 'mdi-tools', link: '/customize', disabled: true },
				// 	],
				// },
				{
                	name: 'strategies', canAdd: true, addTo: '/strategy/new', getItems: () => {
						let items = [];
						this.strategies.forEach(strategy => {
							if (strategy.isArchived) {
								return;
							}
							items.push({
								title: strategy.name,
								icon: 'mdi-database',
								link: '/component/' + strategy.id,
								badge: strategy.totalItems,
								badgeColor: 'transparent',
							});
						});
						return items;
					},
				},
				{
                	name: 'components', canAdd: true, addTo: '/component/new', getItems: () => {
						let items = [];
						this.components.forEach(component => {
							if (component.isArchived) {
                            	return;
							}
							items.push({
								title: component.name,
								icon: component.icon,
								link: '/component/' + component.id,
							});
						});
						return items;
					},
				},
				{
                	name: 'dataset', canAdd: true, addTo: '/dataset/new', getItems: () => {
						let items = [];
						this.datasets.forEach(dataset => {
							if (dataset.isArchived) {
                            	return;
							}
							items.push({
								title: dataset.name,
								icon: dataset.is_remote ? 'mdi-cloud-download' : 'mdi-database',
								link: '/dataset/' + dataset.id,
								badge: dataset.totalItems,
								badgeColor: 'transparent',
							});
						});
						return items;
					},
				},
				// {
				//     name: 'admin', canAdd: false, getItems: () => [
				//         {name: 'admin.users', icon: 'mdi-account-details', link: '/admin/users'},
				//         {name: 'admin.roles', icon: 'mdi-security', link: '/admin/roles'},
				//         {name: 'admin.groups', icon: 'mdi-account-group', link: '/admin/groups'},
				//         {name: 'admin.permissions', icon: 'mdi-account-check', link: '/admin/permissions'},
				//     ],
				// },
				{
					name: 'others', canAdd: false, getItems: () => [
						// {name: 'account', icon: 'mdi-account', link: '/account/' + this.$root.user.id },
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
	.my-account {
		color: white;
	}
</style>
