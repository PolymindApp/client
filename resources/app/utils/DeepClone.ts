import { VueConstructor } from 'vue';

export default {
	install: function (Vue: VueConstructor) {
		Vue.prototype.$deepClone = function(obj: any) {
			return JSON.parse(JSON.stringify(obj));
		};
	}
};
