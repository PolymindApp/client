import { VueConstructor } from "vue";
import SettingsModel from '@/models/SettingsModel';

export default {
    install: function (Vue: VueConstructor): void {
        Vue.prototype.$settings = new SettingsModel();
    }
};
declare module 'vue/types/vue' {
    interface Vue {
        $settings: SettingsModel
    }
}
