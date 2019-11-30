import Server from "../utils/Server";

export default class MessagingService {

	static getMessages(fromUserId) {
		return Server.get.bind(this)('/items/messaging?fields=*,created_by.*,created_by.avatar.filename&filter[to_user][eq]=' + this.$root.user.id + '&filter[created_by][logical]=or&filter[created_by][eq]=' + this.$root.user.id);
	}

	static getUsers() {
		return Server.get.bind(this)('/items/messaging?groups=created_by&fields=*,created_by.*,created_by.avatar.filename&filter[to_user]=' + this.$root.user.id + '&sort=-created_on');
	}

	static sendMessage(userId, message) {
		return Server.post.bind(this)('/items/messaging?fields=*,created_by.*,created_by.avatar.filename', {
			to_user: userId,
			content: message,
		});
	}
}
