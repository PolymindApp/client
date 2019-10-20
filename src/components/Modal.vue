<template>
	<v-dialog v-model="visible" max-width="600">
		<v-card>
			<v-card-title class="headline">
				<v-icon slot="icon" color="error" size="36" v-if="data.type === 'error'" left>mdi-alert-box</v-icon>
				<v-icon slot="icon" color="warning" size="36" v-if="data.type === 'warning'" left>mdi-alert-box</v-icon>
				<v-icon slot="icon" color="success" size="36" v-if="data.type === 'success'" left>mdi-check</v-icon>
				{{ data.title }}
			</v-card-title>

			<v-card-text class="my-5">
				{{ data.message }}
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>

				<v-btn text @click="visible = false">
					{{$t('modal.close')}}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import Vue from 'vue';
import RestError from "../utils/RestError";

export default Vue.extend({

	methods: {

		handleSettings(settings) {
		    Object.assign(this, settings);
		},
	},

	data() {
		return {
			visible: false,
			data: {
			    type: 'default',
				title: this.$t('modal.defaultTitle'),
				message: this.$t('general.defaultErrorDesc'),
			}
		};
	},

	watch: {
		settings: {
			deep: true,
			handler: function(newVal, oldVal) {
				this.handleSettings(newVal.data);
			}
    	},
	},
});
</script>

<style lang="scss" scoped>

</style>
