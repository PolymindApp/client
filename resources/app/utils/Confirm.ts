import { VueConstructor } from 'vue';
import globalVariables from "@/global";

export default {
    install: function (Vue: VueConstructor): void {
        Vue.prototype.$confirm = function (
            title: string,
            body: string,
            buttonText: string,
            callback: Function,
            attrs: Object = {},
        ) {
            const btn = { text: buttonText, attrs: {
                disabled: false,
                loading: false,
                color: 'error',
            }, events: {
                click: () => {
                    callback(globalVariables.modal, btn);
                },
            } };
            Object.assign(globalVariables.modal, {
                visible: true,
                disabled: false,
                loading: false,
                title,
                body,
                buttons: [
                    btn,
                    { type: 'cancel' },
                ],
                attrs: {
                    maxWidth: 500,
                    dense: true,
                    ...attrs
                },
            })
        };
    }
};
