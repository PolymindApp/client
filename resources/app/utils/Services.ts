import Query from '@/utils/Query';
import DeckModel from "@/models/DeckModel";
import UserModel from "@/models/UserModel";
import DictionaryModel from "@/models/DictionaryModel";
import DictionaryItemModel from "@/models/DictionaryItemModel";
import LanguageModel from "@/models/LanguageModel";
import Vue from 'vue';
import PlaybackSettingsModel from "@/models/PlaybackSettingsModel";
import db, {Deck, Dictionary, Language} from '@/database';
import { Table } from 'dexie';
import DictionaryCategoryModel from "@/models/DictionaryCategoryModel";
import VoiceModel from "@/models/VoiceModel";
import MediaModel from "@/models/MediaModel";
import BaseModel from '@/models/BaseModel';
import LogModel from '@/models/LogModel';
import NotificationModel from '@/models/NotificationModel';

export default class Services {

	static token: string|null = localStorage.getItem('token');

    private static async onlineFirst(
        model: Table<any>,
        promise: (query: void) => Promise<any>,
        parser?: (model: Table<any>) => Promise<any>,
    ): Promise<any> {
        if (!window.navigator.onLine) {
            const response = await (parser ? parser(model) : model.toArray());
            return new Promise(async resolve => {
                resolve(response);
            });
        }

        return promise();
    }

    private static setLoginToken(response: any) {
        this.token = response.token;
        localStorage.setItem('token', response.token);
        return response;
    }

    static switchToken(token: string) {
        this.setLoginToken({ token });
    }

	/**
	 * Login to platform
	 *
	 * @param email
	 * @param password
	 * @param path
	 */
	static login(email: string, password: string, path: string|null): Promise<any> {
		return Query.post('/login', { email, password })
            .then(response => this.setLoginToken(response));
	}

	/**
	 * Register a new account
	 *
	 * @param email
	 * @param password
	 * @param confirmation
	 * @param path
	 */
	static register(email: string, password: string, confirmation: string, path: string|null): Promise<any> {
		return Query.post('/register', { email, password, password_confirmation: confirmation })
			.then(response => this.setLoginToken(response));
	}

	/**
	 * Logout from platform
	 */
	static logout(): Promise<any> {
        // return new Promise((resolve, reject) => {
        //     this.token = null;
        //     localStorage.removeItem('token');
        //     resolve(1);
        // });
		return Query.post('/logout')
			.then((response: any) => {
				this.token = null;
				localStorage.removeItem('token');
				return response;
			});
	}

	/**
	 * Tells if user is logged or not
	 */
	static isLoggedIn(): Promise<any> {

        if (!window.navigator.onLine) {
            return new Promise((resolve, reject) => {
                const token = localStorage.getItem('token');
                const accounts = Vue.prototype.$accounts.load();
                const found = accounts.find((item: any) => item.token === token);
                if (found) {
                    resolve(found);
                } else {
                    reject();
                }
            });
        }

        return Query.post('/auth/verify');
	}

	/**
	 * Request for password reset
	 */
	static forgotPasswordRequest(email: string): Promise<any> {
		return Query.post('/password/reset/request', {
			email
		});
	}

	/**
	 * Reset password
	 */
	static resetPassword(email: string, password: string, confirmation: string, token: string): Promise<any> {
		return Query.post('/password/reset', {
            email,
			password,
			password_confirmation: confirmation,
			token,
		});
	}

	/**
	 * Verify email
	 */
	static verifyEmail(signature: string): Promise<any> {
		return Query.post('/register/verify?signature=' + signature)
            .then(response => this.setLoginToken(response));
	}

	/**
	 * Resend verification email
	 */
	static resendVerificationEmail(email: string): Promise<any> {
		return Query.post('/register/resend', {
			email,
		});
	}

	/**
	 * Get all languages
	 */
	static getLanguages(): Promise<any> {
        return this.onlineFirst(
            db.languages,
            () => Query.get('/language'),
        )
            .then(items => {
                db.languages.bulkPut(items);
                return items;
            })
            .then(languages => languages.map((language: Language) => new LanguageModel(language)));
	}

	/**
	 * Get all voices
	 */
	static getVoices(): Promise<any> {
        return this.onlineFirst(
            db.voices,
            () => Query.get('/voice'),
        )
            .then(items => {
                db.voices.bulkPut(items);
                return items;
            })
            .then(items => items.map((item: VoiceModel) => new VoiceModel(item)))
	}

