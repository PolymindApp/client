<template>
	<v-row class="white" no-gutters>

		<!-- LAUNCH SESSION DIALOG -->
		<LaunchSession :visible="launchSession.visible" :structure="launchSession.structure"></LaunchSession>

		<!-- NAVIGATION -->
		<v-col cols="12" md="3" class="fill-height d-flex flex-column pa-4">
			<div style="flex: 0">
				<v-btn :loading="sessionLoading" :disabled="!canStartSession" block color="primary" rounded large>
					<v-icon left>mdi-timelapse</v-icon>
					<span>Démarrez une session</span>
				</v-btn>
			</div>
			<v-divider class="my-4"></v-divider>
			<div class="scrollable" style="flex-grow: 1; height: 0">
				<v-row :class="{ 'scrollable': true, 'mt-4': dayIdx > 0 }" :key="day.date" v-for="(day, dayIdx) in navigation" no-gutters>
					<v-col cols="3" class="text-center d-flex flex-column align-start">
						<div>
							<div :class="{ 'overline text-no-wrap': true, 'primary--text': selectedSession.date === day.date }" v-text="day.name"></div>
							<div :class="{ 'd-flex align-center justify-center title': true, 'primary white--text': selectedSession.date === day.date }" v-text="day.day" style="height: 2.5rem; width: 2.5rem; border-radius: 100%"></div>
						</div>
					</v-col>
					<v-col cols="9">
						<v-card @click="selectSession(session)" :class="{ 'pa-2': true, 'mt-2': sessionIdx > 0 }" :color="selectedSession.id === session.id ? 'primary' : 'grey lighten-4'" :key="session.id" v-for="(session, sessionIdx) in day.sessions" :dark="selectedSession.id === session.id" flat>
							<div class="font-weight-medium" v-text="session.title"></div>
							<div class="caption d-flex align-center justify-space-between">
								<div>{{session.startTime}} - {{session.endTime}}</div>
								<div class="d-flex align-center">
									<v-icon x-small left>mdi-timer</v-icon>
									<span>{{ (session.duration / 60).toFixed(1) }} min</span>
								</div>
							</div>
							<div class="session-status d-flex mb-n2 ml-n2 mr-n2 mt-2">
								<div class="status-hard error" :style="{ width: session.statusPercentages.hard + '%' }"></div>
								<div class="status-unsure warning" :style="{ width: session.statusPercentages.unsure + '%' }"></div>
								<div class="status-easy success" :style="{ width: session.statusPercentages.easy + '%' }"></div>
							</div>
						</v-card>
					</v-col>
				</v-row>
			</div>
