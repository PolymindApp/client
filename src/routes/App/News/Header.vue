<template>
	<v-img class="default-gradient wallpaper" transition="fade" :src="backgroundImage" :gradient="gradient">
		<v-container class="d-flex pa-4 wallpaper-container fill-height align-end pb-12">
			<h1 :class="{ 'white--text': true, 'display-1': isMobile, 'display-3': !isMobile }" v-text="title"></h1>
		</v-container>
	</v-img>
</template>

<script>
	import Vue from 'vue';

	export default Vue.extend({

		props: ['news'],

		methods: {

		},

		computed: {

			isMobile() {
				return this.$vuetify.breakpoint.smAndDown;
			},

			backgroundImage() {
				return (this.news.data && this.news.data.image && this.$thumbnails(this.news.data.image.private_hash, 'wallpaper')) || '';
			},

			gradient() {
				return this.backgroundImage ? 'to top right, rgba(27, 142, 138, .7), rgba(27, 142, 138, .3)' : null;
			},

			title() {
				return this.news.data && this.news.data.content[0].title;
			},
		},

		data() {
			return {

			}
		},
	});
</script>

<style lang="scss" scoped>

	.wallpaper,
	.wallpaper-container {
		min-height: 20rem;
	}
	.wallpaper {
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center center;
	}

	h1 {
		@media all and (min-width: 991px) {
			max-width: 75%;
		}
	}
</style>
