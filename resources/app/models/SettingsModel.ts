import BaseModel from './BaseModel';

export interface IDictionarySettings {
    uuid: string,
    languages: Array<string>,
    bookmarked: boolean,
}

export interface ISettings {
    dictionary_sort_by: string;
    dictionary_sort_order: string;
    dictionary_search: string;
    dictionary_languages: [],
    dictionary_categories: [],
    dictionary_settings: Array<IDictionarySettings>,
}

export default class SettingsModel extends BaseModel {

    public data: any = {};

    protected defaultStructure: ISettings = {
        dictionary_sort_by: 'created_at',
        dictionary_sort_order: 'desc',
        dictionary_search: '',
        dictionary_languages: [],
        dictionary_settings: [],
        dictionary_categories: [],
    };

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
    }

    loadLocal(): SettingsModel {
        const json = localStorage.getItem('settings') || '{}';
        const data = JSON.parse(json);
        return new SettingsModel(data);
    }

    loadRemote(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const settings = this.loadLocal();
                resolve(settings);
            } catch(e) {
                reject(e);
            }
        });
    }

    saveLocal(data: ISettings): void {
        localStorage.setItem('settings', JSON.stringify(data));
    }

    saveRemote(data: ISettings): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.saveLocal(data);
                resolve(this.data);
            } catch(e) {
                reject(e);
            }
        });
    }
}
