import Server from "../utils/Server";

export default class SearchService {

	static query(query, log = true) {
		return Server.get.bind(this)('/custom/search/' + this.$i18n.locale + '?q=' + query.trim().split(' ').join('+') + '&log=' + (log ? '1' : '0'));
	}

	static getLatestSearchTerms(userId) {
		return Server.get.bind(this)('items/search_query?filter[created_by]=' + userId + '&sort=-id&limit=10');
	}
}
