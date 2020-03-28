<template>
	<v-sheet tile :disabled="isDeleted" class="panel-overflow d-flex flex-column" style="width: 100%;">

		<DeleteDialog ref="deleteModal" @delete="remove(true)" />

		<!-- IS FORKED -->
		<v-snackbar color="success" v-model="forkModal.forked">
			<v-icon class="white--text" left>mdi-check</v-icon>
			{{$t('snackbar.forked')}}
			<v-btn text @click="forkModal.forked = false">
				{{$t('modal.close')}}
			</v-btn>
		</v-snackbar>

		<!-- IS PUBLIED -->
		<v-snackbar color="success" v-model="publishModal.publied">
			<v-icon class="white--text" left>mdi-check</v-icon>
			{{$t('snackbar.forked')}}
			<v-btn text @click="forkModal.publied = false">
				{{$t('modal.close')}}
			</v-btn>
		</v-snackbar>

		<!-- MODAL: PUBLISH -->
		<v-dialog v-model="publishModal.visible" scrollable persistent max-width="500px">
			<v-card>
				<v-card-title>
					<v-icon color="primary" slot="icon" size="36" left>mdi-publish</v-icon>
					{{$t('dataset.publishModal.title')}}
				</v-card-title>

				<v-card-text>
					TBD
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn color="primary" @click="publish()">
						<v-icon left>mdi-publish</v-icon>
						{{$t('modal.publish')}}
					</v-btn>

					<v-btn @click="publishModal.visible = false">
						{{$t('modal.cancel')}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- MODAL: FORK -->
		<v-dialog v-model="forkModal.visible" scrollable persistent max-width="500px">
			<v-card>
				<v-card-title>
					<v-icon color="primary" slot="icon" size="36" left>mdi-directions-fork</v-icon>
					{{$t('dataset.forkModal.title')}}
				</v-card-title>

				<v-card-text>
					<span v-text="$t('dataset.forkModal.forkDesc')"></span>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn color="primary" @click="fork()">
						<v-icon left>mdi-directions-fork</v-icon>
						{{$t('modal.fork')}}
					</v-btn>

					<v-btn @click="forkModal.visible = false">
						{{$t('modal.cancel')}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-tabs ref="tabs" show-arrows style="flex: 0" v-model="tab" background-color="rgba(0, 0, 0, 0.1)" @change="updateTab()">
			<v-tab :to="'/dataset/' + id + '/settings'" exact>
				<v-icon left>mdi-pencil-box-outline</v-icon>
				{{$t('dataset.settings.title')}}
			</v-tab>
			<v-tab :to="'/dataset/' + id + '/data'" exact>
				<v-icon left>mdi-database-edit</v-icon>
				{{$t('dataset.data.title')}}
			</v-tab>
<!--			<v-tab :to="'/dataset/' + id + '/view'" exact>-->
<!--				<v-icon left>mdi-view-module</v-icon>-->
<!--				{{$t('dataset.view.title')}}-->
<!--			</v-tab>-->

			<v-spacer></v-spacer>

			<v-btn :disabled="isDeleted" @click="$comments.open(id, 'dataset')" class="mt-3 mr-4" text small>
				<v-icon left>mdi-comment</v-icon>
				{{$t('comment.btnTitle')}}
				<v-chip v-if="commentCount > 0" class="ml-2" color="primary" x-small v-text="commentCount" />
			</v-btn>

			<v-btn :disabled="isDeleted" @click="openFork()" color="grey darken-2 white--text" class="mt-3 mr-2" small>
				<v-icon left>mdi-directions-fork</v-icon>
				{{$t('modal.fork')}}
			</v-btn>

			<v-btn :disabled="!dataHasChanged || isDeleted" @click="openPublish()" color="info" class="mt-3 mr-3" small>
				<v-icon left>mdi-publish</v-icon>
				{{$t('modal.publish')}}
			</v-btn>
		</v-tabs>

		<div v-if="isDeleted">
			<v-alert dark prominent type="error">
				<v-row align="center">
					<v-col class="grow">You have flagged this database as deleted. This is your last chance to restore it.</v-col>
					<v-col class="shrink">
						<v-btn class="restore-deleted" @click="restore()">Restore</v-btn>
					</v-col>
				</v-row>
			</v-alert>
		</div>

		<v-tabs-items touchless ref="tabsItems" class="grey lighten-4" style="flex: 1; overflow: auto" v-model="tab">
			<v-tab-item :value="'/dataset/' + id + '/settings'" class="fill-height">
				<div style="height: 0">
					<Settings :dataset.sync="dataset" :form-errors="formErrors" @update:dataset="compareJsonJob($event, 0)" @update="updateTab" />
				</div>
			</v-tab-item>
			<v-tab-item :value="'/dataset/' + id + '/data'" class="fill-height">
				<div style="height: 0">
					<Data ref="data" :dataset.sync="dataset" :original-dataset.sync="originalDataset" :scrolling-ref="$refs.tabsItems" :form-errors="formErrors" @update:dataset="compareJsonJob" />
				</div>
			</v-tab-item>
			<v-tab-item :value="'/dataset/' + id + '/view'" class="white fill-height">
				<div style="height: 0">
					<Views :dataset.sync="dataset" :form-errors="formErrors" />
				</div>
			</v-tab-item>
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
							<v-list-item-title>{{ revision.data.modified_on }}</v-list-item-title>
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
import DatasetService from "../../services/DatasetService";
import DeleteDialog from "../../components/DeleteDialog";
import Dataset from "../../models/Dataset";
import DeploymentService from "../../services/DeploymentService";
import DatasetColumn from "../../models/DatasetColumn";
import DatasetRow from "../../models/DatasetRow";
import DatasetCell from "../../models/DatasetCell";
import Model from "../../models/Model";
import Transaction from "../../models/Transaction";
// import {VSkeletonLoader} from "vuetify";

let jsonJobTimeout = null;

export default Vue.extend({

	components: { Views, Data, Settings, DeleteDialog },

	mounted() {
		this.initializeValues();
		this.load();
		this.loadRevisions();
		this.updateTab();

		this.$shortcuts.add(this.$t('shortcuts.dataset.save.title'), this.$t('shortcuts.dataset.save.desc'), 'dataset', ['ControlLeft', 'KeyS'], this.shortcutSave);
	},

	destroyed() {
		this.$shortcuts.remove(this.shortcutSave);
	},

	methods: {

		shortcutSave() {
			if (this.dataHasChanged) {
				this.save();
			}
		},

		updateTab() {

			const section = (this.$route.params.section ? this.$route.params.section : 'edit');
			const sectionTitle = this.isNew ? this.$t('dataset.newTitle') : (
			    this.dataset.id
					? this.dataset.name
					: Vue.component('loading', {
					    // components: { VSkeletonLoader },
					    components: { },
					    // template: `<v-skeleton-loader type="text"></v-skeleton-loader>`,
					    template: `<div></div>`,
					})
			);
			const thirdTitle = this.$t('dataset.' + section + '.title');

			this.$root.breadcrumbs = [
				this.$t('title.dataset'),
				sectionTitle,
				thirdTitle,
			];
			document.title = sectionTitle + ' | ' + this.$t('title.dataset');

			this.isNew = this.$route.params.id === 'new';
			this.id = this.isNew ? 'new' : parseInt(this.$route.params.id);

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

			DatasetService.getRevisions.bind(this)(this.id)
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
				DatasetService.get.bind(this)(this.id, true, revisionOffset)
					.then(response => {
						this.id = response.data.id;
						this.isNew = false;
						this.dataset = new Dataset(response.data);
						this.updateOriginalData();
						this.updateTab();
						this.compareJsonJob(this.dataset, 0);
					})
					.catch(error => {
						if (error.response.status === 404) {
							this.$router.push('/404')
						}
						this.$handleError(this, error);
					})
					.finally(() => this.$root.isLoading = false);
			}
		},

		reset() {
			this.dataset = new Dataset(this.$deepClone(this.originalDataset));
			// this.transactions.splice(0, this.transactions.length);
			this.compareJsonJob(this.dataset, 0);
			this.$emit('cancel');
		},

		openFork() {
			this.forkModal.visible = true;
		},

		fork() {

			const revision = this.revisions[this.revisionOffset];

			DatasetService.fork.bind(this)(revision.id)
					.then(response => {
						this.forkModal.visible = false;
						this.$router.push('/dataset/' + response.data.id);
						this.forkModal.forked = true;
						this.$root.$emit('DATASET_UPDATE');
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
		},

		openPublish() {
			this.publishModal.visible = true;
		},

		publish(version, changelog) {

			DeploymentService.fork.bind(this)('dataset', this.id, version, changelog)
					.then(response => {
						this.publishModal.visible = false;
						this.publishModal.publied = true;
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
		},

		initializeValues() {
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
			DatasetService.save.bind(this)(this.id !== 'new' ? this.id : null, this.dataset, transactions)
				.then(([dataset, transactions] = response) => {

					if (this.id !== dataset.data.id) {
						return this.$router.push('/dataset/' + dataset.data.id);
					}

					this.id = parseInt(dataset.data.id);
					this.isNew = false;
					this.updateOriginalData();
					// this.transactions.splice(0, this.transactions.length);
					this.$root.isSaved = true;
					this.loadRevisions();
					this.updateTab();
				})
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
		},

		remove(force = false) {

			if (force) {
				this.$root.isLoading = true;
				DatasetService.remove.bind(this)(this.id)
					.then(response => {
						this.isDeleted = true;
						this.$refs.deleteModal.hide();
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
			} else {
				this.$refs.deleteModal.show();
			}
		},

		restore() {

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

			const rowTransactions = getTransactions('dataset_row', this.dataset.rows, this.originalDataset.rows);
			if (rowTransactions.length > 0) {
				transactions.push(...rowTransactions);
			}

			const columnTransactions = getTransactions('dataset_column', this.dataset.columns, this.originalDataset.columns);
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

		dataHasChanged() {
			return this.datasetJson !== this.originalDatasetJson;// || this.transactions.length > 0;
		},
	},

	data() {
		return {
			forkModal: {
				visible: false,
				forked: false,
			},
			publishModal: {
				visible: false,
				publied: false,
			},
			revisions: [],
			revisionOffset: 0,
			commentCount: 0,
			worker: null,
			id: this.$route.params.id,
			isNew: this.$route.params.id === 'new',
			isDeleted: false,
			formErrors: [],
			tab: '/dataset/new/edit',
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

	watch: {
		'$route.params.id': function() {
			this.initializeValues();
			this.updateTab();
			this.load();
		},
	}
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
