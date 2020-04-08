<template>
	<div>
		<v-card-title>
			{{ title }}
		</v-card-title>
		<v-alert v-if="activities.data.length === 0" type="info" class="mb-6" transition="scale-transition" border="left" colored-border light elevation="2">
			{{$t('account.activities.historyEmpty')}}
		</v-alert>
		<v-timeline dense clipped>
			<v-timeline-item :icon="activity.icon" :color="activity.color" large v-for="(activity, index) in activities.data" :key="index" label>
				<v-row justify="space-between">
					<v-col cols="12" md="8" class="py-0">
						<v-card class="elevation-2">
							<slot name="content" :activity="activity">

							</slot>
						</v-card>
					</v-col>
					<v-col class="text-right align-end d-flex flex-column justify-center py-0" cols="12" md="4">
						<span class="py-2">{{ activity.action_on | timeAgo }}</span>
					</v-col>
				</v-row>
			</v-timeline-item>
		</v-timeline>
	</div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({

	props: ['title', 'activityType', 'activities'],

	components: {},
});
</script>

<style scoped>

</style>
