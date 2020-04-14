<template>
	<div>
		<v-row>
			<v-col cols="12">
				<v-card-title>
					<span class="text-break">{{ $t('account.contributionLastYear', { total: commits.data.length }) }}</span>
				</v-card-title>
				<CommitGraph :user="user" @load="commits = arguments[0]" @load-commits-day="commitsDay = arguments[0]" @load-commits-day-date="commitsDayDate = arguments[0]"/>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" md="7">
				<v-card-title>{{ $t('account.messages') }}</v-card-title>
				<v-form v-if="$root.user.id === user.id" @submit="send($event)">
					<v-textarea v-model="newComment.text" class="mb-4" :placeholder="$t('account.activities.postOnWallPlaceholder')" append-icon="mdi-send" solo hide-details @keydown="handleKeyDown($event)" @click:append="send($event)"></v-textarea>
				</v-form>
				<v-alert v-if="comments.data.length === 0" type="info" class="mb-6" transition="scale-transition" border="left" colored-border light elevation="2">
					{{$t('account.activities.messagesEmpty')}}
				</v-alert>
				<v-timeline v-else dense clipped>
					<v-slide-y-transition group>
						<template v-for="(comment, index) in comments.data">
							<v-timeline-item :icon="comment.icon" :color="comment.color" :key="index" large label>
								<template v-slot:icon>
									<UserAvatar :size="48" :user="comment.action_by" :clickable=" comment.action_by.id !== user.id " />
								</template>
								<v-card>
									<v-card-title class="pt-2 pb-0">
										<span class="font-weight-medium">{{comment.action_by | userScreenName }}</span>
										<span class="font-weight-light ml-md-4 body-2">{{comment.action_on | timeAgo}}</span>
									</v-card-title>
									<v-card-text class="mt-2 mt-md-0">
										{{comment.comment}}
									</v-card-text>
								</v-card>
							</v-timeline-item>
						</template>
					</v-slide-y-transition>
				</v-timeline>
			</v-col>
			<v-col cols="12" md="5">
				<v-slide-y-transition>
					<AccountActivities v-if="!commitsLoaded" :activities-empty="$t('account.activities.historyEmpty')" :activities="histories">
						<template v-slot:title>
							{{ $t('account.recentActivities') }}
						</template>>
						<template v-slot:content="props">
							<v-timeline-item :icon="props.activity.icon" :color="props.activity.color" large :key="props.index" label>
								<v-row justify="space-between">
									<v-col cols="12" md="8" class="py-0">
										<v-card class="elevation-2">
											<v-card-text>
												<template v-if="props.activity.action === 'create'">
												<span v-if="props.activity.collection === 'page'">
													<span v-html="$t('account.activities.history.createPage', props.activity.relation.data)"></span>
												</span>
													<span v-else-if="props.activity.collection === 'component'">
													<span v-html="$t('account.activities.history.createComponent', props.activity.relation.data)"></span>
												</span>
													<span v-else-if="props.activity.collection === 'documentation'">
													<span v-html="$t('account.activities.history.createDocumentation', props.activity.relation.data)"></span>
												</span>
												</template>

												<div class="mt-2">
													<v-btn v-if="props.activity.to" :to="props.activity.to" x-small>
														{{$t('account.activities.view')}}
													</v-btn>
													<v-btn v-else-if="props.activity.click" @click="props.activity.click" x-small>
														{{$t('account.activities.view')}}
													</v-btn>
												</div>
											</v-card-text>
										</v-card>
									</v-col>
									<v-col class="text-right align-end d-flex flex-column justify-center py-0" cols="12" md="4">
										<span class="py-2">{{ props.activity.action_on | timeAgo }}</span>
									</v-col>
								</v-row>
							</v-timeline-item>
						</template>
					</AccountActivities>
					<AccountActivities v-else activities-empty="" :activities="commitsDay">
						<template v-slot:title>
							<span id="contributions_section" class="text-break" v-html="$t('commitGraph.contributionsDay', { total: commitsDay.data.length, date: moment(commitsDayDate).format('ll') })"></span>
						</template>>
						<template v-slot:content="props">
							<v-timeline-item :icon="props.activity.icon" :color="props.activity | activityColor" :key="props.index" large label>
								<template v-slot:icon>
									<v-icon dark>{{ props.activity | activityIcon }}</v-icon>
								</template>
								<v-card>
									<v-card-title :class="{ 'pb-0': props.activity.action === 'comment' }">
										<span class="font-weight-light text-break body-2 mr-4" v-html="$t('activity.' + props.activity.action + '.' + props.activity.collection + '.title', {
											name: props.activity.relation.data.name
										})"></span>
										<span class="font-weight-medium body-2">{{props.activity.action_on | date('HH:mm:ss')}}</span>
									</v-card-title>
									<v-card-text v-if="props.activity.action === 'comment'">
										<v-icon color="grey lighten-2">mdi-format-quote-open</v-icon>
										<span class="font-italic font-weight-light body-1 mx-2" v-text="props.activity.comment"></span>
										<v-icon color="grey lighten-2">mdi-format-quote-close</v-icon>
									</v-card-text>
								</v-card>
							</v-timeline-item>
						</template>
					</AccountActivities>
				</v-slide-y-transition>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import Vue from 'vue';
