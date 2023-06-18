import BaseModel from './BaseModel';
import {Class} from "@/database";

export default class ClassModel extends BaseModel {
    public data: any = {};

    protected defaultStructure: Class = {
        id: null,
        name: '',
        created_at: null,
        updated_at: null,
        deleted_at: null,
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
        this.setOriginalDataJSON(this.data);
    }
}
