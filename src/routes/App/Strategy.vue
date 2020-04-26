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

				<v-spacer></v-spacer>

				<div class="d-flex align-center">
					<div class="mr-4 d-flex align-center">
						<span v-text="$t('strategy.assembly.totalDuration')"></span>
						<v-chip class="ml-4" label small dark>
							<span v-if="totalDuration" v-text="$t('strategy.assembly.duration', { duration: totalDuration })"></span>
							<span v-else v-text="$t('strategy.assembly.undefined')"></span>
						</v-chip>
					</div>

					<v-btn :href="testUri" target="_blank" :disabled="!canTest" color="primary" small>
						<v-icon left>mdi-play</v-icon>
						<span v-text="$t('strategy.assembly.test')"></span>
					</v-btn>

					<v-divider class="mx-4" vertical inset></v-divider>

					<v-btn :disabled="isDeleted" @click="$comments.open(id, 'strategy')" class="mr-4" text small>
						<v-icon left>mdi-comment</v-icon>
						{{$t('comment.btnTitle')}}
						<v-chip v-if="commentCount > 0" class="ml-2" color="primary" x-small v-text="commentCount" />
					</v-btn>
				</div>
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
					<Settings @update:strategy="compareJsonJob($event, 0)" @update="updateTab" :strategy.sync="strategy" :form-errors="formErrors" />
				</div>
			</v-tab-item>
			<v-tab-item :value="'/strategy/' + id + '/assembly'" :style="tabStyle" class="fill-height">
				<Assembly ref="assembly" @update:strategy="compareJsonJob($event, 0)" @update="updateTab" :strategy.sync="strategy" :form-errors="formErrors" />
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
import {StrategyService, Strategy, CommentService, DeploymentService, Dataset} from "@polymind/sdk-js";
import DeleteDialog from "../../components/DeleteDialog";
import UserAvatar from "../../components/UserAvatar";
import Assembly from "./Strategy/Assembly";

let jsonJobTimeout = null;

const beforeRoute = function(to, from, next) {

	if (to.params.id === from.params.id) {
		return next();
	}

	if (to.params.id === 'new') {
		to.meta.strategy = new Strategy();
		next();
	} else {
		StrategyService.get(to.params.id)
			.then(response => {
				to.meta.strategy = new Strategy(response.data);
				next();
			})
			.catch(error => next('/404'));
	}
};

export default Vue.extend({

	components: { Settings, Assembly, DeleteDialog, UserAvatar },

	beforeRouteEnter: beforeRoute,

	beforeRouteUpdate(to, from, next) {
		beforeRoute(to, from, () => {
			next();
			this.$nextTick(() => {
				this.init(to.params.id !== from.params.id);
				this.$nextTick(() => {
					this.$refs.assembly.init();
					this.$forceUpdate();
				});
			});
		});
	},

	created() {
		this.init();
	},

	mounted() {
		window.addEventListener('resize', this.handleWindowResize);
	},

	destroyed() {
		window.removeEventListener('resize', this.handleWindowResize);
	},

	methods: {

		init(load = true) {
			this.strategy = this.$route.meta.strategy;
			this.tab = '/strategy/' + this.id + '/' + this.$route.params.section;
			this.updateTab();
			this.updateOriginalData();
			this.compareJsonJob(this.strategy);

			if (load) {
				this.loadRevisions();
				this.loadCommentCount();
			}
		},

		handleWindowResize() {
			if (this.$refs.header) {
				const tabsBb = this.$refs.header.getBoundingClientRect();
				const actionsBb = this.$refs.actions.$el.getBoundingClientRect();

				this.maxHeight = window.innerHeight - tabsBb.bottom - actionsBb.height;
			}
		},

		updateTab() {

			const section = (this.$route.params.section ? this.$route.params.section : 'settings');
			const sectionTitle = this.isNew ? this.$t('strategy.newTitle') : this.strategy.name;
			const thirdTitle = this.$t('strategy.' + section + '.title');

			this.$root.breadcrumbs = [
				this.$t('title.strategy'),
				sectionTitle,
				thirdTitle,
			];
			document.title = sectionTitle + ' - ' + this.$t('title.strategy');

			setTimeout(() => {
				const event = new Event('resize');
				window.dispatchEvent(event);
			});
		},

		updateOriginalData() {
			this.originalStrategy = new Strategy(this.$deepClone(this.strategy));
			this.originalStrategyJson = JSON.stringify(this.originalStrategy);
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
			this.strategy = new Strategy(this.$deepClone(this.originalStrategy));
			this.updateOriginalData();
		},

		openFork() {
			this.forkModal.visible = true;
		},

		compareJsonJob(strategy, delay = 1000) {

			clearTimeout(jsonJobTimeout);
			jsonJobTimeout = setTimeout(() => {
				this.strategyJson = JSON.stringify(strategy);
				this.dataHasChanged = this.strategyJson !== this.originalStrategyJson;
			}, delay);
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

		id() {
			return this.$route.params.id;
		},

		isNew() {
			return this.$route.params.id === 'new';
		},

		tabStyle() {
			return {
				height: (this.maxHeight - 1) + 'px',
			};
		},

		totalDuration() {
			return this.strategy.totalDuration();
		},

		testUri() {
			const directusStorage = window.localStorage.getItem('directus-sdk-js');
			const directusJson = JSON.parse(directusStorage);
			return process.env.VUE_APP_PLAYER_URL + '/test/strategy/' + this.strategy.id + '?token=' + directusJson.token
		},

		canTest() {
			return this.strategy.id && !this.hasIssue;
		},

		hasIssue() {
			return this.strategy.assemblies.find(assembly => {
				return !assembly.isValid();
			}) !== undefined;
		}
	},

	data() {
		return {
			revisions: [],
			revisionOffset: 0,
			maxHeight: 500,
			isDeleted: false,
			formErrors: [],
			tab: null,
			strategy: null,
			strategyJson: null,
			commentCount: 0,
			dataHasChanged: false,
		}
	},
});
</script>

<style lang="scss" scoped>
	.v-tabs-items::v-deep .v-window__container {
		height: 100%;
	}
</style>
