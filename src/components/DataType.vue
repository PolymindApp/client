<template>
	<div :class="{ 'datatype fill-height d-flex align-center inner-flex-full': true, hovered: hovered }" @mouseenter="hovered = true" @mouseleave="hovered = false">

		<!-- MODAL: COMMENT DATA -->
		<v-dialog v-model="modalCommentData.visible" scrollable persistent max-width="500px">
			<v-card>
				<v-card-title class="headline">
					<v-icon color="primary" slot="icon" size="36" left>mdi-comment-plus-outline</v-icon>
					{{$t('dataset.data.modal.comment.title')}}
				</v-card-title>

				<v-card-text class="mt-4 pt-1">
					<v-textarea ref="comment" v-model="modalCommentData.comment" :label="$t('dataset.data.modal.comment.commentLabel')" outlined hide-details></v-textarea>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn color="primary" @click="postComment()" :disabled="!modalCommentData.comment">
						<v-icon left>mdi-comment-plus-outline</v-icon>
						{{$t('modal.post')}}
					</v-btn>

					<v-btn @click="modalCommentData.visible = false">
						{{$t('modal.cancel')}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- INPUTS -->
		<DataText ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-if="type === 'text'" />
		<DataNumber ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'number'" />
		<DataDate ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'date'" />
		<DataImage ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'image'" />
		<DataAudio ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'audio'" />
		<DataRecording ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'recording'" />
		<DataFile ref="input" v-model="currentValue" :readonly="readonly" v-bind="$attrs" v-on="$listeners" v-else-if="type === 'file'" />

		<!-- COMMENTS -->
		<div v-if="comments.length > 0" class="comments" style="flex: 0">
			<v-menu auto>
				<template v-slot:activator="{ on: menu }">
					<v-tooltip bottom>
						<template v-slot:activator="{ on: tooltip }">
							<v-btn class="ml-2" v-on="{ ...tooltip, ...menu }" icon>
								<v-badge>
									<template v-slot:badge>{{comments.length}}</template>
									<v-icon>mdi-comment-processing-outline</v-icon>
								</v-badge>
							</v-btn>
						</template>
						<span v-text="$t('dataType.commentsTooltip')"></span>
					</v-tooltip>
				</template>

				<v-list dense>
					<v-list-item v-for="(comment, index) in comments" :key="index" @click="comment.callback()" :disabled="comment.disabled && comment.disabled()">
						<v-list-item-icon>
							<v-icon v-text="comment.icon" :disabled="comment.disabled && comment.disabled()"></v-icon>
						</v-list-item-icon>
						<v-list-item-title v-text="comment.title"></v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</div>

		<!-- OPTIONS -->
		<div class="options" style="flex: 0">
			<v-menu auto>
				<template v-slot:activator="{ on: menu }">
					<v-tooltip bottom>
						<template v-slot:activator="{ on: tooltip }">
							<v-btn class="ml-2" v-on="{ ...tooltip, ...menu }" icon>
								<v-icon>mdi-dots-vertical</v-icon>
							</v-btn>
						</template>
						<span v-text="$t('dataType.optionsTooltip')"></span>
					</v-tooltip>
				</template>

				<v-list dense>
					<v-list-item v-for="(option, index) in options" :key="index" @click="option.callback()" :disabled="option.disabled && option.disabled()">
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
    import DataNumber from './DataType/Number';
    import DataDate from './DataType/Date';
    import DataImage from './DataType/Image';
    import DataAudio from './DataType/Audio';
    import DataRecording from './DataType/Recording';
    import DataFile from './DataType/File';

    export default Vue.extend({

        name: 'DataType',

        props: {
            value: {
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
		},

        components: { DataText, DataNumber, DataDate, DataImage, DataAudio, DataRecording, DataFile },

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

			openComment() {
                this.modalCommentData.visible = true;
                setTimeout(() => {
                    this.$refs.comment.focus();
				});
			},

            postComment() {

                this.comments.push({ comment: this.modalCommentData.comment });

                this.$emit('comment', this.modalCommentData.comment);
                this.modalCommentData.comment = null;
                this.modalCommentData.visible = false;
			},

            canReset() {

                if (!this.$refs.input) {
                    return false;
                }

                return this.$refs.input.canReset;
            },
		},

        computed: {

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
				    this.openComment();
				} },
				{ icon: 'mdi-refresh mdi-flip-h', title: this.$t('dataType.options.reset'), callback: () => {
					this.$refs.input.reset();
				}, disabled: () => { return !this.canReset(); } },
				{ icon: 'mdi-file-remove-outline', title: this.$t('dataType.options.clean'), callback: () => {
					this.$refs.input.clear();
				}, disabled: () => { return this.value === null; } }
			];

            return {
                currentValue: this.value,
                defaultOptions: defaultOptions,
                options: [...defaultOptions],
                comments: [],
                hovered: false,
                modalCommentData: {
                    visible: false,
                    comment: null,
                },
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
	.inner-flex-full > * {
		flex: 1;
	}
	.comments,
	.options {
		opacity: 0;
		transition: opacity 300ms ease;
	}
	.hovered {
		.comments,
		.options {
			opacity: 1;
		}
	}
</style>
