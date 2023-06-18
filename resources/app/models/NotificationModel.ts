import BaseModel from './BaseModel';
import UserModel from '@/models/UserModel';

export default class NotificationModel extends BaseModel {
    public data: any = {};

    protected defaultStructure: any = {
        id: null,
        user_id: null,
        user: new UserModel(),
        type: null,
        meta: null,
        acknowledged: null,
        created_at: null,
        updated_at: null,
        deleted_at: null,
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
        this.setOriginalDataJSON(this.data);
    }

    getColor(): string {
        const icons: any = {
            'ACCEPTED_IN_CLASS': 'success'
        };
        return icons[this.data.type];
    }

    getIcon(): string {
        const icons: any = {
            'ACCEPTED_IN_CLASS': 'mdi-check'
        };
        return icons[this.data.type];
    }
}
