<template>
	<v-form @submit="send($event)" class="d-flex align-center">
		<UserAvatar class="mr-4" :user="$root.user" :size="48" />
		<v-text-field v-bind="$attrs" v-on="$listeners" ref="input" v-model="newComment.text" :disabled="isSending || isLocked" @click:append="send($event)" :placeholder="$t('comment.newMessagePlaceholder')" :append-icon="$vuetify.breakpoint.mdAndUp ? 'mdi-send' : null" :dense="$root.isMobile" outlined hide-details></v-text-field>
	</v-form>
</template>

<script>
    import Vue from 'vue';
	import { CommentService } from "@polymind/sdk-js";
	import UserAvatar from "../UserAvatar";

    export default Vue.extend({

        name: 'Form',

        props: ['id', 'collection', 'comments', 'parent', 'total'],

        components: { UserAvatar },

        mounted() {

        	this.$nextTick(() => {
        		if (this.$attrs.autofocus) {
					this.$refs.input.$el.querySelector('input').focus();
				}
			});
        },

        destroyed() {

        },

        methods: {

			send(event) {

				event.preventDefault();

				this.isLocked = true;
				this.isLoading = true;

				const parentId = this.parent ? this.parent.id : undefined;

				CommentService.save(this.id, this.collection, this.newComment.text, parentId)
						.then(response => {
							this.newComment.text = '';

							const comments = this.$deepClone(this.comments);
							comments.unshift(Object.assign(response.data, {
								action_by: {...this.$root.user}
							}));
							this.$emit('update:comments', comments);
							this.$emit('update:total', this.total + 1);
							this.$emit('send', response);

							setTimeout(() => {
								this.isLocked = false;
							}, 5 * 1000);

							if (this.$root.user.settings.newMessageSound) {
								this.$playSound('send');
							}
						})
						.catch(error => {
							this.isLocked = false;
							this.$handleError(this, error)
						})
						.finally(() => {
							this.isLoading = false;
						});
			},
		},

        computed: {

		},

        data() {
            return {
				isSending: false,
				isLocked: false,
				newComment: {
					text: '',
				}
			};
        }
    });
</script>

<style lang="scss" scoped>

</style>
