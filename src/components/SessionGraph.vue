<template>
    <div class="graph">
		<div class="scrollable mx-n4 px-4">
			<div class="pr-4">
				<table class="w-100 table">
					<tbody>
						<tr>
							<td></td>
							<td class="pb-2" :colspan="month.colspan" v-for="month in months">
								{{month.name}}
							</td>
						</tr>
						<tr :key="weekdayIdx" v-for="(weekday, weekdayIdx) in 7">
							<td class="pr-4 text-right">
								<span v-if="weekdayIdx % 2 === 1">{{(weekday) | weekdayName}}</span>
								<span v-else>&nbsp;</span>
							</td>
							<td :key="dayIdx" v-for="(day, dayIdx) in 52" :style="{ width: (100 / 52) + '%'}">
								<v-fade-transition group>
									<v-tooltip :key="'day_' + dayIdx" v-if="day < 52 || currentDay >= weekday" bottom>
										<template v-slot:activator="{ on }">
											<div v-ripple @click="viewSessions(day, weekday)" v-on="on" :class="getClasses(day, weekday)">
												<!--									<span v-if="getDate(day, weekday).format('DD') == 1">{{((day - 1) * 7) + weekday}}</span>-->
											</div>
										</template>
										<span>
											<span v-if="!getSessions(day, weekday)" v-html="$t('sessionGraph.noSession', { date: getDate(day, weekday).format('ll') })"></span>
											<span v-else v-html="$t('sessionGraph.sessions', { total: getSessions(day, weekday).total, date: getSessions(day, weekday).cleanDate })"></span>
										</span>
									</v-tooltip>
								</v-fade-transition>
							</td>
						</tr>
					</tbody>
					<tfoot>
					<tr>
						<td></td>
						<td colspan="52">
							<v-progress-linear :active="isLoading" indeterminate></v-progress-linear>
						</td>
					</tr>
					</tfoot>
				</table>
			</div>
		</div>

		<v-expand-transition group>
			<div key="empty" v-if="sessionsDayDate && sessionsDay.length === 0">
				<v-card-title>{{ $t('sessionGraph.sessionsDay') }}</v-card-title>
				<v-alert type="info" border="left" colored-border light elevation="2">
					<span class="text-break" v-html="$t('sessionGraph.noSessionsThisDay', { date: moment(sessionsDayDate).format('ll') })"></span>
				</v-alert>
			</div>
		</v-expand-transition>
	</div>
</template>

<script>
    import Vue from 'vue';
    import { StrategySessionService } from '@polymind/sdk-js';
    import moment from 'moment';

    export default Vue.extend({

        name: 'CommitGraph',

        props: ['user'],

        components: {},

        mounted() {
			this.init();
        },

        destroyed() {

        },

        methods: {

            init() {
                this.load();
			},

            load() {

                this.isLoading = true;
                StrategySessionService.getAll(this.user.id)
                    .then(response => this.sessions = response)
                    .catch(error => this.$handleError(this, error))
                    .finally(() => this.isLoading = false);
			},

            viewSessions(day, weekday) {

                if (!this.getSessions(day, weekday)) {
                    return;
				}

                const date = this.getDate(day, weekday).format('YYYY-MM-DD');

                this.isLoading = true;
				StrategySessionService.getAllByDate(this.user.id, 'live', date)
                    .then(response => {
                        this.sessionsDay = response;
                        this.sessionsDayDate = date;

						this.$emit('sessions', response);
						this.$emit('date', date);
                    })
                    .catch(error => this.$handleError(this, error))
                    .finally(() => this.isLoading = false);
			},

            getDate(day, weekday) {
                return moment().subtract(this.maxDays, 'day').add(((day) * 7) + weekday, 'day');
			},

            getSessions(day, weekday) {
                const date = this.getDate(day, weekday);
                const daysFromToday = this.$options.filters.daysFromToday(date);
				return this.parsedSessions[daysFromToday];
			},

			getClasses(day, weekday) {
                let classes = ['fill-height'];
                const session = this.getSessions(day, weekday);

                if (session) {

                    classes.push('green clickable');

                    if (session.total === 1) {
                        classes.push('lighten-4');
					// } else if (session.total > 3) {
                    //     classes.push('lighten-4');
					} else if (session.total >= 5 && session.total < 10) {
                        classes.push('lighten-3');
					// } else if (session.total > 10) {
                    //     classes.push('lighten-2');
					} else if (session.total >= 10 && session.total < 20) {
                        classes.push('lighten-2');
					}
				} else {
                    classes.push('grey lighten-3');
				}

				return classes.join(' ');
			},
		},

        computed: {

        	// maxWeeks() {
        	// 	return this.$vuetify.breakpoint.mdAndUp ? 52 : 12;
			// },

            months() {
                let months = [];
				let countDays = 0;

                const firstDate = moment().subtract(this.maxDays - 1, 'days').startOf('day');

                for (let i = 0; i < this.maxMonth + 1; i++) {
                    const start = moment(firstDate).add(i, 'month');
                    if (i > 0) {
                        start.startOf('month');
					}

                    const end = moment(start).endOf('month');
                    let diff = end.diff(start, 'days') + 1;
                    // const remaining = 7 - countDays % 7;

                    const mod = countDays % 7;
					let colspan = Math.floor((mod + diff) / 7);

                    countDays += diff;

                    months.push({
                        name: start.format('MMM'),
                        colspan: colspan,
                    });
                }
                return months;
			},

            maxDays() {
                const total = 53 * 7;
                return total - (7 - this.currentDay);
			},

            currentDay() {
                return parseInt(moment().format('d'));
			},

            parsedSessions() {
                let items = {};
                this.sessions.forEach(session => {
                    const date = moment(session.start_date).format('YYYY-MM-DD');
                    const daysFromToday = this.$options.filters.daysFromToday(date);
                    if (!items[daysFromToday]) {
                        items[daysFromToday] = {
                            date,
                            cleanDate: moment(date).format('ll'),
							total: 0
						};
					}
                    items[daysFromToday].total++;
				});
				return items;
			}
		},

        data() {
            return {
				isLoading: false,
                moment: moment,
				sessions: [],
                sessionsDay: [],
				sessionsDayDate: false,
			};
        },

		watch: {

            'user.id'(id) {
				this.init();
			},

			sessions(value) {
				this.$emit('load', value);
			},
		}
    });
</script>

<style lang="scss" scoped>

	.table {
		border-collapse: collapse;
		border-spacing: 0;
		font-size: 0.8rem;
		min-width: 60rem;

		td {
			height: 1rem;
			padding: 1px;

			div.clickable {
				cursor: pointer;
			}
		}

		tfoot {
			td {
				padding: 0;
				height: 0;
			}
		}
	}
</style>
