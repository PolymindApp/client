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
            ) {
                elements[name].currentTime = 0;
                elements[name].play();
            }
        }
    }
};
