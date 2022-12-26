import BaseModel from './BaseModel';
import {Dictionary, DictionaryI18n} from '@/database';

export default class DictionaryModel extends BaseModel {

    public data: any = {};

    protected defaultStructure: Dictionary = {
        id: null,
        total_items: 0,
        cover: {
            url: null
        },
        i18n: [],
        created_at: null,
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
    }

    languages() {
        return this.data.i18n.filter((lang: DictionaryI18n) => lang.type === 'title');
    }
}
