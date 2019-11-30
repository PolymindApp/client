<template>
	<div>
		<v-chip v-if="readonly && currentValue === null" class="text-center" x-small>NULL</v-chip>
		<span v-if="readonly" v-text="currentValue"></span>
		<v-text-field v-else ref="input" type="date" v-model="currentValue" v-bind="$attrs" v-on="$listeners" />
	</div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'DataDate',

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

				if (!this.$refs.input) {
					return;
				}

				this.$refs.input.focus();
				this.$refs.input.$el.querySelector('input').select();
			},

			clear() {

                this.$emit('input', null);
			},
		},

        computed: {

		},

        data() {
            return {
                currentValue: this.value,
			};
        },

        watch: {
            value(value) {
                this.currentValue = value;
            }
        }
    });
</script>

<style lang="scss" scoped>

</style>
