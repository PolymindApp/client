import Query from '@/utils/Query';
import DeckModel from "@/models/DeckModel";
import Vue from 'vue';
import PlaybackSettingsModel from "@/models/PlaybackSettingsModel";

export default class Services {

	static token: string|null = localStorage.getItem('token');

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
		return Query.get('/language');
	}

	/**
	 * Get all voices
	 */
	static getVoices(): Promise<any> {
		return Query.get('/voice')
            .then(voices => {
                const languages: any = [];
                voices.forEach((voice: any) => {
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
		return Query.get('/deck')
            .then(response => response.map((deck: any) => new DeckModel(deck)));
	}

	/**
	 * Get specific deck
	 */
	static getDeck(id: string): Promise<any> {
		return Query.get('/deck/' + id)
            .then(response => new DeckModel(response))
	}

	/**
	 * Create new deck
	 */
	static createDeck(deck: any): Promise<any> {
        const clone = Vue.prototype.$deepClone(deck.data);
        clone.playback_settings = new PlaybackSettingsModel().data;
		return Query.post('/deck', clone)
            .then(response => new DeckModel(response))
	}

	/**
	 * Update specific deck
	 */
	static updateDeck(id: string, deck: any): Promise<any> {
        const clone = Vue.prototype.$deepClone(deck.data);
        clone.playback_settings = Vue.prototype.$deepClone(clone.playback_settings.data);
		return Query.put('/deck/' + id, clone)
            .then(response => new DeckModel(response))
	}

	/**
	 * Delete specific deck
	 */
	static deleteDeck(id: string): Promise<any> {
		return Query.delete('/deck/' + id);
	}

	/**
	 * Get all cards
	 */
	static getCards(deckId?: number): Promise<any> {
		return Query.get('/card', deckId ? {
            deckId,
        } : undefined);
	}

	/**
	 * Get specific card
	 */
	static getCard(id: string): Promise<any> {
		return Query.get('/card/' + id);
	}

	/**
	 * Create new card
	 */
	static createCard(front: string, back: string, frontVoiceId: number, backVoiceId: number, frontSynthesized?: any, backSynthesized?: any, deckId?: number): Promise<any> {
		return Query.post('/card', {
            deck_id: deckId,
            front,
            back,
            front_voice_id: frontVoiceId,
            back_voice_id: backVoiceId,
            front_synthesized: frontSynthesized,
            back_synthesized: backSynthesized,
		});
	}

	/**
	 * Create new card
	 */
	static bulkCreateCards(cards: any[]): Promise<any> {
		return Query.post('/card/bulk', cards);
	}

	/**
	 * Update specific card
	 */
	static updateCard(card: any): Promise<any> {
		return Query.put('/card/' + card.id, card);
	}

	/**
	 * Update specific card
	 */
	static bulkUpdateCards(cards: any[]): Promise<any> {
		return Query.put('/card/bulk', cards);
	}

	/**
	 * Delete specific card
	 */
	static deleteCard(id: string): Promise<any> {
		return Query.delete('/card/' + id);
	}

	/**
	 * Delete specific card
	 */
	static bulkDeleteCards(cards: any[]): Promise<any> {
        const ids = cards.map(card => card.id);
		return Query.delete('/card/bulk', ids);
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
}
