import BaseModel from './BaseModel';

export default class DatatablePresetModel extends BaseModel {
    public data: any = {};

    protected defaultStructure: any = {
        id: null,
        name: null,
        meta: null,
        created_at: null,
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
        this.setOriginalDataJSON(this.data);
    }
}
