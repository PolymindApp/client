import { VueConstructor } from 'vue';
import globalVariables from "@/global";
import BaseModel from "@/models/BaseModel";

export default {
    install: function (Vue: VueConstructor): void {
        Vue.prototype.$shouldDelete = function (
            promise: <T>(models: BaseModel | Array<BaseModel>) => Promise<T>,
            models: BaseModel | Array<BaseModel>,
            key?: string,
        ): Promise<any> {
            const modelsInArray = Array.isArray(models) ? models : [models];
            return new Promise((resolve, reject) => {
                const btn = {
                    text: this.$t('btn.delete'),
                    attrs: {
                        disabled: false,
                        loading: false,
                        color: 'error',
                    },
                    events: {
                        click: () => {
                            btn.attrs.loading = true;
                            globalVariables.modal.disabled = true;
                            promise(modelsInArray)
                                .then(response => {
                                    this.$snack(this.$i18n.tc((key ? key + '.' : '') + 'shouldDelete.snackSuccess', modelsInArray.length), 'success');
                                    globalVariables.modal.visible = false;
                                    resolve(response);
                                })
                                .catch(reject)
                                .finally(() => {
                                    btn.attrs.loading = false;
                                    globalVariables.modal.disabled = false;
                                });
                        },
                    }
                };
                Object.assign(globalVariables.modal, {
                    visible: true,
                    disabled: false,
                    loading: false,
                    title: this.$tc((key ? key + '.' : '') + 'shouldDelete.title', modelsInArray.length, {
                        total: modelsInArray.length
                    }),
                    body: this.$tc((key ? key + '.' : '') + 'shouldDelete.body', modelsInArray.length, {
                        total: modelsInArray.length
                    }),
                    buttons: [
                        btn,
                        { type: 'cancel' },
                    ],
                    attrs: {
                        maxWidth: 500,
                        dense: true,
                    },
                    on: {
                        close: () => {
                            resolve(null);
                        }
                    }
                })
            })
        };
    }
};

declare module 'vue/types/vue' {
    interface Vue {
        $shouldDelete: (
            promise: <T>(model: any | Array<any>) => Promise<T>,
            models: any | Array<any>,
            key?: string,
        ) => Promise<any>
    }
}
