<template>
	<div class="page-component">
		<v-progress-linear v-if="isLoading" color="white" indeterminate rounded height="6" style="max-width: 100px; margin: 0 auto"></v-progress-linear>

		<v-alert v-if="notFound" border="left" colored-border type="error" light elevation="2">
			{{ $t('component.page.empty') }}
		</v-alert>

		<v-alert v-if="isUnauthorized" border="left" colored-border type="error" light elevation="2">
			{{ $t('component.page.unauthorized') }}
		</v-alert>

		<v-scroll-y-transition mode="out-in">
			<div v-if="content" v-html="content" />
		</v-scroll-y-transition>
	</div>
</template>

<script>
import Vue from 'vue';
import PageService from '../services/Page';

export default Vue.extend({
	name: 'Content',
	props: ['slug'],

	mounted() {
		this.load();
	},

	methods: {

		load() {
			this.isLoading = true;
			PageService.get.bind(this)(this.slug).then(page => this.content = page.data.content)
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
			notFound: false,
		    isUnauthorized: false,
			isLoading: false,
			content: null,
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

</style>
