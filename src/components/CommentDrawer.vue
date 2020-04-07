<template>
	<v-navigation-drawer fixed right temporary touchless v-model="sidebar.opened" width="450" color="transparent" style="z-index: 7">
		<v-card tile class="fill-height d-flex flex-column" color="grey lighten-3" v-if="sidebar.opened">

			<!-- HEADING -->
			<v-row style="flex: 0" class="pa-4" no-gutters>
				<v-col cols="12" md="6" class="d-flex align-center">
					<v-icon class="mr-4">mdi-comment-multiple</v-icon>
					<h2 class="title d-inline-block" v-text="$tc('comment.totalTitle', totalComments, { amount: totalComments })"></h2>
				</v-col>
				<v-col cols="12" md="6" class="text-left text-md-right">
					<CommentSorting :comments="comments" @sortBy="commentsSortBy = $event" />
				</v-col>
			</v-row>

			<!-- COMMENTS -->
			<div class="pa-4 scrollable fill-height" style="flex: 1">
				<Comments class="fill-height" :collection="collection" :id="id" :comments.sync="comments" :total.sync="totalComments" :sort-by="commentsSortBy">
					<template slot="empty">
						<EmptyView :title="$t('comment.emptyTitle')" :desc="$t('comment.emptyDesc')" />
					</template>
				</Comments>
			</div>

			<!-- FORM -->
			<div class="pa-4 white" style="flex: 0">
				<CommentForm :collection="collection" :id="id" :comments.sync="comments" :total.sync="totalComments" autofocus />
			</div>
		</v-card>
	</v-navigation-drawer>
</template>

<script>
    import Vue from 'vue';
    import Comments from "./Comments";
    import CommentForm from "./Comment/Form";
    import CommentSorting from "./Comment/Sorting";
	import EmptyView from "./EmptyView";

    export default Vue.extend({

        name: 'CommentDrawer',

        components: { Comments, EmptyView, CommentForm, CommentSorting },

		methods: {

			open(id, collection) {
				this.id = id;
				this.collection = collection;
				this.sidebar.opened = true;

				this.comments = [];
				this.commentsSortBy = null;
			},

			close() {
				this.sidebar.opened = false;
			},
		},

        data() {
            return {
            	id: null,
            	collection: null,
				comments: [],
				totalComments: 0,
				commentsSortBy: null,
                sidebar: {
                    opened: false,
				},
			};
        }
    });
</script>

<style lang="scss" scoped>
	.title {
		line-height: 1.5rem;
	}
</style>
