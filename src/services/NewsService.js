import Server from "../utils/Server";

export default class NewsService {

	static getAll() {
		return Server.get.bind(this)('/items/news?fields=*,content&filter=', {
			fields: '*.*.*',
			filter: {
				'content.language': this.$i18n.locale,
			}
		});
	}

	static get(slug, locale) {
		return Server.get.bind(this)('/items/news?single=1&fields=*,content&filter=', {
			fields: '*.*.*',
			filter: {
				'content.slug': slug,
				'content.language': locale,
			}
		});
	}
}
