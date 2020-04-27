<template>
	<v-sheet :disabled="isDeleted" class="panel-overflow d-flex flex-column w-100" tile>

		<DeleteDialog ref="deleteModal" @delete="remove(true)" />

		<v-tabs ref="tabs" style="flex: 0" v-model="tab" background-color="rgba(0, 0, 0, 0.1)" @change="updateTab()">
			<v-tab :to="'/dataset/' + id + '/settings'" exact>
				<v-icon left>mdi-pencil-box-outline</v-icon>
				{{$t('dataset.settings.title')}}
			</v-tab>
			<v-tab :to="'/dataset/' + id + '/data'" :disabled="dataset.is_remote" exact>
				<v-icon left>mdi-database-edit</v-icon>
				{{$t('dataset.data.title')}}
			</v-tab>
<!--			<v-tab :to="'/dataset/' + id + '/view'" exact>-->
<!--				<v-icon left>mdi-view-module</v-icon>-->
<!--				{{$t('dataset.view.title')}}-->
<!--			</v-tab>-->

			<v-spacer></v-spacer>

			<div class="d-flex align-center">
				<template v-if="contextualComponent.component && !isDeleted">
					<component :is="contextualComponent.component" v-bind="contextualComponent.props" v-on="contextualComponent.listeners"></component>
					<v-divider class="mx-4" vertical inset></v-divider>
				</template>

				<v-btn :disabled="isDeleted" @click="$comments.open(id, 'dataset')" class="mr-4" text small>
					<v-icon left>mdi-comment</v-icon>
					{{$t('comment.btnTitle')}}
					<v-chip v-if="commentCount > 0" class="ml-2" color="primary" x-small v-text="commentCount" />
				</v-btn>
			</div>
		</v-tabs>

		<div v-if="isDeleted">
			<v-alert dark prominent type="error" class="mb-0" tile>
				<span v-text="$t('dataset.isDeleted')"></span>
			</v-alert>
		</div>

		<v-tabs-items touchless ref="tabsItems" class="grey lighten-4" :style="{ flex: 1, overflow: (tab !== '/dataset/' + id + '/source') ? 'auto' : null }" v-model="tab">
			<v-tab-item :value="'/dataset/' + id + '/settings'" class="pa-4 fill-height">
				<div style="height: 0">
					<Settings :dataset.sync="dataset" :form-errors="formErrors" @update:dataset="compareJsonJob($event, 0)" @update="updateTab" />
				</div>
			</v-tab-item>
			<v-tab-item :value="'/dataset/' + id + '/data'" class="fill-height">
				<div style="height: 0">
					<Data ref="data" :dataset.sync="dataset" :original-dataset.sync="originalDataset" :scrolling-ref="$refs.tabsItems" :form-errors="formErrors" @context="setContext" @refresh="refresh()" @update:dataset="compareJsonJob" />
				</div>
			</v-tab-item>
