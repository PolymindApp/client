<template>
	<div>
		<v-row>
			<v-col cols="12">
				<v-card-title>{{ $t('account.contributionLastYear', { total: commits.data.length }) }}</v-card-title>
				<CommitGraph :user="user" @load="commits = arguments[0]" />
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
							<v-timeline-item :icon="comment.icon" :color="comment.color" large :key="index" label>
								<template v-slot:icon>
									<UserAvatar :size="48" :user="comment.action_by" />
								</template>
								<v-card>
									<v-card-title class="pt-2 pb-0">
										<span class="font-weight-medium">{{comment.action_by | userScreenName }}</span>
										<span class="font-weight-light ml-4 body-2">{{comment.action_on | timeAgo}}</span>
									</v-card-title>
									<v-card-text>
										{{comment.comment}}
									</v-card-text>
								</v-card>
							</v-timeline-item>
						</template>
					</v-slide-y-transition>
				</v-timeline>
			</v-col>
			<v-col cols="12" md="5">
				<v-card-title>
					{{ $t('account.recentActivities') }}
	<!--				<span v-if="histories.data.length > 0" class="primary&#45;&#45;text ml-2">({{histories.meta.filter_count}})</span>-->
				</v-card-title>

				<v-alert v-if="histories.data.length === 0" type="info" class="mb-6" transition="scale-transition" border="left" colored-border light elevation="2">
					{{$t('account.activities.historyEmpty')}}
				</v-alert>
				<v-timeline v-else dense clipped>
					<v-timeline-item :icon="history.icon" :color="history.color" large v-for="(history, index) in histories.data" :key="index" label>
						<v-row justify="space-between">
							<v-col cols="8" class="py-0">
								<v-card class="elevation-2">
									<v-card-text>
										<template v-if="history.action === 'create'">
											<span v-if="history.collection === 'page'">
												<span v-html="$t('account.activities.history.createPage', history.relation.data)"></span>
											</span>
											<span v-else-if="history.collection === 'component'">
												<span v-html="$t('account.activities.history.createComponent', history.relation.data)"></span>
											</span>
											<span v-else-if="history.collection === 'documentation'">
												<span v-html="$t('account.activities.history.createDocumentation', history.relation.data)"></span>
											</span>
										</template>

										<div class="mt-2">
											<v-btn v-if="history.to" :to="history.to" x-small>
												{{$t('account.activities.view')}}
											</v-btn>
											<v-btn v-else-if="history.click" @click="history.click" x-small>
												{{$t('account.activities.view')}}
											</v-btn>
										</div>
									</v-card-text>
								</v-card>
							</v-col>
							<v-col class="text-right align-end d-flex flex-column justify-center py-0" cols="4">
								{{ history.action_on | timeAgo }}
							</v-col>
						</v-row>
					</v-timeline-item>
				</v-timeline>
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

export default Vue.extend({

	props: ['user'],

	components: { UserAvatar, CommitGraph },

	mounted() {
		this.load();
	},

	methods: {

	    load() {

            this.$root.isLoading = true;
	        Promise.all([
                CommentService.getAll.bind(this)('directus_users', this.$route.params.id),
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
	},

	data() {
		return {
            comments: { data: [] },
            commits: { data: [] },
			histories: { data: [] },
            newComment: {
		        text: '',
			}
		}
	},

	watch: {

        '$route.params.id': function(id) {
            this.load();
        }
	}
});
</script>
