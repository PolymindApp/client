import { VueConstructor } from 'vue';
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
