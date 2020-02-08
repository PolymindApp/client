<template>
	<div class="w-100">
		<v-chip v-if="!canEdit && currentValue === null" class="text-center" x-small>NULL</v-chip>
		<span v-if="!canEdit" v-text="currentValue"></span>
		<v-text-field v-else ref="input" type="text" v-model="currentValue" @keyup="handleKeyUp" @keydown="handleKeyDown" @blur="blur" v-bind="$attrs" v-on="$listeners" class="ma-0 pa-0" dense hide-details />
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

			handleKeyDown(event) {
            	if (event.code === 'Tab') {
            		setTimeout(() => { // Let time for blur event to complete
            			this.$emit('tab', event);
					});
				}
			},

			handleKeyUp(event) {
            	if (event.code === 'Enter') {
            		this.blur();
				}
			},

			clear() {
                this.currentValue = null;
			},

			reset() {
				this.currentValue = this.originalValue;
			},
		},

        computed: {

			currentValue: {
				get() {
					return this.value;
				},
				set(val) {
					this.$emit('input', val)
				}
			},

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
                originalValue: this.value,
			};
        },
    });
</script>

<style lang="scss" scoped>

</style>
