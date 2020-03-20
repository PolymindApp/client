import Server from '../utils/Server';

const createdBy = 'created_by.id,created_by.screen_name,created_by.first_name,created_by.last_name,created_by.avatar.filename,created_by.last_access_on';
const user = 'user.id,user.screen_name,user.first_name,user.last_name,user.avatar.filename,user.last_access_on';

export default class FollowingService {

	static countFollowers(id) {
		return Server.get.bind(this)('/items/following?filter[user]=' + id + '&meta=filter_count&limit=0');
	}

	static countFollowing(id) {
		return Server.get.bind(this)('/items/following?filter[created_by]=' + id + '&meta=filter_count&limit=0');
	}

	static isFollowing(id) {
		return Server.get.bind(this)('/items/following?filter[created_by]=' + this.$root.user.id + '&filter[user]=' + id + '&meta=filter_count&limit=0');
	}

	static getFollowings(userId) {
		return Server.get.bind(this)('/items/following?filter[created_by]=' + userId + '&limit=100&meta=filter_count&fields=*,' + user);
	}

	static getFollowers(userId) {
		return Server.get.bind(this)('/items/following?filter[user]=' + userId + '&limit=100&meta=filter_count&fields=*,' + createdBy);
	}

	static toggleFollowing(id) {
		return Server.post.bind(this)('/custom/following/toggle/' + id);
	}
}
