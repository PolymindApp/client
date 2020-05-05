<template>
	<v-card color="transparent" v-bind="$attrs" tile flat class="pa-4 d-flex align-center justify-center flex-column fill-height align-self-center text-center w-100">

		<v-icon v-if="icon" :size="size" :color="color" class="mb-2">{{icon}}</v-icon>
		<v-img v-else-if="image" :src="image" :max-height="size" transition="slide-y-reverse-transition" contain class="mb-2" />

		<div v-if="title || desc" class="align-center d-flex flex-column">
			<h2 class="title limited-content" v-if="title" v-text="title"></h2>
			<p class="overline very-limited-content" v-if="desc" v-text="desc"></p>
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
            icon: {
                type: [String, Boolean],
				default: null,
			},
            color: {
                type: String,
				default: null,
			},
            size: {
                type: Number,
				default: 128,
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
