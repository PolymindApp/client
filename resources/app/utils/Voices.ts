import { VueConstructor } from 'vue';
import VoiceModel from "@/models/VoiceModel";

export default {
    install: function (Vue: VueConstructor) {
        Vue.prototype.$formatVoices = function(voices: Array<VoiceModel>): Array<any> {

            const languages: any = [];
            voices.forEach((voice: any) => {
                const code = voice.data.language.data.code.substring(0, 2);
                let existing = languages.find((language: any) => language.code === code);
                if (!existing) {
                    languages.push({
                        code,
                        name: voice.data.language.data.name.split(',')[0],
                        voices: [voice]
                    });
                } else {
                    existing.voices.push(voice);
                }
            });


            const items: Array<any> = [];
            languages.forEach((language: any) => {
                items.push({ header: language.name });
                language.voices.forEach((voice: any) => {
                    items.push({
                        ...voice.data,
                        originalName: voice.data.name,
                        name: voice.data.language.data.name + ' - ' + voice.data.name,
                    });
                });
            });
            return items;
        };
    }
};

declare module 'vue/types/vue' {
    interface Vue {
        $formatVoices: (voices: Array<any>) => Array<any>
    }
}
