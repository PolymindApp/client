<template>
	<v-card tile flat color="secondary" dark class="d-flex flex-column align-center justify-center w-100">
		<div class="limited-content text-center">
			<h1 class="display-2 font-weight-thin">
				{{$t('error404.title')}}
			</h1>
			<p class="mt-4">
				{{$t('error404.desc')}}
			</p>
			<div>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" color="primary" @click="goBack()">
							<v-icon>mdi-arrow-left</v-icon>
						</v-btn>
					</template>
					<span v-text="$t('error404.tooltips.goBack')"></span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="ml-4" v-on="on" color="primary" @click="goHome()">
							<v-icon>mdi-home</v-icon>
						</v-btn>
					</template>
					<span v-text="$t('error404.tooltips.goHome')"></span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn disabled class="ml-4" v-on="on" color="primary" @click="search()">
							<v-icon>mdi-search-web</v-icon>
						</v-btn>
					</template>
					<span v-text="$t('error404.tooltips.search')"></span>
				</v-tooltip>
			</div>
		</div>
	</v-card>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
	name: 'Error404',

	methods: {

	    goBack() {
	        this.$router.back();
		},

        goHome() {
			this.$router.push('/');
		},

        search() {

		},
	},

	data() {
	    return {

		}
	}
});
</script>

<style lang="scss" scoped>

</style>
