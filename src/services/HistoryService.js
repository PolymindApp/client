import Server from "../utils/Server";

export default class HistoryService {

	static fromUser(id) {
		return Server.get.bind(this)('/custom/activity?filter[action_by]=' + id + '&limit=500&filter[action]=create&filter[collection][in]=documentation,component,page&page_fields=id,title,slug&component_fields=id,name,description&documentation_fields=id,title,slug&limit=5&meta=filter_count&sort=-id');
	}
}
