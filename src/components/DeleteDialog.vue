<template>
	<v-dialog v-model="visible" scrollable max-width="500px">
		<v-card>
			<v-card-title class="headline error--text">
				<v-icon color="error" slot="icon" size="36" left>mdi-alert</v-icon>
				{{ title || $t('modalDelete.title') }}
			</v-card-title>

			<v-card-text class="my-5">
				{{ desc || $t('modalDelete.desc') }}
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>

				<v-btn color="error" @click="$emit('delete')">
					{{$t('modal.delete')}}
				</v-btn>

				<v-btn outlined class="ml-2" @click="visible = false">
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
	name: 'DeleteDialog',
	props: ['title', 'desc'],

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
