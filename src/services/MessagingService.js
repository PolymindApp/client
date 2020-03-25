import Server from "../utils/Server";

const defaultFields = 'id,content,is_read,created_by.id,created_by.screen_name,created_by.first_name,created_by.last_name,created_on,created_by.last_access_on';

export default class MessagingService {

	static getMessages(fromUserId) {

		return Promise.all([
			Server.get.bind(this)('/items/messaging?fields=' + defaultFields + ',created_by.avatar.private_hash&filter[created_by][eq]=' + this.$root.user.id + '&filter[to_user][logical]=and&filter[to_user][eq]=' + fromUserId + '&sort=-id'),
			Server.get.bind(this)('/items/messaging?fields=' + defaultFields + ',created_by.avatar.private_hash&filter[created_by][eq]=' + fromUserId + '&filter[to_user][logical]=and&filter[to_user][eq]=' + this.$root.user.id + '&sort=-id'),
			Server.post.bind(this)('/custom/messaging/acknowledge/' + fromUserId)
		]).then(results => {
			return {
				data: results[0].data.concat(results[1].data).sort((a, b) => (a.created_on > b.created_on) ? 1 : -1)
			};
		});
	}

	static get(id) {
		return Server.get.bind(this)('/items/messaging?fields=*,created_by.*,created_by.avatar.private_hash&filter[to_user]=' + this.$root.user.id + '&filter[id]=' + id + '&single=1');
	}

	static getUsers() {
		return Server.get.bind(this)('/items/messaging?groups=created_by&fields=*,created_by.*,created_by.avatar.private_hash&filter[to_user]=' + this.$root.user.id + '&sort=-created_on');
	}

	static sendMessage(userId, message) {
		return Server.post.bind(this)('/items/messaging?fields=' + defaultFields + ',created_by.avatar.private_hash', {
			to_user: userId,
			content: message,
		});
	}
}
