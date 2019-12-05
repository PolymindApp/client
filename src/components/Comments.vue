<template>
	<v-navigation-drawer fixed right temporary touchless v-model="sidebar.opened" width="450" color="transparent" style="z-index: 7">
		<v-card tile class="d-flex flex-column fill-height" color="grey lighten-3">

			<DeleteDialog ref="deleteModal" :title="$t('comment.deleteTitle')" :desc="$t('comment.deleteDesc')" @delete="remove(deleteClaimant, true)" />

			<v-overlay :absolute="false" :value="isLoading" z-index="10">
				<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
			</v-overlay>

			<div style="flex: 1; overflow: auto" class="pa-4">
				<template v-if="comments.length > 0">

					<div>
						<v-icon left>mdi-comment-multiple</v-icon>
						<h2 class="mb-4 title d-inline-block" v-text="$t('comment.totalTitle', { amount: totalCount })"></h2>

						<v-menu offset-y>
							<template v-slot:activator="{ on }">
								<v-btn class="float-right" v-on="on" text>
									<v-icon left>mdi-sort-variant</v-icon>
									<span v-text="$t('comment.sortBy')"></span>
								</v-btn>
							</template>
							<v-list>
								<v-list-item-group v-model="currentSortBy" color="primary">
									<v-list-item v-for="(item, index) in sortByItems" :key="index" @click="sortBy(item.value)">
										<v-list-item-title>{{ item.text }}</v-list-item-title>
									</v-list-item>
								</v-list-item-group>
							</v-list>
						</v-menu>

					</div>

					<v-list>
						<v-slide-y-transition group>
							<template v-for="(comment, index) in comments">
								<v-list-item :key="index + '_item'">
									<v-list-item-avatar class="align-self-start pt-4">
										<UserAvatar :size="48" :user="comment.action_by" />
									</v-list-item-avatar>

									<v-list-item-content>
										<v-list-item-title>
											<span class="font-weight-medium">{{comment.action_by | userScreenName }}</span>
											<span class="font-weight-light ml-4">{{comment.action_on | timeAgo}}</span>
										</v-list-item-title>
										<v-card v-if="comment.comment_deleted_on === null" class="body-1 mt-2 white py-2 px-3 elevation-1">
											<div>{{comment.comment | plainExcerpt(expandedComment[comment.id] || 100) }}</div>
											<a v-if="comment.comment.length > 100 && !expandedComment[comment.id]" @click="toggleExpand(comment)" v-text="$t('comment.viewCompleteMsg')"></a>
											<a v-if="expandedComment[comment.id]" @click="toggleExpand(comment)" v-text="$t('comment.unviewCompleteMsg')"></a>
										</v-card>
										<div v-else class="py-2" style="opacity: 0.5">
											<v-icon left small>mdi-close</v-icon>
											<span v-text="$t('comment.commentDeleted')"></span>
										</div>

										<div class="mt-2" v-if="comment.comment_deleted_on === null">
											<div class="float-left">
												<v-tooltip bottom>
													<template v-slot:activator="{ on }">
														<v-btn :disabled="comment.comment_deleted_on !== null" v-on="on" small icon>
															<v-icon small>mdi-thumb-up-outline</v-icon>
														</v-btn>
													</template>
													<span v-text="$t('comment.thumbUpTooltip')"></span>
												</v-tooltip>
												<span v-if="(comment.comment_thumb_up - comment.comment_thumb_down) > 0" class="mx-1" v-text="(comment.comment_thumb_up - comment.comment_thumb_down)"></span>
												<v-tooltip bottom>
													<template v-slot:activator="{ on }">
														<v-btn :disabled="comment.comment_deleted_on !== null" class="ml-2" v-on="on" small icon>
															<v-icon small>mdi-thumb-down-outline</v-icon>
														</v-btn>
													</template>
													<span v-text="$t('comment.thumbDownTooltip')"></span>
												</v-tooltip>
												<span v-if="(comment.comment_thumb_down - comment.comment_thumb_up) > 0" class="mx-1" v-text="(comment.comment_thumb_down - comment.comment_thumb_up)"></span>
											</div>
											<div class="float-right">
												<v-tooltip bottom>
													<template v-slot:activator="{ on }">
														<v-btn :disabled="comment.comment_deleted_on !== null" v-if="comment.action_by.id === $root.user.id" v-on="on" color="error" class="mr-1" @click="remove(comment.id)" small icon>
															<v-icon small>mdi-trash-can-outline</v-icon>
														</v-btn>
													</template>
													<span v-text="$t('comment.deleteTooltip')"></span>
												</v-tooltip>
												<v-tooltip bottom>
													<template v-slot:activator="{ on }">
														<v-btn :disabled="comment.comment_deleted_on !== null" v-if="comment.action_by.id === $root.user.id" v-on="on" color="primary" class="mr-1" small icon>
															<v-icon small>mdi-pencil</v-icon>
														</v-btn>
													</template>
													<span v-text="$t('comment.editTooltip')"></span>
												</v-tooltip>

												<v-btn :disabled="comment.comment_deleted_on !== null" small text>
													<v-icon small left>mdi-reply</v-icon>
													<span v-text="$t('comment.replyBtn')"></span>
												</v-btn>
											</div>
										</div>
									</v-list-item-content>
								</v-list-item>
							</template>
						</v-slide-y-transition>
					</v-list>
				</template>
				<EmptyView v-else-if="hasLoaded && comments.length === 0" :title="$t('comment.emptyTitle')" :desc="$t('comment.emptyDesc')" />
			</div>
			<div style="flex: 0" class="white">
				<v-scroll-y-transition mode="out-in">
					<v-form v-if="hasLoaded" @submit="send($event)" style="flex: 0">
						<v-text-field ref="comment" v-model="newComment.text" :disabled="isSending" @click:append="send($event)" :placeholder="$t('comment.newMessagePlaceholder')" append-icon="mdi-send" class="pa-4" outlined hide-details></v-text-field>
					</v-form>
				</v-scroll-y-transition>
			</div>
		</v-card>
	</v-navigation-drawer>
