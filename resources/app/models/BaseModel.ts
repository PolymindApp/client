import Vue from 'vue';
import PlaybackSettingsModel from "@/models/PlaybackSettingsModel";

export default class BaseModel {

    public data: any = {};
    protected defaultStructure: any = {}

    constructor(data: any = {}) {}

    mapDefaultValues(data: any) {
        const mapObject = (obj: any, newData: any, defaultStructure: any) => {
            Object.assign(obj, defaultStructure);
            Object.keys(obj).forEach(key => {
                if (
                    (!Array.isArray(obj[key]) && typeof obj[key] === 'object' && obj[key] !== null) &&
                    (!Array.isArray(defaultStructure[key]) && typeof defaultStructure[key] === 'object')
                ) {
                    mapObject(obj[key], newData[key] || defaultStructure[key], defaultStructure[key]);
                } else if (Array.isArray(obj[key]) && Array.isArray(defaultStructure[key])) {
                    obj[key] = [...(newData[key] || defaultStructure[key])];
                } else if (defaultStructure[key] === undefined) {
                    delete obj[key];
                } else if (newData[key] !== undefined) {
                    obj[key] = newData[key];
                }
            });
        }
        mapObject(this.data, data, this.defaultStructure);

        ['created_at', 'updated_at'].forEach(field => {
            if (this.data[field]) {
                this.data[field] = new Date(this.data[field]);
            }
        })
    }

    clone(clean = true): BaseModel {
        const clone = this.constructor(Vue.prototype.$deepClone(this.data));
        if (clean) {
            ['id', 'created_at', 'updated_at', 'created_by', 'updated_by'].forEach(key => {
                if (clone[key]) {
                    clone[key] = null;
                }
            })
        }
        return clone;
    }
}
