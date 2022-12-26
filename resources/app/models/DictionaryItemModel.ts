import BaseModel from './BaseModel';
import {DictionaryItem} from '@/database';

export default class DictionaryItemModel extends BaseModel {

    public data: any = {};

    protected defaultStructure: DictionaryItem = {
        id: null,
        cover: {
            id: null,
        },
        dictionary_id: null,
        i18n: [],
        created_at: null,
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
    }

    languages() {
        return this.data.i18n;
    }
}
