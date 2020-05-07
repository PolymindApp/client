<template>
	<v-sheet class="w-100" color="grey lighten-4" tile>

		<v-card color="white" class="pa-4" dark tile>

			<!-- OBJECTIVES -->
			<v-row v-if="hasStats" class="mt-n3">
				<v-col cols="12" :md="12 / objectives.length" v-for="(objective, objectiveIdx) in objectives" :key="objectiveIdx">
					<v-card class="pa-4 d-flex align-center fill-height" :color="objective.value > 0 ? objective.color : 'white'" :light="objective.value === 0">
						<div class="shrink mr-4">
							<v-progress-circular :rotate="-90" :size="80" :width="15" :value="objective.percentage">
								<span v-if="objective.value > 0" class="overline">{{ objective.percentage }} %</span>
								<v-icon v-else>mdi-thumb-up</v-icon>
							</v-progress-circular>
						</div>
						<div class="grow">
							<div class="overline">{{ objective.title }}</div>
							<div class="display-1">{{ objective.value | humanNumber }}</div>
						</div>
					</v-card>
				</v-col>

			</v-row>
			<v-alert v-else type="info" class="mx-n4 mt-n4" text dismissible prominent tile>
				<div><strong v-text="$t('dashboard.notSeeingStatsTitle')"></strong></div>
				<div v-text="$t('dashboard.notSeeingStatsDesc')"></div>
			</v-alert>

			<!-- CALENDAR -->
			<v-sheet class="relative" light>

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
					class="v-calendar-session my-2"
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
								<v-chip :color="getSessionCount(props.event.startDay,'easy', props.event.id) ? 'success' : null" class="mr-2" x-small outlined>{{ getSessionCount(props.event.startDay, 'easy', props.event.id) }}</v-chip>
								<v-chip :color="getSessionCount(props.event.startDay,'unsure', props.event.id) ? 'warning' : null" class="mr-2" x-small outlined>{{ getSessionCount(props.event.startDay, 'unsure', props.event.id) }}</v-chip>
								<v-chip :color="getSessionCount(props.event.startDay,'hard', props.event.id) ? 'error' : null" x-small outlined>{{ getSessionCount(props.event.startDay, 'hard', props.event.id) }}</v-chip>
							</div>
						</span>
					</template>
				</v-calendar>
			</v-sheet>
		</v-card>

		<v-sheet color="transparent" class="my-2 px-4" tile>
			<v-row>
				<v-col cols="12" md="6">

					<!-- TENDENCIES -->
					<v-card light>
						<v-overlay v-if="!hasStats" color="white" absolute :dark="false" opacity="0.75" z-index="2">
							<EmptyView title="Rien pour cette semaine" desc="Démarrer une session depuis une de vos strategies en barre latérale" />
						</v-overlay>
						<v-card-title class="flex-column">
							<div v-text="$t('dashboard.weeklyTendenciesTitle')"></div>
							<div class="overline" v-text="$t('dashboard.weeklyTendenciesDesc')"></div>
						</v-card-title>
						<v-card-text class="pt-4">
							<EmptyView v-if="!hasStats" style="height: 350px" title="Rien pour cette semaine" desc="Démarrer une session depuis une de vos strategies en barre latérale" />
							<line-stacked-chart v-else style="height: 350px" :chart-data="strategyData" :options="chartOptions"></line-stacked-chart>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" md="6">

					<!-- INTERVALS -->
					<v-card light>
						<v-overlay v-if="!hasStats" color="white" absolute :dark="false" opacity="0.75" z-index="2">
							<EmptyView title="Rien pour cette semaine" desc="Démarrer une session depuis une de vos strategies en barre latérale" />
						</v-overlay>
						<v-card-title class="flex-column">
							<div v-text="$t('dashboard.avgIntervalsTitle')"></div>
							<div class="overline" v-text="$t('dashboard.avgIntervalsDesc')"></div>
						</v-card-title>
						<v-card-text class="pt-4">
							<EmptyView v-if="!hasStats" style="height: 350px" title="Rien pour cette semaine" desc="Démarrer une session depuis une de vos strategies en barre latérale" />
							<bar-chart v-else style="height: 350px" :chart-data="strategyData" :options="chartOptions"></bar-chart>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" md="6">

					<!-- DATA ADDED -->
					<v-card light>
						<v-overlay v-if="!hasStats" color="white" absolute :dark="false" opacity="0.75" z-index="2">
							<EmptyView title="Rien pour cette semaine" desc="Démarrer une session depuis une de vos strategies en barre latérale" />
						</v-overlay>
						<v-card-title class="flex-column">
							<div v-text="$t('dashboard.dataAddedTitle')"></div>
							<div class="overline" v-text="$t('dashboard.dataAddedDesc')"></div>
						</v-card-title>
						<v-card-text class="pt-4">
							<bar-chart style="height: 350px" :chart-data="strategyData" :options="chartOptions"></bar-chart>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" md="6">

					<!-- STRATEGIES -->
					<v-card light>
						<v-overlay v-if="!hasStats" color="white" absolute :dark="false" opacity="0.75" z-index="2">
							<EmptyView title="Rien pour cette semaine" desc="Démarrer une session depuis une de vos strategies en barre latérale" />
						</v-overlay>
						<v-card-title class="flex-column">
							<div v-text="$t('dashboard.strategyDivisionTitle')"></div>
							<div class="overline" v-text="$t('dashboard.strategyDivisionDesc')"></div>
						</v-card-title>
						<v-card-text class="pt-4">
							<pie-chart style="height: 350px" :chart-data="strategyData" :options="chartOptions"></pie-chart>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" md="6">

					<!-- NEWS -->
					<v-card color="grey lighten-4" light>
						<v-card-title class="white d-flex justify-space-between">
							<span v-text="$t('dashboard.news.title')"></span>
						</v-card-title>
						<v-card-text class="pt-4">

							<!-- EMPTY -->
							<v-slide-y-reverse-transition>
								<EmptyView key="empty" v-if="news.data.length === 0" desc="Aucune actualité" />
							</v-slide-y-reverse-transition>

							<!-- HAS CONTENT -->
							<v-slide-y-reverse-transition group>
								<v-card outlined v-for="(newsItem, newsIdx) in news.data" :key="newsIdx">
									<v-list-item three-line>
										<v-list-item-content>
											<div class="overline mb-4" v-text="$t('dashboard.news.types.' + newsItem.type)"></div>
											<v-list-item-title class="headline mb-1">
												<span v-text="newsItem.content[0].title"></span>
											</v-list-item-title>
											<v-list-item-subtitle>
												<span v-text="newsItem.content[0].abstract" style="line-height: 1.25rem"></span>
											</v-list-item-subtitle>
										</v-list-item-content>

										<v-list-item-avatar v-if="newsItem.thumbnail" tile size="80">
											<v-img height="80" width="80" :src="$thumbnails(newsItem.thumbnail.private_hash, 200, 200)"></v-img>
										</v-list-item-avatar>
									</v-list-item>
									<v-card-actions>
										<v-btn color="primary" :to="'/news/' + newsItem.content[0].language + '/' + newsItem.content[0].slug" text>
											<span v-text="$t('dashboard.news.seeMore')"></span>
											<v-icon right>mdi-plus</v-icon>
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-slide-y-reverse-transition>
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
import PieChart from "../../components/Chart/Pie";
import { Color, NewsService, Strategy, StrategySessionStatsService, Cookies, StrategySessionService, StrategySession} from "@polymind/sdk-js";
import Radar from "../../components/Chart/Radar";
import UserAvatar from "../../components/UserAvatar";
import moment from "moment";
import AccomplishStrategy from "../../components/AccomplishStrategy";

