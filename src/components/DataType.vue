<template>

	<!-- NULL -->
	<v-chip v-if="innerValue === null && !canEdit" class="text-center pe-none" x-small>NULL</v-chip>

	<!-- INPUTS -->
	<DataText ref="input" v-model="innerValue" :readonly="readonly" :can-edit="canEdit" @blur="handleBlur" @update="handleUpdate" @keyup="handleKeyUp" @keydown="handleKeyDown" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'text'"></DataText>
	<DataBoolean ref="input" v-model="innerValue" :readonly="readonly" :can-edit="canEdit" @blur="handleBlur" @update="handleUpdate" @keyup="handleKeyUp" @keydown="handleKeyDown" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'boolean'"></DataBoolean>
	<DataNumber ref="input" v-model="innerValue" :readonly="readonly" :can-edit="canEdit" @blur="handleBlur" @update="handleUpdate" @keyup="handleKeyUp" @keydown="handleKeyDown" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'number'"></DataNumber>
	<DataDate ref="input" v-model="innerValue" :readonly="readonly" :can-edit="canEdit" @blur="handleBlur" @update="handleUpdate" @keyup="handleKeyUp" @keydown="handleKeyDown" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'date'"></DataDate>
</template>

<script>
    import Vue from 'vue';
    import DataText from './DataType/Text';
    import DataBoolean from './DataType/Boolean';
    import DataNumber from './DataType/Number';
    import DataDate from './DataType/Date';

    export default Vue.extend({

        name: 'DataType',

        props: {
            id: {
                type: Number,
				default: null,
			},
            collection: {
                type: String,
				default: null,
			},
            type: {
                type: String,
				default: 'text',
			},
            readonly: {
                type: Boolean,
				default: false,
			},
            value: {
                default: null,
			},
		},

        components: { DataText, DataBoolean, DataNumber, DataDate },

        methods: {

			handleKeyDown(event) {

				if (this.isEditing) {
					switch (event.code) {
						case 'ArrowUp':
						case 'ArrowRight':
						case 'ArrowDown':
						case 'ArrowLeft':
							event.stopPropagation();
							break;
						case 'Tab':
							this.$refs.input.blur();
							this.$emit('tab', event);
							event.stopPropagation();
							break;
					}
				}
			},

			handleKeyUp(event) {

				if (this.isEditing) {
					switch (event.code) {
						case 'Escape':
							this.$refs.input.blur();
						    this.$emit('update', this.value);
						    break;
						case 'Enter':
							this.$refs.input.blur();
						    this.$emit('update', this.innerValue);
							break;
					}
				}
			},

			handleBlur() {
				this.isEditing = false;
			},

			handleUpdate(value) {
				this.update(value);
			},

            edit() {
            	this.isEditing = true;
            	setTimeout(() => {
					this.$refs.input.edit();
            	});
			},

            focus() {
                this.$refs.input.focus();
			},

            blur() {
				this.isEditing = false;
            	this.$refs.input.blur();

            	if (this.$listeners.blur) {
					this.$listeners.blur();
				}
			},

			update(value) {
				this.$emit('update', value);
			},

			clear() {
                this.$refs.input.clear();
			},
		},

        computed: {
            
            canEdit() {
                return this.isEditing;
			},
		},

        data() {
            return {
            	isEditing: false,
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