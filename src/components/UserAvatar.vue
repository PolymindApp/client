<template>
	<v-avatar v-ripple="isInteractive" @click="handleClick" :color="color ? color : 'primary'" :class="classes" :size="size" :style="{ borderWidth: (size / 500) + 'rem'}">

		<v-overlay :absolute="true" :value="isUploading">
			<v-progress-circular :size="size / 2" color="primary" indeterminate></v-progress-circular>
		</v-overlay>

		<div v-if="state && user.id && $root.user.id !== user.id" :class="{
			connection: true,
			grey: !isOnline,
			green: isOnline,
		}" :style="{
			bottom: ((size / 96) + 'rem'),
			right: ((size / 96) + 'rem'),
			width: ((size / 128) + 'rem'),
			height: ((size / 128) + 'rem')
		}">

		</div>

		<div class="overlay-edit d-flex align-center justify-center" v-if="editable && !isUploading && $root.user.id === user.id" @click="modify('picture_id')">
			<v-icon :style="{ fontSize: (size / 42) + 'rem' }">mdi-upload</v-icon>
		</div>

		<img v-if="user.avatar" :src="avatar" alt="avatar" />
		<img v-else-if="$root.user.id === user.id && $root.user.avatar" :src="avatar" alt="avatar" />
		<span :class="(size >= 96 ? 'display-3' : 'display-1') + ' white--text'" v-else>{{$options.filters.userScreenName(user).substring(0, 1).toUpperCase()}}</span>
	</v-avatar>
</template>

<script>
import Vue from 'vue';
import UserModel from "../models/User";
import File from '../utils/File';
import FileService from "../services/FileService";
import UserService from "../services/UserService";
import moment from "moment";

export default Vue.extend({

	props: {
	    user: {
	        type: Object
		},
		size: {
	        type: Number,
			default: 96
		},
		state: {
	        type: Boolean,
			default: true,
		},
		color: {
	        type: String,
			default: 'primary',
		},
		editable: {
	        type: Boolean,
			default: false,
		},
		clickable: {
	        type: Boolean,
			default: true,
		},
	},

	mounted() {

	    if (this.user.avatar) {
            this.avatar = this.$thumbnails(this.user.avatar.private_hash, 'avatar');
		}
	},

	methods: {

		handleClick() {
			if (!this.editable && this.clickable) {
				this.$router.push('/account/' + this.user.id);
			}
		},

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
                                    Object.assign(this.$root.user, new UserModel(response.data));
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

	computed: {

        isOnline() {
            return moment(this.user.last_access_on).isAfter(moment().subtract(5, 'minutes'));
		},

		isCurrentUser() {
        	return this.$root.user.id === this.user.id;
		},

		isInteractive() {
        	return this.editable || this.clickable;
		},

		classes() {
        	return {
        		'no-select': true,
				redirectsToAccount: !this.editable && this.clickable,
			};
		}
	},

	data() {
		return {
		    avatar: null,
			isUploading: false,
		};
	},

	watch: {
	    'user.avatar.private_hash'(filename) {
	        this.avatar = this.$thumbnails(filename, 'avatar');
		},
	    '$root.user.avatar.private_hash'(filename) {

	        if (this.user.id === this.$root.user.id) {
            	this.avatar = this.$thumbnails(filename, 'avatar');
			}
		}
	}
});
</script>

<style lang="scss" scoped>

	.redirectsToAccount {
		cursor: pointer;
	}

	.connection {
		position: absolute;
		border-radius: 100%;
	}

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
