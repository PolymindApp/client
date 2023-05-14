import BaseModel from './BaseModel';
import {Voice} from "@/database";
import LanguageModel from "@/models/LanguageModel";

export default class VoiceModel extends BaseModel {
    public data: any = {};

    protected defaultStructure: Voice = {
        id: null,
        gender: false,
        language: {
            name: '',
            code: '',
            created_at: null,
        },
        language_id: 0,
        name: '',
        neural: false,
        standard: false,
        bilingual: false,
        child: false,
        created_at: null,
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
        this.data.language = new LanguageModel(this.data.language);
        this.setOriginalDataJSON(this.data);
    }
}
