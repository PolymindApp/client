<template>
	<v-app>
		<ErrorDialog :response="$root.error" />

		<div class="logo" :style="{ backgroundImage: 'url(' + logo + ')' }"></div>

		<div class="fill-height d-flex auto-select">
			<router-view></router-view>
		</div>
	</v-app>
</template>

<script>
import Vue from 'vue';
import ErrorDialog from '../components/ErrorDialog.vue';
import Modal from "../components/Modal";
import ErrorWs from "./Error/ErrorWs";
import ErrorDefault from "./Error/ErrorDefault";
import logo from '../assets/images/polymind-light.svg';
import ErrorApi from "./Error/ErrorApi";

export const routes = [
	{path: '/', component: ErrorDefault},
	{path: '/issue/ws', component: ErrorWs},
	{path: '/issue/api', component: ErrorApi},
	{path: '*', redirect: to => {
		if (!to.fullPath.startsWith('/issue/')) {
			localStorage.setItem('redirect_uri', to.fullPath);
		}
		return '/';
	}},
];

export default Vue.extend({
	name: 'Issue',
	components: {
		ErrorDialog, Modal
	},

	created() {

	},

	methods: {

	},

	data: function() {
	    return {
			logo: logo
		};
	},
});
</script>

<style lang="scss" scoped>
	.logo {
		pointer-events: none;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: -10%;
		z-index: 1;
		opacity: 0.1;
		background-size: contain;
		filter: grayscale(100%);
	}
</style>
