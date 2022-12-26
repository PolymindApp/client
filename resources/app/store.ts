import Vue from 'vue'
import Vuex from 'vuex'
import SettingsModel, {ISettings, IDictionarySettings} from '@/models/SettingsModel';

Vue.use(Vuex);

const settings = new SettingsModel();

enum ENavigation {
    dictionary = 'dictionary',
    deck = 'deck'
}

export default new Vuex.Store({
    state: (): {
        settings: ISettings;
        navigation: {
            dictionary: null;
            session: {
                name: string;
                params: {
                    uuid: string
                }
            };
            deck: null
        };
        decks: any[];
        accounts: any[];
        dictionaries: any[]
    } => ({ // Saved locally
        settings: settings.data,
        navigation: {
            dictionary: null,
            deck: null,
            session: {
                name: 'session',
                params: { uuid: 'unclassified' },
            },
        },
        accounts: [],
        dictionaries: [],
        decks: [],
    }),
    mutations: {
        settings(state, model: SettingsModel) {
            Object.assign(state.settings, model.data);
        },
        navigation(state, args: {
            type: ENavigation,
            params: any
        }) {
            state.navigation[args.type] = args.params;
        },
        toggleDictionaryBookmark(state, uuid: string) {
            const settings = state.settings.dictionary_settings;
            let context = settings.find((dictionary: IDictionarySettings) => dictionary.uuid === uuid);
            if (!context) {
                context = {
                    uuid: uuid,
                    languages: [],
                    bookmarked: false,
                }
                settings.push(context);
            }
            context.bookmarked = !context.bookmarked;
        },
        setDictionaryLanguages(state, dictionary: IDictionarySettings) {
            const settings = state.settings.dictionary_settings;
            let context = settings.find((item: IDictionarySettings) => item.uuid === dictionary.uuid);
            if (!context) {
                context = {
                    uuid: dictionary.uuid,
                    languages: [],
                    bookmarked: false,
                }
                settings.push(context);
            }
            context.languages = dictionary.languages;
        },
        accounts(state, accounts: any) {
            state.accounts = accounts;
        },
        dictionaries(state, dictionaries: any) {
            state.dictionaries = dictionaries;
        },
        decks(state, decks: any) {
            state.decks = decks;
        },
    },
})
