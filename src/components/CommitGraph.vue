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
											<div v-ripple @click="viewContributions(day, weekday)" v-on="on" :class="getClasses(day, weekday)">
												<!--									<span v-if="getDate(day, weekday).format('DD') == 1">{{((day - 1) * 7) + weekday}}</span>-->
											</div>
										</template>
										<span>
											<span v-if="!getCommits(day, weekday)" v-html="$t('commitGraph.noContribution', { date: getDate(day, weekday).format('ll') })"></span>
											<span v-else v-html="$t('commitGraph.contributions', { total: getCommits(day, weekday).total, date: getCommits(day, weekday).cleanDate })"></span>
										</span>
									</v-tooltip>
								</v-fade-transition>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<v-expand-transition group>
			<div key="empty" v-if="commitsDayDate && commitsDay.data.length === 0">
				<v-card-title>{{ $t('commitGraph.contributionsDay') }}</v-card-title>
				<v-alert type="info" border="left" colored-border light elevation="2">
					<span class="text-break" v-html="$t('commitGraph.noCommitsThisDay', { date: moment(commitsDayDate).format('ll') })"></span>
				</v-alert>
			</div>
			<div key="notEmpty" v-if="commitsDayDate && commitsDay.data.length > 0">
				<v-card-title ref="timelineTitle">
					<span class="text-break" v-html="$t('commitGraph.contributionsDay', { total: commitsDay.data.length, date: moment(commitsDayDate).format('ll') })"></span>
				</v-card-title>
				<v-timeline ref="timeline" dense clipped>
					<v-slide-y-transition group>
						<template v-for="(commit, index) in commitsDay.data">
							<v-timeline-item :icon="commit.icon" :color="commit | activityColor" large :key="index" label>
								<template v-slot:icon>
									<v-icon dark>{{ commit | activityIcon }}</v-icon>
								</template>
								<v-card>
									<v-card-title :class="{ 'pb-0': commit.action === 'comment' }">
										<span class="font-weight-medium text-break" v-html="$t('activity.' + commit.action + '.' + commit.collection + '.title', {
											name: commit.relation.data.name
										})"></span>
										<span class="font-weight-light ml-md-4 body-2">{{commit.action_on | date('HH:mm:ss')}}</span>
									</v-card-title>
									<v-card-text v-if="commit.action === 'comment'">
<!--										<span v-html="$t('activity.' + commit.action + '.' + commit.collection + '.desc', commit)"></span>-->
										<v-icon color="grey lighten-2">mdi-format-quote-open</v-icon>
										<span class="font-italic font-weight-light body-1 mx-2" v-text="commit.comment"></span>
										<v-icon color="grey lighten-2">mdi-format-quote-close</v-icon>
									</v-card-text>
								</v-card>
							</v-timeline-item>
						</template>
					</v-slide-y-transition>
				</v-timeline>
			</div>
		</v-expand-transition>
	</div>
</template>

<script>
    import Vue from 'vue';
    import ActivityService from '../services/ActivityService';
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

                this.commitsDay = { data: [] };
                this.commitsDayDate = false;
                this.load();
			},

            load() {

                this.isLoading = true;
                ActivityService.getLatestCommits.bind(this)(this.user.id)
                    .then(response => this.commits = response)
                    .catch(error => this.$handleError(this, error))
                    .finally(() => this.isLoading = false);
			},

            viewContributions(day, weekday) {

                if (!this.getCommits(day, weekday)) {
                    return;
				}

                const date = this.getDate(day, weekday).format('YYYY-MM-DD');

                this.isLoading = true;
                ActivityService.getCommitsByDate.bind(this)(this.user.id, date)
                    .then(response => {
                        // const data = response.data.reduce((r, a) => {
                        //     r[a.collection + '_' + a.id + '_' + a.action] = [...r[a.collection + '_' + a.id + '_' + a.action] || [], a];
                        //     return r;
                        // }, {});
                        // this.commitsDay = {data};
                        this.commitsDay = response;
                        this.commitsDayDate = date;
                        setTimeout(() => this.$vuetify.goTo(this.$refs.timelineTitle));
                    })
                    .catch(error => this.$handleError(this, error))
                    .finally(() => this.isLoading = false);
			},

            getDate(day, weekday) {
                return moment().subtract(this.maxDays, 'day').add(((day) * 7) + weekday, 'day');
			},

            getCommits(day, weekday) {
                const date = this.getDate(day, weekday);
                const daysFromToday = this.$options.filters.daysFromToday(date);
				return this.parsedCommits[daysFromToday];
			},

			getClasses(day, weekday) {
                let classes = ['fill-height'];
                const commit = this.getCommits(day, weekday);

                if (commit) {

                    classes.push('green clickable');

                    if (commit.total === 1) {
                        classes.push('lighten-4');
					// } else if (commit.total > 3) {
                    //     classes.push('lighten-4');
					} else if (commit.total >= 5 && commit.total < 10) {
                        classes.push('lighten-3');
					// } else if (commit.total > 10) {
                    //     classes.push('lighten-2');
					} else if (commit.total >= 10 && commit.total < 20) {
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

            parsedCommits() {
                let items = {};
                this.commits.data.forEach(commit => {
                    const date = moment(commit.action_on).format('YYYY-MM-DD');
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
                moment: moment,
				commits: { data: [] },
                commitsDay: { data: [] },
				commitsDayDate: false,
			};
        },

		watch: {

            'user.id'(id) {
				this.init();
			},

			commits(value) {
                this.$emit('load', value);
			}
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
	}
</style>
