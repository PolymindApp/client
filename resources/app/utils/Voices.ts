import { VueConstructor } from 'vue';

export default {
    install: function (Vue: VueConstructor) {
        Vue.prototype.$formatVoices = function(voices: Array<any>) {
            const items: Array<any> = [];
            voices.forEach(language => {
                items.push({ header: language.name });
                language.voices.forEach((voice: any) => {
                    items.push({
                        ...voice,
                        originalName: voice.name,
                        name: voice.language.name + ' - ' + voice.name,
                    });
                });
            });
            return items;
        };
    }
};
