<template>
	<v-card color="transparent" tile flat class="pa-4 d-flex align-center justify-center flex-column fill-height align-self-center text-center w-100">
		<img v-if="image" :src="image" height="128" class="mb-2" />
		<div v-if="title || desc" class="very-limited-content">
			<h2 class="display-1 text-no-wrap" v-if="title" v-text="title"></h2>
			<p class="overline" v-if="desc" v-text="desc"></p>
		</div>
	</v-card>
</template>

<script>
    import Vue from 'vue';
    import defaultImage from '../assets/images/polymind.svg'

    export default Vue.extend({

        name: 'EmptyView',

        props: {
            title: {
                type: [String, Boolean],
				default: false,
			},
            desc: {
                type: [String, Boolean],
				default: false,
			},
            image: {
                type: [String, Boolean],
				default: defaultImage,
			},
		},

        components: {},

        mounted() {

        },

        destroyed() {

        },

        methods: {

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
