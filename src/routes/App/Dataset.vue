<template>
	<v-sheet tile :disabled="isDeleted" class="panel-overflow d-flex flex-column" style="width: 100%;">

		<DeleteDialog ref="deleteModal" @delete="remove(true)" />

		<v-tabs ref="tabs" show-arrows style="flex: 0" v-model="tab" background-color="rgba(0, 0, 0, 0.1)" @change="updateTab()">
			<v-tab :to="'/dataset/' + id + '/settings'" exact>
				<v-icon left>mdi-pencil-box-outline</v-icon>
				{{$t('dataset.settings.title')}}
			</v-tab>
			<v-tab :to="'/dataset/' + id + '/data'" exact>
				<v-icon left>mdi-database-edit</v-icon>
				{{$t('dataset.data.title')}}
			</v-tab>
			<v-tab :to="'/dataset/' + id + '/view'" exact>
				<v-icon left>mdi-view-module</v-icon>
				{{$t('dataset.view.title')}}
			</v-tab>
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

		<v-tabs-items ref="tabsItems" class="grey lighten-4" style="flex: 1; overflow: auto" v-model="tab">
			<v-tab-item :value="'/dataset/' + id + '/settings'" class="white pa-4 fill-height">
				<div style="height: 0">
					<Settings :dataset.sync="dataset" :form-errors="formErrors" @update="updateTab" />
				</div>
			</v-tab-item>
			<v-tab-item :value="'/dataset/' + id + '/data'" class="fill-height">
				<div style="height: 0">
					<Data :dataset.sync="dataset" :transactions.sync="transactions" :scrolling-ref="$refs.tabsItems" :form-errors="formErrors" @update:dataset="compareJsonJob" />
				</div>
			</v-tab-item>
			<v-tab-item :value="'/dataset/' + id + '/view'" class="white fill-height">
				<div style="height: 0">
					<Views :dataset.sync="dataset" :form-errors="formErrors" />
				</div>
			</v-tab-item>
		</v-tabs-items>

		<v-card flat class="pa-4" style="flex: 0; border-radius: 0">
			<v-btn :disabled="!dataHasChanged" @click="save()" color="primary" class="mr-1">
				<v-icon left>mdi-content-save</v-icon>
				{{$t('modal.save')}}
			</v-btn>
			<v-btn :disabled="!dataHasChanged" @click="reset()" text>
				{{$t('modal.cancel')}}
			</v-btn>
			<v-btn :disabled="isNew || isDeleted" @click="remove()" class="float-right" text color="error">
				<v-icon :left="$vuetify.breakpoint.mdAndUp">mdi-delete</v-icon>
				<span v-if="$vuetify.breakpoint.mdAndUp">{{$t('modal.delete')}}</span>
			</v-btn>
		</v-card>
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
// import {VSkeletonLoader} from "vuetify";

let jsonJobTimeout = null;

export default Vue.extend({

	components: { Views, Data, Settings, DeleteDialog },

	mounted() {
		this.initializeValues();
		this.load();
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

			this.id = this.$route.params.id;
			this.isNew = this.$route.params.id === 'new';

			setTimeout(() => {
				const event = new Event('resize');
				window.dispatchEvent(event);
			});
		},

		updateOriginalData() {
			this.originalDataset = this.$deepClone(this.dataset);
			this.originalDatasetJson = JSON.stringify(this.originalDataset);
		},

		load() {

			this.formErrors = [];

			if (!this.isNew) {
				this.$root.isLoading = true;
				DatasetService.get.bind(this)(this.id, true)
					.then(response => {
						this.id = response.data.id;
						this.isNew = false;
						this.dataset = Object.assign(new Dataset(), response.data);
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
			} else {
				// this.$root.isLoading = true;
				// DatasetService.get.bind(this)(1)
				//     .then(response => {
				//         this.initializeValues();
				//         // this.dataset.html = response.data.html;
				//         // this.dataset.js = response.data.js;
				//         // this.dataset.scss = response.data.scss;
				//         this.updateOriginalData();
				//         this.updateTab();
				// this.compareJsonJob(this.dataset, 0);
				//     })
				//     .catch(error => {
				//         if (error.response.status === 404) {
				//             this.$router.push('/404')
				//         }
				//         this.$handleError(this, error);
				//     })
				//     .finally(() => this.$root.isLoading = false);
			}
		},

		reset() {
			this.dataset = this.$deepClone(this.originalDataset);
			this.transactions.splice(0, this.transactions.length);
			this.compareJsonJob(this.dataset, 0);
			this.$emit('cancel');
		},

		initializeValues() {
			this.dataset = new Dataset();
		},

		save() {

			this.formErrors = [];
			this.$root.isLoading = true;
			DatasetService.save.bind(this)(this.id !== 'new' ? this.id : null, this.dataset, this.transactions)
				.then(response => {
					this.id = response.data.id;
					this.isNew = false;
					this.updateOriginalData();
					this.transactions.splice(0, this.transactions.length);
					this.$root.isSaved = true;
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
		}
	},

	computed: {

		dataHasChanged() {
			return this.datasetJson !== this.originalDatasetJson || this.transactions.length > 0;
		},
	},

	data() {
		return {
			transactions: [],
			worker: null,
			id: this.$route.params.id,
			isNew: this.$route.params.id === 'new',
			isDeleted: false,
			formErrors: [],
			tab: '/dataset/new/edit',
			originalDataset: {},
			originalDatasetJson: null,
			datasetJson: null,
			dataset: {},
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
