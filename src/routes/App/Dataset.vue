<template>
	<v-card :disabled="isDeleted" class="panel-overflow d-flex flex-column w-100" tile>

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

			<v-spacer></v-spacer>

			<div class="d-flex align-center">
				<DataActions ref="actions" :dataset="dataset" @refresh="refresh()" />

				<v-menu offset-y>
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" target="_blank" :loading="sessionLoading" :disabled="!canTest" class="ml-2" text small>
							<v-icon left>mdi-test-tube</v-icon>
							<span v-text="$t('dataset.test')"></span>
							<v-icon right>mdi-chevron-down</v-icon>
						</v-btn>
					</template>
					<v-list dense>
						<template v-for="(component, componentIdx) in $root.components">
							<v-list-item :key="component.guid" @click="test(component)">
								<v-list-item-icon>
									<v-icon>{{ component.icon }}</v-icon>
								</v-list-item-icon>
								<v-list-item-title>{{ component.name }}</v-list-item-title>
							</v-list-item>
						</template>
					</v-list>
				</v-menu>

				<v-divider class="mx-4" vertical inset></v-divider>

				<v-btn @click="$comments.open(id, 'dataset')" class="mr-2" text small>
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
					<Data ref="data" :dataset.sync="dataset" :scrolling-ref="$refs.tabsItems" :form-errors="formErrors" @update:dataset="compareJsonJob" />
				</div>
			</v-tab-item>
		</v-tabs-items>

<!--		{{calculateTransactions().flat().length}}-->
<!--		<pre style="max-height: 75px; overflow: auto" v-text="calculateTransactions().flat()"></pre>-->

		<v-toolbar style="flex: 0; border-top: #ccc solid 1px" flat tile>

			<v-btn :disabled="!dataHasChanged" @click="save()" color="primary" class="mr-1">
				<v-icon left>mdi-content-save</v-icon>
				{{$t('modal.save')}}
			</v-btn>

			<v-btn :disabled="!dataHasChanged" @click="reset()" text>
				{{$t('modal.cancel')}}
			</v-btn>

			<v-spacer></v-spacer>

			<v-menu max-height="450" v-model="revisionMenu" offset-y>
				<template v-slot:activator="{ on }">
					<v-btn :disabled="revisions.length === 0 && revisionLoaded" class="float-right mr-4" @click="loadRevisions()" :loading="revisionLoading" text>
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
					<v-list-item :disabled="isNew" @click="remove()">
						<v-list-item-icon><v-icon>mdi-delete</v-icon></v-list-item-icon>
						<v-list-item-title>{{$t('modal.delete')}}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-toolbar>
	</v-card>
</template>

<script>
import Vue from 'vue';
import Data from "./Dataset/Data";
import Settings from "./Dataset/Settings";
import { DatasetService, Dataset, DatasetColumn, DatasetRow, DatasetCell, Model, Transaction, StrategySessionService, StrategySession } from "@polymind/sdk-js";
import DeleteDialog from "../../components/DeleteDialog";
import UserAvatar from "../../components/UserAvatar";
import DataActions from "./Dataset/Contextual/Actions";

const beforeRoute = function(to, from, callback) {

	if (to.params.id === from.params.id) {
		return callback();
	}

	if (to.params.id === 'new') {
		to.meta.dataset = new Dataset({
			columns: [
				new DatasetColumn()
			],
			rows: [
				new DatasetRow()
			],
		});
		callback();
	} else {
		DatasetService.get(to.params.id, true)
			.then(response => {
				to.meta.dataset = new Dataset(response.data);
				if (response.data.is_remote && to.params.section === 'data') {
					callback('/dataset/' + to.params.id + '/settings');
				}
				callback();
			})
			.catch(error => callback('/404'));
	}
};

let jsonJobTimeout = null;

