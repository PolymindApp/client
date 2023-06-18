import RoleModel from './RoleModel';
import BaseModel from './BaseModel';
import MediaModel from '@/models/MediaModel';

export interface IUser {
    id: string | null,
    name: string,
    email: string,
    created_at: string,
    roles: Array<RoleModel>,
    media_id: string | null,
    avatar: {
        id: string | null,
        url: string,
    },
}

export default class UserModel extends BaseModel {

    public data: any = {};
    protected defaultStructure: IUser = {
        id: null,
        name: '',
        email: '',
        created_at: '',
        roles: [],
        media_id: null,
        avatar: {
            id: null,
            url: ''
        },
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
        this.data.avatar = new MediaModel(data.avatar);
        this.data.roles = this.data.roles.map((role: RoleModel) => new RoleModel(role));
        this.setOriginalDataJSON(this.data);
    }

    hasRole(key: string | Array<string>) {
        const keys = Array.isArray(key) ? key : [key];
        return this.data.roles.findIndex((role: RoleModel) => keys.includes(role.data.key) || role.data.key === 'dev') !== -1;
    }
}
