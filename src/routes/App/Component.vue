<template>
	<v-sheet class="panel-overflow d-flex flex-column w-100" tile>

		<DeleteDialog ref="deleteModal" @delete="remove(true)" />

		<!-- IS PUBLIED -->
<!--		<v-snackbar color="success" v-model="publishModal.publied">-->
<!--			<v-icon class="white&#45;&#45;text" left>mdi-check</v-icon>-->
<!--			{{$t('snackbar.forked')}}-->
<!--			<v-btn text @click="forkModal.publied = false">-->
<!--				{{$t('modal.close')}}-->
<!--			</v-btn>-->
<!--		</v-snackbar>-->

		<!-- MODAL: PUBLISH -->
<!--		<v-dialog v-model="publishModal.visible" scrollable persistent max-width="500px">-->
<!--			<v-card>-->
<!--				<v-card-title>-->
<!--					<v-icon color="primary" slot="icon" size="36" left>mdi-publish</v-icon>-->
<!--					{{$t('component.source.publishModal.title')}}-->
<!--				</v-card-title>-->

<!--				<v-card-text>-->
<!--					TBD-->
<!--				</v-card-text>-->

<!--				<v-card-actions>-->
<!--					<v-spacer></v-spacer>-->

<!--					<v-btn color="primary" @click="publish()">-->
<!--						<v-icon left>mdi-publish</v-icon>-->
<!--						{{$t('modal.publish')}}-->
<!--					</v-btn>-->

<!--					<v-btn @click="publishModal.visible = false">-->
<!--						{{$t('modal.cancel')}}-->
<!--					</v-btn>-->
<!--				</v-card-actions>-->
<!--			</v-card>-->
<!--		</v-dialog>-->

		<div ref="header">
			<v-tabs style="flex: 0" v-model="tab" background-color="rgba(0, 0, 0, 0.1)" @change="updateTab()">
				<v-tab :disabled="isDeleted" :to="'/component/' + id + '/settings'" exact>
					<v-icon left>mdi-pencil-box-outline</v-icon>
					{{$t('component.settings.title')}}
				</v-tab>
				<v-tab :disabled="isDeleted" :to="'/component/' + id + '/builds'" exact>
					<v-icon left>mdi-bulldozer</v-icon>
					<v-badge :value="builds.length > 0" :color="lastBuildState | buildColor" :icon="lastBuildState | buildIcon" inline>
						<span :class="{ 'mr-2': builds.length > 0 }">{{$t('component.builds.title')}}</span>
					</v-badge>
				</v-tab>
<!--				<v-tab :disabled="isDeleted" :to="'/component/' + id + '/source'" exact>-->
<!--					<v-icon left>mdi-code-tags</v-icon>-->
<!--					{{$t('component.source.title')}}-->
<!--				</v-tab>-->

				<v-spacer></v-spacer>

				<v-btn :disabled="isDeleted || !component.repo_url" :href="component.repo_url" target="_blank" class="mt-3 ml-2" small text>
					<v-icon left>mdi-directions-fork</v-icon>
					{{$t('modal.fork')}}
				</v-btn>

				<v-divider class="mx-4" vertical inset></v-divider>

<!--				<v-btn :disabled="!dataHasChanged || isDeleted" @click="openPublish()" color="info" class="mt-3 mr-3" small>-->
<!--					<v-icon left>mdi-publish</v-icon>-->
<!--					{{$t('modal.publish')}}-->
<!--				</v-btn>-->

				<v-btn :disabled="isDeleted" @click="$comments.open(id, 'component')" class="mt-3 mr-2" text small>
					<v-icon left>mdi-comment</v-icon>
					{{$t('comment.btnTitle')}}
					<v-chip v-if="commentCount > 0" class="ml-2" color="primary" x-small v-text="commentCount" />
				</v-btn>
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
					<Settings @update="updateTab()" :component="component" :form-errors="formErrors" />
				</div>
			</v-tab-item>
			<v-tab-item :value="'/component/' + id + '/builds'" class="fill-height">
				<Builds :component="component" :builds="builds" :form-errors="formErrors" />
			</v-tab-item>
<!--			<v-tab-item :value="'/component/' + id + '/source'" class="fill-height">-->
<!--				<Source :component="component" :form-errors="formErrors" />-->
<!--			</v-tab-item>-->
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
import Builds from "./Component/Builds";
import Settings from "./Component/Settings";
import {ComponentService, Component, CommentService, DeploymentService, Strategy} from "@polymind/sdk-js";
import DeleteDialog from "../../components/DeleteDialog";
import UserAvatar from "../../components/UserAvatar";

const beforeRoute = function(to, from, next) {

	if (to.params.id === from.params.id) {
		return next();
	}

	if (to.params.id === 'new') {
		to.meta.component = new Component();
		next();
	} else {
		ComponentService.get(to.params.id)
			.then(response => {
				to.meta.component = new Component(response.data);
				next();
			})
			.catch(error => next('/404'));
	}
};

export default Vue.extend({

	components: { Builds, Settings, DeleteDialog, UserAvatar },

	beforeRouteEnter: beforeRoute,

	beforeRouteUpdate(to, from, next) {
		beforeRoute(to, from, () => {
			next();
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
			this.originalComponent = this.$route.meta.component;
			this.component = this.$route.meta.component;
			this.tab = '/component/' + this.id + '/' + this.$route.params.section;
			this.updateTab();

			if (load) {
				this.loadRevisions();
				this.loadCommentCount();
			}
		},

		shortcutSave(event) {
			this.save();
			event.preventDefault();
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

		updateOriginalData() {
			this.originalComponent = this.$deepClone(this.component);
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

            ComponentService.getRevisions(this.id)
                .then(response => {
                    this.revisions = response.data.reverse();
                    this.revisionOffset = 0;
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
		},

        openPublish() {
            this.publishModal.visible = true;
        },

        publish(version, changelog) {

            DeploymentService.fork('component', this.id, version, changelog)
                .then(response => {
                    this.publishModal.visible = false;
                    this.publishModal.publied = true;
                })
                .catch(error => this.$handleError(this, error))
                .finally(() => this.$root.isLoading = false);
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

                    this.$root.$emit('COMPONENT_UPDATE');
                    this.$root.isSaved = true;

                    if (this.id !== response.data.id) {
                        return this.$router.push('/component/' + response.data.id);
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
				ComponentService.remove(this.id)
					.then(response => {
						this.isDeleted = true;
						this.$refs.deleteModal.hide();
                        this.$root.$emit('COMPONENT_UPDATE');
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
			} else {
				this.$refs.deleteModal.show();
			}
		},

		restore() {

            this.$root.isLoading = true;
            ComponentService.restore(this.id)
                .then(response => {
                    this.isDeleted = false;
                    this.$root.$emit('COMPONENT_UPDATE');
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

		lastBuildState() {
			return this.builds.length > 0 && this.builds[0].state;
		},

		dataHasChanged() {
			return JSON.stringify(this.component) !== JSON.stringify(this.originalComponent);
		},

		sourceDark() {
            return (this.tab === '/component/' + this.id + '/source')
				&& this.$root.user.settings.development.theme === 'dark';
		}
	},

	data() {
		return {
            publishModal: {
                visible: false,
                publied: false,
            },
			isDeleted: false,
			formErrors: [],
            revisions: [],
            revisionOffset: 0,
			originalComponent: {},
			component: {},
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