	/**
	 * Get all decks
	 */
	static getDecks(): Promise<any> {
        return this.onlineFirst(
            db.decks,
            () => Query.get('/deck'),
        )
            .then(items => {
                db.decks.bulkPut(items);
                return items;
            })
            .then(decks => decks.map((deck: Deck) => new DeckModel(deck)));
	}

	/**
	 * Get specific deck
	 */
	static getDeck(id: string): Promise<any> {
        return this.onlineFirst(
            db.decks,
            () => Query.get('/deck/' + id),
            model => model.where({ id }).first(),
        )
            .then(response => new DeckModel(response));
	}

	/**
	 * Create new deck
	 */
	static createDeck(deck: any): Promise<any> {
        const clone = Vue.prototype.$deepClone(deck.data);
        clone.playback_settings = new PlaybackSettingsModel().data;
        return this.onlineFirst(
            db.decks,
            () => Query.post('/deck', clone),
            model => model.add(clone),
        )
            .then(response => new DeckModel(response));
	}

	/**
	 * Update specific deck
	 */
	static updateDeck(id: string, deck: any): Promise<any> {
        const clone = Vue.prototype.$deepClone(deck.data);
        clone.playback_settings = Vue.prototype.$deepClone(clone.playback_settings.data);
        return this.onlineFirst(
            db.decks,
            () => Query.put('/deck/' + id, clone),
            model => {
                model.update(id, clone);
                return clone;
            },
        )
            .then(response => new DeckModel(response));
	}

	/**
	 * Delete specific deck
	 */
	static deleteDeck(id: string): Promise<any> {
        return this.onlineFirst(
            db.decks,
            () => Query.delete('/deck/' + id),
            model => model.delete(id),
        );
	}

	/**
	 * Get all cards
	 */
	static getCards(deckId?: number): Promise<any> {
        return this.onlineFirst(
            db.cards,
            () => Query.get('/card', deckId ? { deckId } : undefined),
            model => model.filter(card => {
                return card.deck_id === deckId;
            }).toArray()
        )
            .then(items => {
                db.cards.bulkPut(items);
                return items;
            });
	}

	/**
	 * Get specific card
	 */
	static getCard(id: string): Promise<any> {
        return this.onlineFirst(
            db.cards,
            () => Query.get('/card/' + id),
            model => model.where({ id }).first(),
        )
            .then(item => {
                db.cards.put(item);
                return item;
            });
	}

	/**
	 * Create new card
	 */
	static createCard(front: string, back: string, frontVoiceId: number, backVoiceId: number, frontSynthesized?: any, backSynthesized?: any, deckId?: number): Promise<any> {
        const data = {
            deck_id: deckId,
            front,
            back,
            front_voice_id: frontVoiceId,
            back_voice_id: backVoiceId,
            front_synthesized: frontSynthesized,
            back_synthesized: backSynthesized,
        };
        return this.onlineFirst(
            db.cards,
            () => Query.post('/card', data),
            model => model.add(data),
        );
	}

	/**
	 * Create new card
	 */
	static bulkCreateCards(cards: any[]): Promise<any> {
		return this.onlineFirst(
            db.cards,
            () => Query.post('/card/bulk', cards),
            model => model.bulkAdd(cards),
        );
	}

	/**
	 * Update specific card
	 */
	static updateCard(card: any): Promise<any> {
        return this.onlineFirst(
            db.cards,
            () => Query.put('/card/' + card.id, card),
            model => {
                model.update(card.id, card);
                return card;
            },
        );
	}

	/**
	 * Update specific card
	 */
	static bulkUpdateCards(cards: any[]): Promise<any> {
        return this.onlineFirst(
            db.cards,
            () => Query.put('/card/bulk', cards),
            model => model.bulkPut(cards),
        );
	}

	/**
	 * Delete specific card
	 */
	static deleteCard(id: string): Promise<any> {
        return this.onlineFirst(
            db.cards,
            () => Query.delete('/card/' + id),
            model => model.delete(id),
        );
	}

	/**
	 * Delete specific card
	 */
	static bulkDeleteCards(cards: any[]): Promise<any> {
        const ids = cards.map(card => card.id);
        return this.onlineFirst(
            db.cards,
            () => Query.delete('/card/bulk', ids),
            model => model.bulkDelete(ids),
        );
	}

