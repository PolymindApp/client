import ambiences from '../../../.ambiences.json';

export default class PlaybackSettingsModel {

    public data: any = {};

    private defaultStructure = {
        mode: null,
        repeat: 1,
        delay: 5,
        flipped: false,
        reversed: true,
        frontVoiceEnabled: true,
        backVoiceEnabled: true,
        fromDate: null,
        toDate: null,
        ejected: [],
        ambience: ambiences.length > 0 ? ambiences[0].url : null,
    };

    constructor(data = {}) {
        const defaultKeys = Object.keys(this.defaultStructure);
        Object.assign(this.data, this.defaultStructure, data);
        Object.keys(this.data).forEach(key => {
            if (defaultKeys.indexOf(key) === -1) {
                delete this.data[key];
            }
        });
    }
}
