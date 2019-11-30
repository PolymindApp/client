<template>
	<v-card tile class="default-gradient wallpaper" :style="{ backgroundImage: backgroundImage }">

		<v-overlay :absolute="true" :value="isUploading">
			<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
		</v-overlay>

		<v-container class="d-flex pa-4 wallpaper-container">

			<!-- PICTURE / NAME -->
			<v-sheet style="flex: 1" class="align-self-end d-flex align-center" :dark="true" color="transparent">
				<div>
					<UserAvatar :user="user" color="primary" :size="128" class="mr-4" />
				</div>
				<div>
					<h1 class="display-2 font-weight-thin">
						{{ user.first_name }} {{ user.last_name }}
					</h1>
					<h4 class="subheading" v-if="user.role.name">
						{{ $t('role.' + user.role.name.toLowerCase()) }}
					</h4>
				</div>
			</v-sheet>

			<!-- EDIT WALLPAPER -->
			<v-sheet style="flex: 0; height: 20rem" class="align-self-start align-content-end d-flex flex-column" :dark="true" color="transparent">

				<div style="flex: 1">
					<v-btn class="zoom align-self-start" @click="modify('wallpaper_id')" text>
						<v-icon left>mdi-pencil</v-icon>
						<span>{{ $t('account.changeWallpaper') }}</span>
					</v-btn>
				</div>

				<div class="biography text-right">
					<v-icon>mdi-format-quote-open</v-icon>
					<span class="title font-italic font-weight-light" v-text="user.quote"></span>
					<v-icon>mdi-format-quote-close</v-icon>
				</div>
			</v-sheet>
		</v-container>
	</v-card>
</template>

<script>
import Vue from 'vue';
import File from "../../../utils/File";
import UserAvatar from "../../../components/UserAvatar";
import FileService from "../../../services/File";
import UserService from "../../../services/User";

export default Vue.extend({

	props: ['user'],
	components: { UserAvatar },

	methods: {

		modify(param) {
			File.promptFileDialog(images => {
				this.isUploading = true;
				this.$crop(images, [1400, 350]).then(croppedImages => {
					FileService.upload.bind(this)(croppedImages)
						.then(filesResponse => {
                            UserService.update.bind(this)(this.$root.user.id, {
							    wallpaper: filesResponse.data.id
							})
								.then(response => {
								    this.$root.user = Object.assign(this.$root.user, response.data);
								    this.user = Object.assign(this.user, response.data);
								})
                                .catch(error => this.$handleError(this, error))
                                .finally(() => this.isUploading = false);
						})
						.catch(error => this.$handleError(this, error))
                        .finally(() => this.isUploading = false);
				}).catch(error => this.isUploading = false);
			}, 'image/png, image/jpeg, image/gif');
		},
	},

	computed: {

	    backgroundImage() {
	        return this.user.wallpaper
				? 'url(\'' + this.$thumbnails(this.user.wallpaper.filename, 1500, 350) + '\')'
				: null;
		}
	},

	data: function() {
		return {
			isUploading: false,
		}
	},
});
</script>

<style lang="scss" scoped>
	.wallpaper,
	.wallpaper-container {
		min-height: 20rem;
	}
	.wallpaper {
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center center;

		.zoom {
			transition: transform 300ms ease, opacity 300ms ease;
			transform: scale(0.75);
			opacity: 0;
		}

		&:hover .zoom {
			 transform: scale(1);
			 opacity: 1;
		 }
	}
	.biography {
		opacity: 0.75;

		.title {
			margin: 0 1rem;
		}
	}
</style>
