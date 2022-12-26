import BaseModel from './BaseModel';
import { Media } from '@/database';

export default class MediaModel extends BaseModel {

    public data: any = {};

    protected defaultStructure: Media = {
        id: null,
        url: null,
    }

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
    }
}
