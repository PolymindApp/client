import Vue from 'vue';
import moment from 'moment';
import globalVariables from './global';
import * as VueGoogleMaps from 'vue2-google-maps';
import App, { routes as appRoutes } from './routes/App.vue';
import Restricted, { routes as restrictedRoutes } from './routes/Restricted.vue';
import Issue, { routes as issueRoutes } from './routes/Issue.vue';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import messages from './locales';
import Vuetify from "vuetify/lib";
import VueAnalytics from 'vue-analytics';
import PolymindSDK, { User, StatsService, EventBus, UserService, ServerService, Cookies } from "@polymind/sdk-js";
import 'roboto-fontface/css/roboto/sass/roboto-fontface.scss';
import '@mdi/font/scss/materialdesignicons.scss';
import "./index.scss";
import './filters';
import './loader';

let router;

const $polymind = new PolymindSDK(process.env.VUE_APP_API_URL);
Object.defineProperties(Vue.prototype, {
	$polymind: { value: $polymind }
});

Vue.use(Vuetify);
const vuetify = new Vuetify({
	theme: {
		themes: {
			light: $polymind.theme
		},
	},
});

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use(VueGoogleMaps, {
	load: {
		key: process.env.VUE_APP_GOOGLE_API_KEY,
		libraries: 'places,directions',
	},
});

const i18n = new VueI18n({
	locale: Cookies.get('lang') || 'en',
	fallbackLocale: 'en',
	messages,
});

localStorage.setItem('redirect_uri', window.location.pathname);

(async () => {

	let component = Restricted;
	let routes = restrictedRoutes;

	let callback = (path) => {

		router = new VueRouter({
			mode: 'history',
			routes,
		});

		router.beforeEach((to, from, next) => {

			if (from.fullPath === to.fullPath && from.name === to.name) {
				return;
			}

			if (to.name) {
				const title = i18n.t('title.' + to.name);
				if (title) {
					document.title = title.toString() + ' | Polymind';
				}
			} else {
				document.title = 'Polymind';
			}

			if (component === App) {
				localStorage.setItem('redirect_uri', to.fullPath);
			}

			Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map((el) => el.parentNode.removeChild(el));
			next();
		});

		Vue.use(VueAnalytics, {
			id: process.env.VUE_APP_GOOGLE_ANALYTICS_ID,
			checkDuplicatedScript: true,
			router
		});

		// Make router listen to injected links (from database for instance)
		window.addEventListener('click', event => {
			let { target } = event;
			while (target && target.tagName !== 'A') target = target.parentNode;
			if (target && target.matches("a:not([href*='://'])") && target.href) {
				const { altKey, ctrlKey, metaKey, shiftKey, button, defaultPrevented } = event;
				if (metaKey || altKey || ctrlKey || shiftKey) return;
				if (defaultPrevented) return;
				if (button !== undefined && button !== 0) return;
				if (target && target.getAttribute) {
					const linkTarget = target.getAttribute('target');
					if (/\b_blank\b/i.test(linkTarget)) return;
				}
				const url = new URL(target.href);
				const to = url.pathname;
				if (window.location.pathname !== to && event.preventDefault) {
					event.preventDefault();
					router.push(to);
				}
			}
		});

		new Vue({
			router,
			vuetify,
			i18n,
			data: {
				...globalVariables
			},
			render: (h) => h(component),
		}).$mount('#app');

		if (path) {
			router.replace(path);
		}
	};

	const lockUser = () => {
		if (!globalVariables.user.id || !router.app) {
			return;
		}

		localStorage.setItem('redirect_uri', router.app.$route.fullPath);
		localStorage.setItem('lockedUser', JSON.stringify(globalVariables.user));
		component = Restricted;
		routes = restrictedRoutes;
		callback('/locked');
	};

	const gotoApp = (path) => {
		component = App;
		routes = appRoutes;
		localStorage.removeItem('redirect_uri');
		callback(path);
	};

	const gotoRestricted = (path) => {
		component = Restricted;
		routes = restrictedRoutes;
		callback(path);
	};

	EventBus.subscribe('LOCK_USER', lockUser);
	EventBus.subscribe('LOGOUT', gotoRestricted);
	EventBus.subscribe('LOGIN', gotoApp);

	$polymind.isLoggedIn().then(isLoggedIn => {
		if (isLoggedIn) {
			UserService.me().then(response => {
				const user = new User(response.data);
				globalVariables.user = user;
				localStorage.setItem('user_id', globalVariables.user.id);

				if (user.force_reset_password === true) {
					gotoRestricted('/update-access');
				} else {
					gotoApp();
				}
			});
		} else {
			gotoRestricted();
		}
	}).catch(error => {
		component = Issue;
		routes = issueRoutes;
		callback();
		router.push('/issue/api');
	});
})();
