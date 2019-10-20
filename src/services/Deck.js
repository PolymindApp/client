export default class DeckService {

	static get(id) {

		return this.$root.strapi.request('GET', '/decks/' + id)
			.catch(error => this.$root.error = error);
	}

	static getAll() {

		return this.$root.strapi.request('GET', '/decks?_limit=10000&_sort=order')
			.then(result => result.items)
			.catch(error => this.$root.error = error);
	}

	static updateSpecific(id, data) {

		return this.$root.strapi.request('PUT', '/decks/' + id, {
			data: data
		}).then(result => {
			this.$root.$emit('DECK_UPDATE');
			return result;
		}).catch(error => this.$root.error = error);
	}

	static save(data) {

		const method = data.id ? 'PUT' : 'POST';
		const params = data.id ? ('/' + data.id) : '';

		if (data.setting) {
			delete data.setting.title;
			delete data.setting.created_at;
			delete data.setting.updated_at;
		}

		return this.$root.strapi.request(method, '/decks' + params, {
			data: data
		}).then(result => {
			this.$root.$emit('DECK_UPDATE');
			return result;
		}).catch(error => this.$root.error = error);
	}

	static saveOrder(decks) {

		let items = [];
		decks.forEach((deck, index) => {
			items.push({ id: deck.id, order: index });
		});

		return this.$root.strapi.request('POST', '/decks/order', {
			data: items
		}).then(result => {
			this.$root.$emit('DECK_UPDATE');
			return result;
		}).catch(error => this.$root.error = error);
	}

	static delete(id) {

		return this.$root.strapi.request('DELETE', '/decks/' + id)
			.then(result => {
				this.$root.$emit('DECK_UPDATE');
				return result;
			})
			.catch(error => this.$root.error = error);
	}

	static getPublic(userId = false) {

		let params = [];
		if (userId) {
			params.push('?user.id=' + userId);
		}

		return this.$root.strapi.request('GET', '/decks/public' + params.join('&'))
			.catch(error => this.$root.error = error);
	}

	static listen() {

		this.$root.strapi.request('GET', '/decks?_limit=10000')
			.catch(error => this.$root.error = error);

		// this.sockets.subscribe('DECKS_UPDATED', (data) => {
		// 	console.log(data);
		// });
	}
}
