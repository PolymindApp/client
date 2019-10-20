<template>
	<v-card flat :dark="value.dark" color="transparent">
		<v-container>
			<Page slug="privacy" />
		</v-container>
	</v-card>
</template>

<script>
import Vue from 'vue';
import Page from "../../../components/Page";

export default Vue.extend({

	components: { Page },

	props: ['value'],

	data() {
		return {

		}
	}
})
</script>

<style lang="scss" scoped>

</style>
