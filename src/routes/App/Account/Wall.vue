<template>
	<v-row>
		<v-col cols="12" md="7">
			<v-card-title>{{ $t('account.messages') }}</v-card-title>

			TBD
		</v-col>
		<v-col cols="12" md="5">
			<v-card-title>{{ $t('account.recentActivities') }}</v-card-title>

			<v-timeline dense clipped>
				<v-timeline-item v-for="(history, index) in histories" :key="index" color="grey" small label>
					<v-row justify="space-between">
						<v-col cols="7">
							<v-card class="elevation-2">
								<v-card-text>
									<template v-for="(value, key) in history.diff">
										<span :key="key" v-html="$t('diff.' + key, { value: value })" />.
									</template>
								</v-card-text>
							</v-card>
						</v-col>
						<v-col class="text-right align-center d-flex justify-end" cols="5">
							{{ history.created_at | timeAgo }}
						</v-col>
					</v-row>
				</v-timeline-item>
			</v-timeline>
		</v-col>
	</v-row>
</template>

<script>
import Vue from 'vue';
import HistoryService from '../../../services/History';

export default Vue.extend({

	mounted() {
		this.load();
	},

	methods: {

	    load() {

	        this.$root.isLoading = true;
			HistoryService.fromUser.bind(this)(this.$route.params.id)
				.then(histories => this.histories = histories.data)
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
		}
	},

	data() {
		return {
			activities: [],
			histories: false,
		}
	},
});
</script>
