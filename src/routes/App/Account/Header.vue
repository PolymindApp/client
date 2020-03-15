<template>
	<v-img class="default-gradient wallpaper" :src="backgroundImage">

		<!-- MSG SENT -->
		<v-snackbar color="success" v-model="newMessage.isSent">
			<v-icon class="white--text" left>mdi-check</v-icon>
			{{$t('account.header.msgSent')}}
			<v-btn text @click="newMessage.isSent = false">
				{{$t('modal.close')}}
			</v-btn>
		</v-snackbar>

		<!-- MODAL: SEND MESSAGE -->
		<v-dialog v-model="newMessage.visible" scrollable persistent max-width="500px">
			<v-card>
				<v-card-title>
					<v-icon color="primary" slot="icon" size="36" left>mdi-message-text-outline</v-icon>
					{{$t('account.header.newMsg')}}
				</v-card-title>

				<v-card-text>
					<v-textarea ref="newMsg" v-model="newMessage.text" :placeholder="$t('account.messaging.newMessagePlaceholder')" outlined hide-details></v-textarea>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn color="primary" @click="sendMessage()" :disabled="newMessage.text.length < 5">
						<v-icon left>mdi-send</v-icon>
						{{$t('modal.send')}}
					</v-btn>

					<v-btn @click="newMessage.visible = false">
						{{$t('modal.cancel')}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- MODAL: FOLLOWING -->
		<v-dialog v-model="followingModal.visible" scrollable persistent max-width="500px">
			<v-card>
				<v-card-title>
					<v-icon color="primary" slot="icon" size="36" left>mdi-account-star-outline</v-icon>
					{{$t('account.header.followingModalTitle')}}
				</v-card-title>

				<v-card-text>
					<v-expand-transition group>

						<v-alert key="empty" v-if="followingModal.loaded && followingModal.list.data.length === 0" type="info" border="left" colored-border light elevation="2">
							{{$t('account.header.noFollowings')}}
						</v-alert>

						<v-list v-else-if="followingModal.loaded" key="notEmpty" tile flat color="transparent" three-line>
							<v-expand-transition group>
								<template v-for="(following, index) in followingModal.list.data">
									<v-list-item :to="'/account/' + following.user.id" :key="index + '_item'">
										<v-col class="shrink">
											<UserAvatar :size="48" :user="following.user" />
										</v-col>
										<v-col>
											<v-list-item-title>
												{{following.user | userScreenName }}
											</v-list-item-title>
											<v-list-item-subtitle>
												{{following.created_on | timeAgo}}
											</v-list-item-subtitle>
										</v-col>
									</v-list-item>
									<v-divider v-if="index < followingModal.list.data.length - 1" :key="index + '_sep'"></v-divider>
								</template>
							</v-expand-transition>
						</v-list>
					</v-expand-transition>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn @click="followingModal.visible = false">
						{{$t('modal.close')}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- MODAL: FOLLOWERS -->
		<v-dialog v-model="followersModal.visible" scrollable persistent max-width="500px">
			<v-card>
				<v-card-title>
					<v-icon color="primary" slot="icon" size="36" left>mdi-account-star-outline</v-icon>
					{{$t('account.header.followersModalTitle')}}
				</v-card-title>

				<v-card-text>
					<v-expand-transition group>

						<v-alert key="empty" v-if="followersModal.loaded && followersModal.list.data.length === 0" type="info" border="left" colored-border light elevation="2">
							{{$t('account.header.noFollowers')}}
						</v-alert>

						<v-list v-else-if="followersModal.loaded" key="notEmpty" tile flat color="transparent" three-line>
							<v-expand-transition group>
								<template v-for="(following, index) in followersModal.list.data">
									<v-list-item :to="'/account/' + following.created_by.id" :key="index + '_item'">
										<v-col class="shrink">
											<UserAvatar :size="48" :user="following.created_by" />
										</v-col>
										<v-col>
											<v-list-item-title>
												{{following.created_by | userScreenName }}
											</v-list-item-title>
											<v-list-item-subtitle>
												{{following.created_on | timeAgo}}
											</v-list-item-subtitle>
										</v-col>
									</v-list-item>
									<v-divider v-if="index < followersModal.list.data.length - 1" :key="index + '_sep'"></v-divider>
								</template>
							</v-expand-transition>
						</v-list>
					</v-expand-transition>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn @click="followersModal.visible = false">
						{{$t('modal.close')}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-overlay :absolute="true" :value="isUploading">
			<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
		</v-overlay>

		<v-container class="d-flex pa-4 wallpaper-container fill-height">

			<v-row class="fill-height">
				<v-col order="last" order-sm="first" cols="12" sm="6" md="8" class="py-0 d-flex align-end">

					<!-- PICTURE / NAME -->
					<v-sheet style="flex: 1" class="d-flex align-center" :dark="true" color="transparent">
						<div>
							<UserAvatar :user="user" color="primary" :size="128" :editable="true" class="mr-4" />
						</div>
						<div>
							<h1 class="display-2 font-weight-thin">
								{{ user | userScreenName }}
							</h1>
							<div>
								<h4 class="subheading d-inline-block" v-if="user.role.name">
									{{ $t('role.' + user.role.name.toLowerCase()) }}
								</h4>

								<v-divider class="mx-4" dark vertical inset></v-divider>

								<a class="white--text" @click="followersModal.visible = true">
									<span v-text="$t('account.header.followers')"></span>
									<v-chip class="ml-2" color="primary" x-small>
										{{ countFollowers.meta.filter_count }}
									</v-chip>
								</a>
								<a class="ml-4 white--text" @click="followingModal.visible = true">
									<span v-text="$t('account.header.following')"></span>
									<v-chip class="ml-2" color="primary" x-small>
										{{ countFollowing.meta.filter_count }}
									</v-chip>
								</a>
							</div>

							<div v-if="user.id && $root.user.id !== user.id" class="mt-4">
								<v-btn @click="showNewMessage()" v-if="user.settings.externalMsg !== 'nobody'" class="mr-2" small dark>
									<v-icon left>mdi-pencil-box-outline</v-icon>
									<span v-text="$t('account.header.writeMsg')"></span>
								</v-btn>
								<v-btn @click="toggleFollowing()" small dark text>
									<template v-if="isFollowing.meta.filter_count === 0">
										<v-icon left>mdi-account-plus-outline</v-icon>
										<span v-text="$t('account.header.follow')"></span>
									</template>
									<template v-else>
										<v-icon left>mdi-account-minus</v-icon>
										<span v-text="$t('account.header.unfollow')"></span>
									</template>
								</v-btn>
							</div>
						</div>
					</v-sheet>
				</v-col>

				<v-col v-if="$vuetify.breakpoint.smAndUp" order="first" order-sm="last" cols="12" sm="6" md="4" class="py-0 d-flex flex-column justify-space-between">
					<v-btn v-if="isCurrentUser" class="zoom align-self-end" @click="modify('wallpaper_id')" dark text>
						<v-icon left>mdi-pencil</v-icon>
						<span>{{ $t('account.changeWallpaper') }}</span>
					</v-btn>
					<span v-else></span> <!-- TO PUSH BIO DOWN -->

					<div class="biography text-right white--text" v-if="user.quote">
						<v-icon>mdi-format-quote-open</v-icon>
						<span class="title font-italic font-weight-light" v-text="user.quote"></span>
						<v-icon>mdi-format-quote-close</v-icon>
					</div>
				</v-col>
			</v-row>
		</v-container>
	</v-img>
</template>

<script>
import Vue from 'vue';
import File from "../../../utils/File";
import UserAvatar from "../../../components/UserAvatar";
import UserModel from "../../../models/User";
import FileService from "../../../services/FileService";
import UserService from "../../../services/UserService";
import FollowingService from "../../../services/FollowingService";
import MessagingService from "../../../services/MessagingService";

export default Vue.extend({

	props: ['user'],
	components: { UserAvatar },

	mounted() {
	    this.loadFollowingCount();
	},

	methods: {

	    reset() {

            Object.assign(this.newMessage, { visible: false, text: '', sent: false, });
            Object.assign(this.followersModal, { visible: false, loaded: false, list: { data: [] } });
            Object.assign(this.followingModal, { visible: false, loaded: false, list: { data: [] } });
		},

	    showNewMessage() {
            this.newMessage.visible = true;
            setTimeout(() => {
                this.$refs.newMsg.$el.querySelector('textarea').focus();
			});
		},

	    sendMessage() {

            this.$root.isLoading = true;
            MessagingService.sendMessage.bind(this)(this.user.id, this.newMessage.text)
                .then(response => {
                    Object.assign(this.newMessage, {
                        visible: false,
                        text: '',
						isSent: true,
                    });
                })
                .catch(error => this.$handleError(this, error))
                .finally(() => this.$root.isLoading = false);
		},

	    loadFollowingCount() {

            Promise.all([
                FollowingService.countFollowers.bind(this)(this.user.id),
                FollowingService.countFollowing.bind(this)(this.user.id),
                FollowingService.isFollowing.bind(this)(this.user.id),
            ]).then(([followers, following, isFollowing]) => {
                this.countFollowers = followers;
                this.countFollowing = following;
                this.isFollowing = isFollowing;
            })
                .catch(error => this.$handleError(this, error));
		},

	    loadFollowing() {

            this.$root.isLoading = true;
            FollowingService.getFollowings.bind(this)(this.user.id)
				.then(response => {
				    this.followingModal.list = response;
                    this.followingModal.loaded = true;
                })
                .catch(error => this.$handleError(this, error))
                .finally(response => this.$root.isLoading = false);
		},

	    loadFollowers() {

            this.$root.isLoading = true;
            FollowingService.getFollowers.bind(this)(this.user.id)
                .then(response => {
                    this.followersModal.list = response;
                    this.followersModal.loaded = true;
                })
				.catch(error => this.$handleError(this, error))
            	.finally(response => this.$root.isLoading = false);
		},

	    toggleFollowing() {

            this.$root.isLoading = true;
            FollowingService.toggleFollowing.bind(this)(this.user.id)
				.then(response => {
                    this.isFollowing.meta.filter_count = response ? 1 : 0;
                    this.countFollowers.meta.filter_count = response ? 1 : 0
				})
                .catch(error => this.$handleError(this, error))
                .finally(() => this.$root.isLoading = false);
		},

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
								    this.$root.user = Object.assign(this.$root.user, new UserModel(response.data));
								    this.user = Object.assign(this.user, new UserModel(response.data));
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

	    isCurrentUser() {
	        return this.user.id === this.$root.user.id;
		},

	    backgroundImage() {
	        return this.user.wallpaper
				? this.$thumbnails(this.user.wallpaper.filename, 1500, 350)
				: '';
		}
	},

	data: function() {
		return {
			isUploading: false,
            newMessage: { visible: false, text: '', isSent: false, },
            followersModal: { visible: false, loaded: false, list: { data: [] } },
            followingModal: { visible: false, loaded: false, list: { data: [] } },
			countFollowing: { data: [], meta: { filter_count: 0 } },
            countFollowers: { data: [], meta: { filter_count: 0 } },
            isFollowing: { data: [], meta: { filter_count: 0 } },
		}
	},

	watch: {

        '$route.params.id': function(id) {
            this.reset();
        },

	    'user.id'(id) {
            if (id) {
	        	this.loadFollowingCount();
			}
		},

	    'followingModal.visible'(visible) {
	        if (visible) {
	        	this.loadFollowing();
			}
		},

	    'followersModal.visible'(visible) {
            if (visible) {
	        	this.loadFollowers();
			}
		},
	}
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
