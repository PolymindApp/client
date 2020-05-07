<script>
    import Vue from 'vue';
	import { Line, mixins } from 'vue-chartjs';
	const { reactiveProp } = mixins;

    export default Vue.extend({

        name: 'LineStacked',

		extends: Line,
		mixins: [reactiveProp],
		props: ['options'],

        components: {},

        mounted() {
			this.renderChart(this.chartData, Object.assign({}, {
				scales: {
					yAxes: [{
						stacked: true
					}]
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
