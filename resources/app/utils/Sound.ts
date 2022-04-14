import { VueConstructor } from 'vue';

const elements: any = {
    play: new Audio('/assets/sounds/play.wav'),
    completed: new Audio('/assets/sounds/completed.wav'),
    remove: new Audio('/assets/sounds/remove.wav'),
};

export default {
    install: function (Vue: VueConstructor): void {
        Vue.prototype.$sound = {
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
