<template>
	<v-card tile flat color="secondary" dark class="d-flex flex-column align-center justify-center w-100">
		<div class="limited-content text-center">
			<h1 class="display-2 font-weight-thin">
				{{$t('error.404.title')}}
			</h1>
			<p class="mt-4">
				{{$t('error.404.desc')}}
			</p>

			<ErrorActions />
		</div>
	</v-card>
</template>

<script>
import Vue from 'vue';
import ErrorActions from "./ErrorActions";

export default Vue.extend({
	name: 'Error404',

	components: { ErrorActions },

	methods: {

	},

	data() {
	    return {

		}
	}
});
</script>

<style lang="scss" scoped>

</style>
