<script>
    import Vue from 'vue';
	import { Line, mixins } from 'vue-chartjs';
	const { reactiveProp } = mixins;

    export default Vue.extend({

        name: 'Line',

		extends: Line,
		mixins: [reactiveProp],
		props: ['options'],

        components: {},

        mounted() {
			this.renderChart(this.chartData, this.options)
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
