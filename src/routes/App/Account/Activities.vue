<template>
	<v-row>
		<v-col cols="12" md="7">

			<v-card-title>{{ $t('account.messages') }}</v-card-title>
			<v-textarea v-if="$root.user.id === user.id" v-model="newMessage.text" class="mb-4" :placeholder="$t('account.activities.postOnWallPlaceholder')" append-icon="mdi-send" solo hide-details @click:append="send($event)"></v-textarea>
			<v-alert v-if="messages.data.length === 0" type="info" class="mb-6" transition="scale-transition" border="left" colored-border light elevation="2">
				{{$t('account.activities.messagesEmpty')}}
			</v-alert>
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
										<v-btn v-if="history.to || history.click" :to="history.to" @click="history.click" x-small>
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
</template>

<script>
import Vue from 'vue';
import HistoryService from '../../../services/HistoryService';

export default Vue.extend({

	props: ['user'],

	mounted() {
		this.load();
	},

	methods: {

	    load() {

            this.$root.isLoading = true;
	        Promise.all([
                HistoryService.fromUser.bind(this)(this.$route.params.id),
			])
                .then(([history]) => {
                    this.histories = history;
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

		send(event) {

	        event.preventDefault();
		}
	},

	data() {
		return {
            messages: { data: [] },
			histories: { data: [] },
            newMessage: {
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