<!--			<v-tab-item :value="'/dataset/' + id + '/view'" class="white fill-height">-->
<!--				<div style="height: 0">-->
<!--					<Views :dataset.sync="dataset" :form-errors="formErrors" />-->
<!--				</div>-->
<!--			</v-tab-item>-->
		</v-tabs-items>

		<v-toolbar ref="actions" style="flex: 0; border-top: #ccc solid 1px" flat tile>

			<v-btn :disabled="!dataHasChanged" @click="save()" color="primary" class="mr-1">
				<v-icon left>mdi-content-save</v-icon>
				{{$t('modal.save')}}
			</v-btn>

			<v-btn :disabled="!dataHasChanged" @click="reset()" text>
				{{$t('modal.cancel')}}
			</v-btn>

			<v-spacer></v-spacer>

			<v-menu max-height="450" offset-y>
				<template v-slot:activator="{ on }">
					<v-btn :disabled="revisions.length === 0" class="float-right mr-4" v-on="on" text>
						<v-icon :left="$vuetify.breakpoint.mdAndUp">mdi-history</v-icon>
						<span v-if="$vuetify.breakpoint.mdAndUp">{{$t('revision.btnTitle')}}</span>
						<v-icon right>mdi-chevron-up</v-icon>
					</v-btn>
				</template>
				<v-list>
					<v-list-item-group v-model="revisionOffset" color="primary">
						<v-list-item v-for="(revision, index) in revisions" :key="index" @click="loadRevision(index)">
							<v-list-item-avatar>
								<UserAvatar :size="48" :user="revision.activity.action_by" />
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title>{{revision.activity.action_by | userScreenName }}</v-list-item-title>
								<v-list-item-subtitle>{{ revision.data.modified_on }}</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
					</v-list-item-group>
				</v-list>
			</v-menu>

			<v-menu offset-y top>
				<template v-slot:activator="{ on }">
					<v-btn v-on="on" icon>
						<v-icon>mdi-dots-vertical</v-icon>
					</v-btn>
				</template>
				<v-list>
					<v-list-item :disabled="isDeleted || isNew" @click="remove()">
						<v-list-item-icon><v-icon>mdi-delete</v-icon></v-list-item-icon>
						<v-list-item-title>{{$t('modal.delete')}}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-toolbar>
	</v-sheet>
</template>

<script>
import Vue from 'vue';
import Data from "./Dataset/Data";
import Views from "./Dataset/Views";
import Settings from "./Dataset/Settings";
import {
	Hash,
	DatasetService,
	Dataset,
	DeploymentService,
	DatasetColumn,
	DatasetRow,
	DatasetCell,
	Model,
	Transaction,
	Component
} from "@polymind/sdk-js";
import DeleteDialog from "../../components/DeleteDialog";
import UserAvatar from "../../components/UserAvatar";

const beforeRoute = function(to, from, next) {

	if (to.params.id === from.params.id) {
		return next();
	}

	if (to.params.id === 'new') {
		to.meta.dataset = new Dataset();
		next();
	} else {
		DatasetService.get(to.params.id, true)
			.then(response => {
				to.meta.dataset = new Dataset(response.data);
				next();
			})
			.catch(error => next('/404'));
	}
};

let jsonJobTimeout = null;