<!--			<div style="flex: 0" class="mt-4">-->
<!--				<v-alert type="warning" border="left" icon="mdi-alert-circle-outline" class="ma-0" outlined>-->
<!--					Some alert message here-->
<!--				</v-alert>-->
<!--			</div>-->
		</v-col>

		<!-- DETAILS -->
		<v-col cols="12" md="9" class="fill-height d-flex flex-column">
			<div class="pa-4 pl-0" style="flex-grow: 1; height: 0; overflow-y: scroll">
				<v-card outlined :elevation="2">

					<!-- HEADER -->
					<v-toolbar color="primary" dark flat>

						<v-toolbar-title>
							<v-icon left v-text="selectedSession.icon"></v-icon>
							<span v-text="selectedSession.title"></span>
						</v-toolbar-title>
						<span class="overline ml-4 mt-1">
							(<v-icon x-small left>mdi-timer</v-icon><span v-text="(selectedSession.duration / 60).toFixed(1)"></span> min)
						</span>
						<v-spacer></v-spacer>

						<v-btn @click="relaunch()" class="mr-4" :loading="launchSession.loading" text>
							<v-icon left>mdi-redo-variant</v-icon>
							<span>Relancer</span>
						</v-btn>

						<v-menu bottom left>
							<template v-slot:activator="{ on }">
								<v-btn v-on="on" icon>
									<v-icon>mdi-dots-vertical</v-icon>
								</v-btn>
							</template>
							<v-list dense>
								<v-list-item @click="test(dataset)">
									<v-list-item-icon>
										<v-icon>mdi-archive</v-icon>
									</v-list-item-icon>
									<v-list-item-title>Archive</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>

						<template v-slot:extension>
							<v-tabs v-model="tab" background-color="primary" grow>
								<v-tab>
									<v-icon left>mdi-clipboard-list</v-icon>
									<span>Résultats</span>
								</v-tab>
								<v-tab>
									<v-icon left>mdi-chart-line</v-icon>
									<span>Statistics</span>
								</v-tab>
								<v-tab>
									<v-icon left>mdi-file-find-outline</v-icon>
									<span>Details</span>
								</v-tab>
							</v-tabs>
						</template>
					</v-toolbar>

					<v-tabs-items v-model="tab">

						<!-- RESULTS -->
						<v-tab-item color="transparent">
							<v-row class="fill-height" no-gutters>
								<v-col cols="12" md="4" class="d-flex flex-column">
									<div class="error white--text text-center title relative">
										<div class="pa-4">Difficultés</div>
										<v-sparkline v-model="results.hard" color="rgba(255, 255, 255, 0.25)" :padding="0" height="30" class="mt-n9" fill smooth auto-draw></v-sparkline>
									</div>
									<v-list :color="bg.error" style="flex: 1">
										<v-list-item :key="item" v-for="(item, itemIdx) in words[0]">
											<v-list-item-icon>
												<pie-chart :chart-data="wordsChart" :options="wordsChart.options" style="height: 40px; width: 40px; margin: 5px -5px -15px -5px"></pie-chart>
											</v-list-item-icon>
											<v-list-item-content>
												<v-list-item-title v-html="item"></v-list-item-title>
												<v-list-item-subtitle>
													Temps passé : 3min
												</v-list-item-subtitle>
											</v-list-item-content>
											<v-list-item-icon>
												<v-btn icon>
													<v-icon>mdi-chevron-right</v-icon>
												</v-btn>
											</v-list-item-icon>
										</v-list-item>
									</v-list>
								</v-col>
								<v-col cols="12" md="4" class="d-flex flex-column" style="padding: 0 2px">
									<div class="warning white--text text-center title relative">
										<div class="pa-4">Incertitudes</div>
										<v-sparkline v-model="results.unsure" color="rgba(255, 255, 255, 0.25)" :padding="0" height="30" class="mt-n9" fill smooth auto-draw></v-sparkline>
									</div>
									<v-list :color="bg.warning" style="flex: 1">
										<v-list-item :key="item" v-for="(item, itemIdx) in words[1]">
											<v-list-item-icon>
												<pie-chart :chart-data="wordsChart" :options="wordsChart.options" style="height: 40px; width: 40px; margin: 5px -5px -15px -5px"></pie-chart>
											</v-list-item-icon>
											<v-list-item-content>
												<v-list-item-title v-html="item"></v-list-item-title>
												<v-list-item-subtitle>
													Temps passé : 3min
												</v-list-item-subtitle>
											</v-list-item-content>
											<v-list-item-icon>
												<v-btn icon>
													<v-icon>mdi-chevron-right</v-icon>
												</v-btn>
											</v-list-item-icon>
										</v-list-item>
									</v-list>
								</v-col>
								<v-col cols="12" md="4" class="d-flex flex-column">
									<div class="success white--text text-center title relative">
										<div class="pa-4">Facilités</div>
										<v-sparkline v-model="results.success" color="rgba(255, 255, 255, 0.25)" :padding="0" height="30" class="mt-n9" fill smooth auto-draw></v-sparkline>
									</div>
									<v-list :color="bg.success" style="flex: 1">
										<v-list-item :key="item" v-for="(item, itemIdx) in words[2]">
											<v-list-item-icon>
												<pie-chart :chart-data="wordsChart" :options="wordsChart.options" style="height: 40px; width: 40px; margin: 5px -5px -15px -5px"></pie-chart>
											</v-list-item-icon>
											<v-list-item-content>
												<v-list-item-title v-html="item"></v-list-item-title>
												<v-list-item-subtitle>
													Temps passé : 3min
												</v-list-item-subtitle>
											</v-list-item-content>
											<v-list-item-icon>
												<v-btn icon>
													<v-icon>mdi-chevron-right</v-icon>
												</v-btn>
											</v-list-item-icon>
										</v-list-item>
									</v-list>
								</v-col>
							</v-row>
						</v-tab-item>

						<!-- STATISTICS -->
						<v-tab-item color="transparent" class="pa-4">
							<pre v-text="stats"></pre>
						</v-tab-item>

						<!-- DETAILS -->
						<v-tab-item color="transparent">
							<v-row>
								<v-col cols="12" md="6">
									<v-list>
										<v-subheader>Générale</v-subheader>
										<v-list-item>
											<v-list-item-icon>
												<v-icon>mdi-calendar</v-icon>
											</v-list-item-icon>
											<v-list-item-content>
												<v-list-item-title>Plage de temps</v-list-item-title>
												<v-list-item-subtitle>
													{{ selectedSession.date | humanDate }} de
													{{ selectedSession.startTime }} - {{ selectedSession.endTime }}
												</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>
										<v-list-item>
											<v-list-item-icon>
												<v-icon>mdi-timer</v-icon>
											</v-list-item-icon>
											<v-list-item-content>
												<v-list-item-title>Durée de la session</v-list-item-title>
												<v-list-item-subtitle>3.24 min</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>
										<v-list-item>
											<v-list-item-icon>
												<v-icon>mdi-cube</v-icon>
											</v-list-item-icon>
											<v-list-item-content>
												<v-list-item-title>Type de session</v-list-item-title>
												<v-list-item-subtitle>Diaporama libre</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>
									</v-list>
								</v-col>
								<v-col cols="12" md="6">
									<v-list>
										<v-subheader>Paramètres</v-subheader>
										<v-list-item>
											<v-list-item-content>
												<v-list-item-title>Clé</v-list-item-title>
												<v-list-item-subtitle>Valeur</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>
									</v-list>
								</v-col>
							</v-row>
						</v-tab-item>
					</v-tabs-items>
				</v-card>
			</div>
		</v-col>
	</v-row>
