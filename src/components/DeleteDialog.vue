<template>
	<v-dialog v-model="visible" scrollable max-width="500px">
		<v-card color="error" class="white--text">
			<v-card-title class="headline">
				<v-icon slot="icon" color="white" size="36" left>mdi-alert</v-icon>
				{{$t('modalDelete.title')}}
			</v-card-title>

			<v-card-text class="my-5 white--text">
				{{$t('modalDelete.desc')}}
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>

				<v-btn text @click="$emit('delete')">
					{{$t('modal.delete')}}
				</v-btn>

				<v-btn @click="visible = false">
					{{$t('modal.cancel')}}
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

		show() {
			this.visible = true;
		},

		hide() {
			this.visible = false;
		}
	},

	data() {
		return {
			visible: false,
		};
	},
});
</script>

<style lang="scss" scoped>

</style>
