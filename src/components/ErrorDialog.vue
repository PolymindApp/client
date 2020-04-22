<template>
	<v-dialog :dark="color ? true : false" v-model="visible" scrollable max-width="600">
		<v-card :color="color">
			<v-card-title class="headline">
				<v-icon slot="icon" size="36" left>mdi-alert-box</v-icon>
				{{ title.length > 64 ? $t('error.defaultTitle') : title }}
			</v-card-title>

			<v-card-text v-if="showMessage" class="my-5">
				<h3 v-if="title.length > 64" class="mb-4" v-text="title"></h3>
				<div v-html="message"></div>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>

				<v-btn v-for="(button, index) in buttons" :key="index" text @click="button.callback ? buttonCallback(button) : visible = false">
					{{ button.text }}
				</v-btn>

				<v-btn v-if="buttons.length === 0" text @click="visible = false">
					{{$t('modal.close')}}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import Vue from 'vue';
import RestError from "../utils/RestError";
import ServerError from "../utils/ServerError";

export default Vue.extend({
	name: 'ErrorDialog',
	props: ['response'],

	methods: {

	    close() {
	        this.visible = false;
		},

	    buttonCallback(button) {
			button.callback(this);
		},

		handleResponse(response) {

			this.showMessage = this.env !== 'production';
			this.buttons = [];
			this.color = 'default';

		    if (response instanceof RestError) {
				this.visible = response.response.status < 200 || response.response.status >= 300;
				this.title = response.response.status + ' ' + response.response.statusText;
				this.message = response.data;
			} else if (response instanceof ServerError) {
				this.visible = true;
				this.title = response.title;
				this.message = response.desc;
                this.color = 'error';

				if (response.options) {
					this.buttons = response.options.buttons || [];
				}

				this.showMessage = true;
			} else {
				this.visible = response.message !== undefined;
				this.title = (response.statusCode ? response.statusCode + ': ' : '') + response.message;
				this.message = response.stack;
			}
		},
	},

	watch: {
		response(newVal, oldVal) {
			this.handleResponse(newVal);
		},
	},

	data() {
		return {
			showMessage: false,
			visible: false,
			buttons: [],
			color: null,
			env: process.env.NODE_ENV,
			title: '',
			message: '',
		};
	},
});
</script>

<style lang="scss" scoped>
	.v-card::v-deep pre {
		padding: 2rem;
		border-radius: 0.25rem;
		background-color: rgba(0, 0, 0, 0.05);
		white-space: pre-wrap;
	}
</style>
