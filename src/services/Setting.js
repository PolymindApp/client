export default class SettingService {

	static get(id) {

		return this.$root.strapi.request('GET', '/settings/' + id).catch(error => this.$root.error = error);
	}

	static set(id, data) {

		delete data.created_at;
		delete data.updated_at;
		delete data.title;

		return this.$root.strapi.request('PUT', '/settings/' + id, {
			data: data
		}).catch(error => this.$root.error = error);
	}
}
