<template>
	<v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable max-width="500px">
		<v-card color="transparent" class="d-flex flex-column fill-height grey lighten-2">
			<v-toolbar style="flex: 0" dark color="primary" class="default-gradient">
				<v-icon left>mdi-book</v-icon>
				<v-toolbar-title v-text="$t('media.title')"></v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn icon dark @click="show = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-toolbar>
			<v-row style="flex: 1" class="overflow-hidden" no-gutters>
				<v-col cols="4" md="2" class="pa-4 inner-shadow">

					<v-treeview
						v-model="types.tree"
						:active.sync="types.active"
						:open.sync="types.open"
						:items="types.items"
						item-key="key"
						class="mt-4"
						dense
						rounded
						open-all
						activatable
						selected-color="primary"
						open-on-click
						return-object
					>
						<template v-slot:prepend="{ item, open }">
							<v-icon v-if="item.type === 'cat'">
								{{ types.open ? 'mdi-folder-open' : 'mdi-folder' }}
							</v-icon>
							<v-icon v-else>
								{{ item.icon || fileTypes[item.type] }}
							</v-icon>
						</template>
					</v-treeview>

					<v-divider v-if="tags.items[0].children.length > 0" class="my-4"></v-divider>

					<v-text-field v-if="tags.items[0].children.length > 0" ref="search" v-model="filter" :disabled="tags.items.length === 0" clearable solo :label="$t('mediaBrowser.filterPlaceholder')" prepend-inner-icon="mdi-magnify" hide-details />

					<v-treeview
						v-model="tags.tree"
						:active.sync="tags.active"
						:open.sync="tags.open"
						:items="tags.items"
						:search="filter"
						v-if="tags.items[0].children.length > 0"
						item-key="key"
						class="mt-4"
						dense
						rounded
						open-all
						selectable
						selected-color="primary"
						open-on-click
						return-object
					>
						<template v-slot:prepend="{ item, open }">
							<v-icon v-if="item.type === 'cat'">
								{{ tags.open ? 'mdi-folder-open' : 'mdi-folder' }}
							</v-icon>
							<v-icon v-else>
								{{ item.icon || fileTypes[item.type] }}
							</v-icon>
						</template>
					</v-treeview>
				</v-col>
				<v-col cols="8" md="10" class="grey lighten-4 overflow-auto fill-height">
					<v-scroll-y-transition mode="out-in">
						<v-card v-if="types.active.length > 0" :key="types.active[0].key" color="transparent" tile flat class="pa-8">
							<v-row>
								<v-col :key="index" v-for="(file, index) in files" class="d-flex align-center justify-center">
									<v-card class="pa-2">
										<v-img :src="file.data.thumbnails[0].url" max-height="150" max-width="200" @error="handleError">
											<template v-slot:placeholder>
												<v-row class="fill-height pa-2" no-gutters align="center" justify="center">
													<v-progress-circular v-if="errors.indexOf(file.url) === -1" indeterminate color="primary"></v-progress-circular>
													<template v-else>
														<v-icon>mdi-close</v-icon>
														Image failed
													</template>
												</v-row>
											</template>
										</v-img>
									</v-card>
								</v-col>
							</v-row>
						</v-card>
						<v-card v-else color="transparent" tile flat class="pa-8 w-100">
							Please select
						</v-card>
					</v-scroll-y-transition>
				</v-col>
			</v-row>

			<v-card-actions>
				<v-spacer></v-spacer>

				<v-btn color="primary" :disabled="selected.length === 0" @click="add()">
					<v-icon left>mdi-database-export</v-icon>
					{{$t('modal.add')}}
				</v-btn>

				<v-btn @click="show = false">
					{{$t('modal.cancel')}}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
    import Vue from 'vue';
    import File from '../utils/File';
    import FileService from "../services/FileService";

    export default Vue.extend({

        name: 'MediaBrowser',

        props: ['visible', 'value'],

        components: {},

        mounted() {
			if (this.show) {
				this.load();
			}
        },

        destroyed() {

        },

        methods: {

            handleError(url) {
                if (this.errors.indexOf(url) === -1) {
                    this.errors.push(url);
				}
			},

            load() {
                this.$root.isLoading = true;
                FileService.getAll.bind(this)().then(files => {
                    this.files = files.data;
                })
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
			},

            add() {

                File.promptFileDialog(files => {
                    console.log(files);
                }, 'image/jpg', 'image/jpeg', 'image/png', 'image/gif');
			},
		},

        computed: {

		},

        data() {
            return {
                show: this.visible,
				errors: [],
				selected: [],
                filter: null,
				files: [],
                fileTypes: {
                    doc: 'mdi-file-outline',
                },
                types: {
                    open: [],
                    tree: [],
                    active: ['all'],
                    items: [
                        { key: 'all', name: this.$t('mediaBrowser.types.all'), icon: 'mdi-file-multiple-outline' },
                        { key: 'image', name: this.$t('mediaBrowser.types.images'), icon: 'mdi-image-outline' },
                        { key: 'audio', name: this.$t('mediaBrowser.types.audios'), icon: 'mdi-library-music-outline' },
                        { key: 'other', name: this.$t('mediaBrowser.types.others'), icon: 'mdi-file-outline' },
                    ],
				},
				tags: {
                    open: [],
                    tree: [],
                    active: [],
                    items: [
                        { key: 'tags', name: this.$t('mediaBrowser.types.tags'), icon: 'mdi-tag-multiple', children: [
							{ key: 'tag1', name: 'Tag1' },
							{ key: 'tag2', name: 'Tag2' },
							{ key: 'tag3', name: 'Tag3' },
						] },
                    ],
				},
			};
        },

		watch: {

            visible(visible) {
                this.show = visible;

                if (visible) {
                    this.load();
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
