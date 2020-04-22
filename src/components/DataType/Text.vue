<template>
	<div class="datatype fill-height d-flex align-center">
        <template v-if="!canEdit">
			<slot name="read">
				<div v-text="value" class="text-no-wrap text-truncate"></div>
			</slot>
        </template>
        <template v-else>
            <slot name="edit">
				<v-text-field ref="input" type="text" v-model="innerValue" @blur="handleBlur(value)" v-bind="$attrs" v-on="$listeners" class="ma-0 pa-0 w-100" dense hide-details />
			</slot>
        </template>
	</div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'DataText',

        props: {
            value: {
            	type: String,
                default: null,
            },
            canEdit: {
                type: Boolean,
                default: false,
            },
        },

        methods: {

        	handleBlur() {
        		this.blur();
				this.update(this.innerValue);
        	},

            edit() {
				this.$refs.input.focus();
				this.select();
			},

			blur() {
				this.$refs.input.blur();
			},

			update(value) {
				this.$emit('update', this.innerValue);
			},

			select() {
				this.$refs.input.$el.querySelector('input').select();
			},
		},

		data() {
			return {
				innerValue: this.value,
			};
		},

        watch: {

        	value(value) {
        		if (this.value !== value) {
        			this.innerValue = value;
        		}
        	}
        }
    });
</script>