export default Vue.extend({

	components: { Data, Settings, DeleteDialog, UserAvatar, DataActions },

	beforeRouteEnter(to, from, next) {
		beforeRoute(to, from, (param) => next(param));
	},

	beforeRouteUpdate(to, from, next) {
		beforeRoute(to, from, (param) => {
			next(param);
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
			this.dataset = this.$route.meta.dataset;
			this.tab = '/dataset/' + this.id + '/' + this.$route.params.section;
			this.updateOriginalData();
			this.compareJsonJob(this.dataset, 0);
			this.updateTab();
			this.isDeleted = false;
		},

		shortcutSave(event) {
			if (this.dataHasChanged) {
				this.save();
			}

			event.preventDefault();
		},

		updateTab() {

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

			this.revisionLoading = true;
			DatasetService.getRevisions(this.id)
					.then(response => {
						this.revisions = response.data.reverse();
						this.revisionOffset = 0;
						this.revisionLoaded = true;
						this.revisionMenu = true;
						this.revisionLoading = false;
					})
					.catch(error => this.$handleError(this, error));
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

			this.$refs.actions.exportCSV();

			const transactions = this.calculateTransactions();

			this.formErrors = [];
			this.$root.isLoading = true;
			DatasetService.save(transactions)
				.then(response => {

					this.updateTransactions(response);

					this.$root.isSaved = true;

					if (this.isNew) {
						this.$root.datasets.push(new Dataset(response.dataset[0].result.data));
						return this.$router.push('/dataset/' + response.dataset[0].result.data.id);
					} else {
						const dataset = this.$root.datasets.find(dataset => dataset.id === response.dataset[0].result.data.id);
						Object.assign(dataset, new Dataset(response.dataset[0].result.data));
					}

					this.updateOriginalData();
					this.compareJsonJob(this.dataset, 0);
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

						const datasetIdx = this.$root.datasets.findIndex(dataset => dataset.id === this.id);
						this.$root.datasets.splice(datasetIdx, 1);
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

			/**
			 * Get dataset's transactions
			 */
			const datasetTransactions = getTransactions('dataset', [this.dataset], [this.originalDataset]);
			if (datasetTransactions.length > 0) {
				transactions.push(...datasetTransactions);
			}

			/**
			 * Get rows' transactions
			 */
			const rowTransactions = getTransactions('dataset_row', this.dataset.rows, this.originalDataset.rows, (item, index) => {
				return {
					dataset: this.dataset.id ? ['id', 'dataset', this.dataset.id] : ['guid', 'dataset', this.dataset.guid],
				};
			});
			if (rowTransactions.length > 0) {
				transactions.push(...rowTransactions);
			}

			/**
			 * Get columns' transactions
			 */
			const columnTransactions = getTransactions('dataset_column', this.dataset.columns, this.originalDataset.columns, (item, index) => {
				return {
					dataset: this.dataset.id ? ['id', 'dataset', this.dataset.id] : ['guid', 'dataset', this.dataset.guid],
				};
			});
			if (columnTransactions.length > 0) {
				transactions.push(...columnTransactions);
			}

			/**
			 * Get cells' transactions
			 */
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

		updateTransactions(updates) {

			const updateTypes = ['insert', 'update'];

			if (Array.isArray(updates.dataset_column)) {
				updates.dataset_column.forEach(newColumn => {
					this.dataset.columns = this.dataset.columns.map(oldColumn => {
						if (updateTypes.indexOf(newColumn.type) !== -1 && oldColumn.guid === newColumn.result.data.guid) {
							return new DatasetColumn(newColumn.result.data);
						}
						return oldColumn;
					});
				});
			}

			if (Array.isArray(updates.dataset_row)) {
				updates.dataset_row.forEach(newRow => {
					this.dataset.rows = this.dataset.rows.map(oldRow => {
						if (updateTypes.indexOf(newRow.type) !== -1 && oldRow.guid === newRow.result.data.guid) {
							const row = new DatasetRow(newRow.result.data);
							row.cells = oldRow.cells;
							return row;
						}
						return oldRow;
					});
				});
			}

			if (Array.isArray(updates.dataset_cell)) {
				this.dataset.rows = this.dataset.rows.map(row => {
					row.cells = row.cells.map(oldCell => {
						for (let i = 0; i < updates.dataset_cell.length; i++) {
							const newCell = updates.dataset_cell[i];
							if (updateTypes.indexOf(newCell.type) !== -1 && oldCell.guid === newCell.result.data.guid) {
								return new DatasetCell(newCell.result.data);
							}
						}
						return oldCell;
					});
					return row;
				});
			}
		},

		test(component) {

			this.sessionLoading = true;
			StrategySessionService.generate({
				type: 'test',
				dataset: this.id,
				component: component.id,
				parameters: component.getDefaultParameters(this.dataset),
			})
					.then(session => {
						this.session = session;
						const win = window.open(this.generatedTestUri, '_blank');
						win.focus();
					}).finally(() => this.sessionLoading = false);
		}
	},

	computed: {

		id() {
			return this.isNew ? 'new' : parseInt(this.$route.params.id);
		},

		isNew() {
			return this.$route.params.id === 'new';
		},

		dataHasChanged() {
			return this.datasetJson !== this.originalDatasetJson;// || this.transactions.length > 0;
		},

		testUri() {
			return this.playerHost + '/d/' + this.dataset.id;
		},

		generatedTestUri() {
			return this.playerHost + '/d/' + this.session.hash;
		},

		canTest() {
			if (this.isNew) {
				return false;
			}
			return !this.dataHasChanged;
		}
	},

	data() {
		return {
			playerHost: process.env.VUE_APP_PLAYER_URL,
			revisions: [],
			revisionOffset: 0,
			revisionLoading: false,
			revisionLoaded: false,
			revisionMenu: false,
			commentCount: 0,
			worker: null,
			isDeleted: false,
			formErrors: [],
			session: new StrategySession(),
			sessionLoading: false,
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
