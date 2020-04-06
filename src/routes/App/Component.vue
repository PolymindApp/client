<template>
	<v-sheet class="panel-overflow d-flex flex-column w-100" style="border-radius: 0;">

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
					{{$t('component.source.publishModal.title')}}
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
					{{$t('component.source.forkModal.title')}}
				</v-card-title>

				<v-card-text>
					<span v-text="$t('component.source.forkModal.forkDesc')"></span>
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
				<v-tab :disabled="isDeleted" :to="'/component/' + id + '/settings'" exact>
					<v-icon left>mdi-pencil-box-outline</v-icon>
					{{$t('component.settings.title')}}
				</v-tab>
				<v-tab :disabled="isDeleted" :to="'/component/' + id + '/source'" exact>
					<v-icon left>mdi-code-tags</v-icon>
					{{$t('component.source.title')}}
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

				<v-btn :disabled="!dataHasChanged || isDeleted" @click="openPublish()" color="info" class="mt-3 mr-3" small hidden>
					<v-icon left>mdi-publish</v-icon>
					{{$t('modal.publish')}}
				</v-btn>
			</v-tabs>

			<v-alert v-if="isDeleted" tile prominent type="error">
				<v-row align="center">
					<v-col class="grow">
						<span v-text="$t('component.isDeleted')"></span>
					</v-col>
					<v-col class="shrink">
						<v-btn @click="restore()">
							<span v-text="$t('component.restore')"></span>
						</v-btn>
					</v-col>
				</v-row>
			</v-alert>
		</div>

		<v-tabs-items touchless :dark="$root.user.settings.theme === 'dark'" :style="{ flex: 1, overflow: (tab !== '/component/' + id + '/source') ? 'auto' : null }" v-model="tab">
			<v-tab-item :value="'/component/' + id + '/settings'" class="pa-4 fill-height">
				<div style="height: 0">
					<Settings @update="updateTab()" :component="component" :form-errors="formErrors" />
				</div>
			</v-tab-item>
			<v-tab-item :value="'/component/' + id + '/source'" class="fill-height">
				<Source :component="component" :form-errors="formErrors" />
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
import Source from "./Component/Source";
import Settings from "./Component/Settings";
import ComponentService from "../../services/ComponentService";
import ComponentModel from "../../models/Component";
import DeleteDialog from "../../components/DeleteDialog";
import CommentService from "../../services/CommentService";
import DeploymentService from "../../services/DeploymentService";

export default Vue.extend({

	components: { Source, Settings, DeleteDialog },

	mounted() {
		this.initializeValues();
		this.load();
		this.loadRevisions();
		this.updateTab();
		this.loadCommentCount();

		this.$shortcuts.add(this.$t('shortcuts.component.save.title'), this.$t('shortcuts.component.save.desc'), 'component', ['ControlLeft', 'KeyS'], this.shortcutSave);
	},

	destroyed() {
		this.$shortcuts.remove(this.shortcutSave);
	},

	methods: {

		shortcutSave() {
			this.save();
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
			document.title = sectionTitle + ' | ' + this.$t('title.component');

			this.isNew = this.$route.params.id === 'new';
			this.id = this.isNew ? 'new' : parseInt(this.$route.params.id);

			setTimeout(() => {
				const event = new Event('resize');
				window.dispatchEvent(event);
			});
		},

		updateOriginalData() {
			this.originalComponent = this.$deepClone(this.component);
		},

        loadCommentCount() {

            CommentService.count.bind(this)('component', this.id)
                .then(response => {
                    this.commentCount = response.meta.filter_count;
                })
                .catch(error => this.$handleError(this, error));
		},

        loadRevision(offset) {

            this.load(offset);
		},

		loadRevisions() {

            ComponentService.getRevisions.bind(this)(this.id)
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
				ComponentService.get.bind(this)(this.id, revisionOffset)
					.then(response => {

					    if (revisionOffset !== undefined) {
                            this.id = response.data.data.id;
                            this.component = new ComponentModel(response.data.data);
						} else {
                            this.id = response.data.id;
                            this.component = new ComponentModel(response.data);
						}

					    this.isNew = false;
						this.updateOriginalData();
						this.updateTab();
					})
					.catch(error => {
						if (error.code === 203) {
							return this.$router.push('/404')
						}
						this.$handleError(this, error);
					})
					.finally(() => this.$root.isLoading = false);
			}
		},

		reset() {
			this.component = new ComponentModel(this.$deepClone(this.originalComponent));
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
            this.isDeleted = false;
			this.component = new ComponentModel();
		},

		save() {

			if (!this.dataHasChanged) {
				return;
			}

			this.formErrors = [];
			this.$root.isLoading = true;
			ComponentService.save.bind(this)(this.id !== 'new' ? this.id : null, this.component)
				.then(response => {

                    this.$root.$emit('COMPONENT_UPDATE');
                    this.$root.isSaved = true;

                    if (this.id !== response.data.id) {
                        return this.$router.push('/component/' + response.data.id);
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
				ComponentService.remove.bind(this)(this.id)
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
            ComponentService.restore.bind(this)(this.id)
                .then(response => {
                    this.isDeleted = false;
                    this.$root.$emit('COMPONENT_UPDATE');
                })
                .catch(error => this.$handleError(this, error))
                .finally(() => this.$root.isLoading = false);
		}
	},

	computed: {

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
            forkModal: {
                visible: false,
                forked: false,
            },
            publishModal: {
                visible: false,
                publied: false,
            },
			id: this.$route.params.id,
			isNew: this.$route.params.id === 'new',
			isDeleted: false,
			formErrors: [],
            revisions: [],
            revisionOffset: 0,
			tab: '/component/new/edit',
			originalComponent: {},
			component: {},
            commentCount: 0,
		}
	},

	watch: {
		'$route.params.id': function() {
			this.initializeValues();
			this.updateTab();
			this.load();
			this.loadRevisions();
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
