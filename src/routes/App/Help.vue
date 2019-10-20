<template>
	<v-container class="pa-4">

		<h1 class="display-1 my-8">
			{{$t('help.sectionTitle')}}
		</h1>

		<p>TODO: PARAM CONTEXTUEL POUR FILTRER PAR SECTION</p>

		<v-expansion-panels>
			<v-expansion-panel v-for="(item, i) in items" :key="i">
				<v-expansion-panel-header>
					<strong>{{ item.title }}</strong>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					{{ item.content }}
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
	</v-container>
</template>

<script>
import Vue from 'vue';
import HelpService from '../../services/Help';

export default Vue.extend({

	created() {
		// HelpService.get.bind(this)(this.$i18n.locale).then(results => {
		// 	this.items = results;
		// 	this.isLoading = false;
		// });
	},

	data: () => ({
		items: []
	}),
});
</script>
