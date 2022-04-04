import globalVariables from '../global'
import { VueConstructor } from 'vue'

export default {
	install: function (Vue: VueConstructor): void {
		Vue.prototype.$modal = {
			show: (title: string, content: string, buttons = [], attrs = {}) => {
				Object.assign(globalVariables.modal, { title, content, buttons, attrs, visible: true });
			},
			hide: () => {
				Object.assign(globalVariables.modal, { visible: false });
			},
		}
	}
};
