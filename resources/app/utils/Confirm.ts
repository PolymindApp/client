import { VueConstructor } from 'vue';
import globalVariables from "@/global";

export default {
    install: function (Vue: VueConstructor): void {
        Vue.prototype.$confirm = function (
            title: string,
            body: string,
            buttonText: string = Vue.prototype.$i18n.t('btn.ok'),
            callback: (modal?: any, btn?: any) => void = (modal) => {
                modal.visible = false;
            },
            attrs: Object = {},
        ): void {
            const btn = {
                text: buttonText,
                attrs: {
                    disabled: false,
                    loading: false,
                    color: 'primary',
                },
                events: {
                    click: () => {
                        callback(globalVariables.modal, btn);
                    },
                }
            };
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

declare module 'vue/types/vue' {
    interface Vue {
        $confirm: (
            title: string,
            body: string,
            buttonText: string,
            callback?: (modal?: any, btn?: any) => void,
            attrs?: {},
        ) => void
    }
}
