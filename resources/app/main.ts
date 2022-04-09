import Vue, { VueConstructor } from 'vue'
import App from './views/App.vue'
import Restricted from './views/Restricted.vue'
import appRoutes from '@/routes/app.routes';
import restrictedRoutes from '@/routes/restricted.routes';
import vuetify from '@/plugins/vuetify'
import VueRouter from 'vue-router'
import PortalVue from 'portal-vue'
import i18n from './locales'
import DeepClone from '@/utils/DeepClone'
import Error from '@/utils/Error'
import Modal from '@/utils/Modal'
import Confirm from '@/utils/Confirm'
import Snack from '@/utils/Snack'
import Sound from '@/utils/Sound'
import Voices from '@/utils/Voices'
import EventBus from '@/utils/EventBus'
import Services from '@/utils/Services'
import globalVariables from './global'
import { RouteConfig } from "vue-router/types/router"
import '@mdi/font/scss/materialdesignicons.scss'
import './filters'
import './index.scss'
// import './registerServiceWorker'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(Confirm)
Vue.use(DeepClone)
Vue.use(Error)
Vue.use(Modal)
Vue.use(Snack)
Vue.use(Sound)
Vue.use(Voices)
Vue.use(PortalVue)

let currentInstance: Vue;
const render = (
	component: VueConstructor,
	routes: RouteConfig[],
	path?: string|null
) => {
	if (currentInstance) {
		currentInstance.$destroy();
	}
	const router = new VueRouter({
		mode: 'history',
		base: process.env.BASE_URL || '/',
		routes,
	});
	if (path) {
		router.replace(path);
	}
	new Vue({
		router,
		vuetify,
		i18n,
		data: globalVariables,
		render: (h) => h(component),
	}).$mount('#app');
};

Services.isLoggedIn()
    .then(user => {
        Object.assign(globalVariables.user, user);
        render(App, appRoutes)
    })
    .catch(() => render(Restricted, restrictedRoutes));

EventBus.subscribe('RENDER_APP', () => render(App, appRoutes));
EventBus.subscribe('RENDER_RESTRICTED', () => render(Restricted, restrictedRoutes));
