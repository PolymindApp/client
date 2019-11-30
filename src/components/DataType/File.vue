<template>
	<div>
		<template v-if="readonly">
			<a :href="currentValue" target="_blank" v-text="currentValue" class="text-truncate d-inline-block"></a>
		</template>
		<template v-else>
			<v-file-input ref="input" v-model="currentValue" v-bind="$attrs" v-on="$listeners" />
		</template>
	</div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'DataFile',

        props: {
            value: {
                default: null,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
        },

        components: {},

        mounted() {

        },

        destroyed() {

        },

        methods: {

            edit() {

            },

            focus() {

            },

            clear() {
                this.$emit('input', null);
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
