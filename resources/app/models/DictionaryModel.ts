import BaseModel from './BaseModel';
import DictionaryCategoryModel from './DictionaryCategoryModel';
import {Dictionary, DictionaryI18n} from '@/database';
import MediaModel from "@/models/MediaModel";
import DictionaryI18nModel from "@/models/DictionaryI18nModel";

export default class DictionaryModel extends BaseModel {

    public data: any = {};

    protected defaultStructure: Dictionary = {
        id: null,
        total_items: 0,
        dictionary_category_id: null,
        media_id: null,
        category: {
            id: null,
            i18n: [],
            cover: {
                url: '',
            },
            total_dictionaries: 0
        },
        cover: {
            id: null,
            url: ''
        },
        i18n: [],
        created_at: null,
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
        this.data.category = new DictionaryCategoryModel(data.category);
        this.data.cover = new MediaModel(data.cover);
        this.data.i18n = this.data.i18n.map((i18n: DictionaryI18n) => new DictionaryI18nModel(i18n));

        this.setOriginalDataJSON(this.data);
    }

    languages() {
        return this.data.i18n.filter((lang: DictionaryI18nModel) => lang.data.type === 'title');
    }
}
