import Text from '@/utils/Text';

export default class BaseModel {

    public static staticAutoIncrementId: number = 0;
    public autoIncrementId: number = 0;
    public data: any = {};
    public originalDataJSON: string | null = null;
    public resource: string | null = null;
    protected defaultStructure: any = {}

    constructor(data: any = {}) {
        this.autoIncrementId = BaseModel.staticAutoIncrementId++;

        if (this.resource === null) {
            const resource = Text.toCamelCase(this.constructor.name.substring(0, this.constructor.name.indexOf('Model')));
            this.resource = resource;
        }
    }

    mapDefaultValues(data: any) {
        const mapObject = (obj: any, newData: any, defaultStructure: any) => {
            Object.assign(obj, defaultStructure);
            Object.keys(obj).forEach(key => {
                if (obj[key] instanceof BaseModel && typeof newData[key] === 'object') {
                    obj[key] = new obj[key].constructor(newData[key]);
                }
                else if (
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
        mapObject(this.data, data || {}, this.defaultStructure);

        ['created_at', 'updated_at'].forEach(field => {
            if (this.data[field]) {
                this.data[field] = new Date(this.data[field]);
            }
        })
    }

    setData(data: any = {}) {
        this.mapDefaultValues(data);
        this.setOriginalDataJSON(this.data);
    }

    setOriginalDataJSON(data: any): any {
        const newData = this.toSaveObject();
        this.originalDataJSON = JSON.stringify(newData);
        return newData;
    }

    resetValues() {
        const originalModel = this.getOriginalModel();
        this.data = originalModel.data;
    }

    getOriginalData(): any {
        return JSON.parse(this.originalDataJSON || '');
    }

    getOriginalModel(): any {
        return this.constructor(JSON.parse(this.originalDataJSON || ''));
    }

    isDifferentFromOriginal(data?: any): boolean {
        if (data) {
            return JSON.stringify(data) !== this.originalDataJSON;
        } else {
            const saveData = this.toSaveObject();
            return JSON.stringify(saveData) !== this.originalDataJSON;
        }
    }

    toSaveObject(): {[key: string]: any} {
        const obj: {[key: string]: any} = {};
        Object.keys(this.data).forEach(key => {
            let value = this.data[key];
            if (value instanceof BaseModel) {
                obj[key] = value.toSaveObject();
            } else if (Array.isArray(value)) {
                obj[key] = [];
                value.forEach((val, valIdx) => {
                    if (val instanceof BaseModel) {
                        obj[key][valIdx] = val.toSaveObject();
                    } else {
                        obj[key][valIdx] = val;
                    }
                })
            } else {
                obj[key] = value;
            }
        });

        return obj;
    }

    clone<T>(clean = true): T {
        const clone = this.constructor(this.toSaveObject());
        if (clean) {
            ['id', 'created_at', 'updated_at', 'created_by', 'updated_by'].forEach(key => {
                if (clone[key]) {
                    clone[key] = null;
                }
            })
        }
        return clone;
    }

    isValid(): boolean {
        return true;
    }

    nestedProp(prop: any): any {
        let item: any = this;

        if (prop instanceof Function) {
            return prop(item);
        } else if (item[prop] !== undefined) {
            return item[prop];
        } else {
            const props = prop.split('.');
            for (let i = 0; i < props.length; i++) {
                const p = props[i];
                if (item[p]) {
                    item = item[p];
                } else {
                    return undefined;
                }
            }
            return item;
        }
    }
}
