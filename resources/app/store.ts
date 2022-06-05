import Vue from 'vue'
import Vuex from 'vuex'
import SettingsModel from '@/models/SettingsModel';

Vue.use(Vuex);

const settings = new SettingsModel();

enum ENavigation {
    dictionary = 'dictionary',
    deck = 'deck'
}

export default new Vuex.Store({
    state: () => ({
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
            const bookmarks = state.settings.dictionary_bookmarks;
            const index = bookmarks.findIndex((bookmark: string) => bookmark === uuid);
            if (index === -1) {
                bookmarks.push(uuid);
            } else {
                bookmarks.splice(index, 1);
            }
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
