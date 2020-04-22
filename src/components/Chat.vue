<template>
    <div class="chat mr-4">
		<transition-group name="slide-y" class="d-flex align-end" leave-absolute group>
			<v-card :key="box.user.id" v-for="(box, index) in boxes" class="ml-4" style="width: 15rem; border-bottom-left-radius: 0; border-bottom-right-radius: 0">

				<!-- HEADER -->
				<v-card @click="toggle(box)" class="pa-2 d-flex align-center no-select" :color="box.acknowledged ? 'grey' : 'primary'" tile flat dark>
					<div class="mr-2">
						<UserAvatar :user="box.user" :size="24" />
					</div>
					<div class="overline text-truncate" v-text="$options.filters.userScreenName(box.user)"></div>
					<v-spacer></v-spacer>
					<v-btn class="ml-2" @click="remove(index)" icon x-small>
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card>

				<!-- BODY -->
				<v-expand-transition>
					<div v-if="box.open" class="d-flex flex-column" style="max-height: 50vh">
						<div v-if="box.messages.length > 0" ref="messageArea" style="flex: 1; overflow: auto" class="py-0 px-1 d-flex align-center">
							<div class="align-self-start w-100 d-flex flex-column">
								<v-card flat :class="{ 'px-2 mt-1 d-block-inline': true, 'align-self-start grey lighten-3': box.user.id === message.created_by.id, 'align-self-end primary white--text': $root.user.id === message.created_by.id }" :key="index" v-for="(message, index) in box.messages" style="max-width: 75%">
									{{ message.content }}
								</v-card>
							</div>
						</div>
						<v-form class="no-select" @submit="send(box, $event)" style="flex: 0">
							<v-text-field v-model="box.newMessage.text" :disabled="isSending" :placeholder="$t('account.messaging.newMessagePlaceholder')" append-icon="mdi-send" class="ma-1" outlined hide-details @click:append="send(box.user.id, $event)" dense></v-text-field>
						</v-form>
					</div>
				</v-expand-transition>
			</v-card>
		</transition-group>
	</div>
</template>

<script>
    import Vue from 'vue';
	import UserAvatar from "./UserAvatar";
	import { MessagingService } from "@polymind/sdk-js";

    export default Vue.extend({

        name: 'Chat',

        props: [],

        components: { UserAvatar },

        mounted() {

			// MessagingService.getUsers(this.$root.user.id)
			// 	.then(response => {
			// 		response.data.forEach(user => {
			// 			this.boxes.push({
			// 				user: user.created_by,
			// 				acknowledged: true,
			// 				open: false,
			// 				messages: [],
			// 				newMessage: {
			// 					text: '',
			// 				},
			// 			});
			// 		});
			// 	})
			// 	.catch(error => this.$handleError(this, error));
        },

        destroyed() {

        },

        methods: {

        	toggle(box) {
        		box.open = !box.open;
			},

        	remove(index) {
        		this.boxes.splice(index, 1);
			},

			send(box, event) {

				event.preventDefault();

				if (!box.newMessage.text.trim()) {
					return;
				}

				this.isSending = true;
				MessagingService.sendMessage(box.user.id, box.newMessage.text.trim())
					.then(response => {
						box.messages.push(response.data);
						box.newMessage.text = '';

						if (this.$root.user.settings.newMessageSound) {
							this.$playSound('send');
						}

						setTimeout(() => {
							this.$refs.messageArea.scrollTop = this.$refs.messageArea.scrollHeight;
						});
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.isSending = false);
			},
		},

        computed: {

		},

        data() {
            return {
				boxes: [],
				isSending: false,
			};
        }
    });
</script>

<style lang="scss" scoped>
	.chat {
		position: fixed;
		bottom: 0;
		right: 0;
		z-index: 5;
	}
</style>
