import {I18n} from '@/database';
import LanguageModel from "@/models/LanguageModel";
import I18nModel from "@/models/I18nModel";

export default class DictionaryI18nModel extends I18nModel {

    public data: any = {};
    public resource = '/admin/dictionary/i18n'

    protected defaultStructure: I18n = {
        id: null,
        text: '',
        type: '',
        language: {
            id: null,
            name: '',
            code: '',
            created_at: null,
            updated_at: null,
            deleted_at: null,
        },
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
        this.data.language = new LanguageModel(this.data.language);
        this.setOriginalDataJSON(this.data);
    }
}
