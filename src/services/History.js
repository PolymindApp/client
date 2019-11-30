import Server from "../utils/Server";

export default class HistoryService {

	static fromUser(id) {
		return Server.get.bind(this)('/revisions?filter[collection]=directus_users&filter[item]=' + id + '&fields=*,activity.action_on&sort=-activity&limit=5');
	}
}
