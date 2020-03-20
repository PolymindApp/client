<template>
	<div class="w-100">
		<slot name="read" v-if="!canEdit">
			<v-chip v-if="currentValue === null" class="text-center pe-none" x-small>NULL</v-chip>
			<span v-else v-text="currentValue"></span>
		</slot>
		<v-text-field v-else ref="input" type="text" v-model="editingValue" @blur="blur" v-bind="$attrs" v-on="$listeners" class="ma-0 pa-0" dense hide-details />
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
				this.$emit('update', this.editingValue);
				this.editingValue = null;
			},

			focus() {

				this.isEditing = true;
				this.editingValue = this.value;

				this.$nextTick(() => {
					if (!this.$refs.input) {
						return;
					}

					this.$refs.input.focus();
					this.$refs.input.$el.querySelector('input').select();
				});
			},

			handleKeyDown(event) {
            	switch (event.code) {
            		case 'ArrowUp':
            		case 'ArrowRight':
            		case 'ArrowBottom':
            		case 'ArrowLeft':
            			event.stopPropagation();
            			break;
            		case 'Tab':
						this.blur();
						this.$emit('tab', event);
						event.stopPropagation();
            			break;
				}
			},

			handleKeyUp(event) {
				switch (event.code) {
					case 'Enter':
					case 'Escape':
						this.blur();
						break;
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
					// this.$emit('input', val);
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
				editingValue: null,
                isEditing: false,
                originalValue: this.value,
			};
        },
    });
</script>

<style lang="scss" scoped>

</style>
