<template>
	<v-sheet class="w-100 py-2" color="grey lighten-4" tile>

		<v-card color="transparent" class="px-4" flat tile>

			<!-- TOTALS -->
			<v-row>
				<v-col cols="12" md="6">
					<v-card v-if="next" v-on="next.listeners" class="d-flex align-center fill-height">
						<v-card class="text-no-wrap pa-4 d-flex flex-column justify-center fill-height" :color="next.color" style="flex: 0; border-top-right-radius: 0; border-bottom-right-radius: 0" dark flat>
							<div class="overline" v-text="$t('dashboard.nextEvent' + (next.isToday ? 'Today' : next.isTomorrow ? 'Tomorrow' : 'Later'))"></div>
							<div class="title text-uppercase" v-text="next.dayMonth"></div>
							<div v-text="next.year"></div>
						</v-card>
						<div class="ml-8 pa-4 d-flex align-center" style="flex: 1">
							<div class="text-center text-no-wrap " style="flex: 0">
								<v-icon :color="next.color" x-large>{{ next.icon }}</v-icon>
								<h3 class="mt-2" v-text="next.name"></h3>
								<div class="overline" v-text="$t('strategy.assembly.duration', { duration: next.duration || '~' })"></div>
							</div>
							<div class="ml-8 text-center" style="flex: 1">
								<div class="desc" v-html="next.desc"></div>
<!--								<div class="overline">{{ next.strategy.assemblies.length }} étapes :</div>-->

