import Vue from 'vue';

export default class BaseModel {

    public data: any = {};
    protected defaultStructure = {}

    mapDefaultValues(data: any) {
        const defaultKeys = Object.keys(this.defaultStructure);
        Object.assign(this.data, this.defaultStructure, data);
        Object.keys(this.data).forEach(key => {
            if (defaultKeys.indexOf(key) === -1) {
                delete this.data[key];
            }
        });
    }

    clone() {
        return this.constructor(Vue.prototype.$deepClone(this.data));
    }
}
