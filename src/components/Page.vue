<template>
	<div class="page-component">
		<v-progress-linear v-if="isLoading" color="white" indeterminate rounded height="6" style="max-width: 100px; margin: 0 auto"></v-progress-linear>

		<v-alert v-if="notFound" border="left" colored-border type="error" light elevation="2">
			{{ $t('component.page.empty') }}
		</v-alert>

		<v-alert v-if="isUnauthorized" border="left" colored-border type="error" light elevation="2">
			{{ $t('component.page.unauthorized') }}
		</v-alert>

		<slot name="title" v-if="!isLoading" :page="page">
			<h1 class="display-1 mb-4" v-if="$attrs.title !== undefined" v-text="title"></h1>
		</slot>

		<v-scroll-y-transition mode="out-in">
			<div v-if="content">
				<slot name="content" :page="page">
					<div v-html="content" />
				</slot>
			</div>
		</v-scroll-y-transition>
	</div>
</template>

<script>
import Vue from 'vue';
import PageService from '../services/PageService';

export default Vue.extend({
	name: 'Page',
	props: ['slug'],

	mounted() {
		this.load();
	},

	methods: {

		load() {
			this.isLoading = true;
			PageService.get.bind(this)(this.slug).then(page => {
				this.page = page.data;
				this.content = page.data.content;
				this.title = page.data.title;
			})
				.catch(error => {
					if (error.response.status === 404) {
						return this.notFound = true;
					}
					if (error.data.message) {
						switch(error.data.message) {
							case 'UNAUTHORIZED':
								return this.isUnauthorized = true;
								break;
						}
					}

					this.$handleError(this, error);
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
	},

	data() {
		return {
		    page: {
		        title: null,
				content: null,
			},
			notFound: false,
		    isUnauthorized: false,
			isLoading: false,
			content: null,
			title: null,
		};
	},

	watch: {
		'$i18n.locale': function(locale) {
			this.load();
		}
	}
});
</script>

<style lang="scss">

	.page-component blockquote {
		margin: 1rem;
		border-left: rgba(255, 255, 255, 0.2) solid 3px;
		padding-left: 1rem;
		color: rgba(255, 255, 255, 0.75);
		font-size: 1.25rem;
	}

	.page-component h1,
	.page-component h2,
	.page-component h3,
	.page-component h4,
	.page-component h5,
	.page-component h6 {
		margin-bottom: 1rem;
	}

	.page-component ul > li + li,
	.page-component ol > li + li {
		margin-top: 0.5rem;
	}
</style>
