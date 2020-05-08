<template>
	<v-sheet class="w-100 py-2" color="grey lighten-4" tile>

		<v-card color="transparent" class="px-4" flat tile>

			<!-- TOTALS -->
			<v-row v-if="stats.totalCount > 0">
				<v-col cols="12" md="6">
					<v-card class="pa-4 d-flex align-center fill-height">
						<div style="flex: 0">
							<doughnut-chart :chart-data="reviewedChart" :options="reviewedChart.options" style="width: 100px; height: 100px"></doughnut-chart>
						</div>
						<div class="ml-4" style="flex: 1">
							<horizontal-bar-chart style="height: 100px" :chart-data="difficultyOverviewChart" :options="difficultyOverviewChart.options"></horizontal-bar-chart>
						</div>
					</v-card>
				</v-col>
				<v-col cols="12" md="6">

					<!-- EMPTY -->
					<v-slide-y-reverse-transition>
						<EmptyView key="empty" v-if="!news.data" :desc="$t('dashboard.news.emptyDesc')" />
					</v-slide-y-reverse-transition>

					<!-- HAS CONTENT -->
					<v-card :to="'/news/' + news.data.content[0].language + '/' + news.data.content[0].slug" class="fill-height">
						<v-list-item three-line>
							<v-list-item-avatar v-if="news.data.thumbnail" tile size="80">
								<v-img height="80" width="80" :src="$thumbnails(news.data.thumbnail.private_hash, 'avatar')"></v-img>
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title class="headline mb-1 primary--text">
									<span v-text="news.data.content[0].title"></span>
								</v-list-item-title>
								<v-list-item-subtitle>
									<span v-text="news.data.content[0].abstract" style="line-height: 1.25rem"></span>
								</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
						<v-card-actions>
							<v-btn color="primary" :to="'/news/' + news.data.content[0].language + '/' + news.data.content[0].slug" text>
								<span v-text="$t('dashboard.news.seeMore')"></span>
								<v-icon right>mdi-plus</v-icon>
							</v-btn>

							<v-spacer></v-spacer>

							<v-icon left x-small>mdi-calendar</v-icon>
							<span class="overline mr-4">{{ news.data.created_on | timeAgo }}</span>
						</v-card-actions>
					</v-card>
				</v-col>
			</v-row>
			<v-alert v-else type="info" class="mx-n4 mt-n4" text dismissible prominent tile>
				<div><strong v-text="$t('dashboard.notSeeingStatsTitle')"></strong></div>
				<div v-text="$t('dashboard.notSeeingStatsDesc')"></div>
			</v-alert>

			<!-- CALENDAR -->
			<v-card class="relative my-2">

				<!-- ACCOMPLISH DIALOG -->
				<AccomplishStrategy :visible.sync="accomplishDialog.visible" :strategy="accomplishStrategy" />

				<!-- PAST/FUTURE DIALOG -->
				<v-dialog v-model="accomplishDialog.pastFutureVisible" scrollable persistent max-width="400px">
					<v-card>
						<v-card-title class="headline">
							<v-icon color="error" slot="icon" size="36" left>mdi-close</v-icon>
							<span v-text="$t('strategy.accomplishDialogTitle')"></span>
						</v-card-title>

						<v-card-text class="my-4">
							<span v-text="$t('strategy.accomplishDialogDesc')"></span>
						</v-card-text>

						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn @click="accomplishDialog.pastFutureVisible = false" text>
								<span v-text="$t('modal.close')"></span>
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>

				<v-overlay absolute color="white" z-index="2" :value="events.length === 0">
					<div class="text-center">
						<EmptyView :title="$t('dashboard.emptyCalendarTitle')" :desc="$t('dashboard.emptyCalendarDesc')" light />
						<v-btn to="/strategy/new" v-text="$t('dashboard.planStrategy')"></v-btn>
					</div>
				</v-overlay>
				<v-calendar
					ref="calendar"
					type="week"
					color="primary"
					:now="today"
					:value="today"
					short-months
					short-weekday
					:locale="$i18n.locale"
					:first-interval="firstInterval"
					:interval-count="intervalCount"
					:events="events"
					:event-color="getEventColor"
					@change="getEvents"
					@click:event="handleEventClick"
					class="v-calendar-session"
				>
					<template v-slot:event="props">
						<span :class="{ 'pa-1 black--text': props.event.startDay !== today && !props.timed }">
							<span>
								<template v-if="!props.event.valid">
									<v-icon color="white" small left>mdi-alert</v-icon>
								</template>
								<template v-else-if="!props.timed">
									<template v-if="props.event.startDay < today">
										<v-icon color="error" small left>mdi-close-circle</v-icon>
									</template>
									<template v-else-if="props.event.startDay === today">
										<v-icon color="white" small left>mdi-play</v-icon>
									</template>
									<template v-else>
										<v-icon :color="props.event.color" small left>mdi-circle</v-icon>
									</template>
								</template>
								<template v-else>
									<v-icon :color="props.event.color" small left>mdi-circle</v-icon>
								</template>
								<span v-text="props.event.name"></span>
								(<!--
									--><strong v-if="props.event.valid" v-text="$t('strategy.assembly.duration', { duration: props.event.duration })"></strong>
									<strong v-else v-text="$t('dashboard.invalid')"></strong><!--
								-->)
							</span>
							<div v-if="props.timed && props.event.duration >= 60" class="text-center">
								<v-chip :color="stats.daily[props.event.startDay].session[props.event.id].totalTags.easy > 0 ? 'success' : null" class="mr-2" x-small outlined>{{ stats.daily[props.event.startDay].session[props.event.id].totalTags.easy || 0 }}</v-chip>
								<v-chip :color="stats.daily[props.event.startDay].session[props.event.id].totalTags.unsure > 0 ? 'warning' : null" class="mr-2" x-small outlined>{{ stats.daily[props.event.startDay].session[props.event.id].totalTags.unsure || 0 }}</v-chip>
								<v-chip :color="stats.daily[props.event.startDay].session[props.event.id].totalTags.hard > 0 ? 'error' : null" x-small outlined>{{ stats.daily[props.event.startDay].session[props.event.id].totalTags.hard || 0 }}</v-chip>
							</div>
						</span>
					</template>
				</v-calendar>
			</v-card>
		</v-card>

		<v-sheet color="transparent" class="px-4" tile>
			<v-row>
				<v-col cols="12" md="6">

					<!-- DIFFICULTY -->
					<v-card light>
						<v-overlay v-if="stats.totalCount === 0" color="white" absolute :dark="false" opacity="0.75" z-index="2">
							<EmptyView :title="$t('dashboard.difficultyChartEmptyTitle')" :desc="$t('dashboard.difficultyChartEmptyDesc')" />
						</v-overlay>
						<v-card-title class="flex-column">
							<div v-text="$t('dashboard.difficultyChartTitle')"></div>
							<div class="overline" v-text="$t('dashboard.difficultyChartDesc')"></div>
						</v-card-title>
						<v-card-text class="pt-4">
							<line-stacked-chart style="height: 350px" :chart-data="difficultyChart" :options="difficultyChart.options"></line-stacked-chart>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" md="6">

					<!-- INTERVALS -->
					<v-card light>
						<v-overlay v-if="stats.totalTime === 0" color="white" absolute :dark="false" opacity="0.75" z-index="2">
							<EmptyView :title="$t('dashboard.intervalChartEmptyTitle')" :desc="$t('dashboard.intervalChartEmptyDesc')" />
						</v-overlay>
						<v-card-title class="flex-column">
							<div v-text="$t('dashboard.intervalChartTitle')"></div>
							<div class="overline" v-text="$t('dashboard.intervalChartDesc')"></div>
						</v-card-title>
						<v-card-text class="pt-4">
							<bar-stacked-chart style="height: 350px" :chart-data="intervalChart" :options="intervalChart.options"></bar-stacked-chart>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" md="6">

					<!--  DATASET -->
					<v-card light>
						<v-overlay v-if="!hasDatasetStats" color="white" absolute :dark="false" opacity="0.75" z-index="2">
							<EmptyView :title="$t('dashboard.datasetChartEmptyTitle')" :desc="$t('dashboard.datasetChartEmptyDesc')" />
						</v-overlay>
						<v-card-title class="flex-column">
							<div v-text="$t('dashboard.datasetChartTitle')"></div>
							<div class="overline" v-text="$t('dashboard.datasetChartDesc')"></div>
						</v-card-title>
						<v-card-text class="pt-4">
							<bar-stacked-chart style="height: 350px" :chart-data="datasetChart" :options="datasetChart.options"></bar-stacked-chart>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" md="6">

					<!-- ENDEAVOURS DIVISION -->
					<v-card light>
						<v-overlay v-if="!hasEndeavoursStats" color="white" absolute :dark="false" opacity="0.75" z-index="2">
							<EmptyView :title="$t('dashboard.endeavoursDivisionChartEmptyTitle')" :desc="$t('dashboard.endeavoursDivisionChartEmptyDesc')" />
						</v-overlay>
						<v-card-title class="flex-column">
							<div v-text="$t('dashboard.endeavoursDivisionChartTitle')"></div>
							<div class="overline" v-text="$t('dashboard.endeavoursDivisionChartDesc')"></div>
						</v-card-title>
						<v-card-text class="pt-4">
							<v-row no-gutters>
								<v-col cols="12" md="6" class="pa-4 text-center">
									<pie-chart :chart-data="endeavoursDivisionCharts.total" :options="endeavoursDivisionCharts.total.options" style="height: 143.25px"></pie-chart>
								</v-col>
								<v-col cols="12" md="6" class="pa-4 text-center">
									<pie-chart :chart-data="endeavoursDivisionCharts.strategies" :options="endeavoursDivisionCharts.strategies.options" style="height: 143.25px"></pie-chart>
								</v-col>
								<v-col cols="12" md="6" class="pa-4 text-center">
									<pie-chart :chart-data="endeavoursDivisionCharts.components" :options="endeavoursDivisionCharts.components.options" style="height: 143.25px"></pie-chart>
								</v-col>
								<v-col cols="12" md="6" class="pa-4 text-center">
									<pie-chart :chart-data="endeavoursDivisionCharts.datasets" :options="endeavoursDivisionCharts.datasets.options" style="height: 143.25px"></pie-chart>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-sheet>
	</v-sheet>
