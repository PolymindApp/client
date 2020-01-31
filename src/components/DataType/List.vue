<template>
	<div>
		<v-chip v-if="!canEdit && currentValue === null" class="text-center" x-small>NULL</v-chip>
		<span v-if="!canEdit" v-text="currentValue"></span>
		<v-select v-else ref="input" :items="items" type="text" v-model="currentValue" @blur="blur" v-bind="$attrs" v-on="$listeners" class="ma-0 pa-0" dense hide-details />
	</div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'DataText',

        props: {
            value: {
                default: null,
            },
            items: {
            	type: Array,
                default: [],
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
				this.focus();
			},

			blur() {
                this.isEditing = false;
                this.$emit('input', this.currentValue);
			},

			focus() {

				this.isEditing = true;

				this.$nextTick(() => {
					if (!this.$refs.input) {
						return;
					}

					this.$refs.input.focus();
					this.$refs.input.$el.querySelector('input').select();
				});
			},

			clear() {
                this.$emit('input', null);
			},

			reset() {
                this.$emit('input', this.originalValue);
			},
		},

        computed: {

            canEdit() {
                return !this.readonly && this.isEditing;
			},

			canReset() {
				return JSON.stringify(this.value) !== JSON.stringify(this.originalValue);
			}
		},

        data() {
            return {
                isEditing: false,
                currentValue: this.value,
                originalValue: this.value,
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
