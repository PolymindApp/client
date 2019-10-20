<template>
	<div>
		<v-switch v-model="deck.isThemeEnabled" :disabled="deck.isArchived" color="primary" :label="$t('deck.theme.isEnabled')"></v-switch>
		<ThemeField v-model="deck.setting" :disabled="!deck.isThemeEnabled || deck.isArchived" />
	</div>
</template>

<script>
import Vue from 'vue';
import ThemeField from "../../../../components/ThemeField";

export default Vue.extend({

	props: ['deck'],

	components: { ThemeField },

	mounted() {

	},

	data: function() {
		return {
		    originalData: {},
			data: {
				name: ''
			}
		}
	},
});
</script>
