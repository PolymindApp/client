<template>
	<canvas ref="chart"></canvas>
</template>

<script>
    import Vue from 'vue';
    import Chart from 'chart.js';

    export default Vue.extend({

        name: 'Radar',

        props: ['labels', 'datasets', 'options', 'colors'],

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

                let datasets = [];
                this.datasets.forEach((entry, index) => {
                    let dataset = {};
                    if (index < colors.length) {
                        Object.assign(dataset, {
                            backgroundColor: Chart.helpers.color(colors[index]).alpha(0.333).rgbString(),
                            borderColor: colors[index],
						}, entry);
					}
                    datasets.push(dataset);
				});

                this.context = this.$refs.chart.getContext('2d');
                this.chart = new Chart(this.context, Object.assign({
                    type: 'radar',
                    data: {
                        labels: this.labels,
                        datasets: datasets,
                    },
					options: {
                        responsive: true,
                        legend: {
                            display: false,
                            position: 'top',
                        },
						elements: {
                            line: {
                                borderWidth: 3,
							}
						},
						scale: {
                            gridLines: {
                                color: this.dark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
							},
                            angleLines: {
                                color: this.dark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
							},
							pointLabels: {
                                fontColor: this.dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                                fontSize: 16,
							},
                            ticks: {
                                display: false,
                                maxTicksLimit: 3
                            }
                        }
					}
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
