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
import VueCookies from 'vue-cookies';
import Vuetify from "vuetify/lib";
import VueAnalytics from 'vue-analytics';
import PolymindSDK, { User, StatsService, EventBus, UserService } from "@polymind/sdk-js";
import 'roboto-fontface/css/roboto/sass/roboto-fontface.scss';
import '@mdi/font/scss/materialdesignicons.scss';
import "./index.scss";
import './filters';
import './loader';
// import ab from 'autobahn';

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

// const stats = JSON.parse(localStorage.getItem('statsQueue')) || { queue: [], };
const stats = { queue: [], };
const statsObj = {
	push(action, meta) {
		stats.queue.push({action, meta, user_date: moment().format('YYYY-MM-DD HH:mm:ss')});
	},
	process() {
		StatsService.process.bind(Vue.prototype)(stats.queue)
			.then(() => {
				stats.queue = [];
				// localStorage.removeItem('statsQueue');
			})
			.catch(err => {
				// localStorage.setItem('statsQueue', JSON.stringify(stats));
			});
	}
};
Object.defineProperties(Vue.prototype, {
	$stats: { value: statsObj }
});

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use(VueCookies);
Vue.use(VueGoogleMaps, {
	load: {
		key: process.env.VUE_APP_GOOGLE_API_KEY,
		libraries: 'places,directions',
	},
});

const i18n = new VueI18n({
	locale: VueCookies.get('lang') || 'en',
	fallbackLocale: 'en',
	messages,
});

(async () => {

	let component = Restricted;
	let routes = restrictedRoutes;

	if ($polymind.isLoggedIn()) {
		component = App;
		routes = appRoutes;
		localStorage.removeItem('redirect_uri');
	}

	let callback = () => {

		router = new VueRouter({
			mode: 'history',
			routes,
		});

		router.beforeEach((to, from, next) => {

			if (to.name) {
				const title = i18n.t('title.' + to.name);
				if (title) {
					document.title = title.toString() + ' | Polymind';
				}
			} else {
				document.title = 'Polymind';
			}

			statsObj.push('ROUTE', {
				from: from.fullPath,
				to: to.fullPath,
			});

			Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map((el) => el.parentNode.removeChild(el));

			next();
		});

		router.afterEach((to, from) => {
			statsObj.process();
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

		statsObj.push('APP_LOADED');

		new Vue({
			router,
			vuetify,
			i18n,
			data: {
				...globalVariables
			},
			render: (h) => h(component),
		}).$mount('#app');
	};

	EventBus.subscribe('LOCK_USER', () => {
		// TODO: VERIFY THIS REFACTORING
		localStorage.setItem('redirect_uri', Vue.prototype.$route.fullPath);
		localStorage.setItem('lockedUser', JSON.stringify(Vue.prototype.$root.user));
		component = Restricted;
		routes = restrictedRoutes;
		callback();
		router.push('/locked');
	});

	// const conn = new ab.Connection({
	// 	url: process.env.VUE_APP_WS_URI,
	// 	realm: 'polymind',
	// });
	//
	// conn.onopen = (session) => {

		UserService.updateWsToken({
			// sessionId: session.id
		})
			.then(data => {
				const user = new User(data.user);
				if (!$polymind.isLoggedIn() || (data.user && user.force_reset_password !== true)) {
					callback();
				} else {
					component = Restricted;
					routes = restrictedRoutes;
					callback();
					router.push('/update-access');
				}
			})
			.catch(error => {
				component = Issue;
				routes = issueRoutes;
				callback();
				router.push('/issue/api');
			});
	// };
	// conn.onclose = (session) => {
	// 	component = Issue;
	// 	routes = issueRoutes;
	// 	callback();
	// 	router.push('/issue/ws');
	// };
	// conn.open();
	//
	// Object.defineProperties(Vue.prototype, {
	// 	$ws: { value: conn }
	// });
})();
