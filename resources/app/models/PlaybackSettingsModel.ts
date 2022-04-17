export default class PlaybackSettingsModel {

    public data: any = {};

    private defaultStructure = {
        mode: null,
        repeat: 1,
        delay: 5,
        flipped: false,
        reversed: false,
        frontVoiceEnabled: true,
        backVoiceEnabled: true,
        fromDate: null,
        toDate: null,
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