</template>

<script>
import Vue from 'vue';
import EmptyView from "../../components/EmptyView";
import LineStackedChart from "../../components/Chart/LineStacked";
import BarChart from "../../components/Chart/Bar";
import BarStackedChart from "../../components/Chart/BarStacked";
import HorizontalBarChart from "../../components/Chart/HorizontalBar";
import DoughnutChart from "../../components/Chart/Doughnut";
import PieChart from "../../components/Chart/Pie";
import { Color, NewsService, StrategySessionStatsService, Cookies, StrategySession } from "@polymind/sdk-js";
import Radar from "../../components/Chart/Radar";
import UserAvatar from "../../components/UserAvatar";
import moment from "moment";
import AccomplishStrategy from "../../components/AccomplishStrategy";

export default Vue.extend({

	components: { EmptyView, UserAvatar, DoughnutChart, PieChart, BarChart, BarStackedChart, HorizontalBarChart, LineStackedChart, Radar, AccomplishStrategy },

	beforeRouteEnter(to, from, next) {

		const startDate = moment().startOf('week').subtract(1, 'day');
		const endDate = moment().endOf('week').add(2, 'day');

		Promise.all([
			NewsService.getLatest(Cookies.get('lang')),
			StrategySessionStatsService.getAll('live', startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')),
		])
				.then(([news, stats]) => {
					to.meta.news = news;
					to.meta.stats = stats;
					next();
				})
				.catch(error => next('/404'));
	},

	created() {
		this.init();
	},

	mounted () {
		this.$refs.calendar.scrollToTime(moment().format('HH:mm'));
	},

	methods: {

		init() {
			this.prepareStats();
		},

		handleEventClick(props) {

			if (!props.event.valid) {
				this.$router.push('/strategy/' + props.event.strategy.id);
			}
			else if (props.timed) {

			}
			else if (props.event.startDay === this.today) {
				this.accomplishStrategy = props.event.strategy;
				this.accomplishDialog.visible = true;
			} else if (props.event.startDay > this.today) {
				this.accomplishStrategy = props.event.strategy;
				this.accomplishDialog.pastFutureVisible = true;
			} else if (props.event.startDay < this.today) {
				this.accomplishStrategy = props.event.strategy;
				this.accomplishDialog.pastFutureVisible = true;
			}
		},

		getEvents ({ start, end }) {

			const events = [];

			this.strategies.forEach(item => {
				const strategy = item;
				strategy.getEvents({ start, end }).forEach(event => {
					event.strategy = strategy;

					const dayStats = this.stats.daily[event.startDay];
					if (dayStats && dayStats.session[event.strategy_session]) {
						return;
					}

					event.valid = strategy.isValid(this.components, this.datasets);
					events.push(event);
				});
			});

			for(let day in this.stats.daily) {
				for(let ssKey in this.stats.daily[day].session) {
					const session = this.stats.daily[day].session[ssKey];
					const strategySession = new StrategySession(session);
					if (strategySession.end_date) {
						const id = parseInt(ssKey);
						const element = session.strategy
								? this.$root.strategies.find(strategy => strategy.id === id)
								: this.$root.components.find(component => component.id === id);
						if (element) {
							const event = strategySession.getEvent();
							Object.assign(event, {
								id: element.id,
								color: element.color,
								icon: element.icon,
								name: element.name,
							});
							events.push(event);
						}
					}
				}
			}

			this.events = events
		},

		getEventColor (event) {

			if (!event.valid) {
				return 'error';
			} else if (event.startTime) {

				return '#fff';

				if (event.startDay === this.today) {
					return event.color;
				}
			} else if (event.startDay === this.today) {
				return event.color;
			}

			return 'grey lighten-2';
		},

		prepareStats() {

			const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',];
			const tags = ['easy', 'unsure', 'hard'];
			const colors = [
				this.$vuetify.theme.themes.light.success,
				this.$vuetify.theme.themes.light.warning,
				this.$vuetify.theme.themes.light.error
			];
			for (let i = 0; i < 7; i++) {
				colors.push(Color.randomHex());
			}

			/**
			 * Reviewed Doughnut Chart
			 */
			this.reviewedChart.datasets = [{
				data: [3, 8, 1],
				backgroundColor: [colors[0], '#eee', colors[2]]
			}];

			/**
			 * Difficulty Overview Chart
			 */
			this.difficultyOverviewChart.datasets = [{
				data: [
					this.stats.totalTags.easy || 0,
					this.stats.totalTags.unsure || 0,
					this.stats.totalTags.hard || 0,
					0, // Hack.. otherwise data won't show up
				],
				backgroundColor: [colors[0], colors[1], colors[2]]
			}];

			/**
			 * Difficulty Details Chart
			 */
			for (let tagIdx = 0; tagIdx < tags.length; tagIdx++) {
				const tag = tags[tagIdx];
				const data = [];
				for (let i = 0; i < days.length; i++) {
					const day = moment().startOf('week').add(i, 'days').format('YYYY-MM-DD');
					const dailyItem = this.stats.daily[day];
					data.push(dailyItem ? dailyItem.totalTags[tag] || 0 : 0);
				}

				this.difficultyChart.datasets.push({
					label: this.$t('dashboard.difficulties.' + tag),
					backgroundColor: colors[tagIdx],
					borderColor: 'transparent',
					pointRadius: 0,
					data,
				});
			}
			for (let dayIdx in days) {
				this.difficultyChart.labels.push(this.$t('date.' + days[dayIdx]));
			}

			/**
			 * Interval Details Chart
			 */
			let data = [];
			for (let i = 0; i < days.length; i++) {
				const day = moment().startOf('week').add(i, 'days').format('YYYY-MM-DD');
				const dailyItem = this.stats.daily[day];
				data.push(dailyItem ? dailyItem.avgAnsweringTime || 0 : 0);
			}
			this.intervalChart.datasets.push({
				label: this.$t('dashboard.avgTimeSpent'),
				backgroundColor: Color.hexToRgba(colors[0]),
				borderColor: Color.hexToRgba(colors[0]),
				data,
			});
			for (let dayIdx in days) {
				this.intervalChart.labels.push(this.$t('date.' + days[dayIdx]));
			}

			/**
			 * Dataset Chart
			 */
			let datasetTypes = ['create', 'update', 'delete'];
			datasetTypes.forEach((type, typeIdx) => {
				let data = [];
				for (let i = 0; i < days.length; i++) {
					const day = moment().startOf('week').add(i, 'days').format('YYYY-MM-DD');
					const dailyItem = this.stats.datasets.daily[day];
					data.push(dailyItem ? dailyItem.total[type] || 0 : 0);
				}
				this.datasetChart.datasets.push({
					label: this.$t('dashboard.datasetChartLabels.' + type),
					backgroundColor: Color.hexToRgba(colors[typeIdx]),
					borderColor: Color.hexToRgba(colors[typeIdx]),
					data,
				});
			});
			for (let dayIdx in days) {
				this.datasetChart.labels.push(this.$t('date.' + days[dayIdx]));
			}

			/**
			 * Endeavours Division Chart
			 */
			for(let type in this.stats.endeavours) {
				const items = this.stats.endeavours[type];
				if (type === 'total') {
					this.endeavoursDivisionCharts[type].datasets[0].backgroundColor = [colors[0], colors[1], colors[2]];
					this.endeavoursDivisionCharts[type].datasets[0].data = [
						items.strategies,
						items.components,
						items.datasets,
					];
				} else {
					let i = 0;
					for(let key in items) {
						const id = parseInt(key);
						const item = this.$root[type].find(entry => entry.id === id);
						if (item) {
							const value = items[key];
							this.endeavoursDivisionCharts[type].labels.push(item.name);
							this.endeavoursDivisionCharts[type].datasets[0].backgroundColor.push(item.color || colors[i]);
							this.endeavoursDivisionCharts[type].datasets[0].data.push(value);
							i++;
						}
					}
				}
			}
		},
	},

	computed: {

		hasDatasetStats() {
			const total = this.stats.datasets.total;
			return (total.create + total.delete + total.update) > 0;
		},

		hasEndeavoursStats() {
			const total = this.stats.endeavours.total;
			return (total.components + total.datasets + total.strategies) > 0;
		},

		firstInterval() {
			let firstInterval = 24;
			this.events.forEach(event => {
				const startHour = moment(event.start).hour();
				const endHour = moment(event.end).hour();

				if (startHour === 0 && endHour === 0) {
					return;
				}

				if (startHour < firstInterval) {
					firstInterval = startHour;
				}
			});

			if (firstInterval === -1) {
				firstInterval = moment().hour();
			}

			return firstInterval;
		},

		intervalCount() {
			let intervalCount = -1;
			this.events.forEach(event => {
				const startHour = moment(event.start).hour();
				const endHour = moment(event.end).hour();

				if (startHour === 0 && endHour === 0) {
					return;
				}

				if (endHour > intervalCount) {
					intervalCount = endHour + 1;
				}
			});

			if (intervalCount === -1) {
				intervalCount = moment().hour() + 5;
			}

			let count = intervalCount - this.firstInterval;
			if (count < 5) {
				count = 5;
			}

			return count;
		},
	},

	data() {
		const timeSpentTooltipsCallbacks = {
			label(tooltipItem, data) {
				let label = data.datasets[tooltipItem.datasetIndex].label || data.labels[tooltipItem.index];
				const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
				if (label) {
					label += ': ';
				}
				let format = 's[s]';
				if (value >= 10 * 60 * 60) {
					format = 'HH[h]mm[m]ss[s]';
				} else if (value >= 60 * 60) {
					format = 'H[h]mm[m]ss[s]';
				} else if (value >= 10 * 60) {
					format = 'mm[m]ss[s]';
				} else if (value >= 60) {
					format = 'm[m]ss[s]';
				} else if (value >= 10) {
					format = 'ss[s]';
				}

				return label + moment().startOf('day').add(value, 'seconds').format(format);
			}
		};
		return {
            fab: false,
			selectedStrategy: [],
			accomplishStrategy: null,
			accomplishDialog: { visible: false, pastFutureVisible: false, },
			news: this.$route.meta.news,
			strategies: this.$root.strategies,
			components: this.$root.components,
			datasets: this.$root.datasets,
			stats: this.$route.meta.stats,
			statsBySessionDate: {},
			reviewedChart: {
				labels: [
					this.$t('dashboard.reviews.completed'),
					this.$t('dashboard.reviews.todo'),
					this.$t('dashboard.reviews.skipped')
				],
				datasets: [],
				options: {
					legend: false
				},
			},
			difficultyOverviewChart: {
				labels: [
					this.$t('dashboard.difficulties.easy'),
					this.$t('dashboard.difficulties.unsure'),
					this.$t('dashboard.difficulties.hard')
				],
				datasets: [],
				options: {
					legend: false,
					scales: {
						xAxes: [{
							display: false,
							gridLines: {
								display:false
							}
						}],
						yAxes: [{
							gridLines: {
								display:false
							}
						}]
					},
				},
			},
			difficultyChart: {
				labels: [],
				datasets: [],
				options: {

				},
			},
			intervalChart: {
				labels: [],
				datasets: [],
				options: {
					tooltips: {
						callbacks: timeSpentTooltipsCallbacks
					},
				},
			},
			datasetChart: {
				labels: [],
				datasets: [],
				options: {

				},
			},
			endeavoursDivisionCharts: {
            	total: {
					labels: [
						this.$t('app.menuGroup.strategies'),
						this.$t('app.menuGroup.components'),
						this.$t('app.menuGroup.dataset'),
					],
					datasets: [{
						backgroundColor: [],
						data: [],
					}],
					options: {
						title: {
							display: true,
							text: this.$t('dashboard.endeavoursDivisionChartTotal'),
							position: 'bottom',
						},
						tooltips: {
							callbacks: timeSpentTooltipsCallbacks
						},
						legend: {
							position: 'right',
						},
					},
				},
            	strategies: {
					labels: [],
					datasets: [{
						backgroundColor: [],
						data: [],
					}],
					options: {
						title: {
							display: true,
							text: this.$t('dashboard.endeavoursDivisionChartByStrategies'),
							position: 'bottom',
						},
						tooltips: {
							callbacks: timeSpentTooltipsCallbacks
						},
						legend: {
							position: 'right',
						},
					},
				},
            	components: {
					labels: [],
					datasets: [{
						backgroundColor: [],
						data: [],
					}],
					options: {
						title: {
							display: true,
							text: this.$t('dashboard.endeavoursDivisionChartByComponents'),
							position: 'bottom',
						},
						tooltips: {
							callbacks: timeSpentTooltipsCallbacks
						},
						legend: {
							position: 'right',
						},
					},
				},
            	datasets: {
					labels: [],
					datasets: [{
						backgroundColor: [],
						data: [],
					}],
					options: {
						title: {
							display: true,
							text: this.$t('dashboard.endeavoursDivisionChartByDatasets'),
							position: 'bottom',
						},
						tooltips: {
							callbacks: timeSpentTooltipsCallbacks
						},
						legend: {
							position: 'right',
						},
					},
				},
			},
			events: [],
			today: moment().format('YYYY-MM-DD'),
		}
	},
});
</script>

<style lang="scss">
	.theme--light.v-calendar-session {

		.v-calendar-daily_head-day-label {
			pointer-events: none;
		}

		.v-calendar-daily__day.v-past,
		.v-calendar-daily__day.v-future {
			background-color: rgba(0, 0, 0, 0.05);
		}
		.v-event-timed {
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			transition: all ease 0.3s;

			&.white--text {
				color: black !important;
				border-color: #ccc !important;
			}

			&.white--text:hover {
				border-color: #666 !important;
			}
		}
	}
</style>
