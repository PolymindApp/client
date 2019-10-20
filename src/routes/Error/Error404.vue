<template>
	<v-card tile flat dark class="d-flex flex-column align-center justify-center" style="width: 100%">
		<div>
			<v-icon color="primary" style="font-size: 5rem">mdi-file-question-outline</v-icon>
		</div>
		<h1 class="display-1 mt-4">
			{{$t('title.error404')}}
		</h1>
		<p class="grey--text">
			{{$t('error404.desc')}}
		</p>
		<v-btn color="primary" @click="goBack()">
			<v-icon left>mdi-arrow-left</v-icon>
			{{ $t('error.goBack') }}
		</v-btn>
	</v-card>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
	name: 'Error404',

	methods: {

	    goBack() {
	        this.$router.back();
		}
	},

	data() {
	    return {

		}
	}
});
</script>

<style lang="scss" scoped>

</style>
