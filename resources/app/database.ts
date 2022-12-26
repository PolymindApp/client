import Dexie, { Table } from 'dexie';
import PlaybackSettingsModel from "@/models/PlaybackSettingsModel";

export interface Language {
    id?: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface Voice {
    id?: number;
    gender: boolean;
    language: Language;
    language_id: number;
    name: string;
    neural: boolean;
    standard: boolean;
    bilingual: boolean;
    child: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface User {
    id?: string;
    name: string;
    email: string;
    roles: Role;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id?: string;
    key: string;
    name: string;
    description: string;
}

export interface Deck {
    id?: string;
    default_front_voice_id: number;
    default_back_voice_id: number;
    default_back_voice: Voice;
    default_front_voice: Voice;
    name: string;
    single: boolean;
    total_card: number;
    playback_settings: PlaybackSettingsModel;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    deleted_at: string;
}

export interface Card {
    id?: string;
    deck_id: string;
    front_voice_id: number;
    back_voice_id: number;
    front_voice: Voice;
    back_voice: Voice;
    front: string;
    back: string;
    front_synthesized: Blob;
    back_synthesized: Blob;
    order: number;
}

export interface Media {
    id?: string;
    url: string;
}

export interface Dictionary {
    id?: string;
    dictionary_category_id: DictionaryCategory;
    total_items: number;
    cover: Media;
    i18n: [DictionaryI18n];
    created_by: User;
    created_at: string;
}

export interface DictionaryI18n {
    id?: string;
    text: string;
    language: Language;
}

export interface DictionaryCategory {
    id?: string;
    total_dictionaries: number;
    cover: Media;
    i18n: Array<DictionaryCategoryI18n>;
}

export interface DictionaryCategoryI18n {
    id?: string;
    text: string;
    language: Language;
}

export interface DictionaryItem {
    id?: string;
    dictionary_id: string;
    cover: Media;
    i18n: Array<DictionaryItemI18n>;
}

export interface DictionaryItemI18n {
    id?: string;
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
