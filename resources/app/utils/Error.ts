import { VueConstructor } from 'vue';
import Hash from "@/utils/Hash";
import globalVariables from "@/global";

export default {
	install: function (Vue: VueConstructor): void {
		Vue.prototype.$handleError = function (
            reason: any,
            formErrors?: any,
            showWarning = true,
        ) {
            if (showWarning) {
                Object.assign(globalVariables.error, {
                    guid: Hash.guid(),
                    ...reason,
                    body: reason.message,
                })
            }

            if (reason.errors) {
                Object.assign(formErrors, reason.errors);
            }
		};
	}
};

declare module 'vue/types/vue' {
    interface Vue {
        $handleError: (
            reason: any,
            formErrors?: any,
            showWarning?: boolean
        ) => any
    }
}
