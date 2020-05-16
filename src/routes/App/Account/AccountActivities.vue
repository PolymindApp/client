<template>
	<div>
		<v-card-title>
			<slot name="title"></slot>
		</v-card-title>
		<v-alert v-if="activities.length === 0" type="info" class="mb-6" transition="scale-transition" border="left" colored-border light elevation="2">
			{{ activitiesEmpty }}
		</v-alert>
		<v-timeline v-else dense clipped>
			<template v-for="(activity, index) in activities">
				<slot name="content" :activity="activity" :index="index"></slot>
			</template>
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
