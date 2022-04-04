import globalVariables from '../global'
import { VueConstructor } from 'vue';

export default {
	install: function (Vue: VueConstructor): void {
		Vue.prototype.$snack = function (body: string, color = null, icon = null) {
			Object.assign(globalVariables.snack, { body, color, icon, visible: true });
		};
	}
};
