<template>
	<div>
		<v-text-field v-model="data.name" :label="$t('deck.details.name')" outlined />
	</div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({

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