    /**
     * Export given session in specified format
     */
    static export(ids: any[], format: string, name: string, settings: any): Promise<any> {
        return Query.post('/export/' + format, {
            ids,
            name,
            settings
        }, undefined,  true)
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = name + ".mp3";
                document.body.appendChild(link);
                link.click();
                link.remove();
            });
    }

    /**
     * Get all dictionaries
     */
    static getDictionaries(): Promise<any> {
        return this.onlineFirst(
            db.dictionaries,
            () => Query.get('/dictionary'),
        )
            .then(items => {
                db.dictionaries.bulkPut(items);
                return items;
            })
            .then(dictionaries => dictionaries.map((dictionary: Dictionary) => new DictionaryModel(dictionary)));
    }

    /**
     * Get all dictionary
     */
    static getDictionary(id: string): Promise<any> {
        return this.onlineFirst(
            db.dictionaries,
            () => Query.get('/dictionary/' + id),
            model => model.where({ id }).first(),
        )
            .then(item => {
                db.dictionaries.put(item);
                return item;
            })
            .then(item => new DictionaryModel(item));
    }

    /**
     * Get all dictionary categories
     */
    static getDictionaryCategories(): Promise<any> {
        return this.onlineFirst(
            db.dictionary_categories,
            () => Query.get('/dictionary/category'),
        )
            .then(items => {
                db.dictionary_categories.bulkPut(items);
                return items;
            })
            .then(items => items.map((item: DictionaryCategoryModel) => new DictionaryCategoryModel(item)));
    }

    /**
     * Get all dictionary items
     */
    static getDictionaryItems(uuid: string): Promise<any> {
        return this.onlineFirst(
            db.dictionary_items,
            () => Query.get('/dictionary/' + uuid + '/items'),
        )
            .then(items => {
                db.dictionary_items.bulkPut(items);
                return items;
            })
            .then(items => items.map((item: DictionaryItemModel) => new DictionaryItemModel(item)));
    }

    /**
     * Sync all data
     */
    static syncData(): Promise<any> {
        return Promise.all([
            this.getLanguages(),
            this.getVoices(),
            this.getDecks(),
            this.getDictionaries(),
        ]).then(([languages, voices, decks, dictionaries]) => {
            const promises: Array<Promise<any>> = [
                this.getCards()
            ];
            decks.forEach((deck: any) => promises.push(this.getCards(deck.data.id)));
            return Promise.all(promises)
                .then(cards => {
                    return { languages, voices, decks, cards, dictionaries };
                })
        });
    }

    /**
     * Get all users
     */
    static getUsers(): Promise<any> {
        return this.onlineFirst(
            db.users,
            () => Query.get('/admin/user'),
        )
            .then(items => {
                db.users.bulkPut(items);
                return items;
            })
            .then(users => users.map((user: UserModel) => new UserModel(user)));
    }

    /**
     * Get user's notifications
     */
    static getNotifications(user: UserModel): Promise<any> {
        return this.onlineFirst(
            db.notifications,
            () => Query.get('/user/' + user.data.id  + '/notifications'),
        )
            .then(items => {
                db.notifications.bulkPut(items);
                return items;
            })
            .then(notifications => notifications.map((notification: NotificationModel) => new NotificationModel(notification)));
    }

    /**
     * Acknowledge user's notifications
     */
    static acknowledgeNotifications(notifications: Array<NotificationModel>): Promise<Array<NotificationModel>> {
        return Query.post('/notifications/acknowledge', notifications)
            .then(response => response.map((item: any) => new NotificationModel(item)));
    }

    /**
     * Get user profile
     */
    static getProfile(uuid: string): Promise<any> {
        return this.onlineFirst(
            db.users,
            () => Query.get('/user/' + uuid + '/profile'),
            model => model.where({ id: uuid }).first(),
        )
            .then(response => {
                response.user = new UserModel(response.user);
                response.decks = response.decks.map((deck: any) => new DeckModel(deck));
                response.logs = response.logs.map((deck: any) => new LogModel(deck));
                response.notifications = response.notifications.map((deck: any) => new NotificationModel(deck));
                return response;
            });
    }

    /**
     * Get all users
     */
    static getList(url: string, dbName: string, modelClass: new (props: any) => BaseModel): Promise<any> {
        return this.onlineFirst(
            // @ts-ignore
            db[dbName],
            () => Query.get(url),
        )
            .then(items => {
                // @ts-ignore
                db[dbName].bulkPut(items);
                return items;
            })
            .then(items => items.data.map((user: any) => new modelClass(user)));
    }

    /**
     * Save media
     *
     * @param media
     */
    static saveMedia(media: MediaModel): Promise<MediaModel> {
        return new Promise((resolve, reject) => {
            if (media.isDifferentFromOriginal()) {
                const data = media.toSaveObject();
                return this.onlineFirst(
                    db.medias,
                    data.id
                        ? () => Query.put('/media/' + data.id, data)
                        : () => Query.post('/media', data),
                    data.id
                        ? model => model.update(data.id, data)
                        : model => model.add(data)
                )
                    .then(response => new MediaModel(response));
            } else {
                resolve(media);
            }
        })
    }

    /**
     * Save dictionary
     *
     * @param dictionary
     */
    static saveDictionary(dictionary: DictionaryModel): Promise<DictionaryModel> {
        return new Promise((resolve, reject) => {
            if (dictionary.isDifferentFromOriginal()) {
                this.saveMedia(dictionary.data.cover).then(media => {
                    dictionary.data.media_id = media.data.id;
                    const data = dictionary.toSaveObject();
                    return this.onlineFirst(
                        db.dictionaries,
                        data.id
                            ? () => Query.put('/admin/dictionary/' + data.id, data)
                            : () => Query.post('/admin/dictionary', data),
                        data.id
                            ? model => model.update(data.id, data)
                            : model => model.add(data)
                    )
                        .catch(reject)
                        .then(response => new DictionaryModel(response));
                })
            } else {
                resolve(dictionary);
            }
        })
    }

    /**
     * Delete specific dictionary
     */
    static deleteDictionary(id: string): Promise<any> {
        return this.onlineFirst(
            db.dictionaries,
            () => Query.delete('/admin/dictionary/' + id),
            model => model.delete(id),
        );
    }

    /**
     * Save dictionary items
     */
    static saveDictionaryItems(model: DictionaryItemModel): Promise<DictionaryItemModel> {
        return new Promise((resolve, reject) => {
            if (model.isDifferentFromOriginal()) {
                return this.saveMedia(model.data.cover).then(media => {
                    model.data.media_id = media.data.id;
                    const data = model.toSaveObject();
                    return this.onlineFirst(
                        db.dictionaries,
                        data.id
                            ? () => Query.put('/admin/dictionary/' + model.data.dictionary_id + '/items/' + data.id, data)
                            : () => Query.post('/admin/dictionary/' + model.data.dictionary_id + '/items', data),
                        data.id
                            ? model => model.update(data.id, data)
                            : model => model.add(data)
                    )
                        .catch(reject)
                        .then(response => new DictionaryItemModel(response));
                })
            } else {
                resolve(model);
            }
        })
    }

    /**
     * Delete specific dictionary item
     */
    static deleteDictionaryItems(model: DictionaryItemModel): Promise<any> {
        const id = model.data.id;
        return this.onlineFirst(
            db.dictionaries,
            () => Query.delete('/admin/dictionary/' + model.data.dictionary_id + '/items/' + id),
            model => model.delete(id),
        );
    }

    private static getApiPath(table: string): string {
        if (table.endsWith('ies')) {
            return table.substring(0, table.length - 3) + 'y';
        } else if (table.endsWith('ses')) {
            return table.substring(0, table.length - 3) + 's';
        }
        return table.substring(0, table.length - 1);
    }

    /**
     * Get all from table
     */
    static getAll<T>(table: string, modelClass: new (props: any) => T): Promise<Array<T>> {
        return this.onlineFirst(
            // @ts-ignore
            db[table],
            () => Query.get(this.getApiPath('/' + table)),
        )
            .then(items => {
                // @ts-ignore
                db[table].bulkPut(items.data);
                return items.data;
            })
            .then(items => items.map((item: BaseModel) => new modelClass(item)));
    }


    /**
     * Get all from table
     */
    static delete<T>(table: string, models: T | Array<T>, modelClass: new (props: any) => T): Promise<Array<T>> {
        const modelsInArray = Array.isArray(models) ? models : [models];
        return this.onlineFirst(
            // @ts-ignore
            db[table],
            () => Query.delete(this.getApiPath('/' + table) + '/bulk', models),
            (model: any) => {
                const promises: Array<Promise<any>> = [];
                modelsInArray.forEach((item: any) => {
                    promises.push(model.delete(item.data.id));
                })
                return Promise.all(promises);
            },
        )
            .then(items => items.map((item: BaseModel) => new modelClass(item)));
    }

    /**
     * Create new card
     */
    static save<T>(table: string, models: Array<T>, modelClass: new (props: any) => T): Promise<Array<T>> {
        // @ts-ignore
        const modelsToSave = models.map(model => model.toSaveObject());
        return this.onlineFirst(
            // @ts-ignore
            db[table],
            () => Query.post(this.getApiPath('/' + table) + '/bulk', modelsToSave),
            // @ts-ignore
            model => model.bulkAdd(modelsToSave),
        )
            .then(items => items.map((item: BaseModel) => new modelClass(item)));
    }
}
