import Server from "../utils/Server";

export default class HistoryService {

	static fromUser(id, limit = 5) {
		return Server.get.bind(this)('/custom/activity?filter[action_by]=' + id + '&filter[action]=create&filter[collection][in]=documentation,component,page&page_fields=id,title,slug&component_fields=id,name,description&documentation_fields=id,title,slug&limit=' + id + '&meta=filter_count&sort=-id');
	}
}
