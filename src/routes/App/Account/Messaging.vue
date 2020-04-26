<template>
	<v-expand-transition group>

		<EmptyView key="empty" v-if="hasLoaded && users.length === 0" :title="$t('account.messaging.emptyTitle')" :desc="$t('account.messaging.emptyDesc')" class="py-12" />

		<v-card key="notEmpty" v-else-if="hasLoaded">
			<v-row no-gutters>
				<v-col cols="4" md="4">
					<v-list tile flat three-line class="inner-shadow grey lighten-4 fill-height">
						<template v-for="(user, index) in users">
							<v-list-item :to="'/account/' + $root.user.id + '/messaging/' + user.created_by.id" :key="index + '_item'" :class="(userId === user.created_by.id ? 'v-list-item--active grey lighten-2 inner-shadow' : '') + ' align-center'">
								<v-col class="shrink">
									<UserAvatar :size="48" :user="user.created_by" />
								</v-col>
								<v-col>
									<v-list-item-title>{{user.created_by | userScreenName}}</v-list-item-title>
									<v-list-item-subtitle v-html="user.content"></v-list-item-subtitle>
								</v-col>
								<v-list-item-icon v-if="!user.is_read">
									<v-icon :color="userId !== user.created_by.id ? 'primary' : 'white'" xSmall>
										mdi-checkbox-blank-circle
									</v-icon>
								</v-list-item-icon>
							</v-list-item>
							<v-divider v-if="index < users.length - 1" :key="index + '_sep'"></v-divider>
						</template>
					</v-list>
				</v-col>
				<v-col cols="8" md="8">
					<div class="d-flex flex-column fill-height" style="height: 80vh">
						<div ref="messageArea" style="flex: 1; overflow: auto" class="pa-4 py-0 pb-2 d-flex align-center">
							<v-scroll-y-transition mode="out-in">
								<div key="notEmpty" v-if="userId" class="align-self-start w-100 d-flex flex-column">
									<v-card :class="{ 'py-2 px-4 mt-4 d-block-inline': true, 'align-self-start grey lighten-3': userId === message.created_by.id, 'align-self-end primary white--text': $root.user.id === message.created_by.id }" :key="index" v-for="(message, index) in messages[userId]" style="max-width: 75%">
										{{ message.content }}
									</v-card>
								</div>
								<v-card key="empty" v-else color="transparent" tile flat class="pa-8 d-flex align-center justify-center flex-column align-self-center text-center w-100">
									<img src="../../../assets/images/polymind.svg" height="128" />
									<div class="limited-content mt-2">
										<h2 class="display-1" v-text="$t('account.messaging.empty')"></h2>
										<p class="overline" v-text="$t('account.messaging.selectUserFirst')"></p>
									</div>
								</v-card>
							</v-scroll-y-transition>
						</div>
						<v-scroll-y-transition mode="out-in">
							<v-form v-if="userId" @submit="send(userId, $event)" style="flex: 0">
								<v-text-field v-model="newMessage.text" :disabled="!userId || isSending" :placeholder="$t('account.messaging.newMessagePlaceholder')" append-icon="mdi-send" class="ma-4" outlined hide-details @click:append="send(userId, $event)"></v-text-field>
							</v-form>
						</v-scroll-y-transition>
					</div>
				</v-col>
			</v-row>
		</v-card>
	</v-expand-transition>
</template>

<script>
    import Vue from 'vue';
    import UserAvatar from "../../../components/UserAvatar";
    import { MessagingService, NotificationService } from "@polymind/sdk-js";
    import EmptyView from "../../../components/EmptyView";

    export default Vue.extend({

        name: 'Messaging',

        props: [],

        components: { EmptyView, UserAvatar, MessagingService },

        mounted() {

            this.init();
        },

        destroyed() {
			// if (this.wsSubscription) {
			// 	this.$ws.session.unsubscribe(this.wsSubscription);
			// }
        },

        methods: {

            init() {

                this.messages = [];

                MessagingService.getUsers(this.$root.user.id)
                    .then(response => {
                        this.users = response.data;
                        this.hasLoaded = true;
                    })
                    .catch(error => this.$handleError(this, error));

                if (this.userId) {
                    this.getMessages(this.userId);
				}

				// this.$ws.session.subscribe('activity', data => {
				// 	switch(data[0].collection) {
				// 		case 'messaging':
				// 			MessagingService.get(this.$root.user.id, data[0].item.data.id)
				// 					.then(response => {
				// 						response.data.acknowledged_on = new Date();
				// 						this.messages[this.userId].unshift(response.data);
				// 					})
				// 					.catch(error => this.$handleError(this, error));
				// 			break;
				// 	}
				// }).then(sub => this.wsSubscription = sub);
			},

			getMessages(userId) {

                MessagingService.getMessages(userId, this.$root.user.id)
					.then(response => {
					    this.messages[userId] = response.data;

					    setTimeout(() => {
                            this.$refs.messageArea.scrollTop = this.$refs.messageArea.scrollHeight;
						});

					    this.$forceUpdate();
					})
					.catch(error => this.$handleError(this, error));
			},

			send(userId, event) {

                event.preventDefault();

                if (!this.newMessage.text.trim()) {
					return;
					this.isSending = true;

				}
				MessagingService.sendMessage(userId, this.newMessage.text.trim())
                    .then(response => {
                        this.messages[userId].push(response.data);
                        this.newMessage.text = '';

                        if (this.$root.user.settings.newMessageSound) {
                            this.$playSound('send');
                        }

                        setTimeout(() => {
                            this.$refs.messageArea.scrollTop = this.$refs.messageArea.scrollHeight;
                        });
                    })
                    .catch(error => this.$handleError(this, error))
                    .finally(() => this.isSending = false);
			}
		},

        computed: {

		},

        data() {
            return {
                users: [],
                messages: [],
                isSending: false,
                hasLoaded: false,
				wsSubscription: null,
                newMessage: {
                    text: '',
				},
				userId: parseInt(this.$route.params.key) || null,
			};
        },

		watch: {
            $route() {
                this.userId = parseInt(this.$route.params.key) || null;
                if (this.userId) {
                	this.init();
				}
			}
		}
    });
</script>

<style lang="scss" scoped>
	.inner-shadow {
		box-shadow: inset -1rem 0 0.5rem -1rem rgba(0, 0, 0, 0.25);
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
</style>
