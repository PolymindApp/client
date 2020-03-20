<template>
	<div class="w-100">
		<slot name="read" v-if="!canEdit">
			<v-chip v-if="currentValue === null" class="text-center pe-none" x-small>NULL</v-chip>
			<span v-else v-text="formattedValue"></span>
		</slot>
		<v-select v-else ref="input" :items="items" v-model="currentValue" @blur="blur" v-bind="$attrs" v-on="$listeners" class="ma-0 my-n1 pa-0" dense hide-details />
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
                default: () => [],
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
				this.$emit('update', this.currentValue);
			},

			focus() {

				this.isEditing = true;

				this.$nextTick(() => {
					if (!this.$refs.input) {
						return;
					}

					this.$refs.input.activateMenu();
					this.$refs.input.focus();
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
			},

			selectedValue() {
            	return this.items.find(item => item.value === this.currentValue);
			},

			formattedValue() {
            	if (this.items.length > 0) {
            		if (typeof this.items[0] !== 'string') {
            			return this.selectedValue.text;
					}

					return this.items.find(item => item === this.currentValue);
				}

            	return this.currentValue;
			},
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
