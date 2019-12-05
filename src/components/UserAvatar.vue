<template>
	<v-avatar color="primary" :size="size" :style="{ borderWidth: (size / 500) + 'rem'}">

		<v-overlay :absolute="true" :value="isUploading">
			<v-progress-circular :size="size / 2" color="primary" indeterminate></v-progress-circular>
		</v-overlay>

		<div class="overlay-edit d-flex align-center justify-center" v-if="!isUploading && $root.user.id === user.id" @click="modify('picture_id')">
			<v-icon :style="{ fontSize: (size / 42) + 'rem' }">mdi-upload</v-icon>
		</div>

		<img v-if="user.avatar" :src="$thumbnails(user.avatar.filename, 256, 256)" alt="avatar" />
		<span :class="(size >= 96 ? 'display-3' : 'display-1') + ' white--text'" v-else>{{$options.filters.userScreenName(user).substring(0, 1).toUpperCase()}}</span>
	</v-avatar>
</template>

<script>
import Vue from 'vue';
import File from '../utils/File';
import FileService from "../services/FileService";
import UserService from "../services/UserService";

export default Vue.extend({
	props: {
	    user: {
	        type: Object
		},
		size: {
	        type: Number,
			default: 96
		}
	},

	methods: {

	    modify(param) {

			File.promptFileDialog(images => {
				this.isUploading = true;
				this.$crop(images, [512, 512]).then(croppedImages => {
					FileService.upload.bind(this)(croppedImages, progress => {
						const percent = (progress.loaded * 100) / progress.total;
						// this.percentUploaded = percent.toFixed(2) + '%';
					})
						.then(filesResponse => {
                            UserService.update.bind(this)(this.$root.user.id, {
                                avatar: filesResponse.data.id
                            })
                                .then(response => {
                                    Object.assign(this.$root.user, response.data);
                                })
                                .catch(error => this.$handleError(this, error))
                                .finally(() => this.isUploading = false);
						})
						.catch(error => {
							this.$handleError(this, error);
							this.isUploading = false;
						});
				});
			}, 'image/png, image/jpeg, image/gif');
		}
	},

	data() {
		return {
			isUploading: false,
		};
	},
});
</script>

<style lang="scss" scoped>

	.v-avatar {
		position: relative;
		overflow: hidden;
		border: white solid 0.25rem;

		.overlay-edit {
			cursor: pointer;
			border-radius: 50%;
			opacity: 0;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.33);
			transition: opacity 300ms ease,
						transform 300ms ease;

			.v-icon {
				color: white;
				transform: scale(0);
				transition: opacity 300ms ease,
							transform 300ms ease;
			}
		}

		&:hover {

			.overlay-edit {
				opacity: 1;

				.v-icon {
					transform: scale(1);
				}
			}
		}
	}
</style>
