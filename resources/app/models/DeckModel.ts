import BaseModel from './BaseModel';
import PlaybackSettingsModel from "@/models/PlaybackSettingsModel";

export default class DeckModel extends BaseModel {

    public data: any = {};

    protected defaultStructure = {
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
        super(data);
        this.mapDefaultValues(data);
        this.data.playback_settings = new PlaybackSettingsModel(Object.assign({}, data.playback_settings));
    }
}
