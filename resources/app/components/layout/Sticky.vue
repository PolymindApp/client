<template>
	<v-sheet v-resize="onResize" color="transparent" :style="{
		top: stickyTop + 'px',
		position: 'sticky',
		maxHeight: '100vh',
		overflow: 'auto',
	}" v-bind="$attrs" v-on="$listeners">
		<slot></slot>
	</v-sheet>
</template>

<script>
export default {
	name: 'Sticky',

	data: () => ({
		stickyTop: 0,
	}),

	methods: {
		onResize() {
			this.stickyTop = document.getElementsByClassName('v-app-bar')[0].clientHeight;
		},
	},

	mounted() {
		setTimeout(() => this.onResize());
	},
}
</script>
