import BaseModel from './BaseModel';
import {Student} from "@/database";

export default class StudentModel extends BaseModel {
    public data: any = {};

    protected defaultStructure: Student = {
        id: null,
        user_id: null,
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
