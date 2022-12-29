import BaseModel from './BaseModel';

export interface IRole {
    id: number | null,
    key: string,
    name: string,
    description?: string,
}

export default class RoleModel extends BaseModel {

    public data: any = {};

    protected defaultStructure: IRole = {
        id: null,
        key: '',
        name: '',
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
    }
}
