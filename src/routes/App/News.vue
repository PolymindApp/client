<template>
	<v-card flat tile class="fill-height grey lighten-2 w-100">

		<!-- HEADER -->
		<Header :news="news" v-if="isLoaded" />

		<v-container v-if="isLoaded" class="pa-4">

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
				<v-divider class="my-12"></v-divider>
			</div>

			<!-- COMMENTS -->
			<div class="my-12">
				<h3 v-if="totalComments === 0" v-text="$t('comment.title')"></h3>
				<Comments ref="comments" collection="news" :id="news.data.id"></Comments>
			</div>
		</v-container>
	</v-card>
</template>

<script>
import Vue from 'vue';
import Header from "./News/Header";
import NewsService from "../../services/NewsService";
import UserAvatar from "../../components/UserAvatar";
import Comments from "../../components/Comments";

export default Vue.extend({

	components: { Header, UserAvatar, Comments },

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

			document.title = title + ' | ' + this.$t('title.news');
		},

	    load() {

			this.slug = this.$route.params.slug;
			this.locale = this.$route.params.locale;

			this.$root.isLoading = true;
			Promise.all([
				NewsService.get.bind(this)(this.slug, this.locale),
			]).then(([news]) => {
                this.news = news;
                this.isLoaded = true;
                this.updateContext();
			})
				.catch(error => {
					return this.$router.push('/404');
				})
				.finally(() => this.$root.isLoading = false);
		},
	},

	computed: {

		totalComments() {
			return 1; //this.$refs.comments.totalCount;
		}
	},

	data() {

		return {
			isLoaded: false,
			news: {},
			slug: null,
			locale: null,
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
