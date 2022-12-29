import BaseModel from './BaseModel';
import DictionaryCategoryModel from './DictionaryCategoryModel';
import {Dictionary, I18n} from '@/database';
import MediaModel from "@/models/MediaModel";
import I18nModel from "@/models/I18nModel";

export default class DictionaryModel extends BaseModel {

    public data: any = {};

    protected defaultStructure: Dictionary = {
        id: null,
        total_items: 0,
        dictionary_category_id: null,
        category: {
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
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
        this.data.category = new DictionaryCategoryModel(this.data.category);
        this.data.cover = new MediaModel(this.data.cover);
        this.data.i18n = this.data.i18n.map((i18n: I18n) => new I18nModel(i18n));
    }

    languages() {
        return this.data.i18n.filter((lang: I18nModel) => lang.data.type === 'title');
    }
}
