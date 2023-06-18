import Vue from 'vue'
import Vuex from 'vuex'
import UserModel from '@/models/UserModel';
import SettingsModel, {ISettings, IDictionarySettings} from '@/models/SettingsModel';
import DeckModel from '@/models/DeckModel';
import NotificationModel from '@/models/NotificationModel';
import DictionaryModel from '@/models/DictionaryModel';

Vue.use(Vuex);

const settings = new SettingsModel();

enum ENavigation {
    dictionary = 'dictionary',
    deck = 'deck'
}

export default new Vuex.Store({
    state: (): {
        user: UserModel,
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
        decks: Array<DeckModel>;
        notifications: Array<NotificationModel>;
        accounts: any[];
        dictionaries: Array<DictionaryModel>;
    } => ({ // Saved locally
        user: new UserModel(),
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
        notifications: [],
        dictionaries: [],
        decks: [],
    }),
    mutations: {
        user(state, user: UserModel) {
            Object.assign(state.user, user);
        },
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
        dictionaries(state, dictionaries: Array<DictionaryModel>) {
            state.dictionaries = dictionaries;
        },
        decks(state, decks: Array<DeckModel>) {
            state.decks = decks;
        },
        notifications(state, notifications: Array<NotificationModel>) {
            state.notifications = notifications;
        },
        acknowledgeNotifications(state, notifications: Array<NotificationModel>) {
            notifications.forEach(notification => {
                const item = state.notifications.find(item => item.data.id === notification.data.id);
                if (item) {
                    item.data.acknowledged = true;
                }
            });
        },
    },
})
