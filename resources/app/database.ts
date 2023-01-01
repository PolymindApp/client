import Dexie, { Table } from 'dexie';
import PlaybackSettingsModel from "@/models/PlaybackSettingsModel";

export interface I18n {
    id?: string | null;
    text: string;
    type?: string | null;
    voice_id?: number | null;
    language: Language;
}

export interface Language {
    id?: number | null;
    name: string;
    code: string;
    voices?: Array<Voice>;
    created_at?: string | null;
    updated_at?: string | null;
    deleted_at?: string | null;
}

export interface Voice {
    id?: number | null;
    gender: boolean;
    language: Language;
    language_id: number;
    name: string;
    neural: boolean;
    standard: boolean;
    bilingual: boolean;
    child: boolean;
    created_at?: string | null;
    updated_at?: string | null;
    deleted_at?: string | null;
}

export interface User {
    id?: string | null;
    name: string;
    email: string;
    roles: Role;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface Role {
    id?: string | null;
    key: string;
    name: string;
    description?: string | null;
}

export interface Deck {
    id?: string | null;
    default_front_voice_id: number;
    default_back_voice_id: number;
    default_back_voice: Voice;
    default_front_voice: Voice;
    name: string;
    single: boolean;
    total_card: number;
    playback_settings: PlaybackSettingsModel;
    created_at?: string | null;
    created_by?: string | null;
    updated_at?: string | null;
    updated_by?: string | null;
    deleted_at?: string | null;
}

export interface Card {
    id?: string | null;
    deck_id: string;
    front_voice_id: number | null;
    back_voice_id: number | null;
    front_voice: Voice;
    back_voice: Voice;
    front: string;
    back: string;
    front_synthesized: Blob;
    back_synthesized: Blob;
    order: number;
}

export interface Media {
    id?: string | null;
    url: string | null;
}

export interface Dictionary {
    id?: string | null;
    dictionary_category_id?: string | null;
    total_items: number;
    cover: Media;
    category: DictionaryCategory,
    i18n: Array<DictionaryI18n>;
    created_by?: User | null;
    created_at?: string | null;
}

export interface DictionaryI18n {
    id?: string | null;
    text: string;
    type: string | null;
    language: Language;
}

export interface DictionaryCategory {
    id?: string | null;
    total_dictionaries: number;
    cover?: Media | null;
    i18n: Array<DictionaryCategoryI18n>;
}

export interface DictionaryCategoryI18n {
    id?: string | null;
    text: string;
    language: Language;
}

export interface DictionaryItem {
    id?: string | null;
    dictionary_id?: string | null;
    cover?: Media | null;
    i18n: Array<DictionaryItemI18n>;
    created_at?: string | null;
}

export interface DictionaryItemI18n {
    id?: string | null;
    text: string;
    text_synthesized: string;
    language: Language;
}

export class PolymindDB extends Dexie {

    users!: Table<User>;
    roles!: Table<Role>;
    decks!: Table<Deck>;
    cards!: Table<Card>;
    voices!: Table<Voice>;
    languages!: Table<Language>;
    medias!: Table<Media>;
    dictionaries!: Table<Dictionary>;
    dictionary_categories!: Table<DictionaryCategory>;
    dictionary_items!: Table<DictionaryItem>;

    constructor() {
        super('polymind');

        this.version(3).stores({
            users: '++id, name, email',
            roles: '++id, key, name, description',
            decks: '++id, name, created_at, updated_at',
            cards: '++id, deck_id, created_at, updated_at',
            voices: '++id, language_id, name',
            languages: '++id, code, name',
            dictionaries: '++id, name, dictionary_category_id, total_items',
            dictionary_categories: '++id, total_dictionaries',
            dictionary_items: '++id, dictionary_id',
        });
    }
}

const db = new PolymindDB();
export default db;
