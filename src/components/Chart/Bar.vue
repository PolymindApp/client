<script>
    import Vue from 'vue';
	import { Bar, mixins } from 'vue-chartjs';
	const { reactiveProp } = mixins;

    export default Vue.extend({

        name: 'Bar',

		extends: Bar,
		mixins: [reactiveProp],
		props: ['options'],

		mounted() {
			this.updateChart();
		},

		methods: {

			updateChart() {
				this.renderChart(this.chartData, Object.assign({}, this.defaultOptions, this.options));
			}
		},

		data() {
        	return {
				defaultOptions: {
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						position: 'bottom',
					},
					tooltips: {
						mode: 'index',
						intersect: false,
					},
				}
			}
		},

		watch: {

			chartData: {
				deep: true,
				handler(options) {
					this.updateChart();
				}
			}
		}
    });
</script>
