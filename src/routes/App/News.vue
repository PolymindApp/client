<template>
	<v-card flat tile class="fill-height grey lighten-2 w-100">

		<!-- HEADER -->
		<Header :news="news" v-if="isLoaded" />

		<v-expand-transition>
			<div v-if="isLoaded && !$root.isLoading" class="white pb-12">
				<v-container class="pa-4">

					<!-- CONTENT -->
					<div class="my-12" v-html="news.data.content[0].content"></div>

					<!-- CREDITS -->
					<div>
						<div class="d-flex align-center">
							<UserAvatar :size="64" :user="news.data.created_by" />
							<div class="ml-4">
								<div v-html="$t('news.writtenBy', { screenName: $options.filters.userScreenName(news.data.created_by) })"></div>
								<div>{{ news.data.created_on | timeAgo }}</div>
							</div>
						</div>
					</div>
				</v-container>
			</div>
		</v-expand-transition>

		<v-expand-transition>
			<v-container v-if="isLoaded && !$root.isLoading" class="pa-4">

				<!-- COMMENTS -->
				<div class="my-12 mb-4 mb-md-12">

					<v-row class="mb-8" no-gutters>
						<v-col cols="12" md="6">
							<v-icon left>mdi-comment-multiple</v-icon>
							<h2 class="title d-inline-block" v-text="$tc('comment.totalTitle', totalComments, { amount: totalComments })"></h2>
						</v-col>
						<v-col cols="12" md="6" class="text-left text-md-right">
							<CommentSorting :comments="comments" @sortBy="commentsSortBy = $event" />
						</v-col>
					</v-row>

					<CommentForm collection="news" :id="news.data.id" :comments.sync="comments" :total.sync="totalComments" solo />

					<v-divider class="my-6" />

					<Comments collection="news" :id="news.data.id" :comments.sync="comments" :total.sync="totalComments" :sort-by="commentsSortBy" />
				</div>
			</v-container>
		</v-expand-transition>
	</v-card>
</template>

<script>
import Vue from 'vue';
import Header from "./News/Header";
import { NewsService } from "@polymind/sdk-js";
import UserAvatar from "../../components/UserAvatar";
import Comments from "../../components/Comments";
import CommentForm from "../../components/Comment/Form";
import CommentSorting from "../../components/Comment/Sorting";

export default Vue.extend({

	components: { Header, UserAvatar, Comments, CommentForm, CommentSorting, },

	mounted() {
	    this.load();
	},

	methods: {

		updateContext() {

			const title = this.news.data.content[0].title;

			this.$root.breadcrumbs = [
				this.$t('title.news'),
				title,
			];

			document.title = title + ' - ' + this.$t('title.news');
		},

	    load() {

			this.slug = this.$route.params.slug;
			this.locale = this.$route.params.locale;

			this.$root.isLoading = true;
			Promise.all([
				NewsService.get(this.slug, this.locale),
			]).then(([news]) => {
                this.news = news;
                this.isLoaded = true;
                this.updateContext();
			})
				.catch(error => {
					return this.$router.replace('/404');
				})
				.finally(() => this.$root.isLoading = false);
		},
	},

	computed: {

	},

	data() {

		return {
			isLoaded: false,
			news: {},
			slug: null,
			locale: null,
			comments: [],
			totalComments: 0,
			commentsSortBy: null,
		}
	},

	watch: {
		'$route.params.slug': function(id) {
			this.load();
		}
	}
});
</script>

<style lang="scss" scoped>

</style>
