<template>
	<v-sheet class="w-100" color="grey lighten-4" tile>

		<v-card color="white" class="py-2 px-4" dark tile>

			<!-- OBJECTIVES -->
			<v-row>
				<v-col cols="12" :md="12 / objectives.length" v-for="(objective, objectiveIdx) in objectives" :key="objectiveIdx">
					<v-card class="pa-4 d-flex align-center" :color="objective.color">
						<div class="shrink mr-4">
							<v-progress-circular :rotate="-90" :size="80" :width="15" :value="objective.percentage" color="white">
								{{ objective.percentage }} %
							</v-progress-circular>
						</div>
						<div class="grow">
							<div class="overline">{{ objective.title }}</div>
							<div class="display-1">{{ objective.value | humanNumber }}</div>
						</div>
					</v-card>
				</v-col>
			</v-row>

			<!-- CALENDAR -->
			<v-sheet class="relative" light>
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
					:first-interval="firstInterval"
					:interval-count="intervalCount"
					:events="events"
					:event-color="getEventColor"
					@change="getEvents"
					@click:event="handleEventClick"
					class="v-calendar-session my-2"
				>
					<template v-slot:event="props">
						<span :class="{ 'pa-1 black--text': true }">
							<span>
								<template v-if="!props.event.valid">
									<v-icon color="white" small left>mdi-alert</v-icon>
								</template>
								<template v-else-if="!props.timed">
									<template v-if="props.event.startDay < today">
										<v-icon color="error" small left>mdi-close-circle</v-icon>
									</template>
									<template v-else-if="props.event.startDay === today">
										<v-icon small left>mdi-play</v-icon>
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
							<div v-if="props.timed" class="text-center">
								<v-chip color="success" class="mr-2" x-small outlined>5</v-chip>
								<v-chip color="warning" class="mr-2" x-small outlined>5</v-chip>
								<v-chip color="error" x-small outlined>5</v-chip>
							</div>
						</span>
					</template>
				</v-calendar>
			</v-sheet>
		</v-card>

		<v-sheet color="transparent" class="my-2 px-4" tile>
			<v-row>
				<v-col cols="12" md="6">

					<!-- BARS -->
					<v-card light color="white">
						<div class="d-flex align-center pa-4">
							<div class="shrink">
								<v-btn :disabled="strategies.data.length < 2" icon>
									<v-icon>mdi-chevron-left</v-icon>
								</v-btn>
							</div>
							<div class="flex-md-grow-1">
								<v-select class="pa-0 ma-0 mx-4" label="Strategie" item-text="name" :items="strategies.data" v-model="selectedStrategy" solo flat dense hide-details></v-select>
							</div>
							<div class="shrink">
								<v-btn :disabled="strategies.data.length < 2" icon>
									<v-icon>mdi-chevron-right</v-icon>
								</v-btn>
							</div>
						</div>

						<div class="pa-4 pt-0">
							<bar-chart style="height: 350px" :chart-data="strategyData" :options="chartOptions"></bar-chart>
						</div>
					</v-card>
				</v-col>
				<v-col cols="12" md="6">

					<!-- NEWS -->
					<v-card light color="grey lighten-4">
						<v-list color="white">
							<v-list-item>
								<v-list-item-icon class="mr-4">
									<v-icon>mdi-newspaper-variant-multiple-outline</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title class="headline primary--text" v-text="$t('dashboard.news.title')"></v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list>
						<v-divider></v-divider>
						<v-list color="transparent" max-height="400" class="scrollable" tile>

							<!-- EMPTY -->
							<v-slide-y-reverse-transition>
								<EmptyView key="empty" v-if="news.data.length === 0" desc="Aucune actualité" />
							</v-slide-y-reverse-transition>

							<!-- HAS CONTENT -->
							<v-slide-y-reverse-transition group>
								<v-card class="mx-2" outlined v-for="(newsItem, newsIdx) in news.data" :key="newsIdx">
									<v-list-item three-line>
										<v-list-item-content>
											<div class="overline mb-4" v-text="$t('dashboard.news.types.' + newsItem.type)"></div>
											<v-list-item-title class="headline mb-1">
												<span v-text="newsItem.content[0].title"></span>
											</v-list-item-title>
											<v-list-item-subtitle>
												<span v-text="newsItem.content[0].abstract"></span>
											</v-list-item-subtitle>
										</v-list-item-content>

										<v-list-item-avatar v-if="newsItem.thumbnail" tile size="80">
											<v-img height="80" width="80" :src="$thumbnails(newsItem.thumbnail.private_hash, 200, 200)"></v-img>
										</v-list-item-avatar>

										<v-list-item-avatar v-else tile size="80">
											<v-icon size="80">mdi-newspaper-variant-outline</v-icon>
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
						</v-list>
					</v-card>
				</v-col>
			</v-row>
		</v-sheet>
	</v-sheet>
