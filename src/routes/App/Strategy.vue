<template>
	<v-card :disabled="isDeleted" class="panel-overflow d-flex flex-column w-100" tile>

		<DeleteDialog ref="deleteModal" @delete="remove(true)" />

		<!-- LAUNCH SESSION DIALOG -->
		<LaunchSession :visible.sync="launchSessionDialog.visible" :strategy="strategy" />

		<div ref="header">
			<v-tabs style="flex: 0" v-model="tab" background-color="rgba(0, 0, 0, 0.1)" @change="updateTab()">
				<v-tab :to="'/strategy/' + id + '/settings'" exact>
					<v-icon left>mdi-pencil-box-outline</v-icon>
					<span v-text="$t('strategy.settings.title')"></span>
				</v-tab>
				<v-tab :to="'/strategy/' + id + '/assembly'" exact>
					<v-icon v-if="assemblyIsValid" left>mdi-transit-connection-variant</v-icon>
					<v-icon v-else color="error" left>mdi-alert</v-icon>
					<span v-text="$t('strategy.assembly.title')"></span>
				</v-tab>

				<v-spacer></v-spacer>

				<div class="d-flex align-center">
					<div class="mr-4 d-flex align-center">
						<span v-text="$t('strategy.assembly.totalDuration')"></span>
						<v-chip class="ml-4" label small dark>
							<span v-if="totalDuration" v-text="$t('strategy.assembly.duration', { duration: (isIndeterminate ? '+ ' : '') + totalDuration })"></span>
							<span v-else v-text="$t('strategy.assembly.undefined')"></span>
						</v-chip>
					</div>

					<v-btn @click="launchSessionDialog.visible = true" target="_blank" :disabled="!canTest" color="success" class="mr-2" small>
						<v-icon left>mdi-play</v-icon>
						<span v-text="$t('strategy.assembly.accomplish')"></span>
					</v-btn>

					<v-btn @click="test()" target="_blank" :loading="sessionTestLoading" :disabled="!canTest" text small>
						<v-icon left>mdi-test-tube</v-icon>
						<span v-text="$t('strategy.assembly.test')"></span>
					</v-btn>

					<v-divider class="mx-4" vertical inset></v-divider>

					<v-btn @click="$comments.open(id, 'strategy')" class="mr-2" text small>
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
			<v-tab-item :value="'/strategy/' + id + '/settings'" class="fill-height">
				<div style="height: 0">
					<Settings @update:strategy="compareJsonJob($event, 0)" @update="updateTab" :strategy.sync="strategy" :form-errors="formErrors" />
				</div>
			</v-tab-item>
			<v-tab-item :value="'/strategy/' + id + '/assembly'" class="fill-height">
				<div style="height: 0">
					<Assembly ref="assembly" @update:strategy="compareJsonJob($event, 0)" @update="updateTab" :strategy.sync="strategy" :form-errors="formErrors" :components="components" :datasets="datasets" />
				</div>
			</v-tab-item>
		</v-tabs-items>

		<v-toolbar ref="actions" style="flex: 0; border-top: #ccc solid 1px" flat tile>

			<v-btn :disabled="!dataHasChanged || !assemblyIsValid" @click="save()" color="primary" class="mr-1">
				{{$t('modal.save')}}
			</v-btn>
			<v-btn class="ml-2" :disabled="!dataHasChanged" @click="reset()" text>
				{{$t('modal.cancel')}}
			</v-btn>

			<v-spacer></v-spacer>

			<v-menu max-height="450" v-model="revisionMenu" offset-y>
				<template v-slot:activator="{ on }">
					<v-btn :disabled="revisions.length === 0 && revisionLoaded" @click="loadRevisions()" :loading="revisionLoading" class="float-right mr-4" text>
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
import Settings from "./Strategy/Settings";
import {StrategyService, Strategy, CommentService, DeploymentService, SessionStructureService } from "@polymind/sdk-js";
import DeleteDialog from "../../components/DeleteDialog";
import UserAvatar from "../../components/UserAvatar";
import Assembly from "./Strategy/Assembly";
import LaunchSession from "../../components/LaunchSession";

let jsonJobTimeout = null;

const beforeRoute = function(to, from, callback) {

	if (to.params.id === from.params.id) {
		return callback();
	}

	if (to.params.id === 'new') {
		to.meta.strategy = new Strategy();
		callback();
	} else {
		Promise.all([
			StrategyService.get(to.params.id),
		]).then(([strategy, components, datasets]) => {
			to.meta.strategy = new Strategy(strategy.data);
			callback();
		})
		.catch(error => callback('/404'));
	}
};

