<template>
	<v-sheet class="panel-overflow d-flex flex-column" style="width: 100%; border-radius: 0;">

		<DeleteDialog ref="deleteModal" @delete="remove(true)" />

		<v-tabs show-arrows style="flex: 0" v-model="tab" background-color="rgba(0, 0, 0, 0.1)" @change="updateTab()">
			<v-tab :to="'/strategy/' + id + '/settings'" exact>
				<v-icon left>mdi-pencil-box-outline</v-icon>
				{{$t('strategy.settings.title')}}
			</v-tab>
			<v-tab :to="'/strategy/' + id + '/interface'" exact>
				<v-icon left>mdi-code-tags</v-icon>
				{{$t('strategy.interface.title')}}
			</v-tab>
			<v-tab :to="'/strategy/' + id + '/components'" exact>
				<v-icon left>mdi-card-bulleted-settings</v-icon>
				{{$t('strategy.components.title')}}
			</v-tab>
			<v-tab :to="'/strategy/' + id + '/workflow'" exact>
				<v-icon left>mdi-flash-outline</v-icon>
				{{$t('strategy.workflow.title')}}
			</v-tab>
		</v-tabs>

		<div v-if="isDeleted">
			IS DELETED
		</div>

		<v-tabs-items style="flex: 1; overflow: auto;" v-model="tab">
			<v-tab-item :value="'/strategy/' + id + '/settings'" class="pa-4 fill-height">
				<Settings @update="updateTab()" :strategy="strategy" :form-errors="formErrors" />
			</v-tab-item>
			<v-tab-item :value="'/strategy/' + id + '/interface'" class="pa-4 fill-height">
				<Source :strategy="strategy" :form-errors="formErrors" />
			</v-tab-item>
			<v-tab-item :value="'/strategy/' + id + '/components'" class="pa-4 fill-height">
				<Params :strategy="strategy" :form-errors="formErrors" />
			</v-tab-item>
			<v-tab-item :value="'/strategy/' + id + '/workflow'" class="pa-4 fill-height">
				<Events :strategy="strategy" :form-errors="formErrors" />
			</v-tab-item>
		</v-tabs-items>

		<v-card flat class="pa-4" style="flex: 0">
			<v-btn :disabled="!dataHasChanged" @click="save()" color="primary" class="mr-1">
				{{$t('modal.save')}}
			</v-btn>
			<v-btn :disabled="!dataHasChanged" @click="reset()" text>
				{{$t('modal.cancel')}}
			</v-btn>
			<v-btn :disabled="isNew" @click="remove()" class="float-right" text color="error">
				{{$t('modal.delete')}}
			</v-btn>
		</v-card>
	</v-sheet>
</template>

<script>
import Vue from 'vue';
import Source from "./Strategy/Interface";
import Settings from "./Strategy/Settings";
import Events from "./Strategy/Components";
import Params from "./Strategy/Workflow";
import StrategyService from "../../services/StrategyService";
import DeleteDialog from "../../components/DeleteDialog";

export default Vue.extend({

	components: { Source, Settings, Params, Events, DeleteDialog },

	mounted() {
		this.initializeValues();
		this.load();
		this.updateTab();
	},

	methods: {

		updateTab() {

			const section = (this.$route.params.section ? this.$route.params.section : 'edit');
			const sectionTitle = this.$t('strategy.' + section + '.title');

			this.$root.breadcrumbs = [
				this.$t('title.strategy'),
				sectionTitle,
			];
			document.title = sectionTitle + ' | ' + this.$t('title.strategy');

			this.id = this.$route.params.id;
			this.isNew = this.$route.params.id === 'new';
		},

		updateOriginalData() {
			this.originalStrategy = this.$deepClone(this.strategy);
		},

		load() {

			this.formErrors = [];

			if (!this.isNew) {
				this.$root.isLoading = true;
				StrategyService.get.bind(this)(this.id)
					.then(response => {
						this.initializeValues();
						this.id = response.data.id;
						this.isNew = false;
						this.strategy = response.data;
						this.updateOriginalData();
					})
					.catch(error => {
						if (error.response.status === 404) {
							this.$router.push('/404')
						}
						this.$handleError(this, error);
					})
					.finally(() => this.$root.isLoading = false);
			} else {
				this.initializeValues();
                	this.updateOriginalData();
			}
		},

		reset() {
			this.strategy = this.$deepClone(this.originalStrategy);
		},

		initializeValues() {

			this.strategy = {
				name: '',
				description: '',
				is_invisible: false,
				is_public: false,
				icon: '',
				interface: null,
				workflow: [],
				components: [],
			};
		},

		save() {

			this.formErrors = [];
			this.$root.isLoading = true;
			StrategyService.save.bind(this)(this.id !== 'new' ? this.id : null, this.strategy)
				.then(response => {
					    this.id = response.data.id;
					    this.isNew = false;
					this.updateOriginalData();
					    this.$root.isSaved = true;
				})
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
		},

		remove(force = false) {

			if (force) {
				this.$root.isLoading = true;
				StrategyService.remove.bind(this)(this.id)
					.then(response => {
						this.isDeleted = true;
						this.$refs.deleteModal.hide();
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
			} else {
				this.$refs.deleteModal.show();
			}
		}
	},

	computed: {
		dataHasChanged() {
			return JSON.stringify(this.strategy) !== JSON.stringify(this.originalStrategy);
		},
	},

	data() {
		return {
			id: this.$route.params.id,
			isNew: this.$route.params.id === 'new',
			isDeleted: false,
			formErrors: [],
			tab: '/strategy/new/edit',
			originalStrategy: {},
			strategy: {},
		}
	},

	watch: {
		'$route.params.id': function() {
			this.updateTab();
			this.load();
		}
	}
});
</script>

<style lang="scss" scoped>

</style>
