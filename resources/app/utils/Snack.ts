import globalVariables from '../global'
import { VueConstructor } from 'vue';
import VueI18n from "vue-i18n";
import TranslateResult = VueI18n.TranslateResult;

export default {
	install: function (Vue: VueConstructor): void {
		Vue.prototype.$snack = function (body: string | TranslateResult, color = null, icon = null) {
			Object.assign(globalVariables.snack, { body, color, icon, visible: true });
		};
	}
};


declare module 'vue/types/vue' {
    interface Vue {
        $snack: (body: string | TranslateResult, color?: string, icon?: string) => void
    }
}
