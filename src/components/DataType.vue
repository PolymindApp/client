<template>
<!--	<div :class="{ 'datatype fill-height d-flex align-center': true, hovered: hovered }" @mouseenter="hovered = true" @mouseleave="hovered = false">-->
<!--	<div>-->

		<!-- INPUTS -->
		<DataText ref="input" :value="currentValue" :readonly="readonly" @keyup="handleKeyUp" @keydown="handleKeyDown" v-bind="$attrs" v-on="$listeners" v-if="type === 'text'">
			<template slot="read">
				<slot name="read"></slot>
			</template>
			<template slot="edit">
				<slot name="edit"></slot>
			</template>
		</DataText>
		<DataBoolean ref="input" :value="currentValue" :readonly="readonly" @keyup="handleKeyUp" @keydown="handleKeyDown" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'boolean'">
			<template slot="read">
				<slot name="read"></slot>
			</template>
			<template slot="edit">
				<slot name="edit"></slot>
			</template>
		</DataBoolean>
		<DataNumber ref="input" :value="currentValue" :readonly="readonly" @keyup="handleKeyUp" @keydown="handleKeyDown" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'number'">
			<template slot="read">
				<slot name="read"></slot>
			</template>
			<template slot="edit">
				<slot name="edit"></slot>
			</template>
		</DataNumber>
		<DataDate ref="input" :value="currentValue" :readonly="readonly" @keyup="handleKeyUp" @keydown="handleKeyDown" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'date'">
			<template slot="read">
				<slot name="read"></slot>
			</template>
			<template slot="edit">
				<slot name="edit"></slot>
			</template>
		</DataDate>
		<DataList ref="input" :value="currentValue" :readonly="readonly" @keyup="handleKeyUp" @keydown="handleKeyDown" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'list'">
			<template slot="read">
				<slot name="read"></slot>
			</template>
			<template slot="edit">
				<slot name="edit"></slot>
			</template>
		</DataList>
		<DataImage ref="input" :value="currentValue" :readonly="readonly" @keyup="handleKeyUp" @keydown="handleKeyDown" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'image'">
			<template slot="read">
				<slot name="read"></slot>
			</template>
			<template slot="edit">
				<slot name="edit"></slot>
			</template>
		</DataImage>
		<DataAudio ref="input" :value="currentValue" :readonly="readonly" @keyup="handleKeyUp" @keydown="handleKeyDown" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'audio'">
			<template slot="read">
				<slot name="read"></slot>
			</template>
			<template slot="edit">
				<slot name="edit"></slot>
			</template>
		</DataAudio>
		<DataFile ref="input" :value="currentValue" :readonly="readonly" @keyup="handleKeyUp" @keydown="handleKeyDown" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'file'">
			<template slot="read">
				<slot name="read"></slot>
			</template>
			<template slot="edit">
				<slot name="edit"></slot>
			</template>
		</DataFile>
		<DataWysiwyg ref="input" :value="currentValue" :readonly="readonly" @keyup="handleKeyUp" @keydown="handleKeyDown" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'wysiwyg'">
			<template slot="read">
				<slot name="read"></slot>
			</template>
			<template slot="edit">
				<slot name="edit"></slot>
			</template>
		</DataWysiwyg>

		<!-- OPTIONS -->
<!--		<div v-if="false && options && (hovered || menu)" class="options">-->
<!--			<v-menu :value="menu" auto>-->
<!--				<template v-slot:activator="{ on: menu }">-->
<!--					<v-tooltip bottom>-->
<!--						<template v-slot:activator="{ on: tooltip }">-->
<!--							<v-btn class="ml-2" v-on="{ ...tooltip, ...menu }" x-small icon>-->
<!--								<v-icon>mdi-dots-vertical</v-icon>-->
<!--							</v-btn>-->
<!--						</template>-->
<!--						<span v-text="$t('dataType.optionsTooltip')"></span>-->
<!--					</v-tooltip>-->
<!--				</template>-->

