import Server from "../utils/Server";

export default class NotificationService {

	static getAll() {
		return Server.get.bind(this)('/items/notification?fields=*,created_by.id,created_by.screen_name,created_by.first_name,created_by.last_name,created_by.avatar.filename,from.*,from.avatar.filename,activity.*&meta=filter_count&meta=filter_count&filter[to]=' + this.$root.user.id);
	}

	static get(id) {
		return Server.get.bind(this)('/items/notification?fields=*,created_by.id,created_by.screen_name,created_by.first_name,created_by.last_name,created_by.avatar.filename,from.*,from.avatar.filename,activity.*&meta=filter_count&meta=filter_count&filter[to]=' + this.$root.user.id + '&filter[id]=' + id + '&single=1');
	}

	static acknowledge(ids = []) {
		return Server.post.bind(this)('/custom/notification/acknowledge/' + ids.join(','));
	}
}
