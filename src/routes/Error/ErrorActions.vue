<template>
	<div>
		<v-tooltip bottom>
			<template v-slot:activator="{ on }">
				<v-btn v-on="on" color="primary" @click="goBack()">
					<v-icon>mdi-arrow-left</v-icon>
				</v-btn>
			</template>
			<span v-text="$t('error.actions.goBack')"></span>
		</v-tooltip>
		<v-tooltip bottom>
			<template v-slot:activator="{ on }">
				<v-btn class="ml-4" v-on="on" color="primary" @click="goHome()">
					<v-icon>mdi-home</v-icon>
				</v-btn>
			</template>
			<span v-text="$t('error.actions.goHome')"></span>
		</v-tooltip>
		<v-tooltip bottom>
			<template v-slot:activator="{ on }">
				<v-btn disabled class="ml-4" v-on="on" color="primary" @click="search()">
					<v-icon>mdi-search-web</v-icon>
				</v-btn>
			</template>
			<span v-text="$t('error.actions.search')"></span>
		</v-tooltip>
	</div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'Error.Actions',

        props: [],

        components: {},

        mounted() {

        },

        destroyed() {

        },

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

        computed: {

		},

        data() {
            return {

			};
        }
    });
</script>

<style lang="scss" scoped>

</style>
