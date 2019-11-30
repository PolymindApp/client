<template>
	<v-dialog v-model="showModal" fullscreen hide-overlay transition="dialog-bottom-transition">
		<v-card color="transparent" class="d-flex flex-column fill-height grey lighten-2">
			<v-toolbar style="flex: 0" dark color="primary" class="default-gradient">
				<v-icon left>mdi-book</v-icon>
				<v-toolbar-title v-text="$t('help.title')"></v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn icon dark @click="$root.help.visible = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-toolbar>
			<v-row style="flex: 1" no-gutters>
				<v-col cols="6" md="3" class="pa-4 inner-shadow">

					<v-text-field ref="search" v-model="filter" :disabled="items.length === 0" clearable solo :label="$t('help.filterPlaceholder')" prepend-inner-icon="mdi-magnify" hide-details />

					<v-alert v-if="items.length === 0" type="warning" text tile colored-border border="bottom" class="mt-4 white">
						{{$t('help.noItems')}}
					</v-alert>

					<v-treeview
						v-model="tree"
						:active.sync="active"
						:open.sync="open"
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
				</v-col>
				<v-col cols="6" md="9" class="white d-flex">
					<v-scroll-y-transition mode="out-in">
						<v-card v-if="active.length > 0" :key="active[0].key" color="transparent" tile flat class="pa-8 align-self-start">
							<component :is="active[0].component"></component>
						</v-card>
						<v-card v-else color="transparent" tile flat class="pa-8 d-flex align-center flex-column align-self-center text-center w-100">
							<img src="../assets/images/polymind.svg" height="128" />
							<div class="very-limited-content mt-2">
								<h2 class="display-1" v-text="$t('help.noSelectTitle')"></h2>
								<p class="overline" v-text="$t('help.noSelectDesc')"></p>
							</div>
						</v-card>
					</v-scroll-y-transition>
				</v-col>
			</v-row>
		</v-card>
	</v-dialog>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'Help',

        props: ['visible'],

        components: {},

        mounted() {

        },

        destroyed() {

        },

        methods: {

		},

        computed: {

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
            //             let item = {...entry};
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
                showModal: false,
                filter: '',
                open: ['Components'],
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
                    this.$nextTick(() => {
                    	this.$refs.search.focus();
					});
				}
			},

            showModal(visible) {
                if (!visible) {
                    this.$root.help.visible = false;
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