export default Vue.extend({

	components: { EmptyView, UserAvatar, PieChart, BarChart, LineStackedChart, Radar, AccomplishStrategy },

	beforeRouteEnter(to, from, next) {

		const startDate = moment().startOf('week').subtract(1, 'day');
		const endDate = moment().endOf('week').add(2, 'day');

		Promise.all([
			NewsService.getAll(Cookies.get('lang')),
			StrategySessionService.getAllBetween(localStorage.getItem('user_id'), 'live', startDate, endDate),
			StrategySessionStatsService.getAll(),
		])
				.then(([news, sessions, stats]) => {
					to.meta.news = news;
					to.meta.sessions = sessions;
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
				const strategy = new Strategy(item);
				strategy.getEvents({ start, end }).forEach(event => {
					event.strategy = strategy;

					if (this.hasDoneSession(event.strategy.id, event.startDay)) {
						return;
					}

					event.valid = strategy.isValid(this.components, this.datasets);
					events.push(event);
				});
			});

			this.sessions.data.forEach(item => {
				const session = new StrategySession(item);
				if (session.end_date) {
					events.push(session.getEvent());
				}
			});

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

		hasDoneSession(id, date) {
			return this.sessions.data.find(session => moment(session.start_date).format('YYYY-MM-DD') === date && session.strategy.id === id);
		},

		getSessionCount(tag, date, id) {

			const stat = this.stats.find(stat => {
				if (date && stat.date !== date) {
					return;
				}
				if (id && stat.strategy_session !== id) {
					return;
				}
				return stat.tag === tag;
			});

			if (!stat) {
				return 0;
			}

			return stat.count;
		},

		prepareStats() {

			const tags = ['easy', 'unsure', 'hard'];
			const colors = ['success', 'warning', 'error'];

			let total = 0;
			this.statsBySessionDate = {};
			this.stats.forEach(stat => {
				const index = tags.indexOf(stat.tag);
				if (index >= 0) {
					this.objectives[index].value += stat.count;
					total += stat.count;
				}
			});
			for (let i = 0; i < this.objectives.length; i++) {
				const objective = this.objectives[i];
				objective.percentage = parseFloat((objective.value / total * 100).toFixed(1));
			}


			this.strategyData.labels = [];
			const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',];
			for (let i = 0; i < 7; i++) {
				this.strategyData.labels.push(this.$t('date.' + days[i]));
			}

			this.strategyData.datasets = [];
			tags.forEach((tag, tagIdx) => {
				const data = [];
				days.forEach((day, dayIdx) => {
					const date = moment().startOf('week').add(dayIdx, 'day').format('YYYY-MM-DD');
					const count = this.getSessionCount(tag, date);
					data.push(count);
				});
				const color = this.$vuetify.theme.themes.light[colors[tagIdx]];
				this.strategyData.datasets.push({
					label: this.$t('dashboard.objectives.' + tag),
					backgroundColor: Color.hexToRgba(color),
					data
				});
			});
		},
	},

	computed: {

		hasStats() {
			let total = 0;
			for (let i = 0; i < this.objectives.length; i++) {
				const objective = this.objectives[i];
				total += objective.value;
			}
			return total > 0;
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
		return {
            fab: false,
			selectedStrategy: [],
			accomplishStrategy: null,
			objectives: [
				{ title: this.$t('dashboard.objectives.easy'), percentage: 0, value: 0, color: 'primary', },
				{ title: this.$t('dashboard.objectives.unsure'), percentage: 0, value: 0, color: 'third', },
				{ title: this.$t('dashboard.objectives.hard'), percentage: 0, value: 0, color: 'secondary', },
			],
			accomplishDialog: { visible: false, pastFutureVisible: false, },
			news: this.$route.meta.news,
			strategies: this.$root.strategies,
			components: this.$root.components,
			datasets: this.$root.datasets,
			sessions: this.$route.meta.sessions,
			stats: this.$route.meta.stats,
			statsBySessionDate: {},
			strategyData: {
				labels: [],
				datasets: []
			},
			chartOptions: {
				responsive: true,
				maintainAspectRatio: false,
			},
			events: [],
			today: moment().format('YYYY-MM-DD'),
		}
	},
});
</script>

<style lang="scss">
	.theme--light.v-calendar-session {
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
