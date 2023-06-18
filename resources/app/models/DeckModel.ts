import BaseModel from './BaseModel';
import PlaybackSettingsModel from "@/models/PlaybackSettingsModel";
import MediaModel from '@/models/MediaModel';
import VoiceModel from '@/models/VoiceModel';

export default class DeckModel extends BaseModel {

    public data: any = {};

    protected defaultStructure = {
        id: null,
        media: new MediaModel(),
        media_id: null,
        default_back_voice: new VoiceModel(),
        default_front_voice: new VoiceModel(),
        default_front_voice_id: null,
        default_back_voice_id: null,
        name: null,
        i18n: null,
        single: false,
        total_card: 0,
        playback_settings: new PlaybackSettingsModel(),
        created_at: null,
        created_by: null,
    };

    constructor(data: any = {}) {
        super(data);
        this.mapDefaultValues(data);
        this.data.playback_settings = new PlaybackSettingsModel(Object.assign({}, data.playback_settings));
        this.setOriginalDataJSON(this.data);
    }
}
