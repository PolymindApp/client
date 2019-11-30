import Server from '../utils/Server';

export default class PageService {

	static get(slug) {
		return Server.get.bind(this)('/items/page?single=1&filter[language.abbreviation]=' + this.$i18n.locale + '&filter[slug]=' + slug, {
			filters: {
				'language.abbreviation': this.$i18n.locale,
				slug: slug
			}
		});
	}
}
