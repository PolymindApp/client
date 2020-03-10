<template>
	<v-sheet class="panel-overflow d-flex flex-column w-100" tile>

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
					{{$t('strategy.publishModal.title')}}
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
					{{$t('strategy.forkModal.title')}}
				</v-card-title>

				<v-card-text>
					<span v-text="$t('strategy.forkModal.forkDesc')"></span>
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

		<div ref="header">
			<v-tabs show-arrows style="flex: 0" v-model="tab" background-color="rgba(0, 0, 0, 0.1)" @change="updateTab()">
				<v-tab :to="'/strategy/' + id + '/settings'" exact>
					<v-icon left>mdi-pencil-box-outline</v-icon>
					{{$t('strategy.settings.title')}}
				</v-tab>
				<v-tab :to="'/strategy/' + id + '/interface'" exact>
					<v-icon left>mdi-code-tags</v-icon>
					{{$t('strategy.interface.title')}}
				</v-tab>
				<v-tab :to="'/strategy/' + id + '/workflow'" exact>
					<v-icon left>mdi-flash-outline</v-icon>
					{{$t('strategy.workflow.title')}}
				</v-tab>

				<v-spacer></v-spacer>

				<v-btn :disabled="isDeleted" @click="$comments.open(id, 'component')" class="mt-3 mr-4" text small>
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

			<v-alert v-if="isDeleted" style="flex: 0" class="ma-0" tile prominent type="error">
				<v-row align="center">
					<v-col class="grow">
						<span v-text="$t('strategy.isDeleted')"></span>
					</v-col>
					<v-col class="shrink">
						<v-btn @click="restore()">
							<span v-text="$t('strategy.restore')"></span>
						</v-btn>
					</v-col>
				</v-row>
			</v-alert>
		</div>

		<v-tabs-items ref="items" style="flex: 1;" class="scrollable" v-model="tab">
			<v-tab-item :value="'/strategy/' + id + '/settings'" :style="tabStyle" class="fill-height">
				<div style="height: 0">
					<Settings @update="updateTab()" :strategy="strategy" :form-errors="formErrors" />
				</div>
			</v-tab-item>
			<v-tab-item :value="'/strategy/' + id + '/interface'" :style="tabStyle" class="fill-height">
				<Source :strategy="strategy" :form-errors="formErrors" />
			</v-tab-item>
			<v-tab-item :value="'/strategy/' + id + '/workflow'" :style="tabStyle" class="fill-height">
				<Workflow :strategy="strategy" :form-errors="formErrors" />
			</v-tab-item>
		</v-tabs-items>

		<v-toolbar ref="actions" style="flex: 0; border-top: #ccc solid 1px" flat tile>
			<v-btn :disabled="!dataHasChanged || isDeleted" @click="save()" color="primary" class="mr-1">
				{{$t('modal.save')}}
			</v-btn>
			<v-btn class="ml-2" :disabled="!dataHasChanged || isDeleted" @click="reset()" text>
				{{$t('modal.cancel')}}
			</v-btn>

			<v-spacer></v-spacer>

			<v-menu offset-y top>
				<template v-slot:activator="{ on }">
					<v-btn :disabled="isDeleted" v-on="on" icon>
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
	</v-sheet>
</template>

<script>
import Vue from 'vue';
import Settings from "./Strategy/Settings";
import Source from "./Strategy/Interface";
import Workflow from "./Strategy/Workflow";
import StrategyService from "../../services/StrategyService";
import DeleteDialog from "../../components/DeleteDialog";
import StrategyModel from "../../models/Strategy";
import CommentService from "../../services/CommentService";
import ComponentService from "../../services/ComponentService";
import DeploymentService from "../../services/DeploymentService";

export default Vue.extend({

	components: { Source, Settings, Workflow, DeleteDialog },

	mounted() {
		this.initializeValues();
		this.load();
		this.updateTab();
		this.loadCommentCount();

		window.addEventListener('resize', this.handleWindowResize);
	},

	destroyed() {
		window.removeEventListener('resize', this.handleWindowResize);
	},

	methods: {

		handleWindowResize() {
			if (this.$refs.header) {
				const tabsBb = this.$refs.header.getBoundingClientRect();
				const actionsBb = this.$refs.actions.$el.getBoundingClientRect();

				this.maxHeight = window.innerHeight - tabsBb.bottom - actionsBb.height;
			}
		},

		updateTab() {

			const section = (this.$route.params.section ? this.$route.params.section : 'edit');
			const sectionTitle = this.isNew ? this.$t('strategy.newTitle') : this.strategy.name;
			const thirdTitle = this.$t('strategy.' + section + '.title');

			this.$root.breadcrumbs = [
				this.$t('title.strategy'),
				sectionTitle,
				thirdTitle,
			];
			document.title = sectionTitle + ' | ' + this.$t('title.strategy');

			this.id = parseInt(this.$route.params.id);
			this.isNew = this.$route.params.id === 'new';

			setTimeout(() => {
				const event = new Event('resize');
				window.dispatchEvent(event);
			});
		},

		updateOriginalData() {
			this.originalStrategy = this.$deepClone(this.strategy);
		},

		loadCommentCount() {

			CommentService.count.bind(this)('strategy', this.id)
					.then(response => {
						this.commentCount = response.meta.filter_count;
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
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
						this.strategy = new StrategyModel(response.data);
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
				this.initializeValues();
                	this.updateOriginalData();
			}
		},

		reset() {
			this.strategy = this.$deepClone(this.originalStrategy);
		},

		openFork() {
			this.forkModal.visible = true;
		},

		fork() {

			const revision = this.revisions[this.revisionOffset];

			ComponentService.fork.bind(this)(revision.id)
					.then(response => {
						this.forkModal.visible = false;
						this.$router.push('/component/' + response.data.id);
						this.forkModal.forked = true;
						this.$root.$emit('COMPONENT_UPDATE');
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
		},

		openPublish() {
			this.publishModal.visible = true;
		},

		publish(version, changelog) {

			DeploymentService.fork.bind(this)('component', this.id, version, changelog)
					.then(response => {
						this.publishModal.visible = false;
						this.publishModal.publied = true;
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
		},

		initializeValues() {

			this.strategy = new StrategyModel();
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
		},

		restore() {

			this.$root.isLoading = true;
			StrategyService.restore.bind(this)(this.id)
					.then(response => {
						this.isDeleted = false;
						this.$root.$emit('STRATEGY_UPDATE');
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
		}
	},

	computed: {

		tabStyle() {
			return {
				height: this.maxHeight + 'px',
			};
		},

		dataHasChanged() {
			return JSON.stringify(this.strategy) !== JSON.stringify(this.originalStrategy);
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
			maxHeight: 500,
			id: this.$route.params.id,
			isNew: this.$route.params.id === 'new',
			isDeleted: false,
			formErrors: [],
			tab: '/strategy/new/edit',
			originalStrategy: new StrategyModel(),
			strategy: new StrategyModel(),
			commentCount: 0,
		}
	},

	watch: {
		'$route.params.id': function() {
			this.updateTab();
			this.load();
			this.loadCommentCount();
		}
	}
});
</script>

<style lang="scss" scoped>
	.v-tabs-items::v-deep .v-window__container {
		height: 100%;
	}
</style>
