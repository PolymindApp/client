import Server from '../utils/Server';

export default class PageService {

	static get(slug) {
		return Server.get.bind(this)('/page/' + this.$i18n.locale + '/' + slug);
	}
}
