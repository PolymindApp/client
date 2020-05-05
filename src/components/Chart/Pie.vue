<template>
	<canvas ref="chart"></canvas>
</template>

<script>
	import Vue from 'vue';
	import Chart from 'chart.js';

	export default Vue.extend({

		name: 'Pie',

		props: ['labels', 'datasets'],

		components: {},

		mounted() {
			this.init();
		},

		destroyed() {

		},

		methods: {

			init() {

				const colors = this.colors || [
					this.$vuetify.theme.themes.light.primary,
					this.$vuetify.theme.themes.light.secondary,
					this.$vuetify.theme.themes.light.third,
				];

				this.context = this.$refs.chart.getContext('2d');
				this.chart = new Chart(this.context, Object.assign({
					type: 'pie',
					data: {
						labels: this.labels,
						datasets: this.datasets,
					},
				}, this.options));
			}
		},

		computed: {

		},

		data() {
			return {
				context: null,
				chart: null,
			};
		}
	});
</script>

<style lang="scss" scoped>

</style>
