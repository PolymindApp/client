<template>
	<v-sheet :disabled="isDeleted" class="panel-overflow d-flex flex-column" style="width: 100%; border-radius: 0;">

		<DeleteDialog ref="deleteModal" @delete="remove(true)" />

		<v-tabs show-arrows style="flex: 0" v-model="tab" background-color="rgba(0, 0, 0, 0.1)" @change="updateTab()">
			<v-tab :to="'/dataset/' + id + '/settings'" exact>
				<v-icon left>mdi-pencil-box-outline</v-icon>
				{{$t('dataset.settings.title')}}
			</v-tab>
			<v-tab :to="'/dataset/' + id + '/data'" exact>
				<v-icon left>mdi-database-edit</v-icon>
				{{$t('dataset.data.title')}}
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

		<v-tabs-items style="flex: 1; overflow: auto;" v-model="tab">
			<v-tab-item :value="'/dataset/' + id + '/settings'" class="pa-4 fill-height">
				<Settings :dataset="dataset" :form-errors="formErrors" @update="updateTab" />
			</v-tab-item>
			<v-tab-item :value="'/dataset/' + id + '/data'" class="fill-height">
				<Data :dataset="dataset" :form-errors="formErrors" @update="updateDataset" />
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
import Settings from "./Dataset/Settings";
import DatasetService from "../../services/Dataset";
import DeleteDialog from "../../components/DeleteDialog";
import Dataset from "../../models/Dataset";
import {VSkeletonLoader} from "vuetify";

export default Vue.extend({

	components: { Data, Settings, DeleteDialog },

	mounted() {
		this.initializeValues();
		this.load();
		this.updateTab();
	},

	methods: {

	    updateDataset(dataset) {
            this.dataset = dataset;
		},

		updateTab() {

			const section = (this.$route.params.section ? this.$route.params.section : 'edit');
			const sectionTitle = this.isNew ? this.$t('dataset.newTitle') : (
			    this.dataset.id
					? this.dataset.name
					: Vue.component('loading', {
					    components: { VSkeletonLoader },
					    template: `<v-skeleton-loader type="text"></v-skeleton-loader>`,
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
			this.originalDataset = JSON.parse(JSON.stringify(this.dataset));
		},

		load() {

			this.formErrors = [];

			if (!this.isNew) {
				this.$root.isLoading = true;
				DatasetService.get.bind(this)(this.id)
					.then(response => {
						this.id = response.data.id;
						this.isNew = false;
						this.dataset = Object.assign(new Dataset(), response.data);
						this.updateOriginalData();
						this.updateTab();
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
			this.dataset = JSON.parse(JSON.stringify(this.originalDataset));
			this.$emit('cancel');
		},

		initializeValues() {
			this.dataset = new Dataset();
		},

		save() {

			this.formErrors = [];
			this.$root.isLoading = true;
			DatasetService.save.bind(this)(this.id !== 'new' ? this.id : null, this.dataset)
				.then(response => {
					    this.id = response.data.id;
					    this.isNew = false;
					this.updateOriginalData();
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

		}
	},

	computed: {

		dataHasChanged() {
			return JSON.stringify(this.dataset) !== JSON.stringify(this.originalDataset);
		},
	},

	data() {
		return {
			id: this.$route.params.id,
			isNew: this.$route.params.id === 'new',
			isDeleted: false,
			formErrors: [],
			tab: '/dataset/new/edit',
			originalDataset: {},
			dataset: {},
		}
	},

	watch: {
		'$route.params.id': function() {
			this.initializeValues();
			this.updateTab();
			this.load();
		}
	}
});
</script>

<style lang="scss" scoped>
	.v-tabs-items >>> .v-window__container {
		height: 100%;
	}
	.panel-overflow[disabled] {

		& >>> td {
			pointer-events: none;
		}
		& >>> .v-pagination,
		& >>> .v-btn:not(.restore-deleted),
		& >>> .v-simple-checkbox,
		& >>> .v-input {
			opacity: 0.5;
			pointer-events: none;
		}
	}
</style>
