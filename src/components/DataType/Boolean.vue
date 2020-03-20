<template>
	<div class="w-100">
		<slot name="read" v-if="!canEdit">
			<div class="d-inline-block" @mousedown.stop @mouseup.stop>
				<v-switch ref="input" v-model="currentValue" @change="$emit('update', $event)" v-bind="$attrs" v-on="$listeners" class="my-0 py-0 ml-1 mr-n3" color="primary" dense inset hide-details />
			</div>
		</slot>
		<slot name="edit" v-else>
			<div class="d-inline-block" @mousedown.stop @mouseup.stop>
				<v-switch ref="input" v-model="currentValue" @change="$emit('update', $event)" v-bind="$attrs" v-on="$listeners" class="my-0 py-0 ml-1 mr-n3" color="primary" dense inset hide-details />
			</div>
		</slot>
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
                this.$emit('input', this.currentValue);
			},

			focus() {

				this.isEditing = true;

				// this.$nextTick(() => {
				// 	if (!this.$refs.input) {
				// 		return;
				// 	}
				//
				// 	this.$refs.input.focus();
				// 	this.$refs.input.$el.querySelector('input').select();
				// });
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
            },
			currentValue(value) {
				this.$emit('input', this.currentValue);
			},
        }
    });
</script>

<style lang="scss" scoped>

</style>
