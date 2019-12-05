import Server from "../utils/Server";

export default class SearchService {

	static query(query) {
		return Server.get.bind(this)('/custom/search/' + this.$i18n.locale + '?q=' + query.trim().split(' ').join('+'));
	}
}
