import { IRole } from './RoleModel';
import BaseModel from './BaseModel';

export interface IUser {
    id: string | null,
    name: string,
    email: string,
    created_at: string,
    roles: Array<IRole>
}

export default class UserModel extends BaseModel {

    public data: any = {};
    protected defaultStructure: IUser = {
        id: null,
        name: '',
        email: '',
        created_at: '',
        roles: [],
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
        this.setOriginalDataJSON(this.data);
    }

    hasRole(key: string | Array<string>) {
        const keys = Array.isArray(key) ? key : [key];
        return this.data.roles.findIndex((role: IRole) => keys.includes(role.key) || role.key === 'dev') !== -1;
    }
}
