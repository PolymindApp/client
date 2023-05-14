import BaseModel from './BaseModel';
import {Language} from "@/database";

export default class LanguageModel extends BaseModel {
    public data: any = {};

    protected defaultStructure: Language = {
        id: null,
        name: '',
        code: '',
        voices: [],
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
