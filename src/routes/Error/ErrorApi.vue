<template>
	<v-card tile flat color="grey" dark class="d-flex flex-column align-center justify-center w-100">
		<div class="limited-content text-center">

			<v-icon size="96" class="mb-4" disabled>mdi-lan-disconnect</v-icon>

			<h1 class="display-2 font-weight-thin">
				{{$t('error.api.title')}}
			</h1>
			<p class="mt-4">
				{{$t('error.api.desc')}}
			</p>

<!--			<ErrorActions />-->
		</div>
	</v-card>
</template>

<script>
import Vue from 'vue';
import ErrorActions from "./ErrorActions";

export default Vue.extend({
	name: 'ErrorApi',

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
