<template>
	<div :class="{ 'datatype fill-height d-flex align-center ': true, hovered: hovered }" @mouseenter="hovered = true" @mouseleave="hovered = false">

		<!-- INPUTS -->
		<DataText ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-if="type === 'text'" />
		<DataBoolean ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'boolean'" />
		<DataNumber ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'number'" />
		<DataDate ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'date'" />
		<DataList ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'list'" />
		<DataImage ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'image'" />
		<DataAudio ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'audio'" />
		<DataRecording ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'recording'" />
		<DataFile ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'file'" />

		<!-- OPTIONS -->
		<div v-if="false && options && (hovered || menu)" class="options">
			<v-menu v-model="menu" auto>
				<template v-slot:activator="{ on: menu }">
					<v-tooltip bottom>
						<template v-slot:activator="{ on: tooltip }">
							<v-btn class="ml-2" v-on="{ ...tooltip, ...menu }" x-small icon>
								<v-icon>mdi-dots-vertical</v-icon>
							</v-btn>
						</template>
						<span v-text="$t('dataType.optionsTooltip')"></span>
					</v-tooltip>
				</template>

				<v-list dense>
					<v-list-item v-for="(option, index) in optionsList" :key="index" @click="option.callback()" :disabled="option.disabled && option.disabled()">
						<v-list-item-icon>
							<v-icon v-text="option.icon" :disabled="option.disabled && option.disabled()"></v-icon>
						</v-list-item-icon>
						<v-list-item-title v-text="option.title"></v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</div>
	</div>
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
    import DataRecording from './DataType/Recording';
    import DataFile from './DataType/File';

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

        components: { DataText, DataBoolean, DataNumber, DataDate, DataList, DataImage, DataAudio, DataRecording, DataFile },

        mounted() {

        },

        destroyed() {

        },

        methods: {

            edit() {
                this.$refs.input.edit();
			},

            focus() {
                this.$refs.input.focus();
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

                if (!this.$refs.input) {
                    return false;
                }

                return this.$refs.input.canEdit;
			},
		},

        data() {

            const defaultOptions = [
				{ icon: 'mdi-pencil', title: this.$t('dataType.options.edit'), callback: () => {
					this.$refs.input.edit();
				} },
				{ icon: 'mdi-comment-plus-outline', title: this.$t('dataType.options.comment'), callback: () => {
					this.$comments.open(this.id, this.collection);
				} },
				{ icon: 'mdi-refresh mdi-flip-h', title: this.$t('dataType.options.reset'), callback: () => {
					this.$refs.input.reset();
				}, disabled: () => { return !this.canReset(); } },
				{ icon: 'mdi-file-remove-outline', title: this.$t('dataType.options.clean'), callback: () => {
					this.$refs.input.clear();
				}, disabled: () => { return this.currentValue === null; } }
			];

            return {
            	menu: false,
                defaultOptions: defaultOptions,
				optionsList: [...defaultOptions],
                comments: [],
                hovered: false,
                modalCommentData: {
                    visible: false,
                    comment: null,
                },
			};
        },
    });
</script>

<style lang="scss" scoped>
	.datatype {
		position: relative;
	}
	.options {
		opacity: 0;
		transition: opacity 300ms ease;
		position: absolute;
		right: 0;
	}
	.hovered {
		.options {
			opacity: 1;
		}
	}
</style>