export default Vue.extend({

	components: { Settings, Assembly, DeleteDialog, UserAvatar, LaunchSession },

	beforeRouteEnter(to, from, next) {
		beforeRoute(to, from, (param) => next(param));
	},

	beforeRouteUpdate(to, from, next) {
		beforeRoute(to, from, (param) => {
			next(param);
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
		this.$shortcuts.add(this.$t('shortcuts.component.save.title'), this.$t('shortcuts.component.save.desc'), 'component', ['ControlLeft', 'KeyS'], this.shortcutSave);
	},

	destroyed() {
		this.$shortcuts.remove(this.shortcutSave);
	},

	methods: {

		init(load = true) {

			if (load) {
				this.strategy = this.$route.meta.strategy;
				this.datasets = this.$root.datasets;
				this.components = this.$root.components;
				this.updateOriginalData();
				// this.loadCommentCount();
			}

			this.tab = '/strategy/' + this.id + '/' + this.$route.params.section;
			this.updateTab();
			this.compareJsonJob(this.strategy);
			this.isDeleted = false;
		},

		shortcutSave(event) {
			this.save();
			event.preventDefault();
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

			this.revisionLoading = true;
			StrategyService.getRevisions(this.id)
					.then(response => {
						this.revisions = response.data.reverse();
						this.revisionOffset = 0;
						this.revisionLoaded = true;
						this.revisionMenu = true;
						this.revisionLoading = false;
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
			this.compareJsonJob(this.strategy, 0);
		},

		updateOriginalData() {
			this.originalStrategy = new Strategy(this.$deepClone(this.strategy));
			this.originalStrategyJson = JSON.stringify(this.originalStrategy);
		},

		compareJsonJob(strategy, delay = 1000) {

			clearTimeout(jsonJobTimeout);
			jsonJobTimeout = setTimeout(() => {
				this.strategyJson = JSON.stringify(strategy);
				this.dataHasChanged = this.strategyJson !== this.originalStrategyJson;
			}, delay);
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

			if (!this.dataHasChanged) {
				return;
			}

			this.formErrors = [];
			this.$root.isLoading = true;
			StrategyService.save(this.id !== 'new' ? this.id : null, this.strategy)
				.then(response => {

					this.$root.$emit('STRATEGY_UPDATE');
					this.$root.isSaved = true;

					if (this.id !== response.data.id) {
						this.$root.strategies.push(new Strategy(response.data));
						return this.$router.push('/strategy/' + response.data.id);
					} else {
						const strategy = this.$root.strategies.find(strategy => strategy.id === response.data.id);
						Object.assign(strategy, new Strategy(response.data));
					}

					this.updateOriginalData();
					this.compareJsonJob(this.strategy, 0);
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

						const strategyIdx = this.$root.strategies.findIndex(strategy => strategy.id === this.id);
						this.$root.strategies.splice(strategyIdx, 1);
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
			} else {
				this.$refs.deleteModal.show();
			}
		},

		test() {

			this.sessionTestLoading = true;
			SessionStructureService.generate({
				strategy: this.strategy.id,
				parameters: this.strategy.assemblies,
			})
					.then(session => {
						this.session = session;
						const win = window.open(this.generatedTestUri, '_blank');
						win.focus();
					}).finally(() => this.sessionTestLoading = false);
		}
	},

	computed: {

		id() {
			return this.isNew ? 'new' : parseInt(this.$route.params.id);
		},

		isNew() {
			return this.$route.params.id === 'new';
		},

		totalDuration() {
			return this.strategy.totalDuration();
		},

		isIndeterminate() {
			for (let i = 0; i < this.strategy.assemblies.length; i++) {
				const assembly = this.strategy.assemblies[i];
				if (assembly.duration === 0) {
					return true;
				}
			}

			return false;
		},

		generatedTestUri() {
			return this.playerHost + '/s/' + this.session.hash + '/test';
		},

		canTest() {
			if (this.isNew) {
				return false;
			}
			return this.strategy.id && this.strategy.assemblies.length > 0 && this.strategy.isValid(this.components, this.datasets);
		},

		assemblyIsValid() {
			return this.strategy.isValid(this.components, this.datasets);
		},
	},

	data() {
		return {
			playerHost: process.env.VUE_APP_PLAYER_URL,
			revisions: [],
			revisionOffset: 0,
			revisionLoading: false,
			revisionLoaded: false,
			revisionMenu: false,
			maxHeight: 500,
			isDeleted: false,
			formErrors: [],
			tab: null,
			sessionTestLoading: false,
			dataHasChanged: false,
			datasets: this.$root.datasets,
			components: this.$root.components,
			strategy: null,
			originalStrategy: null,
			strategyJson: null,
			originalStrategyJson: null,
			commentCount: 0,
			launchSessionDialog: {
				visible: false,
			},
		}
	},
});
</script>

<style lang="scss" scoped>
	.v-tabs-items::v-deep .v-window__container {
		height: 100%;
	}
</style>