</template>

<script>
import Vue from 'vue';
import EmptyView from "../../components/EmptyView";
import BarChart from "../../components/Chart/Bar";
import {Response, NewsService, StrategyService, Strategy, ComponentService, DatasetService, Cookies, StrategySessionService, StrategySession} from "@polymind/sdk-js";
import Radar from "../../components/Chart/Radar";
import UserAvatar from "../../components/UserAvatar";
import moment from "moment";

export default Vue.extend({

	components: { EmptyView, UserAvatar, BarChart, Radar },

	beforeRouteEnter(to, from, next) {

		Promise.all([
			NewsService.getAll(Cookies.get('lang')),
			StrategyService.getAll(localStorage.getItem('user_id')),
			ComponentService.getAll(localStorage.getItem('user_id')),
			DatasetService.getAll(localStorage.getItem('user_id')),
			StrategySessionService.getAll(localStorage.getItem('user_id')),
		])
				.then(([news, strategies, components, datasets, sessions]) => {
					to.meta.news = news;
					to.meta.strategies = strategies;
					to.meta.components = components;
					to.meta.datasets = datasets;
					to.meta.sessions = sessions;
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

		},

		handleEventClick(props) {
			console.log(props);

			if (!props.event.valid) {
				this.$router.push('/strategy/' + props.event.strategy_id);
			}
			else if (props.event.startDay === this.today) {
				const link = process.env.VUE_APP_PLAYER_URL + '/strategy/' + props.event.strategy_id;
				const win = window.open(link, '_blank');
				win.focus();

			} else if (props.event.startDay > this.today) {

			} else if (props.event.startDay < this.today) {

			}
		},

		getEvents ({ start, end }) {

			const events = [];

			this.strategies.data.forEach(item => {
				const strategy = new Strategy(item);
				strategy.getEvents({ start, end }).forEach(event => {
					event.strategy_id = strategy.id;
					event.valid = strategy.isValid(this.components.data, this.datasets.data);
					events.push(event);
				});
			});

			this.sessions.data.forEach(item => {
				const session = new StrategySession(item);
				events.push(session.getEvent());
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
	},

	computed: {

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
					intervalCount = endHour;
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
			objectives: [
				{ title: 'Facile', percentage: Math.ceil(Math.random() * 100), value: Math.ceil(Math.random() * 10000), color: 'primary', },
				{ title: 'Incertain', percentage: Math.ceil(Math.random() * 100), value: Math.ceil(Math.random() * 1000), color: 'third', },
				{ title: 'Difficile', percentage: Math.ceil(Math.random() * 100), value: Math.ceil(Math.random() * 1000), color: 'secondary', },
			],
			news: this.$route.meta.news,
			strategies: this.$route.meta.strategies,
			components: this.$route.meta.components,
			datasets: this.$route.meta.datasets,
			sessions: this.$route.meta.sessions,
			strategyData: {
				labels: [Math.floor(Math.random() * (50 - 5 + 1)) + 5, Math.floor(Math.random() * (50 - 5 + 1)) + 5],
				datasets: [
					{
						label: 'Facile',
						backgroundColor: this.$vuetify.theme.themes.light.primary,
						data: [Math.floor(Math.random() * (50 - 5 + 1)) + 5, Math.floor(Math.random() * (50 - 5 + 1)) + 5]
					}, {
						label: 'Incertain',
						backgroundColor: this.$vuetify.theme.themes.light.third,
						data: [Math.floor(Math.random() * (50 - 5 + 1)) + 5, Math.floor(Math.random() * (50 - 5 + 1)) + 5]
					}, {
						label: 'Difficile',
						backgroundColor: this.$vuetify.theme.themes.light.secondary,
						data: [Math.floor(Math.random() * (50 - 5 + 1)) + 5, Math.floor(Math.random() * (50 - 5 + 1)) + 5]
					}
				]
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
	.v-calendar-session {
		.v-calendar-daily__day.v-past,
		.v-calendar-daily__day.v-future {
			background-color: rgba(0, 0, 0, 0.05);
		}
		.v-calendar-daily__day.v-future .v-event-timed:not(:hover),
		.v-calendar-daily__day.v-past .v-event-timed:not(:hover) {
			opacity: 0.5;
		}
		.v-event-timed {
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			transition: all ease 0.3s;
			color: black !important;

			&.white--text {
				color: #777 !important;
			}
		}
	}
</style>