</template>

<script>
    import Vue from 'vue';
    import CommentService from "../services/CommentService";
    import EmptyView from "./EmptyView";
    import UserAvatar from "./UserAvatar";
    import DeleteDialog from "./DeleteDialog";

    export default Vue.extend({

        name: 'Comments',

        props: [],

        components: { EmptyView, UserAvatar, DeleteDialog },

        mounted() {

        },

        destroyed() {

        },

        methods: {

            open(id, collection) {

                this.sidebar.opened = true;
                if (!id) {
                    setTimeout(() => this.$refs.comment.$el.querySelector('input').focus());
				} else if (id !== this.previousId) {
                    this.reset();
					this.load(id, collection);
				}
			},

			toggleExpand(comment) {
                if (this.expandedComment[comment.id]) {
                	delete this.expandedComment[comment.id]
				} else {
                    this.expandedComment[comment.id] = 1e100;
				}
                this.$forceUpdate();
			},

			close() {
                this.sidebar.opened = false;
			},

			sortBy(sort) {
                this.load(this.previousId, this.collection, sort);
			},

			load(id, collection, sort) {

                this.isLoading = true;
                CommentService.getAll.bind(this)(collection, id, sort)
					.then(response => {
                        this.reset();
						this.comments = response.data;
						this.totalCount = response.meta.filter_count;
						this.hasLoaded = true;
						setTimeout(() => this.$refs.comment.$el.querySelector('input').focus())
					})
                    .catch(error => this.$handleError(this, error))
                	.finally(() => this.isLoading = false);

                this.previousId = id;
                this.collection = collection;
			},

			send(event) {

                event.preventDefault();

                this.isLoading = true;
                CommentService.save.bind(this)(this.previousId, this.collection, this.newComment.text)
                    .then(response => {
                        this.newComment.text = '';
                        this.comments.unshift(Object.assign(response.data, {
                            action_by: {...this.$root.user}
						}));
                        this.totalCount++;

                        if (this.$root.user.settings.newMessageSound) {
                            this.$playSound('send');
						}
                    })
                    .catch(error => this.$handleError(this, error))
                    .finally(() => this.isLoading = false);
			},

			reset() {
                Object.assign(this, {
                    isLoading: false,
                    hasLoaded: false,
                    isSending: false,
                    comments: [],
                    expandedComment: [],
                    totalCount: 0,
                    newComment: {
                        text: '',
                    }
				});
			},

            remove(id, force = false) {

                if (!force) {
                    this.deleteClaimant = id;
                    this.$refs.deleteModal.show();
				} else {
                    CommentService.delete.bind(this)(id)
                        .then(response => {
                            const comment = this.comments.find(comment => comment.id === id);
                            comment.comment_deleted_on = new Date();
                        })
                        .catch(error => this.$handleError(this, error))
                        .finally(() => this.isLoading = false);
				}
			}
		},

        computed: {

		},

        data() {
            return {
                deleteClaimant: null,
				previousId: null,
				collection: null,
				isLoading: false,
				hasLoaded: false,
                isSending: false,
                currentSortBy: 0,
                comments: [],
                expandedComment: [],
                totalCount: 0,
                sidebar: {
                    opened: false,
				},
                sortByItems: [
					{ text: this.$t('sortBy.mostRecent'), value: '-id' },
					{ text: this.$t('sortBy.oldest'), value: 'id' },
					{ text: this.$t('sortBy.thumbsUp'), value: '-comment_thumb_up' },
					{ text: this.$t('sortBy.thumbsDown'), value: '-comment_thumb_down' },
				],
                newComment: {
                    text: '',
				}
			};
        }
    });
</script>

<style lang="scss" scoped>

</style>
