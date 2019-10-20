export default class HelpService {

	static get(locale) {

		let params = [];
		if (locale) {
			params.push('&lang.abbreviation=' + locale);
		}

		return this.$root.strapi.request('GET', '/helps?_limit=10000' + params.join('&'))
			.catch(error => this.$root.error = error);
	}
}
