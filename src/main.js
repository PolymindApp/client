import Vue from 'vue';
import store from './store';
import './registerServiceWorker';
import vuetify from './plugins/vuetify';
import globalVariables from './global';
import * as VueGoogleMaps from 'vue2-google-maps';
import App, { routes as appRoutes } from './routes/App.vue';
import Restricted, { routes as restrictedRoutes } from './routes/Restricted.vue';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import messages from './locales';
import loader from './loader';
import VueCookies from 'vue-cookies';
import VueAnalytics from 'vue-analytics';
import VueCordova from 'vue-cordova';
import "./styles/index.scss";
import './filters';
import DirectusSDK from "@directus/sdk-js";
import ab from 'autobahn';

let directusConfig = {
	url: process.env.VUE_APP_API_URL,
	project: 'polymind',
	storage: window.localStorage,
};

const server = new DirectusSDK(directusConfig);

Object.defineProperties(Vue.prototype, {
	$server: { value: server }
});

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use(VueCookies);
Vue.use(VueCordova);
Vue.use(VueGoogleMaps, {
	load: {
		key: process.env.VUE_APP_GOOGLE_API_KEY,
		libraries: 'places,directions',
	},
});

const i18n = new VueI18n({
	locale: localStorage.getItem('lang') || 'en',
	fallbackLocale: 'en',
	messages,
});

(async () => {

	let component = Restricted;
	let routes = restrictedRoutes;

	if (server.loggedIn) {
		component = App;
		routes = appRoutes;
	}

	const router = new VueRouter({
		mode: 'history',
		routes,
	});

	router.beforeEach((to, from, next) => {

		if (to.name) {
			const title = i18n.t('title.' + to.name);
			if (title) {
				document.title = title.toString();
			}
		} else {
			document.title = 'Polymind';
		}

		Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map((el) => el.parentNode.removeChild(el));

		next();
	});

	Vue.use(VueAnalytics, {
		id: process.env.VUE_APP_GOOGLE_ANALYTICS_ID,
		checkDuplicatedScript: true,
		router
	});

	let loadCallback = () => {

		let callback = () => {
			window.addEventListener('click', event => {

				// ensure we use the link, in case the click has been received by a subelement
				let { target } = event;
				while (target && target.tagName !== 'A') target = target.parentNode;
				// handle only links that do not reference external resources
				if (target && target.matches("a:not([href*='://'])") && target.href) {
					// some sanity checks taken from vue-router:
					// https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
					const { altKey, ctrlKey, metaKey, shiftKey, button, defaultPrevented } = event;
					// don't handle with control keys
					if (metaKey || altKey || ctrlKey || shiftKey) return;
					// don't handle when preventDefault called
					if (defaultPrevented) return;
					// don't handle right clicks
					if (button !== undefined && button !== 0) return;
					// don't handle if `target="_blank"`
					if (target && target.getAttribute) {
						const linkTarget = target.getAttribute('target');
						if (/\b_blank\b/i.test(linkTarget)) return;
					}
					// don't handle same page links/anchors
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
				store,
				vuetify,
				i18n,
				data: {
					...globalVariables
				},
				render: (h) => h(component),
			}).$mount('#app');
		};

		const conn = new ab.Connection({
			url: process.env.VUE_APP_WS_URI,
			realm: 'polymind'
		});
		conn.onopen = (session) => {

			callback();

			// // 1) subscribe to a topic
			// function onevent(args) {
			// 	console.log("Event:", args[0]);
			// }
			// session.subscribe('com.myapp.hello', onevent);
			//
			// // 2) publish an event
			// session.publish('com.myapp.hello', ['Hello, world!']);
			//
			// // 3) register a procedure for remoting
			// function add2(args) {
			// 	return args[0] + args[1];
			// }
			// session.register('com.myapp.add2', add2);
			//
			// // 4) call a remote procedure
			// session.call('com.myapp.add2', [2, 3]).then(
			// 	function (res) {
			// 		console.log("Result:", res);
			// 	}
			// );
		};
		conn.open();
		Object.defineProperties(Vue.prototype, {
			$ws: { value: conn }
		});
	};

	if (window.location.protocol === 'file:' || window.location.port === '3000') {
		const cordovaScript = document.createElement('script');
		cordovaScript.setAttribute('type', 'text/javascript');
		cordovaScript.setAttribute('src', 'cordova.js');
		document.body.appendChild(cordovaScript);

		Vue.cordova.on('deviceready', () => {
			loadCallback();
		});
	} else {
		loadCallback();
	}
})();
