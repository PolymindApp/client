import Vue from 'vue';

export default class BaseModel {

    public data: any = {};

    clone() {
        return this.constructor(Vue.prototype.$deepClone(this.data));
    }
}
