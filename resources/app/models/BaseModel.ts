import Vue from 'vue';
import PlaybackSettingsModel from "@/models/PlaybackSettingsModel";

export default class BaseModel {

    public data: any = {};
    protected defaultStructure = {}

    constructor(data: any = {}) {}

    mapDefaultValues(data: any) {
        const defaultKeys = Object.keys(this.defaultStructure);
        Object.assign(this.data, this.defaultStructure, data);
        Object.keys(this.data).forEach(key => {
            if (defaultKeys.indexOf(key) === -1) {
                delete this.data[key];
            }
        });

        ['created_at', 'updated_at'].forEach(field => {
            if (this.data[field]) {
                this.data[field] = new Date(this.data[field]);
            }
        })
    }

    clone() {
        return this.constructor(Vue.prototype.$deepClone(this.data));
    }
}
