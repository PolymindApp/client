import Server from '../utils/Server';

export default class ContentService {

	static get(slug) {
		return Server.get.bind(this)('/content/' + this.$i18n.locale + '/' + slug);
	}
}
