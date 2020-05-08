<script>
    import Vue from 'vue';
	import { Bar, mixins } from 'vue-chartjs';
	const { reactiveProp } = mixins;

    export default Vue.extend({

        name: 'BarStacked',

		extends: Bar,
		mixins: [reactiveProp],
		props: ['options'],

        components: {},

        mounted() {
			this.renderChart(this.chartData, Object.assign({}, {
				responsive: true,
				maintainAspectRatio: false,
				legend: {
					position: 'bottom',
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				scales: {
					xAxes: [{
						stacked: true
					}],
					yAxes: [{
						stacked: true
					}],
				}
			}, this.options));
        },

        destroyed() {

        },

        methods: {

		},

        computed: {

		},

        data() {
            return {

			};
        }
    });
</script>
