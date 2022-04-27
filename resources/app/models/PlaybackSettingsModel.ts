import ambiences from '../../../.ambiences.json';
import BaseModel from "@/models/BaseModel";

export default class PlaybackSettingsModel extends BaseModel {

    public data: any = {};

    private defaultStructure = {
        side: null,
        repeat: 1,
        delay: 5,
        flipped: false,
        reversed: true,
        frontVoiceEnabled: true,
        backVoiceEnabled: true,
        cardRangeFrom: null,
        cardRangeTo: null,
        cardRangeMode: null,
        fromDate: null,
        toDate: null,
        ejected: [],
        ambience: ambiences.length > 0 ? ambiences[0].url : null,
        music: true,
        animation: true,
        wallpaper: true,
        lastCardId: null,
    };

    constructor(data = {}) {
        super();
        const defaultKeys = Object.keys(this.defaultStructure);
        Object.assign(this.data, this.defaultStructure, data);
        Object.keys(this.data).forEach(key => {
            if (defaultKeys.indexOf(key) === -1) {
                delete this.data[key];
            }
        });
    }
}
