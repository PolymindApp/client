<template>
	<v-card class="panel-overflow d-flex flex-column w-100" :disabled="isDeleted" tile>

		<DeleteDialog ref="deleteModal" @delete="remove(true)" />

		<div ref="header">
			<v-tabs style="flex: 0" v-model="tab" background-color="rgba(0, 0, 0, 0.1)" @change="updateTab()">
				<v-tab :to="'/component/' + id + '/settings'" exact>
					<v-icon left>mdi-pencil-box-outline</v-icon>
					{{$t('component.settings.title')}}
				</v-tab>
				<v-tab :to="'/component/' + id + '/parameters'" exact>
					<v-icon left>mdi-folder-settings-variant-outline</v-icon>
					{{$t('component.parameters.title')}}
				</v-tab>
				<v-tab :to="'/component/' + id + '/builds'" exact>
					<v-icon left>mdi-bulldozer</v-icon>
					<v-badge :value="builds.length > 0" :color="lastBuildState | buildColor" :icon="lastBuildState | buildIcon" inline>
						<span :class="{ 'mr-2': builds.length > 0 }">{{$t('component.builds.title')}}</span>
					</v-badge>
				</v-tab>

				<v-spacer></v-spacer>

				<div class="d-flex align-center">
<!--					<v-btn v-if="!component.is_private" :disabled="!component.repo_url" :href="component.repo_url" target="_blank" class="ml-2" small text>-->
<!--						<v-icon left>mdi-directions-fork</v-icon>-->
<!--						{{$t('modal.fork')}}-->
<!--					</v-btn>-->

					<v-btn @click="test()" target="_blank" :loading="sessionLoading" :disabled="!canTest" class="ml-2" text small>
						<v-icon left>mdi-test-tube</v-icon>
						<span v-text="$t('component.test')"></span>
					</v-btn>

					<v-divider class="mx-4" vertical inset></v-divider>

					<v-btn @click="$comments.open(id, 'component')" class="mr-2" text small>
						<v-icon left>mdi-comment</v-icon>
						{{$t('comment.btnTitle')}}
						<v-chip v-if="commentCount > 0" class="ml-2" color="primary" x-small v-text="commentCount" />
					</v-btn>
				</div>
			</v-tabs>
		</div>

		<div v-if="isDeleted">
			<v-alert dark prominent type="error" class="mb-0" tile>
				<span v-text="$t('component.isDeleted')"></span>
			</v-alert>
		</div>

		<v-tabs-items touchless :dark="$root.user.settings.theme === 'dark'" class="grey lighten-4" :style="{ flex: 1, overflow: (tab !== '/component/' + id + '/source') ? 'auto' : null }" v-model="tab">
			<v-tab-item :value="'/component/' + id + '/settings'" class="pa-4 fill-height">
				<div style="height: 0">
					<Settings @update:component="compareJsonJob($event, 0)" @update="updateTab" :component.sync="component" :form-errors="formErrors" :is-different="dataHasChanged" />
				</div>
			</v-tab-item>
			<v-tab-item :value="'/component/' + id + '/parameters'" class="fill-height">
				<Parameters @value="updateParamValues" @update:component="compareJsonJob($event, 0)" @update="updateTab" :component.sync="component" :dataset.sync="dataset" :form-errors="formErrors" />
			</v-tab-item>
			<v-tab-item :value="'/component/' + id + '/builds'" class="fill-height">
				<Builds @update:component="compareJsonJob($event, 0)" @update="updateTab" :component.sync="component" :builds="builds" :form-errors="formErrors" />
			</v-tab-item>
		</v-tabs-items>

		<v-toolbar :dark="sourceDark" ref="actions" style="flex: 0; border-top: #ccc solid 1px" flat tile>

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
import Builds from "./Component/Builds";
import Settings from "./Component/Settings";
import {ComponentService, Component, CommentService, SessionStructureService, Session, Dataset } from "@polymind/sdk-js";
import DeleteDialog from "../../components/DeleteDialog";
import UserAvatar from "../../components/UserAvatar";
import Parameters from "./Component/Parameters";

let jsonJobTimeout = null;

const beforeRoute = function(to, from, callback) {

	if (to.params.id === from.params.id) {
		return callback();
	}

	if (to.params.id === 'new') {
		to.meta.component = new Component();
		callback();
	} else {
		ComponentService.get(to.params.id)
			.then(response => {
				to.meta.component = new Component(response.data);
				callback();
			})
			.catch(error => callback('/404'));
	}
};

