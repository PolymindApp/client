<template>
	<v-avatar color="primary" :size="size" :style="{ borderWidth: (size / 500) + 'rem'}">

		<v-overlay :absolute="true" :value="isUploading">
			<v-progress-circular :size="size / 2" color="primary" indeterminate></v-progress-circular>
		</v-overlay>

		<div class="overlay-edit d-flex align-center justify-center" v-if="!isUploading" @click="modify('picture_id')">
			<v-icon :style="{ fontSize: (size / 42) + 'rem' }">mdi-upload</v-icon>
		</div>

		<img v-if="user.profile.picture.url" :src="user.profile.picture.url" alt="avatar" />
		<span :class="(size >= 96 ? 'display-3' : 'display-1') + ' white--text'" v-else>{{user.profile.screen_name.substring(0, 1).toUpperCase()}}</span>
	</v-avatar>
</template>

<script>
import Vue from 'vue';
import File from '../utils/File';
import FileService from "../services/File";
import ProfileService from "../services/Profile";

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
				this.$crop(images, [128, 128]).then(croppedImages => {
					FileService.upload.bind(this)(croppedImages)
						.then(filesResponse => {

							let payload = {};
							payload[param] = filesResponse.data.id;

							ProfileService.update.bind(this)(this.user.profile.id, payload)
								.then(profileResponse => {
									this.$root.user.profile.picture.url = filesResponse.data.url;
									this.user.profile.picture.url = filesResponse.data.url;
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
