<template>
	<v-sheet class="panel-overflow d-flex flex-column" style="width: 100%; border-radius: 0;">

		<DeleteDialog ref="deleteModal" @delete="remove(true)" />

		<v-tabs show-arrows style="flex: 0" v-model="tab" background-color="rgba(0, 0, 0, 0.1)" @change="updateTab()">
			<v-tab :to="'/component/' + id + '/settings'" exact>
				<v-icon left>mdi-pencil-box-outline</v-icon>
				{{$t('component.settings.title')}}
			</v-tab>
			<v-tab :to="'/component/' + id + '/source'" exact>
				<v-icon left>mdi-code-tags</v-icon>
				{{$t('component.source.title')}}
			</v-tab>
<!--			<v-tab :to="'/component/' + id + '/params'" exact>-->
<!--				<v-icon left>mdi-card-bulleted-settings</v-icon>-->
<!--				{{$t('component.params.title')}}-->
<!--			</v-tab>-->
<!--			<v-tab :to="'/component/' + id + '/events'" exact>-->
<!--				<v-icon left>mdi-flash-outline</v-icon>-->
<!--				{{$t('component.events.title')}}-->
<!--			</v-tab>-->

			<v-spacer></v-spacer>

			<v-btn @click="$comments.open(id, 'component')" class="ma-3" text small>
				<v-icon left>mdi-comment</v-icon>
				{{$t('comment.btnTitle')}}
				<v-chip v-if="commentCount > 0" class="ml-2" color="primary" x-small v-text="commentCount" />
			</v-btn>
		</v-tabs>

		<div v-if="isDeleted">
			IS DELETED
		</div>

		<v-tabs-items style="flex: 1; overflow: auto;" v-model="tab">
			<v-tab-item :value="'/component/' + id + '/settings'" class="pa-4 fill-height">
				<Settings @update="updateTab()" :component="component" :form-errors="formErrors" />
			</v-tab-item>
			<v-tab-item :value="'/component/' + id + '/source'" class="fill-height">
				<Source :component="component" :form-errors="formErrors" />
			</v-tab-item>
<!--			<v-tab-item :value="'/component/' + id + '/params'" class="pa-4 fill-height">-->
<!--				<Params :component="component" :form-errors="formErrors" />-->
<!--			</v-tab-item>-->
<!--			<v-tab-item :value="'/component/' + id + '/events'" class="pa-4 fill-height">-->
<!--				<Events :component="component" :form-errors="formErrors" />-->
<!--			</v-tab-item>-->
		</v-tabs-items>

		<v-card :dark="tab === '/component/' + id + '/source'" flat class="pa-4" style="flex: 0; border-radius: 0">
			<v-btn :disabled="!dataHasChanged" @click="save()" color="primary" class="mr-1">
				<v-icon left>mdi-content-save</v-icon>
				{{$t('modal.save')}}
			</v-btn>
			<v-btn :disabled="!dataHasChanged" @click="reset()" text>
				{{$t('modal.cancel')}}
			</v-btn>

			<v-btn :disabled="isNew" @click="remove()" class="float-right" text color="error">
				<v-icon :left="$vuetify.breakpoint.mdAndUp">mdi-delete</v-icon>
				<span v-if="$vuetify.breakpoint.mdAndUp">{{$t('modal.delete')}}</span>
			</v-btn>

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
		</v-card>
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

export default Vue.extend({

	components: { Source, Settings, DeleteDialog },

	mounted() {
		this.initializeValues();
		this.load();
		this.loadRevisions();
		this.updateTab();
		this.loadCommentCount();
	},

	methods: {

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

			this.id = this.$route.params.id;
			this.isNew = this.$route.params.id === 'new';

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
                .catch(error => this.$handleError(this, error))
                .finally(() => this.$root.isLoading = false);
		},

        loadRevision(offset) {

            this.load(offset);
		},

		loadRevisions() {

            ComponentService.getRevisions.bind(this)(this.id)
                .then(response => {
                    this.revisions = response.data;
                    this.revisionOffset = response.data.length - 1;
				})
                .catch(error => this.$handleError(this, error))
                .finally(() => this.$root.isLoading = false);
		},

		load(revisionOffset) {

			this.formErrors = [];

			if (!this.isNew) {

				this.$root.isLoading = true;
				ComponentService.get.bind(this)(this.id, revisionOffset)
					.then(response => {

					    if (revisionOffset !== undefined) {
                            this.id = response.data.data.id;
                            this.component = response.data.data;
						} else {
                            this.id = response.data.id;
                            this.component = response.data;
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
			} else {
				this.$root.isLoading = true;
				ComponentService.get.bind(this)(1)
					.then(response => {
						this.initializeValues();
						this.component.html = response.data.html;
						this.component.js = response.data.js;
						this.component.scss = response.data.scss;
						this.updateOriginalData();
						this.updateTab();
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
			}
		},

		reset() {
			this.component = this.$deepClone(this.originalComponent);
		},

		initializeValues() {
			this.component = new ComponentModel();
		},

		save() {

			this.formErrors = [];
			this.$root.isLoading = true;
			ComponentService.save.bind(this)(this.id !== 'new' ? this.id : null, this.component)
				.then(response => {
					this.id = response.data.id;
					this.isNew = false;
					this.updateOriginalData();
					this.loadRevisions();
					this.updateTab();
					this.$root.isSaved = true;
					this.revisionOffset = 0;
                    this.$root.$emit('COMPONENT_UPDATE');
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
			return JSON.stringify(this.component) !== JSON.stringify(this.originalComponent);
		},
	},

	data() {
		return {
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
		}
	}
});
</script>

<style lang="scss" scoped>
	.v-tabs-items >>> .v-window__container {
		height: 100%;
	}
</style>
