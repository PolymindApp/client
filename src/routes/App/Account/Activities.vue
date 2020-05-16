<template>
	<div>
		<v-row>
			<v-col cols="12">
				<v-card-title>
					<span class="text-break">{{ $tc('account.sessionLastYear', sessions.length, { total: sessions.length }) }}</span>
				</v-card-title>
				<SessionGraph :user="user" @load="sessions = arguments[0]" @sessions="handleSessions" @date="handleDate"/>
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
										<span class="font-weight-medium subtitle-1">{{comment.action_by | userScreenName }}</span>
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
					<AccountActivities v-if="!sessionsLoaded" :activities-empty="$t('account.activities.sessionEmpty')" :activities="sessions">
						<template v-slot:title>
							{{ $t('account.recentActivities') }}
						</template>>
						<template v-slot:content="props">
							<v-timeline-item :icon="props.activity.getIcon()" :color="props.activity.getColor()" large :key="props.index" label>
								<v-card class="elevation-2">
									<v-card-text class="d-flex align-center">
										<span v-html="$t('account.activities.sessionCompleted', {
											name: props.activity.getName(),
											timeAgo: $options.filters.timeAgo(props.activity.end_date)
										})"></span>
									</v-card-text>
								</v-card>
							</v-timeline-item>
						</template>
					</AccountActivities>
					<AccountActivities v-else activities-empty="$t('account.activities.sessionEmpty')" :activities="sessionsDay">
						<template v-slot:title>
							<span ref="activities" class="text-break" v-html="$tc('sessionGraph.sessionsDay', sessionsDay.length, { total: sessionsDay.length, date: moment(sessionsDayDate).format('ll') })"></span>
						</template>>
						<template v-slot:content="props">
							<v-timeline-item :icon="props.activity.getIcon()" :color="props.activity.getColor()" large :key="props.index" label>
								<v-card class="elevation-2">
									<v-card-text class="d-flex align-center">
										<span v-html="$t('account.activities.sessionCompleted', {
											name: props.activity.getName(),
											timeAgo: $options.filters.timeAgo(props.activity.end_date)
										})"></span>
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
import { SessionService, CommentService } from '@polymind/sdk-js';
import UserAvatar from "../../../components/UserAvatar";
import SessionGraph from "../../../components/SessionGraph";
import AccountActivities from "./AccountActivities";
import moment from 'moment';

export default Vue.extend({

	props: ['user'],

	components: { UserAvatar, SessionGraph, AccountActivities },

	mounted() {
		this.load();
	},

	methods: {

	    load() {

	        Promise.all([
                CommentService.getAll('directus_users', this.$route.params.id, '-id', 10),
				SessionService.getAll(this.$route.params.id, null, 5),
			])
                .then(([comments, sessions]) => {
                    this.comments = comments;
                    this.sessions = sessions;
                })
                .catch(error => this.$handleError(this, error));
		},

        handleKeyDown(event) {
	        if (event.code === 'Enter' && !event.shiftKey) {
	            this.send(event);
			}
		},

		handleSessions(sessions) {
			this.sessionsDay = sessions;
		},

		handleDate(date) {
			this.sessionsDayDate = date;
		},

        send(event) {

            event.preventDefault();

            CommentService.save(this.$route.params.id, 'directus_users', this.newComment.text)
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
                .catch(error => this.$handleError(this, error));
        },
	},

	data() {
		return {
			moment: moment,
            comments: { data: [] },
			sessionsDay: [],
			sessionsDayDate: false,
			sessionsLoaded: false,
			sessions: [],
            newComment: {
		        text: '',
			}
		}
	},

	watch: {

        '$route.params.id': function(id) {
            this.load();
        },

		sessionsDay(value) {
			this.sessionsLoaded = true;
			setTimeout(() => this.$vuetify.goTo(this.$refs.activities, {
				duration: 300,
				offset: 30,
				easing: 'easeInOutCubic',
			}));
		}
	}
});
</script>
