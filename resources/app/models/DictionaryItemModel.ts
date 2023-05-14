import BaseModel from './BaseModel';
import {DictionaryItem, I18n} from '@/database';
import MediaModel from "@/models/MediaModel";
import I18nModel from "@/models/I18nModel";

export default class DictionaryItemModel extends BaseModel {

    public data: any = {};

    protected defaultStructure: DictionaryItem = {
        id: null,
        cover: {
            id: null,
            url: '',
        },
        dictionary_id: null,
        i18n: [],
        created_at: null,
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
        this.data.cover = new MediaModel(this.data.cover);
        this.data.i18n = this.data.i18n.map((i18n: I18n) => new I18nModel(i18n));
        this.setOriginalDataJSON(this.data);
    }

    languages() {
        return this.data.i18n;
    }
}
