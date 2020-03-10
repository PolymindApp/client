<template>
	<v-navigation-drawer app :hide-overlay="hideOverlay" :temporary="temporary" :permanent="permanent" v-model="sidebar.opened" width="300" :mini-variant="sidebar.miniVariant">
		<v-card tile height="100%" class="d-flex flex-column">
			<div style="flex: 0">
				<v-card tile class="py-5 lightbox default-gradient user-tile" :style="{ backgroundImage: backgroundImage }">

					<v-overlay :absolute="false" :value="isLoading">
						<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
					</v-overlay>

					<v-layout class="px-5" align-center>
						<v-flex>
							<UserAvatar :user="$root.user" :size="64" :editable="true" />
						</v-flex>
						<v-flex>
							<v-layout align-end fill-height>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title class="title white--text">{{ $root.user | userScreenName }}</v-list-item-title>
										<v-list-item-subtitle class="white--text mt-n1">
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
						<v-text-field ref="search" v-model="filter" @keyup="handleKeyDown($event)" clearable solo-inverted dark :label="$t('sidebar.filterPlaceholder')" prepend-inner-icon="mdi-magnify" hide-details />
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
						<span style="flex: 1">
							{{ $t('app.menuGroup.' + group.name) }}
							<span class="font-weight-bold primary--text" v-if="group.canAdd && group.getItems().length > 0">({{group.getItems().length}})</span>
						</span>

						<v-tooltip v-if="group.canAdd" bottom>
							<template v-slot:activator="{ on }">
								<v-btn icon @click="toggleSection(group.name)" v-on="on" icon>
									<v-icon v-if="$root.user.settings.sidebar[group.name]">mdi-chevron-down</v-icon>
									<v-icon v-else>mdi-chevron-up</v-icon>
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
								<v-alert v-if="group.canAdd && group.getItems().length === 0" text tile type="warning" class="ma-0">
									{{$t('sidebar.' + group.name + 'Empty')}}
								</v-alert>
								<v-list v-if="group.getItems().length > 0" shaped v-bind:class="group.className">
									<!--						<draggable :disabled="$vuetify.breakpoint.smAndDown" class="draggable-list" :list="decks" v-bind="{ disabled: !group.sortable, animation: 200, }" @end="group.sortable && group.sortable.onEnd()">-->
									<v-list-item color="primary" :key="item.name || item.title" :to="item.link" :exact="item.exact" @click="item.signOut ? signOut() : null" :disabled="item.disabled" v-for="item in group.getItems()">
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
import ComponentService from "../services/ComponentService";
import StrategyService from "../services/StrategyService";
import DatasetService from "../services/DatasetService";
import DocumentService from "../services/DocumentService";
import UserService from "../services/UserService";

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
		this.loadComponents();
		this.loadStrategies();
		this.loadDatasets();
		this.loadDocuments();

	    this.$root.$on('COMPONENT_UPDATE', this.loadComponents);
	    this.$root.$on('STRATEGY_UPDATE', this.loadStrategies);
	    this.$root.$on('DATASET_UPDATE', this.loadDatasets);
	    this.$root.$on('DOCUMENTS_UPDATE', this.loadDocuments);
	    this.$root.$on('FULLSCREEN', this.fullScreenEvent);
	},

	destroyed() {

        this.$root.$off('COMPONENT_UPDATE', this.loadComponents);
        this.$root.$off('STRATEGY_UPDATE', this.loadStrategies);
        this.$root.$off('DATASET_UPDATE', this.loadDatasets);
        this.$root.$off('DOCUMENTS_UPDATE', this.loadDocuments);
	    this.$root.$off('FULLSCREEN', this.fullScreenEvent);
	},

	methods: {

	    focusSearch() {
	        this.$refs.search.$el.querySelector('input').focus();
	        this.$refs.search.$el.querySelector('input').select();
		},

	    toggleSection(name) {

            this.$root.user.settings.sidebar[name] = !this.$root.user.settings.sidebar[name];
            UserService.update.bind(this)(this.$root.user.id, {
                settings: this.$root.user.settings
            })
                .catch(error => this.$handleError(this, error));
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
	        UserService.update.bind(this)(this.$root.user.id, {
	            settings: this.$root.user.settings
			})
				.catch(error => this.$handleError(this, error));

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

		loadStrategies() {
			StrategyService.getAllMine.bind(this)().then(response => {
				this.strategies = response.data;
			})
				.catch(error => this.$handleError(this, error))
				// .finally(() => this.$root.isLoading = false);
		},

		loadComponents() {
			ComponentService.getAllMine.bind(this)().then(response => {
				this.components = response.data;
			})
				.catch(error => this.$handleError(this, error))
				// .finally(() => this.$root.isLoading = false);
		},

		loadDatasets() {
			DatasetService.getAllMine.bind(this)().then(response => {
				this.datasets = response.data;
			})
				.catch(error => this.$handleError(this, error))
			// .finally(() => this.$root.isLoading = false);
		},

        loadDocuments() {
			DocumentService.getAllMine.bind(this)().then(response => {
				this.documents = response.data;
			})
				.catch(error => this.$handleError(this, error))
			// .finally(() => this.$root.isLoading = false);
		},

		signOut() {
		    UserService.logout.bind(this)()
				.then(() => {
                    this.$router.go(0);
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
                ? 'url(\'' + this.$thumbnails(this.$root.user.wallpaper.filename, 256, 256) + '\')'
                : null;
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
			isLoading: false,
			version: process.env.VERSION,
			strategies: [],
			components: [],
			datasets: [],
			documents: [],
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
				{
                	name: 'strategies', canAdd: true, addTo: '/strategy/new', getItems: () => {
						let items = [];
						this.strategies.forEach(strategy => {
							if (strategy.isArchived) {
								return;
							}
							items.push({
								title: strategy.name,
								icon: 'mdi-strategy',
								link: '/strategy/' + strategy.id,
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
                	name: 'document', canAdd: true, addTo: '/document/new', getItems: () => {
						let items = [];
						this.documents.forEach(document => {
							if (document.isArchived) {
                            	return;
							}
							items.push({
								title: document.name,
								icon: 'mdi-file-document-outline',
								link: '/dataset/' + document.id,
								badge: document.totalItems,
								badgeColor: 'transparent',
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
	.my-account {
		color: white;
	}
</style>
