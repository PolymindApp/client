<template>
	<v-sheet class="panel-overflow d-flex flex-column w-100" tile>

		<DeleteDialog ref="deleteModal" @delete="remove(true)" />

		<div ref="header">
			<v-tabs style="flex: 0" v-model="tab" background-color="rgba(0, 0, 0, 0.1)" @change="updateTab()">
				<v-tab :to="'/strategy/' + id + '/settings'" exact>
					<v-icon left>mdi-pencil-box-outline</v-icon>
					{{$t('strategy.settings.title')}}
				</v-tab>
				<v-tab :to="'/strategy/' + id + '/assembly'" exact>
					<v-icon left>mdi-transit-connection-variant</v-icon>
					{{$t('strategy.assembly.title')}}
				</v-tab>
<!--				<v-tab :to="'/strategy/' + id + '/interface'" exact>-->
<!--					<v-icon left>mdi-code-tags</v-icon>-->
<!--					{{$t('strategy.interface.title')}}-->
<!--				</v-tab>-->
<!--				<v-tab :to="'/strategy/' + id + '/workflow'" exact>-->
<!--					<v-icon left>mdi-flash-outline</v-icon>-->
<!--					{{$t('strategy.workflow.title')}}-->
<!--				</v-tab>-->

				<v-spacer></v-spacer>

				<v-btn :disabled="isDeleted" @click="$comments.open(id, 'strategy')" class="mt-3 mr-4" text small>
					<v-icon left>mdi-comment</v-icon>
					{{$t('comment.btnTitle')}}
					<v-chip v-if="commentCount > 0" class="ml-2" color="primary" x-small v-text="commentCount" />
				</v-btn>
			</v-tabs>
		</div>

		<div v-if="isDeleted">
			<v-alert dark prominent type="error" class="mb-0" tile>
				<span v-text="$t('strategy.isDeleted')"></span>
			</v-alert>
		</div>

		<v-tabs-items touchless ref="items" style="flex: 1;" class="scrollable grey lighten-4" v-model="tab">
			<v-tab-item :value="'/strategy/' + id + '/settings'" :style="tabStyle" class="fill-height">
				<div style="height: 0">
					<Settings @update="updateTab()" :strategy="strategy" :form-errors="formErrors" />
				</div>
			</v-tab-item>
			<v-tab-item :value="'/strategy/' + id + '/assembly'" :style="tabStyle" class="fill-height">
				<Assembly :strategy="strategy" :form-errors="formErrors" />
			</v-tab-item>
<!--			<v-tab-item :value="'/strategy/' + id + '/interface'" :style="tabStyle" class="fill-height">-->
<!--				<Source :strategy="strategy" :form-errors="formErrors" />-->
<!--			</v-tab-item>-->
<!--			<v-tab-item :value="'/strategy/' + id + '/workflow'" :style="tabStyle" class="fill-height">-->
<!--				<Workflow :strategy="strategy" :form-errors="formErrors" />-->
<!--			</v-tab-item>-->
		</v-tabs-items>

		<v-toolbar ref="actions" style="flex: 0; border-top: #ccc solid 1px" flat tile>
			<v-btn :disabled="!dataHasChanged || isDeleted" @click="save()" color="primary" class="mr-1">
				{{$t('modal.save')}}
			</v-btn>
			<v-btn class="ml-2" :disabled="!dataHasChanged || isDeleted" @click="reset()" text>
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
import Settings from "./Strategy/Settings";
import { StrategyService, Strategy, CommentService, DeploymentService } from "@polymind/sdk-js";
import DeleteDialog from "../../components/DeleteDialog";
import UserAvatar from "../../components/UserAvatar";
import Assembly from "./Strategy/Assembly";

export default Vue.extend({

	components: { Settings, Assembly, DeleteDialog, UserAvatar },

	mounted() {
		this.initializeValues();
		this.load();
		this.loadRevisions();
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
			document.title = sectionTitle + ' - ' + this.$t('title.strategy');

			this.isNew = this.$route.params.id === 'new';
			this.id = this.isNew ? 'new' : parseInt(this.$route.params.id);

			setTimeout(() => {
				const event = new Event('resize');
				window.dispatchEvent(event);
			});
		},

		updateOriginalData() {
			this.originalStrategy = this.$deepClone(this.strategy);
		},

		loadCommentCount() {

			CommentService.count('strategy', this.id)
					.then(response => {
						this.commentCount = response.meta.filter_count;
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
		},

		loadRevision(offset) {

			this.load(offset);
		},

		loadRevisions() {

			StrategyService.getRevisions(this.id)
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
				StrategyService.get(this.id, revisionOffset)
					.then(response => {
						this.initializeValues();
						this.id = response.data.id;
						this.isNew = false;
						this.strategy = new Strategy(response.data);
						this.updateOriginalData();
						this.updateTab();
					})
					.catch(error => {
						if (error.code === 203) {
							return this.$router.replace('/404')
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

			StrategyService.fork(revision.id)
					.then(response => {
						this.forkModal.visible = false;
						this.$router.push('/strategy/' + response.data.id);
						this.forkModal.forked = true;
						this.$root.$emit('STRATEGY_UPDATE');
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
		},

		openPublish() {
			this.publishModal.visible = true;
		},

		publish(version, changelog) {

			DeploymentService.fork('strategy', this.id, version, changelog)
					.then(response => {
						this.publishModal.visible = false;
						this.publishModal.publied = true;
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
		},

		initializeValues() {
			this.isDeleted = false;
			this.strategy = new Strategy();
		},

		save() {

			this.formErrors = [];
			this.$root.isLoading = true;
			StrategyService.save(this.id !== 'new' ? this.id : null, this.strategy)
				.then(response => {

					this.$root.$emit('STRATEGY_UPDATE');
					this.$root.isSaved = true;

					if (this.id !== response.data.id) {
						return this.$router.push('/strategy/' + response.data.id);
					}

					this.id = response.data.id;
					this.isNew = false;
					this.updateOriginalData();
					this.loadRevisions();
					this.updateTab();
					this.revisionOffset = 0;
				})
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
		},

		remove(force = false) {

			if (force) {
				this.$root.isLoading = true;
				StrategyService.remove(this.id)
					.then(response => {
						this.isDeleted = true;
						this.$refs.deleteModal.hide();
						this.$root.$emit('STRATEGY_UPDATE');
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
			} else {
				this.$refs.deleteModal.show();
			}
		},

		restore() {

			this.$root.isLoading = true;
			StrategyService.restore(this.id)
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
				height: (this.maxHeight - 1) + 'px',
			};
		},

		dataHasChanged() {
			return JSON.stringify(this.strategy) !== JSON.stringify(this.originalStrategy);
		},
	},

	data() {
		return {
			revisions: [],
			revisionOffset: 0,
			maxHeight: 500,
			id: this.$route.params.id,
			isNew: this.$route.params.id === 'new',
			isDeleted: false,
			formErrors: [],
			tab: '/strategy/new/edit',
			originalStrategy: new Strategy(),
			strategy: new Strategy(),
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