import HistoryService from '../../../services/HistoryService';
import CommentService from "../../../services/CommentService";
import UserAvatar from "../../../components/UserAvatar";
import CommitGraph from "../../../components/CommitGraph";
import AccountActivities from "./AccountActivities";
import moment from 'moment';

export default Vue.extend({

	props: ['user'],

	components: { UserAvatar, CommitGraph, AccountActivities },

	mounted() {
		this.load();
	},

	methods: {

	    load() {

            this.$root.isLoading = true;
	        Promise.all([
                CommentService.getAll.bind(this)('directus_users', this.$route.params.id, '-id', 5),
                HistoryService.fromUser.bind(this)(this.$route.params.id),
			])
                .then(([comments, histories]) => {
                    this.comments = comments;
                    this.histories = histories;
                    this.histories.data.map(history => {
                        switch(history.collection) {
							case 'page':
							    history.icon = 'mdi-file-document-box-plus-outline';
							    history.color = 'black lighten-2';
							    history.to = '/' + history.relation.data.slug;
							    break;
							case 'component':
							    history.icon = 'mdi-cube';
							    history.color = 'blue-grey lighten-2';
                                history.to = '/component/' + history.relation.data.id;
							    break;
							case 'documentation':
							    history.icon = 'mdi-book';
							    history.color = 'light-green darken-1';
                                history.click = () => {
                                    this.$help.open(history.relation.data.slug)
								};
							    break;
						}
					});
                })
                .catch(error => this.$handleError(this, error))
                .finally(() => this.$root.isLoading = false);
		},

        handleKeyDown(event) {
	        if (event.code === 'Enter' && !event.shiftKey) {
	            this.send(event);
			}
		},

        send(event) {

            event.preventDefault();

            this.$root.isLoading = true;
            CommentService.save.bind(this)(this.$route.params.id, 'directus_users', this.newComment.text)
                .then(response => {
                    this.newComment.text = '';
                    this.comments.data.unshift(Object.assign(response.data, {
                        action_by: {...this.$root.user}
                    }));
                    // this.totalCount++;

                    if (this.$root.user.settings.newMessageSound) {
                        this.$playSound('send');
                    }
                })
                .catch(error => this.$handleError(this, error))
                .finally(() => this.$root.isLoading = false);
        },

		toContributions() {
			this.$vuetify.goTo(this.target, this.options);
		},
	},

	data() {
		return {
			moment: moment,
            comments: { data: [] },
            commits: { data: [] },
			commitsDay: { data: [] },
			commitsDayDate: false,
			commitsLoaded: false,
			histories: { data: [] },
			target: '#contributions_section',
			duration: 300,
			offset: 30,
			easing: 'easeInOutCubic',
            newComment: {
		        text: '',
			}
		}
	},

	computed: {
		options() {
			return {
				duration: this.duration,
				offset: this.offset,
				easing: this.easing,
			}
		},
	},

	watch: {

        '$route.params.id': function(id) {
            this.load();
        },

		commitsDay(value) {
			this.commitsLoaded = true;
			setTimeout(() => this.toContributions());
		}
	}
});
</script>
