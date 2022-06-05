import { VueConstructor } from 'vue';

export default {
	install: function (Vue: VueConstructor) {
		Vue.prototype.$deepClone = function(obj: any) {
			return JSON.parse(JSON.stringify(obj));
		};
	}
};

declare module 'vue/types/vue' {
    interface Vue {
        $deepClone: (message: any) => any
    }
}
