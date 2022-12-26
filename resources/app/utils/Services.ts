import Query from '@/utils/Query';
import DeckModel from "@/models/DeckModel";
import UserModel from "@/models/UserModel";
import DictionaryModel from "@/models/DictionaryModel";
import DictionaryItemModel from "@/models/DictionaryItemModel";
import Vue from 'vue';
import PlaybackSettingsModel from "@/models/PlaybackSettingsModel";
import db, { Voice, Deck, Dictionary } from '@/database';
import { Table } from 'dexie';

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
        return new Promise((resolve, reject) => {
            this.token = null;
            localStorage.removeItem('token');
            resolve(1);
        });
		// return Query.post('/logout')
		// 	.then((response: any) => {
		// 		this.token = null;
		// 		localStorage.removeItem('token');
		// 		return response;
		// 	});
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
            });
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
            .then((voices: Array<Voice>) => {
                const languages: any = [];
                voices.forEach(voice => {
                    const code = voice.language.code.substring(0, 2);
                    let existing = languages.find((language: any) => language.code === code);
                    if (!existing) {
                        languages.push({
                            code,
                            name: voice.language.name.split(',')[0],
                            voices: [voice]
                        });
                    } else {
                        existing.voices.push(voice);
                    }
                });
                return languages;
            });
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
                const url = window.URL.createObjectURL(blob);
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
            });
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
}