export default Vue.extend({

	components: { Views, Data, Settings, DeleteDialog, UserAvatar },

	beforeRouteEnter: beforeRoute,

	beforeRouteUpdate(to, from, next) {
		beforeRoute(to, from, () => {
			next();
			this.$nextTick(() => {
				this.init(to.params.id !== from.params.id);
				this.$forceUpdate();
			});
		});
	},

	created() {
		this.init();
	},

	mounted() {
		this.$shortcuts.add(this.$t('shortcuts.dataset.save.title'), this.$t('shortcuts.dataset.save.desc'), 'dataset', ['ControlLeft', 'KeyS'], this.shortcutSave);
	},

	destroyed() {
		this.$shortcuts.remove(this.shortcutSave);
	},

	methods: {

		init(load = true) {
			this.originalDataset = this.$route.meta.dataset;
			this.dataset = this.$route.meta.dataset;
			this.tab = '/dataset/' + this.id + '/' + this.$route.params.section;
			this.updateTab();

			if (load) {
				this.loadRevisions();
			}
		},

		setContext(component, props, listeners) {
			this.contextualComponent.component = component;
			this.contextualComponent.props = props;
			this.contextualComponent.listeners = listeners;
		},

		shortcutSave(event) {
			if (this.dataHasChanged) {
				this.save();
			}

			event.preventDefault();
		},

		updateTab() {

			//this.contextualComponent.component = false;
			//this.contextualComponent.props = null;
			//this.contextualComponent.listeners = null;

			const section = (this.$route.params.section ? this.$route.params.section : 'edit');
			const sectionTitle = this.isNew ? this.$t('dataset.newTitle') : this.dataset.name;
			const thirdTitle = this.$t('dataset.' + section + '.title');

			this.$root.breadcrumbs = [
				this.$t('title.dataset'),
				sectionTitle,
				thirdTitle,
			];
			document.title = this.dataset.name + ' - ' + this.$t('title.dataset');

			setTimeout(() => {
				const event = new Event('resize');
				window.dispatchEvent(event);
			});
		},

		updateOriginalData() {
			this.originalDataset = new Dataset(this.$deepClone(this.dataset));
			this.originalDatasetJson = JSON.stringify(this.originalDataset);
		},

		loadRevision(offset) {

			this.load(offset);
		},

		loadRevisions() {

			DatasetService.getRevisions(this.id)
					.then(response => {
						this.revisions = response.data.reverse();
						this.revisionOffset = 0;
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
		},

		load(revisionOffset) {

			this.formErrors = [];

			if (!this.isNew) {

				this.$root.isLoading = true;
				DatasetService.get(this.id, true, revisionOffset)
					.then(response => {
						this.dataset = new Dataset(response.data);
						this.updateOriginalData();
						this.updateTab();
						this.compareJsonJob(this.dataset, 0);
					})
					.catch(error => {
						if (error.code === 203) {
							return this.$router.replace('/404');
						}
						this.$handleError(this, error);
					})
					.finally(() => this.$root.isLoading = false);
			}
		},

		reset() {
			this.dataset = new Dataset(this.$deepClone(this.originalDataset));
			this.compareJsonJob(this.dataset, 0);
			this.$emit('cancel');
		},

		initializeValues() {
			this.isDeleted = false;
			this.dataset = new Dataset({
				columns: [ new DatasetColumn() ],
				rows: [ new DatasetRow({
					cells: [ new DatasetCell() ],
				}) ],
			});
		},

		save() {

			const transactions = this.calculateTransactions();

			this.formErrors = [];
			this.$root.isLoading = true;
			DatasetService.save(transactions)
				.then(response => {

					this.$root.$emit('DATASET_UPDATE');
					this.$root.isSaved = true;

					if (this.isNew) {
						return this.$router.push('/dataset/' + response.dataset[0].data.id);
					}

					this.updateOriginalData();
					this.compareJsonJob(this.component, 0);
					this.loadRevisions();
					this.updateTab();
				})
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
		},

		remove(force = false) {

			if (force) {
				this.$root.isLoading = true;
				DatasetService.remove(this.id)
					.then(response => {
						this.isDeleted = true;
						this.$refs.deleteModal.hide();
						this.$root.$emit('DATASET_UPDATE');
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
			} else {
				this.$refs.deleteModal.show();
			}
		},

		refresh() {
			this.load();
		},

		compareJsonJob(dataset, delay = 1000) {

			clearTimeout(jsonJobTimeout);
			jsonJobTimeout = setTimeout(() => {
				this.datasetJson = JSON.stringify(dataset);
			}, delay);
		},

		calculateTransactions() {

			const transactions = [];

			const getTransactions = (collection, list, originalList, getRelations = () => { return {}; }) => {

				const transactions = [];
				list.forEach((item, itemIdx) => {
					const props = {};
					if (item.id === null) {
						props.action = 'insert';
						props.guid = item.guid;
						props.data = new Model(item).flat(false);

						const relations = getRelations(item, itemIdx);
						if (Object.keys(relations).length > 0) {
							Object.assign(props, { relations });
						}
					} else {

						const originalItem = originalList.find(originalItem => originalItem.guid === item.guid);
						if (!originalItem) {

							if (item.id) {
								props.action = 'delete';
								props.id = item.id;
							}

						} else {

							const diff = {};
							const itemKeys = Object.keys(item);
							const originalKeys = Object.keys(originalItem);
							itemKeys.forEach((itemKey, keyIdx) => {
								if (item[itemKey] instanceof Object) {
									return;
								}
								if (item[itemKey] !== originalItem[originalKeys[keyIdx]]) {
									diff[itemKey] = item[itemKey];
								}
							});

							if (Object.keys(diff).length > 0) {
								props.action = 'update';
								props.id = item.id;
								props.data = new Model(diff).flat(true);
							}
						}
					}

					if (props.action) {
						Object.assign(props, {
							collection,
						});
						transactions.push(new Transaction(props));
					}
				});

				// When verifying the new list, if an item has been removed from the original, the comparision logic
				// doesn't take into account the opposite (if removed from original).. so we do that check here and
				// merge the results. Transactions from newest items takes priority over those from original items.
				originalList.forEach(originalItem => {
					const item = list.find(item => item.guid === originalItem.guid);
					if (!item && originalItem.id !== null) {
						const props = {
							action: 'delete',
							collection,
							id: originalItem.id,
						};
						transactions.push(new Transaction(props));
					}
				});

				return transactions;
			};

			if (!this.dataset.id) {
				transactions.push(new Transaction({
					action: 'insert',
					guid: this.dataset.guid,
					collection: 'dataset',
					data: new Model(this.dataset).flat(),
				}));
			}

			const rowTransactions = getTransactions('dataset_row', this.dataset.rows, this.originalDataset.rows, (item, index) => {
				return {
					dataset: this.dataset.id ? ['id', 'dataset', this.dataset.id] : ['guid', 'dataset', this.dataset.guid],
				};
			});
			if (rowTransactions.length > 0) {
				transactions.push(...rowTransactions);
			}

			const columnTransactions = getTransactions('dataset_column', this.dataset.columns, this.originalDataset.columns, (item, index) => {
				return {
					dataset: this.dataset.id ? ['id', 'dataset', this.dataset.id] : ['guid', 'dataset', this.dataset.guid],
				};
			});
			if (columnTransactions.length > 0) {
				transactions.push(...columnTransactions);
			}

			const cells = this.dataset.rows.map(row => row.cells).flat();
			const originalCells = this.originalDataset.rows.map(row => row.cells).flat();
			const cellTransactions = getTransactions('dataset_cell', cells, originalCells, (item, index) => {
				const row = this.dataset.rows.find(row => row.cells.find(cell => cell.guid === item.guid));
				const columnIdx = row.cells.findIndex(cell => cell.guid === item.guid);
				const column = this.dataset.columns[columnIdx];
				return {
					dataset_row: row.id ? ['id', 'dataset_row', row.id] : ['guid', 'dataset_row', row.guid],
					dataset_column: column.id ? ['id', 'dataset_column', column.id] : ['guid', 'dataset_column', column.guid],
				};
			});
			if (cellTransactions.length > 0) {
				transactions.push(...cellTransactions);
			}

			return transactions;
		},
	},

	computed: {

		id() {
			return parseInt(this.$route.params.id);
		},

		isNew() {
			return this.$route.params.id === 'new';
		},

		dataHasChanged() {
			return this.datasetJson !== this.originalDatasetJson;// || this.transactions.length > 0;
		},
	},

	data() {
		return {
			contextualComponent: {
				component: false,
				props: null,
				listeners: null,
			},
			revisions: [],
			revisionOffset: 0,
			commentCount: 0,
			worker: null,
			isDeleted: false,
			formErrors: [],
			originalDataset: new Dataset({
				columns: [ new DatasetColumn() ],
				rows: [ new DatasetRow({
					cells: [ new DatasetCell() ],
				}) ],
			}),
			originalDatasetJson: null,
			datasetJson: null,
			dataset: new Dataset({
				columns: [ new DatasetColumn() ],
				rows: [ new DatasetRow({
					cells: [ new DatasetCell() ],
				}) ],
			}),
		}
	},
});
</script>

<style lang="scss" scoped>
	.v-tabs-items::v-deep .v-window__container {
		height: 100%;
	}
	.panel-overflow[disabled] {

		&::v-deep td {
			pointer-events: none;
		}
		&::v-deep .v-pagination,
		&::v-deep .v-btn:not(.restore-deleted),
		&::v-deep .v-simple-checkbox,
		&::v-deep .v-input {
			opacity: 0.5;
			pointer-events: none;
		}
	}
</style>
