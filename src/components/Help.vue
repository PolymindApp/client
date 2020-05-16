<template>
	<v-dialog v-model="showModal" fullscreen hide-overlay transition="dialog-bottom-transition">

		<v-card class="d-flex flex-column fill-height">

			<!-- TOOLBAR -->
			<v-toolbar style="flex: 0; z-index: 1" dark color="primary" class="default-gradient">
				<v-icon v-if="isPermanent" left>mdi-book</v-icon>
				<v-icon v-else @click="toggleSidebar()" left>mdi-menu</v-icon>
				<v-toolbar-title class="ml-2" v-text="$t('help.title')"></v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn icon dark @click="$root.help.visible = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-toolbar>

			<div class="d-flex fill-height">

				<!-- SIDEBAR -->
				<v-navigation-drawer ref="drawer" :permanent="isPermanent" :temporary="!isPermanent" v-model="sidebar.opened" class="fill-height" style="min-width: 300px" :absolute="!isPermanent">
					<div :class="{ 'pa-4 fill-height grey lighten-4': true, 'grey lighten-2 inner-shadow': isPermanent }">

						<!-- SEARCH -->
						<v-text-field ref="search" v-model="filter" :disabled="items.length === 0" clearable solo :label="$t('help.filterPlaceholder')" prepend-inner-icon="mdi-magnify" autocomplete="off" hide-details />

						<!-- ALERNO ITEMS -->
						<v-alert v-if="items.length === 0" type="warning" text tile colored-border border="bottom" class="mt-4 white">
							{{$t('help.noItems')}}
						</v-alert>

						<!-- HIERARCHY -->
						<v-slide-y-transition>
							<v-treeview
									v-if="itemsLoaded"
									v-model="tree"
									:active.sync="active"
									:open.sync="opened"
									:search="filter"
									:items="items"
									item-key="key"
									class="mt-4"
									rounded
									open-all
									activatable
									open-on-click
									return-object
							>
								<template v-slot:prepend="{ item, open }">
									<v-icon v-if="item.type === 'cat'">
										{{ open ? 'mdi-folder-open' : 'mdi-folder' }}
									</v-icon>
									<v-icon v-else>
										{{ item.icon || types[item.type] }}
									</v-icon>
								</template>
							</v-treeview>
						</v-slide-y-transition>
					</div>
				</v-navigation-drawer>

				<!-- CONTENT -->
				<v-scroll-y-transition mode="out-in">
					<v-card color="transparent" v-if="active.length > 0" :key="active[0].key" tile flat class="pa-8 align-self-start">
						<h1 v-html="active[0].name" class="display-1 mb-8 primary--text"></h1>
						<div v-html="active[0].content"></div>
					</v-card>
					<EmptyView v-else :title="$t('help.noSelectTitle')" :desc="$t('help.noSelectDesc')" />
				</v-scroll-y-transition>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
    import Vue from 'vue';
    import EmptyView from "./EmptyView";
    import { DocumentationService } from "@polymind/sdk-js";

    export default Vue.extend({

        name: 'Help',

        props: ['visible'],

        components: { EmptyView },

        mounted() {

            this.load();
        },

        destroyed() {

        },

        methods: {

            open(slug) {

                this.active = [];
                const search = items => items.forEach(item => {
                    if (item.children) {
                        return search(item.children);
					} else if(item.slug === slug) {
                        this.active = [item];
					}
				});

                search(this.items);
                this.$forceUpdate();
			},

			toggleSidebar() {
            	this.sidebar.opened = !this.sidebar.opened;
			},

            load() {

                this.$root.isLoading = true;
				DocumentationService.getAll(this.$i18n.locale)
					.then(documentations => {
						this.$help.items.splice(0, this.$help.items.length);
						documentations.forEach(documentation => {
							const content = documentation.getContent(this.$i18n.locale);
							if (content) {
                        		this.$help.add(documentation.group, content.slug, content.title, content.content);
							}
						});
						this.itemsLoaded = true;
					})
                    .catch(error => this.$handleError(this, error))
                    .finally(() => this.$root.isLoading = false);
			}
		},

        computed: {

			isPermanent() {
				return this.$vuetify.breakpoint.mdAndUp;
			},

            // TODO: At this point, Vuetify does not provide a way to know if the filtered items are empty or not

            // filteredItems() {
			//
            //     if (!this.filter) {
            //         return this.items;
            //     }
			//
            //     const scan = entries => {
			//
            //         let items = [];
            //         entries.forEach(entry => {
			//
            //             let item = this.$deepClone(entry);
            //             if (!item.children) {
            //                 item.children = [];
			// 			}
            //             if (item.children.length > 0) {
            //             	item.children = scan(item.children);
			// 			}
			//
            //             const title = entry.name.toLowerCase();
            //             const filter = this.filter.trim().toLowerCase();
            //             if (title.indexOf(filter) !== -1 || item.children.length > 0) {
			//
            //                 if ((item.type === 'cat' && item.children.length > 0)
			// 				|| item.type !== 'cat') {
            //                 	items.push(item);
			// 				}
            //             }
			// 		});
			//
            //         return items;
			// 	};
			//
            //     return scan(this.items);
            // }
		},

        data() {
            return {
                itemsLoaded: false,
                showModal: false,
				sidebar: {
                	opened: true,
				},
                filter: '',
                opened: [],
                tree: [],
                active: [],
                types: {
                    doc: 'mdi-file-outline',
				},
                items: this.$help.items,
			};
        },

		watch: {

            visible(visible) {

                this.showModal = visible;

                if (visible) {
                	if (this.$refs.drawer) {
						setTimeout(() => {
							this.$refs.search.focus();
						});
						this.$refs.drawer.init();
					}
				}
			},

            showModal(visible) {
                if (!visible) {
                    this.$root.help.visible = false;
				}
			},

			active: {
            	deep: true,
				handler: function() {
            		if (!this.isPermanent) {
            			this.sidebar.opened = false;
					}
				}
			}
		}
    });
</script>

<style lang="scss" scoped>
	.inner-shadow {
		box-shadow: inset -1rem 0 0.5rem -1rem rgba(0, 0, 0, 0.25);
	}
</style>
