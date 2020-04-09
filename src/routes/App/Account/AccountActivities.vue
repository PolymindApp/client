<template>
	<div>
		<v-card-title>
			<slot name="title"></slot>
		</v-card-title>
		<v-alert v-if="activities.data.length === 0" type="info" class="mb-6" transition="scale-transition" border="left" colored-border light elevation="2">
			{{ activitiesEmpty }}
		</v-alert>
		<v-timeline v-else dense clipped>
			<v-timeline-item :icon="activity.icon" :color="activity.color" large v-for="(activity, index) in activities.data" :key="index" label>
				<template v-slot:icon>
					<slot name="activityIcon" :activity="activity"></slot>
				</template>
				<slot name="content" :activity="activity"></slot>
			</v-timeline-item>
		</v-timeline>
	</div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({

	props: ['activitiesEmpty', 'activities'],

	components: {},
});
</script>

<style scoped>

</style>
