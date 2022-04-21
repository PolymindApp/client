import PlaybackSettingsModel from "@/models/PlaybackSettingsModel";

export default class DeckModel {

    public data: any = {};

    private defaultStructure = {
        id: null,
        default_front_voice_id: null,
        default_back_voice_id: null,
        name: null,
        i18n: null,
        single: false,
        total_card: 0,
        playback_settings: new PlaybackSettingsModel(),
    };

    constructor(data: any = {}) {
        const defaultKeys = Object.keys(this.defaultStructure);
        Object.assign(this.data, this.defaultStructure, data);
        Object.keys(this.data).forEach(key => {
            if (defaultKeys.indexOf(key) === -1) {
                delete this.data[key];
            }
        });

        this.data.playback_settings = new PlaybackSettingsModel(Object.assign({}, data.playback_settings));
    }
}
