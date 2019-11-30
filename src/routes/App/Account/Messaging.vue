<template>
	<v-card>
		<v-row no-gutters>
			<v-col cols="4" md="4">
				<v-list tile flat color="transparent" three-line class="inner-shadow grey lighten-4 fill-height">
					<template v-for="(user, index) in users">
						<v-list-item :to="'/account/' + $root.user.id + '/messaging/' + user.created_by.id" :key="index + '_item'" :class="(!user.aknowledged_on ? 'v-list-item--active primary--text' : '') + ' align-center'">
							<v-col class="shrink">
								<UserAvatar :size="48" :user="user.created_by" />
							</v-col>
							<v-col>
								<v-list-item-title>{{user.created_by.first_name}} {{user.created_by.last_name}}</v-list-item-title>
								<v-list-item-subtitle v-html="user.content"></v-list-item-subtitle>
							</v-col>
							<v-list-item-icon v-if="!user.aknowledged_on">
								<v-icon color="primary" xSmall>
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
					<div style="flex: 1" class="pa-4 py-0 d-flex align-center ">
						<v-scroll-y-transition mode="out-in">
							<div v-if="userId" class="align-self-start w-100 d-flex flex-column">
								<v-scroll-y-transition mode="out-in">
									<v-card :class="{ 'py-2 px-4 mt-4 d-block-inline': true, 'align-self-start grey lighten-3': userId === message.created_by.id, 'align-self-end light-blue white--text': $root.user.id === message.created_by.id }" :key="index" v-for="(message, index) in messages[userId]" style="max-width: 75%">
										{{ message.content }}
									</v-card>
								</v-scroll-y-transition>
							</div>
							<v-card key="empty" color="transparent" tile flat class="pa-8 d-flex align-center justify-center flex-column align-self-center text-center w-100">
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
							<v-text-field v-model="newMessage.text" :disabled="!userId || isSending" :placeholder="$t('account.messaging.newMessagePlaceholder')" append-icon="mdi-send" class="pa-4" outlined hide-details></v-text-field>
						</v-form>
					</v-scroll-y-transition>
				</div>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
    import Vue from 'vue';
    import UserAvatar from "../../../components/UserAvatar";
    import MessagingService from "../../../services/Messaging";

    export default Vue.extend({

        name: 'Messaging',

        props: [],

        components: { UserAvatar, MessagingService },

        mounted() {

            this.init();
        },

        destroyed() {

        },

        methods: {

            init() {

                this.messages = [];

                MessagingService.getUsers.bind(this)()
                    .then(response => {
                        this.users = response.data;
                    })
                    .catch(error => this.$handleError(this, error));

                if (this.userId) {
                    this.getMessages(this.userId);
				}
			},

			getMessages(userId) {

                this.$root.isLoading = true;
                MessagingService.getMessages.bind(this)(userId)
					.then(response => {
					    this.messages[userId] = response.data;
					    this.$forceUpdate();
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
			},

			send(userId, event) {

                event.preventDefault();

                if (!this.newMessage.text.trim()) {
                    return;
				}

                this.isSending = true;
                MessagingService.sendMessage.bind(this)(userId, this.newMessage.text.trim())
                    .then(response => {
                        this.messages[userId].push(response.data);
                        this.newMessage.text = null;
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
                newMessage: {
                    text: null,
				},
				userId: parseInt(this.$route.params.key) || null,
			};
        },

		watch: {
            $route() {
                this.userId = parseInt(this.$route.params.key) || null;
                this.init();
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
