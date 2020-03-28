<template>
	<div class="d-flex">

		<!-- AVATAR -->
		<UserAvatar :size="48" :user="comment.action_by" class="align-self-start mr-4" />

		<div class="w-100">

			<!-- USERNAME -->
			<v-list-item-title>
				<span class="font-weight-medium">{{comment.action_by | userScreenName }}</span>
				<span class="font-weight-light ml-0 ml-md-4 d-block d-md-inline">{{comment.action_on | timeAgo}}</span>
			</v-list-item-title>

			<div>
				<div v-if="comment.comment_deleted_on === null" class="body-1">

					<!-- MESSAGE -->
					<div v-if="isModifying">
						<v-text-field @keyup="handleEditKeyUp" @blur="update" ref="modify" v-model="comment.comment" class="ma-0 pa-0" outlined dense hide-details></v-text-field>
					</div>
					<span class="mr-2" v-else>
						<span class="mr-2">{{comment.comment | plainExcerpt(expandedComment[comment.id] || 100) }}</span>
						<a v-if="comment.comment.length > 100 && !expandedComment[comment.id]" @click="toggleExpand(comment)" v-text="$t('comment.viewCompleteMsg')"></a>
						<a v-if="expandedComment[comment.id]" @click="toggleExpand(comment)" v-text="$t('comment.unviewCompleteMsg')"></a>
					</span>

					<!-- OWNER OPTIONS -->
					<span v-if="!isModifying" class="d-inline-block">

						<!-- DELETE -->
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-btn :disabled="comment.comment_deleted_on !== null" v-if="comment.action_by.id === $root.user.id" v-on="on" color="error" class="mr-1" @click="$emit('remove', comment.id)" small icon>
									<v-icon small>mdi-trash-can-outline</v-icon>
								</v-btn>
							</template>
							<span v-text="$t('comment.deleteTooltip')"></span>
						</v-tooltip>

						<!-- MODIFY -->
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-btn @click="modify()" :disabled="comment.comment_deleted_on !== null" v-if="comment.action_by.id === $root.user.id" v-on="on" color="primary" class="mr-1" small icon>
									<v-icon small>mdi-pencil</v-icon>
								</v-btn>
							</template>
							<span v-text="$t('comment.editTooltip')"></span>
						</v-tooltip>
					</span>
				</div>

				<!-- MESSAGE DELETED -->
				<div v-else class="py-2" style="opacity: 0.5">
					<v-icon left small>mdi-close</v-icon>
					<span v-text="$t('comment.commentDeleted')"></span>
				</div>
			</div>

			<div class="mt-2" v-if="comment.comment_deleted_on === null">

				<!-- THUMB UP -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn @click="toggleLike(comment.id)" :disabled="comment.comment_deleted_on !== null" :class="{ 'primary--text': totalThumbsUp > 0 }" v-on="on" small icon>
							<v-icon v-if="totalThumbsUp > 0" small>mdi-thumb-up</v-icon>
							<v-icon v-else small>mdi-thumb-up-outline</v-icon>
						</v-btn>
					</template>
					<span v-text="$t('comment.thumbUpTooltip')"></span>
				</v-tooltip>
				<span class="mx-1 primary--text" v-text="printTotalThumbsUp"></span>

				<!-- THUMB DOWN -->
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn @click="toggleLike(comment.id, false)" :disabled="comment.comment_deleted_on !== null" :class="{ 'ml-2': true, 'secondary--text': totalThumbsDown > 0 }" v-on="on" small icon>
							<v-icon v-if="totalThumbsDown > 0" small>mdi-thumb-down</v-icon>
							<v-icon v-else small>mdi-thumb-down-outline</v-icon>
						</v-btn>
					</template>
					<span v-text="$t('comment.thumbDownTooltip')"></span>
				</v-tooltip>
				<span class="mx-1 secondary--text" v-text="printTotalThumbsDown"></span>

				<!-- REPLY -->
				<v-btn v-if="!isReplying" @click="reply()" :class="{ 'ml-4': true }" :disabled="comment.comment_deleted_on !== null" small text>
					<v-icon small left>mdi-reply</v-icon>
					<span v-text="$t('comment.replyBtn')"></span>
				</v-btn>
			</div>

			<v-expand-transition group>
				<div class="mt-4" v-for="(comment, index) in replies" :key="index + '_item_' + comment.id">
					<CommentItem :id="id" :collection="collection" :class="{ 'mt-4': index > 0 }" :comment.sync="replies[index]" @remove="$emit('remove', $event)" />
				</div>
			</v-expand-transition>

			<v-expand-transition>
				<div v-if="isReplying">
					<div class="py-4">
						<v-divider class="mb-4"></v-divider>

						<CommentForm :id="id" :collection="collection" :comments.sync="replies" :parent="comment" @keyup="handleReplyKeyUp" @send="handleSend" solo autofocus />
						<div class="text-right">
							<a class="d-inline-block mt-2" @click="cancelReply()" v-text="$t('comment.cancel')"></a>
						</div>
					</div>
				</div>
			</v-expand-transition>
		</div>
	</div>