export default Vue.extend({

	components: { Parameters, Builds, Settings, DeleteDialog, UserAvatar },

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
		this.$shortcuts.add(this.$t('shortcuts.component.save.title'), this.$t('shortcuts.component.save.desc'), 'component', ['ControlLeft', 'KeyS'], this.shortcutSave);
	},

	destroyed() {
		this.$shortcuts.remove(this.shortcutSave);
	},

	methods: {

		init(load = true) {

			if (load) {
				this.originalComponent = this.$route.meta.component;
				this.component = this.$route.meta.component;

				this.updateOriginalData();
				// this.loadCommentCount();
			}

			this.tab = '/component/' + this.id + '/' + this.$route.params.section;
			this.updateTab();
			this.compareJsonJob(this.component);
			this.isDeleted = false;
		},

		shortcutSave(event) {
			this.save();
			event.preventDefault();
		},

		updateParamValues(values) {
			this.parametersValue = values;
		},

		updateTab() {

			const section = (this.$route.params.section ? this.$route.params.section : 'edit');
			const sectionTitle = this.isNew ? this.$t('component.newTitle') : this.component.name;
			const thirdTitle = this.$t('component.' + section + '.title');

			this.$root.breadcrumbs = [
				this.$t('title.component'),
				sectionTitle,
				thirdTitle,
			];
			document.title = sectionTitle + ' - ' + this.$t('title.component');

			setTimeout(() => {
				const event = new Event('resize');
				window.dispatchEvent(event);
			});
		},

		compareJsonJob(component, delay = 1000) {

			clearTimeout(jsonJobTimeout);
			jsonJobTimeout = setTimeout(() => {
				this.componentJson = JSON.stringify(component);
				this.dataHasChanged = this.componentJson !== this.originalComponentJson;
			}, delay);
		},

		updateOriginalData() {
			this.originalComponent = new Component(this.$deepClone(this.component));
			this.originalComponentJson = JSON.stringify(this.originalComponent);
		},

        loadCommentCount() {

            CommentService.count('component', this.id)
                .then(response => {
                    this.commentCount = response.meta.filter_count;
                })
                .catch(error => this.$handleError(this, error));
		},

        loadRevision(offset) {

            this.load(offset);
		},

		loadRevisions() {

			this.revisionLoading = true;
            ComponentService.getRevisions(this.id)
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
				ComponentService.get(this.id, revisionOffset)
					.then(response => {

					    if (revisionOffset !== undefined) {
                            this.component = new Component(response.data.data);
						} else {
                            this.component = new Component(response.data);
						}

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
			}
		},

		reset() {
			this.component = new Component(this.$deepClone(this.originalComponent));
			this.updateOriginalData();
			this.compareJsonJob(this.component, 0);
		},

		initializeValues() {
            this.isDeleted = false;
			this.component = new Component();
		},

		save() {

			if (!this.dataHasChanged) {
				return;
			}

			this.formErrors = [];
			this.$root.isLoading = true;
			ComponentService.save(this.id !== 'new' ? this.id : null, this.component)
				.then(response => {
                    this.$root.isSaved = true;

                    if (this.id !== response.data.id) {
                    	this.$root.components.push(new Component(response.data));
                        return this.$router.push('/component/' + response.data.id);
                    } else {
						const component = this.$root.components.find(component => component.id === response.data.id);
						Object.assign(component, new Component(response.data));
					}

					this.updateOriginalData();
					this.compareJsonJob(this.component, 0);
					this.updateTab();
					this.revisionOffset = 0;
				})
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
		},

		remove(force = false) {

			if (force) {
				this.$root.isLoading = true;
				ComponentService.remove(this.id)
					.then(response => {
						this.isDeleted = true;
						this.$refs.deleteModal.hide();

						const componentIdx = this.$root.components.findIndex(component => component.id === this.id);
						this.$root.components.splice(componentIdx, 1);
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
			} else {
				this.$refs.deleteModal.show();
			}
		},

		test() {

			this.sessionLoading = true;
			SessionStructureService.generate({
				component: this.component.id,
				dataset: this.dataset.id,
				parameters: this.parametersValue,
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

		lastBuildState() {
			return this.builds.length > 0 && this.builds[0].state;
		},

		sourceDark() {
            return (this.tab === '/component/' + this.id + '/source')
				&& this.$root.user.settings.development.theme === 'dark';
		},

		generatedTestUri() {
			return this.playerHost + '/c/' + this.session.hash + '/test';
		},

		canTest() {

			if (this.isNew) {
				return false;
			}

			const types = ['component', 'dataset'];
			for (let y = 0; y < types.length; y++) {
				const type = types[y];
				for (let i = 0; i < this.component.compiled_parameters[type].parameters.length; i++) {
					const param = this.component.compiled_parameters[type].parameters[i];
					const model = this.parametersValue[type];

					if (param.mandatory !== true) {
						continue;
					}

					if (param.type === 'column') {
						if (!!(this.dataset.columns.find(column => column.guid === model[param.key]))) {
							continue
						}
						return false;
					}

					if (!!(model[param.key])) {
						continue;
					}

					return false;
				}
			}

			return this.component.getURL();
		}
	},

	data() {
		return {
			playerHost: process.env.VUE_APP_PLAYER_URL,
			isDeleted: false,
			formErrors: [],
            revisions: [],
            revisionOffset: 0,
			revisionLoading: false,
			revisionLoaded: false,
			revisionMenu: false,
			session: new Session(),
			sessionLoading: false,
			dataHasChanged: false,
			dataset: new Dataset(),
			component: null,
			originalComponent: null,
			componentJson: null,
			originalComponentJson: null,
			parametersValue: this.$route.meta.component.getDefaultParameters(),
            commentCount: 0,
			builds: [
				{ id: 1, state: 'running', startDate: 1587504365000, endDate: 1587504365000, publicUrl: 'https://localhost:5002', },
				{ id: 2, state: 'completed', startDate: 1587504365000, endDate: 1587504365000, publicUrl: 'https://localhost:5002', },
				{ id: 3, state: 'completed', startDate: 1587504365000, endDate: 1587504365000, publicUrl: 'https://localhost:5002', },
				{ id: 4, state: 'failed', startDate: 1587504365000, endDate: 1587504365000, publicUrl: 'https://localhost:5002', },
				{ id: 5, state: 'completed', startDate: 1587504365000, endDate: 1587504365000, publicUrl: 'https://localhost:5002', },
			],
		}
	},
});
</script>

<style lang="scss" scoped>
	.v-tabs-items::v-deep .v-window__container {
		height: 100%;
	}
</style>
