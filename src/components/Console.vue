<template>
	<v-card class="pa-2 fill-height console-container" flat>
		<div class="item d-flex align-center" :key="index" v-for="(item, index) in value">
			<v-icon style="flex: 0" v-if="item.params instanceof Array || item.params instanceof Object">mdi-play</v-icon>
			<span style="flex: 1">{{ item.params }}</span>
<!--			<span style="flex: 0" class="text-no-wrap">{{ item.stack }}</span>-->
		</div>
	</v-card>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
	props: {
		value: {
			type: Array,
			default: []
		},
	},

	methods: {

	},

	data() {
		return {

		};
	},
});
</script>

<style lang="scss" scoped>
	.console-container {
		overflow: auto;
	}
	.item {

		padding: 0.5rem;

		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}

		& + .item {
			border-top: rgba(0, 0, 0, 0.1) solid 1px;
		}
	}
</style>