</template>

<script>
	import Vue from 'vue';
	import EmptyView from "../../components/EmptyView";
	import LaunchSession from "../../components/LaunchSession";
	import moment from 'moment';
	import { SessionStatsService, SessionStructure, Color, Session, SessionStructureService } from '@polymind/sdk-js';
	import PieChart from '../../components/Chart/Pie';

	export default Vue.extend({

		components: { EmptyView, PieChart, LaunchSession },

		beforeRouteEnter(to, from, next) {

			const startDate = moment().subtract(1, 'month');
			const endDate = moment().add(1, 'day');
			SessionStatsService.getAll(null, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')).then(stats => {
				to.meta.stats = stats;
				next();
			})
					.catch(error => next('/404'));
		},

		created() {
			this.init();
		},

		mounted () {

		},

		methods: {

			init() {

				if (this.navigation.length > 0) {
					this.selectSession(this.navigation[0].sessions[0]);
				}
			},

			selectSession(session) {
				this.selectedSession = session;
			},

			relaunch() {
				this.launchSession.loading = true;
				SessionStructureService.getBySessionId(this.selectedSession.id)
				.then(structure => {
					this.launchSession.visible = true;
					this.launchSession.structure = structure;
				})
				.finally(() => this.launchSession.loading = false);
			},

		},

		computed: {

			navigation() {
				let items = [];
				for (let date in this.stats.daily) {
					const day = {
						date,
						timestamp: moment(date).unix(),
						name: moment(date).format('ddd').toUpperCase().replace('.', ''),
						day: parseInt(moment(date).format('D')),
						sessions: [],
					};
					for (let id in this.stats.daily[date].session) {
						const sessionData = this.stats.daily[date].session[id];
						const dataset = this.$root.datasets.find(dataset => dataset.id === sessionData.dataset);
						const totalStatus = (sessionData.totalTags.hard || 0) + (sessionData.totalTags.unsure || 0) + (sessionData.totalTags.easy || 0);
						const session = {
							id,
							date,
							icon: dataset.icon,
							title: dataset.name,
							startTime: moment(sessionData.start_date).format('HH:mm'),
							endTime: moment(sessionData.end_date).format('HH:mm'),
							duration: sessionData.totalTime,
							timestamp: moment(sessionData.start_date).unix(),
							statusPercentages: {
								easy: (sessionData.totalTags.easy || 0) * 100 / totalStatus,
								unsure: (sessionData.totalTags.unsure || 0) * 100 / totalStatus,
								hard: (sessionData.totalTags.hard || 0) * 100 / totalStatus,
							},
						};
						day.sessions.push(session);
					}
					day.sessions.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1).reverse();
					items.push(day);
				}
				items.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1).reverse();
				return items;
			},

			canStartSession() {
				return this.$root.components.length > 0 && this.$root.datasets.length > 0;
			},
		},

		data() {
			return {
				tab: 'stats',
				today: moment().format('YYYY-MM-DD'),
				stats: this.$route.meta.stats,
				selectedSession: new Session(),
				sessionLoading: false,
				results: {
					hard: [3, 5, 11, 17, 6, 9, 18, 14, 4, 12, 10, 8, 2, 1, 16, 7, 19, 15, 13, 20],
					unsure: [13, 16, 17, 19, 15, 12, 10, 4, 3, 1, 14, 8, 5, 9, 11, 2, 18, 7, 6, 20],
					success: [6, 16, 7, 10, 17, 5, 3, 8, 1, 4, 20, 13, 19, 2, 15, 18, 14, 11, 9, 12],
				},
				bg: {
					error: Color.hexToRgba(this.$vuetify.theme.themes.light.error, 0.1),
					warning: Color.hexToRgba(this.$vuetify.theme.themes.light.warning, 0.1),
					success: Color.hexToRgba(this.$vuetify.theme.themes.light.success, 0.1),
				},
				words: [
					['articulate', 'acquisition', 'rain', 'demand', 'nature', 'branch', 'apathy', 'capture', 'free', 'lack', 'temporary', 'gate', 'grow', 'turkey', 'ball', 'representative', 'convulsion', 'crosswalk', 'popular', 'fascinate', 'economist', 'qualification', 'compound', 'session', 'game',],
					['aluminium', 'kneel', 'abuse', 'unlike', 'hold', 'bracket', 'risk', 'decline', 'whip', 'director', 'hell', 'occasion', 'assembly', 'ambition', 'beer', 'efflux', 'partner', 'lily', 'constellation', 'native', 'rice', 'paralyzed', 'indication', 'harass', 'tiger,',],
					['skin', 'Koran', 'dealer', 'neighborhood', 'mouth', 'dance', 'number', 'design', 'pepper', 'superior', 'restless', 'hunter', 'rebel', 'spy', 'patience', 'bike', 'ignore', 'market', 'seem', 'trivial', 'condition', 'charge', 'award', 'attack', 'improvement',],
				],
				wordsChart: {
					labels: [],
					datasets: [{
						backgroundColor: [
							this.$vuetify.theme.themes.light.success,
							this.$vuetify.theme.themes.light.warning,
							this.$vuetify.theme.themes.light.error
						],
						data: [3, 5, 7],
					}],
					options: {
						tooltips: {
							enabled: false,
						},
					}
				},
				launchSession: {
					loading: false,
					visible: false,
					structure: new SessionStructure(),
				},
			}
		},

		watch: {

		}
	});
</script>

<style lang="scss">
	.session-status > div {
		height: 3px;
	}
	.session-status {
		border-radius: 0 0 3px 3px !important;
		overflow: hidden;
	}
</style>
