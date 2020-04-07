<template>
	<div>
		<DeleteDialog ref="deleteModal" :title="$t('comment.deleteTitle')" :desc="$t('comment.deleteDesc')" @delete="remove(deleteClaimant, true)" />

		<v-overlay :absolute="false" :value="isLoading" z-index="10">
			<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
		</v-overlay>

		<div style="flex: 1" class="fill-height">
			<template v-if="comments.length > 0">
				<v-slide-y-transition group>
					<div v-for="(comment, index) in comments" :key="index + '_item'">
						<CommentItem :id="id" :collection="collection" :class="{ 'mt-4': index > 0 }" :comment.sync="comments[index]" @remove="remove($event)" />
					</div>
				</v-slide-y-transition>
			</template>
			<template v-else-if="hasLoaded && comments.length === 0">
				<slot name="empty">
					<div v-text="$t('comment.emptyTitle')"></div>
				</slot>
			</template>
		</div>
	</div>
</template>

<script>
    import Vue from 'vue';
    import CommentService from "../services/CommentService";
    import EmptyView from "./EmptyView";
    import UserAvatar from "./UserAvatar";
    import DeleteDialog from "./DeleteDialog";
	import CommentItem from "./Comment/Item";
	import CommentSorting from "./Comment/Sorting";

    export default Vue.extend({

        name: 'Comments',

        props: ['id', 'collection', 'comments', 'total', 'sortBy'],

        components: { EmptyView, UserAvatar, DeleteDialog, CommentSorting, CommentItem },

		mounted() {
        	this.load(this.id, this.collection);
		},

        methods: {

			load(id, collection, sort) {

                this.isLoading = true;
                Promise.all([
					CommentService.count.bind(this)(collection, id, sort),
					CommentService.getAll.bind(this)(collection, id, sort)
				]).then(([count, comments]) => {
					this.reset();
					this.$emit('update:total', count.meta.filter_count);
					this.$emit('update:comments', comments.data);
					this.hasLoaded = true;
				})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.isLoading = false);
			},

			reset() {
				this.$emit('update.comments', []);
                Object.assign(this, {
                    isLoading: false,
                    hasLoaded: false,
                    isSending: false,
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

							this.$stats.push('DELETE_COMMENT', {
								id
							});
                        })
                        .catch(error => this.$handleError(this, error))
                        .finally(() => this.isLoading = false);
				}
			},
		},

        data() {
            return {
                deleteClaimant: null,
				isLoading: false,
				hasLoaded: false,
			};
        },

		watch: {

        	sortBy(sortBy) {
        		if (sortBy) {
        			this.load(this.id, this.collection, sortBy);
				}
			}
		}
    });
</script>

<style lang="scss" scoped>

</style>