<!--				<v-list dense>-->
<!--					<v-list-item v-for="(option, index) in optionsList" :key="index" @click="option.callback()" :disabled="option.disabled && option.disabled()">-->
<!--						<v-list-item-icon>-->
<!--							<v-icon v-text="option.icon" :disabled="option.disabled && option.disabled()"></v-icon>-->
<!--						</v-list-item-icon>-->
<!--						<v-list-item-title v-text="option.title"></v-list-item-title>-->
<!--					</v-list-item>-->
<!--				</v-list>-->
<!--			</v-menu>-->
<!--		</div>-->
<!--	</div>-->
</template>

<script>
    import Vue from 'vue';
    import DataText from './DataType/Text';
    import DataBoolean from './DataType/Boolean';
    import DataNumber from './DataType/Number';
    import DataDate from './DataType/Date';
    import DataList from './DataType/List';
    import DataImage from './DataType/Image';
    import DataAudio from './DataType/Audio';
    import DataFile from './DataType/File';
    import DataWysiwyg from './DataType/Wysiwyg';

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
            value: {
                default: null,
			},
            type: {
                type: String,
				default: 'text',
			},
            options: {
                type: Boolean,
				default: false,
			},
            readonly: {
                type: Boolean,
				default: false,
			},
		},

        components: { DataText, DataBoolean, DataNumber, DataDate, DataList, DataImage, DataAudio, DataFile, DataWysiwyg },

        mounted() {

        },

        destroyed() {

        },

        methods: {

			handleKeyDown(event) {

				if (this.isEditing()) {
					switch (event.code) {
						case 'ArrowUp':
						case 'ArrowRight':
						case 'ArrowBottom':
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

				if (this.isEditing()) {
					switch (event.code) {
						case 'Enter':
						case 'Escape':
							this.$refs.input.blur();
							break;
					}
				}
			},

            edit() {
                this.$refs.input.edit();
			},

            focus() {
                this.$refs.input.focus();
			},

            blur() {
                this.$refs.input.blur();
			},

			clear() {
                this.$refs.input.clear();
			},

			reset() {
                this.$refs.input.reset();
			},

            canReset() {

                if (!this.$refs.input) {
                    return false;
                }

                return this.$refs.input.canReset;
            },

			isEditing() {
				return this.$refs.input.isEditing;
			},
		},

        computed: {

			currentValue: {
				get() {
					return this.value;
				},
				set(val) {
					this.$emit('update', val);
				}
			},

            canEdit() {

                if (!this.$refs.input) {
                    return false;
                }

                return this.$refs.input.canEdit;
			},
		},

        data() {

            // const defaultOptions = [
			// 	{ icon: 'mdi-pencil', title: this.$t('dataType.options.edit'), callback: () => {
			// 		this.$refs.input.edit();
			// 	} },
			// 	{ icon: 'mdi-comment-plus-outline', title: this.$t('dataType.options.comment'), callback: () => {
			// 		this.$comments.open(this.id, this.collection);
			// 	} },
			// 	{ icon: 'mdi-refresh mdi-flip-h', title: this.$t('dataType.options.reset'), callback: () => {
			// 		this.$refs.input.reset();
			// 	}, disabled: () => { return !this.canReset(); } },
			// 	{ icon: 'mdi-file-remove-outline', title: this.$t('dataType.options.clean'), callback: () => {
			// 		this.$refs.input.clear();
			// 	}, disabled: () => { return this.currentValue === null; } }
			// ];

            return {
            	// menu: false,
                // defaultOptions: defaultOptions,
				// optionsList: [...defaultOptions],
                // comments: [],
                // hovered: false,
                // modalCommentData: {
                //     visible: false,
                //     comment: null,
                // },
			};
        },
    });
</script>

<style lang="scss" scoped>
	/*.datatype {*/
	/*	position: relative;*/
	/*}*/
	/*.options {*/
	/*	opacity: 0;*/
	/*	transition: opacity 300ms ease;*/
	/*	position: absolute;*/
	/*	right: 0;*/
	/*}*/
	/*.hovered {*/
	/*	.options {*/
	/*		opacity: 1;*/
	/*	}*/
	/*}*/
</style>
