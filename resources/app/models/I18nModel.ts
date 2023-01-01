import BaseModel from './BaseModel';
import {I18n} from "@/database";
import LanguageModel from "@/models/LanguageModel";

export default class I18nModel extends BaseModel {

    public data: any = {};

    protected defaultStructure: I18n = {
        id: null,
        text: '',
        type: '',
        voice_id: null,
        language: {
            id: null,
            name: '',
            code: '',
            created_at: null,
            updated_at: null,
            deleted_at: null,
        },
    }

    constructor(data: I18n) {
        super(data);
        this.mapDefaultValues(data);
        this.data.language = new LanguageModel(this.data.language);
    }
}
