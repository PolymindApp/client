import Server from "../utils/Server";

export default class NotificationService {

	static get() {
		return Server.get.bind(this)('/items/notification?fields=*,created_by.*,created_by.avatar.filename,from.*,from.avatar.filename&filter[to]=' + this.$root.user.id);
	}
}