</template>

<script>
    import Vue from 'vue';
    import UserAvatar from "../UserAvatar";
    import DeleteDialog from "../DeleteDialog";
    import CommentForm from "../Comment/Form";
    import CommentItem from "../Comment/Item";
    import LikeService from "../../services/LikeService";
	import CommentService from "../../services/CommentService";

    export default Vue.extend({

        name: 'CommentItem',

        props: ['id', 'collection', 'comment'],

        components: { UserAvatar, DeleteDialog, CommentForm, CommentItem },

		mounted() {

		},

        methods: {

			handleEditKeyUp(event) {
				switch (event.code) {
					case 'Escape':
						this.isModifying = false;
						break;
					case 'Enter':
						this.$refs.modify.$el.querySelector('input').blur();
						break;
				}
			},

			handleReplyKeyUp(event) {
				switch (event.code) {
					case 'Escape':
						this.isReplying = false;
						break;
				}
			},

			handleSend() {
				this.isReplying = false;
			},

			toggleExpand(comment) {
                if (this.expandedComment[comment.id]) {
                	delete this.expandedComment[comment.id]
				} else {
                    this.expandedComment[comment.id] = 1e100;
				}
                this.$forceUpdate();
			},

			toggleLike(activityId, isPositive = true) {

                LikeService.toggle.bind(this)(activityId, isPositive)
                    .then(response => {
                    	const comment = this.$deepClone(this.comment);
                    	comment.comment_thumb_up = response.data.comment_thumb_up;
                    	comment.comment_thumb_down = response.data.comment_thumb_down ;

						this.$emit('update:comment', comment);
						this.$stats.push('LIKE', {
							activityId,
							isPositive
						});
                    })
                    .catch(error => this.$handleError(this, error))
                    .finally(() => this.isLoading = false);
			},

			modify() {
				this.beforeModifying = this.comment.comment;
				this.isModifying = true;
				this.$nextTick(() => {
					this.$refs.modify.$el.querySelector('input').focus();
				});
			},

			reply() {
				this.isReplying = true;
			},

			cancelReply() {
				this.isReplying = false;
			},

			update() {

				if (this.beforeModifying.trim() === this.comment.comment.trim()) {
					this.isModifying = false;
					return;
				}

				this.isLoading = true;
				CommentService.update.bind(this)(this.comment.id, this.comment.comment)
					.then(response => {
						const comment = this.$deepClone(this.comment);
						comment.comment = response.data.comment;

						this.$emit('update:comment', comment);
						this.$stats.push('MODIFY_COMMENT', {
							id: comment.id,
							comment: comment.comment,
						});

						this.$root.isSaved = true;
						this.isModifying = false;
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.isLoading = false);
			}
		},

		computed: {

        	totalThumbsUp() {
        		const result = this.comment.comment_thumb_up - this.comment.comment_thumb_down;
        		return result > 0 ? result : 0;
			},

        	totalThumbsDown() {
				const result = this.comment.comment_thumb_down - this.comment.comment_thumb_up;
				return result > 0 ? result : 0;
			},

			// Fix an issue with Vue not handle item with v-if position properly
			printTotalThumbsUp() {
        		return this.totalThumbsUp > 0 ? this.totalThumbsUp : '';
			},

			// Fix an issue with Vue not handle item with v-if position properly
			printTotalThumbsDown() {
				return this.totalThumbsDown > 0 ? this.totalThumbsDown : '';
			},
		},

        data() {
            return {
            	replies: [],
				beforeModifying: null,
            	isModifying: false,
            	isReplying: false,
				expandedComment: [],
			};
        }
    });
</script>

<style lang="scss" scoped>

</style>
