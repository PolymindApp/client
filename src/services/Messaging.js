import Server from "../utils/Server";

export default class MessagingService {

	static getMessages(fromUserId) {

		return Promise.all([
			Server.get.bind(this)('/items/messaging?fields=*,created_by.*,created_by.avatar.filename&filter[created_by][eq]=' + this.$root.user.id + '&filter[to_user][logical]=and&filter[to_user][eq]=' + fromUserId),
			Server.get.bind(this)('/items/messaging?fields=*,created_by.*,created_by.avatar.filename&filter[created_by][eq]=' + fromUserId + '&filter[to_user][logical]=and&filter[to_user][eq]=' + this.$root.user.id),
		]).then(results => {
			return {
				data: results[0].data.concat(results[1].data).sort((a, b) => (a.created_on > b.created_on) ? 1 : -1)
			};
		});
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
