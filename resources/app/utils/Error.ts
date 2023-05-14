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
            if (reason.errors) {
                Object.assign(formErrors, reason.errors);
            }

            if (showWarning || !reason.errors) {
                Object.assign(globalVariables.error, {
                    guid: Hash.guid(),
                    ...reason,
                    body: reason.message,
                })
            }

            throw new Error(reason);
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
