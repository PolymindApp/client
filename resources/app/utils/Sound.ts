import { VueConstructor } from 'vue';
import playSound from '@/assets/sounds/play.wav';
import completedSound from '@/assets/sounds/completed.wav';
import removeSound from '@/assets/sounds/remove.wav';
import recordSound from '@/assets/sounds/record.wav';

const mapping: any = {
    play: playSound,
    completed: completedSound,
    remove: removeSound,
    record: recordSound,
};

const elements: any = {};
Object.keys(mapping).forEach(name => {
    elements[name] = new Audio(mapping[name]);
});

export default {
    install: function (Vue: VueConstructor): void {
        Vue.prototype.$sound = {
            create: function(
                name: string
            ) {
                return new Audio(mapping[name]);
            },
            play: function (
                name: string,
                volume = 1,
            ) {
                elements[name].currentTime = 0;
                elements[name].volume = volume;
                elements[name].play();
            }
        }
    }
};
