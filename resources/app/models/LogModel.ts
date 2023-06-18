import BaseModel from './BaseModel';

export default class LogModel extends BaseModel {
    public data: any = {};

    protected defaultStructure: any = {
        id: null,
        version: null,
        type: null,
        meta: null,
        created_at: null,
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
        this.setOriginalDataJSON(this.data);
    }

    getIcon(): string {
        const icons: any = {
            LOGIN: 'mdi-login-variant',
            LOGOUT: 'mdi-logout-variant',
            UPDATE_USER: 'mdi-account-edit-outline',
            CLONE_DECK: 'mdi-content-copy',
            CREATE_DECK: 'mdi-plus-box-outline',
            UPDATE_DECK: 'mdi-content-save-outline',
            DELETE_DECK: 'mdi-delete-outline',
            JOIN_CLASS: 'mdi-google-classroom',
            LEFT_CLASS: 'mdi-google-classroom',
            START_SESSION: 'mdi-headphones',
        };
        return icons[this.data.type];
    }
}
