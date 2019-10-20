<template>
	<v-container>
		<v-row>
			<v-col cols="6" md="4" v-for="chart in charts">
				<v-card class="text-center">
					<v-card-text>
						<v-sheet :color="chart.color">
							<v-sparkline auto-draw color="white" :labels="chart.labels" :value="chart.value" line-width="2" padding="16" smooth></v-sparkline>
						</v-sheet>
					</v-card-text>
					<v-card-text>
						<div class="display-1 font-weight-thin">
							{{ chart.title }}
						</div>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
	data: function() {
		return {
			charts: [
				{
					    title: 'Overall',
					color: 'primary',
					labels: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm',],
					value: [200, 675, 410, 390, 310, 460, 250,],
				},
				{
					title: 'To practice',
					color: 'warning',
					labels: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm',],
					value: [200, 675, 410, 390, 310, 460, 250,],
				},
				{
					title: 'Succeeded',
					color: 'success',
					labels: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm',],
					value: [200, 675, 410, 390, 310, 460, 250,],
				},
			]

		}
	},
});
</script>

<style lang="scss" scoped>

</style>