<!--								<div :key="assembly.guid" v-for="(assembly, assemblyIdx) in next.strategy.assemblies">-->
<!--									<strong v-text="assembly.name || assembly.component"></strong>-->
<!--								</div>-->
							</div>
						</div>
						<div v-if="next.isToday" class="px-4 text-center" style="flex: 0">
							<v-icon :color="next.color" x-large>mdi-play</v-icon>
						</div>
					</v-card>
					<v-card v-else class="d-flex align-center fill-height">
						<v-alert type="warning" class="ma-0 fill-height d-flex justify-center" text prominent tile>
							<h3 v-text="$t('dashboard.noStrategySoonTitle')"></h3>
							<div v-text="$t('dashboard.noStrategySoonDesc')"></div>
							<v-btn class="mt-4" to="/strategy/new" color="warning">
								<v-icon left>mdi-plus</v-icon>
								<span v-text="$t('dashboard.planStrategy')"></span>
							</v-btn>
						</v-alert>
					</v-card>
				</v-col>
				<v-col cols="12" md="6">

					<!-- EMPTY -->
					<v-slide-y-reverse-transition>
						<EmptyView key="empty" v-if="!news.data" :desc="$t('dashboard.news.emptyDesc')" />
					</v-slide-y-reverse-transition>

					<!-- HAS CONTENT -->
					<v-card class="fill-height">
						<v-list-item three-line>
							<v-list-item-avatar v-if="news.data.thumbnail" tile size="80">
								<v-img height="80" width="80" :src="$thumbnails(news.data.thumbnail.private_hash, 'avatar')"></v-img>
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title class="headline mb-1">
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
						<EmptyView :title="$t('dashboard.emptyCalendarTitle')" :desc="$t('dashboard.emptyCalendarDesc')" icon="mdi-thumb-up-outline" color="primary" :size="48" light />
						<v-btn to="/strategy/new" v-text="$t('dashboard.planStrategy')"></v-btn>
					</div>
				</v-overlay>
				<v-fade-transition>
					<v-overlay v-if="isLoading" color="white" absolute :dark="false" opacity="0.75" z-index="2">
						<v-progress-circular color="primary" indeterminate></v-progress-circular>
					</v-overlay>
				</v-fade-transition>
				<v-calendar
					ref="calendar"
					:type="calendarType"
					color="primary"
					:now="today"
					:value="calendarValue"
					short-months
					short-weekday
					:start="calendarStartDate"
					:end="calendarEndDate"
					:locale="$i18n.locale"
					:first-interval="firstInterval"
					:interval-count="intervalCount"
					:events="events"
					:event-color="getEventColor"
					@change="setEvents"
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
									--><strong v-if="props.event.valid" v-text="$t('strategy.assembly.duration', { duration: props.event.duration || '~' })"></strong>
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
				<v-col cols="12" md="6" xl="3">

					<!-- DIFFICULTY -->
					<v-card class="fill-height" light>
						<v-overlay v-if="stats.totalCount === 0" color="white" absolute :dark="false" opacity="0.75" z-index="2">
							<EmptyView :title="$t('dashboard.difficultyChartEmptyTitle')" :desc="$t('dashboard.difficultyChartEmptyDesc')" :image="false" />
						</v-overlay>
						<v-fade-transition>
							<v-overlay v-if="isLoading" color="white" absolute :dark="false" opacity="0.75" z-index="2">
								<v-progress-circular color="primary" indeterminate></v-progress-circular>
							</v-overlay>
						</v-fade-transition>
						<v-card-title class="flex-column">
							<div v-text="$t('dashboard.difficultyChartTitle')"></div>
							<div class="overline" v-text="$t('dashboard.difficultyChartDesc')"></div>
						</v-card-title>
						<v-card-text class="pt-4">
							<line-stacked-chart style="height: 350px" :chart-data="difficultyChart" :options="difficultyChart.options"></line-stacked-chart>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" md="6" xl="3">

					<!-- INTERVALS -->
					<v-card class="fill-height" light>
						<v-overlay v-if="stats.totalTime === 0" color="white" absolute :dark="false" opacity="0.75" z-index="2">
							<EmptyView :title="$t('dashboard.intervalChartEmptyTitle')" :desc="$t('dashboard.intervalChartEmptyDesc')" :image="false" />
						</v-overlay>
						<v-fade-transition>
							<v-overlay v-if="isLoading" color="white" absolute :dark="false" opacity="0.75" z-index="2">
								<v-progress-circular color="primary" indeterminate></v-progress-circular>
							</v-overlay>
						</v-fade-transition>
						<v-card-title class="flex-column">
							<div v-text="$t('dashboard.intervalChartTitle')"></div>
							<div class="overline" v-text="$t('dashboard.intervalChartDesc')"></div>
						</v-card-title>
						<v-card-text class="pt-4">
							<bar-stacked-chart style="height: 350px" :chart-data="intervalChart" :options="intervalChart.options"></bar-stacked-chart>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" md="6" xl="3">

					<!--  DATASET -->
					<v-card class="fill-height" light>
						<v-overlay v-if="!hasDatasetStats" color="white" absolute :dark="false" opacity="0.75" z-index="2">
							<EmptyView :title="$t('dashboard.datasetChartEmptyTitle')" :desc="$t('dashboard.datasetChartEmptyDesc')" :image="false" />
						</v-overlay>
						<v-fade-transition>
							<v-overlay v-if="isLoading" color="white" absolute :dark="false" opacity="0.75" z-index="2">
								<v-progress-circular color="primary" indeterminate></v-progress-circular>
							</v-overlay>
						</v-fade-transition>
						<v-card-title class="flex-column">
							<div v-text="$t('dashboard.datasetChartTitle')"></div>
							<div class="overline" v-text="$t('dashboard.datasetChartDesc')"></div>
						</v-card-title>
						<v-card-text class="pt-4">
							<bar-stacked-chart style="height: 350px" :chart-data="datasetChart" :options="datasetChart.options"></bar-stacked-chart>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" md="6" xl="3">

					<!-- ENDEAVOURS DIVISION -->
					<v-card class="fill-height" light>
						<v-overlay v-if="!hasEndeavoursStats" color="white" absolute :dark="false" opacity="0.75" z-index="2">
							<EmptyView :title="$t('dashboard.endeavoursDivisionChartEmptyTitle')" :desc="$t('dashboard.endeavoursDivisionChartEmptyDesc')" :image="false" />
						</v-overlay>
						<v-fade-transition>
							<v-overlay v-if="isLoading" color="white" absolute :dark="false" opacity="0.75" z-index="2">
								<v-progress-circular color="primary" indeterminate></v-progress-circular>
							</v-overlay>
						</v-fade-transition>
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
									<doughnut-chart :chart-data="endeavoursDivisionCharts.strategies" :options="endeavoursDivisionCharts.strategies.options" style="height: 143.25px"></doughnut-chart>
								</v-col>
								<v-col cols="12" md="6" class="pa-4 text-center">
									<doughnut-chart :chart-data="endeavoursDivisionCharts.components" :options="endeavoursDivisionCharts.components.options" style="height: 143.25px"></doughnut-chart>
								</v-col>
								<v-col cols="12" md="6" class="pa-4 text-center">
									<doughnut-chart :chart-data="endeavoursDivisionCharts.datasets" :options="endeavoursDivisionCharts.datasets.options" style="height: 143.25px"></doughnut-chart>
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
import ToolbarContextual from "./Dashboard/ToolbarContextual";
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

		const startDate = moment().subtract(6, 'days');
		const endDate = moment().add(1, 'day');

		Promise.all([
			NewsService.getLatest(Cookies.get('lang')),
			StrategySessionStatsService.getAll(null, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')),
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
		this.$toolbar.setContextual(ToolbarContextual, {
			value: this.dataRangeContextual
		}, {
			input: args => this.dataRange = [moment(args[0]), moment(args[1])],
		});
	},

	methods: {

		init() {
			this.updateDates();
			this.prepareStats();
		},

		updateDates() {
			const [ start, end ] = this.dataRange;
			this.statsStartDate = start.format('YYYY-MM-DD');
			this.statsEndDate = end.format('YYYY-MM-DD');
			this.calendarValue = this.statsStartDate;
			this.calendarType = this.rangeSize() > 7 ? 'month' : 'custom-daily';
			this.calendarStartDate = this.getCalendarStartDate();
			this.calendarEndDate = this.getCalendarEndDate();
		},

		rangeSize() {
			return moment(this.dataRange[1]).diff(moment(this.dataRange[0]), 'days');
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

		reload() {

			const [ start, end ] = this.dataRange;

			this.isLoading = true;
			StrategySessionStatsService.getAll(null, start.format('YYYY-MM-DD'), moment(end).add(1, 'day').format('YYYY-MM-DD'))
					.then(stats => {
						this.stats = stats;
						this.updateDates();
						this.prepareStats();
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.isLoading = false);
		},

		setEvents ({ start, end }) {
			this.events = this.getEvents(start.date, end.date, true);
		},

		getPlannedEvents(start, end, excludeSessions = false) {

			const events = [];

			this.strategies.forEach(item => {
				const strategy = item;
				strategy.getEvents(start, end).forEach(event => {
					event.strategy = strategy;
					Object.assign(event, {
						id: strategy.id,
						color: strategy.getColor(),
						icon: strategy.getIcon(),
						name: strategy.name,
						desc: strategy.description,
					});

					const dayStats = this.stats.daily[event.startDay];
					if (excludeSessions && dayStats && dayStats.session[event.strategy_session]) {
						return;
					}

					event.valid = strategy.isValid(this.components, this.datasets);
					events.push(event);
				});
			});

			return events.sort((a, b) => (a.startDay > b.startDay) ? 1 : -1);
		},

		getTimedSessions(start, end) {

			const events = [];

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
								color: element.getColor(),
								icon: element.getIcon(),
								name: element.name,
								desc: element.description,
							});
							events.push(event);
						}
					}
				}
			}

			return events.sort((a, b) => (a.startDay > b.startDay) ? 1 : -1);
		},

		getEvents (start, end, excludeSessions = false) {

			return this.getPlannedEvents(start, end, excludeSessions).concat(this.getTimedSessions(start, end));
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
			} else if (event.startDay > this.today) {
				return Color.hexToRgba(event.color, 0.25);
			}

			return 'grey lighten-4';
		},

		prepareStats() {

			const [ start, end ] = this.dataRange;
			const daysDiff = end.diff(start, 'days') + 1;
			const daysLabels = [];
			for (let i = 0; i < daysDiff; i++) {
				if (this.rangeSize() > 7) {
					const localizedDate = moment(start).add(i, 'day').format('ll').split(' ');
					daysLabels.push(localizedDate[0] + ' ' + localizedDate[1]);
				} else {
					daysLabels.push(this.$options.filters.ucfirst(moment(start).add(i, 'day').format('dddd')));
				}
			}
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
			this.difficultyChart.datasets = [];
			for (let tagIdx = 0; tagIdx < tags.length; tagIdx++) {
				const tag = tags[tagIdx];
				const data = [];
				for (let i = 0; i < daysDiff; i++) {
					const day = moment(start).add(i, 'days').format('YYYY-MM-DD');
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
			this.difficultyChart.labels = daysLabels

			/**
			 * Interval Details Chart
			 */
			let data = [];
			for (let i = 0; i < daysDiff; i++) {
				const day = moment(start).add(i, 'days').format('YYYY-MM-DD');
				const dailyItem = this.stats.daily[day];
				data.push(dailyItem ? dailyItem.avgAnsweringTime || 0 : 0);
			}
			this.intervalChart.datasets = [{
				label: this.$t('dashboard.avgTimeSpent'),
				backgroundColor: Color.hexToRgba(colors[0]),
				borderColor: Color.hexToRgba(colors[0]),
				data,
			}];
			this.intervalChart.labels = daysLabels;

			/**
			 * Dataset Chart
			 */
			let datasetTypes = ['create', 'update', 'delete'];
			this.datasetChart.datasets = [];
			datasetTypes.forEach((type, typeIdx) => {
				let data = [];
				for (let i = 0; i < daysDiff; i++) {
					const day = moment(start).add(i, 'days').format('YYYY-MM-DD');
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
			this.datasetChart.labels = daysLabels;

			/**
			 * Endeavours Division Chart
			 */
			for(let type in this.stats.endeavours) {

				this.endeavoursDivisionCharts[type].labels = [];
				this.endeavoursDivisionCharts[type].datasets = [];

				const items = this.stats.endeavours[type];
				if (type === 'total') {

					if ((items.strategies + items.components + items.datasets) > 0) {

						this.endeavoursDivisionCharts[type].labels = [
							this.$t('app.menuGroup.strategies'),
							this.$t('app.menuGroup.components'),
							this.$t('app.menuGroup.dataset'),
						];
						this.endeavoursDivisionCharts[type].datasets.push({ backgroundColor: [], data: []});
						this.endeavoursDivisionCharts[type].datasets[0].backgroundColor = [colors[0], colors[1], colors[2]];
						this.endeavoursDivisionCharts[type].datasets[0].data = [
							items.strategies,
							items.components,
							items.datasets,
						];
					}
				} else {
					let i = 0;

					for(let key in items) {
						const id = parseInt(key);
						const item = this.$root[type].find(entry => entry.id === id);
						if (item) {
							const value = items[key];
							this.endeavoursDivisionCharts[type].datasets.push({ backgroundColor: [], data: []});
							this.endeavoursDivisionCharts[type].labels.push(item.name);
							this.endeavoursDivisionCharts[type].datasets[0].backgroundColor.push(item.color || colors[i]);
							this.endeavoursDivisionCharts[type].datasets[0].data.push(value);
							i++;
						}
					}
				}
			}
		},

		getNextSession() {

			const events = this.getPlannedEvents(this.today, moment(this.today).add(1, 'month'));
			if (events.length > 0) {
				return events[0];
			}
		},

		getCalendarStartDate() {

			if (this.rangeSize > 7) {
				return this.statsStartDate;
			}

			console.log(moment().endOf('week').format('YYYY-MM-DD'));

			return moment().endOf('week').subtract(3, 'days').format('YYYY-MM-DD');
		},

		getCalendarEndDate() {

			if (this.rangeSize > 7) {
				return this.statsEndDate;
			}

			return moment().endOf('week').add(3, 'days').format('YYYY-MM-DD');
		},
	},

	computed: {

		dataRangeContextual() {
			return [
				this.dataRange[0].format('YYYY-MM-DD'),
				this.dataRange[1].format('YYYY-MM-DD')
			];
		},

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

		next() {
			const event = this.getNextSession();

			if (!event) {
				return;
			}

			const localizedDate = moment(event.startDay).format('ll').split(' ');
			const isToday = event.startDay === this.today;
			const isTomorrow = event.startDay === this.tomorrow;
			const listeners = {};

			if (isToday) {
				listeners.click = () => {
					this.accomplishStrategy = this.$root.strategies[0];
					this.accomplishDialog.visible = true;
				};
			}

			return {
				...event,
				isToday,
				isTomorrow,
				color: isToday ? event.color || 'primary' : 'grey darken-2',
				dayMonth: localizedDate[0] + ' ' + localizedDate[1],
				year: moment().format('YYYY'),
				listeners,
			};
		}
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
			dataRange: [
				moment().subtract(7, 'days'),
				moment()
			],
			calendarType: 'custom-daily',
			calendarStartDate: null,
			calendarEndDate: null,
			isLoading: false,
			selectedStrategy: [],
			accomplishStrategy: null,
			accomplishDialog: { visible: false, pastFutureVisible: false, },
			news: this.$route.meta.news,
			strategies: this.$root.strategies,
			components: this.$root.components,
			datasets: this.$root.datasets,
			stats: this.$route.meta.stats,
			statsBySessionDate: {},
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
					labels: [],
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
			tomorrow: moment().add(1, 'day').format('YYYY-MM-DD'),
			calendarValue: moment().format('YYYY-MM-DD'),
		}
	},

	watch: {

		dataRange(range) {
			this.reload();
		}
	}
});
</script>

<style lang="scss">
	.theme--light.v-calendar-session {

		.v-calendar-weekly__day-label,
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
	.desc {
		p:last-child {
			margin-bottom: 0;
		}
	}
</style>
