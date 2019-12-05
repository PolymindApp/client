import Server from '../utils/Server';

const defaultFields = 'id,comment,comment_deleted_on,comment_thumb_up,comment_thumb_down,action_on,action_by.screen_name,action_by.first_name,action_by.last_name,action_by.avatar.filename,action_by.id';

export default class CommentService {

	static count(collection, id) {
		return Server.get.bind(this)('/activity?filter[action]=comment&filter[collection]=' + collection + '&filter[item]=' + id + '&fields=' + defaultFields + '&meta=filter_count&limit=0');
	}

	static getAll(collection, id, sort = '-id') {
		return Server.get.bind(this)('/activity?filter[action]=comment&filter[collection]=' + collection + '&filter[item]=' + id + '&fields=' + defaultFields + '&sort=' + sort + '&meta=filter_count&limit=50');
	}

	static save(id, collection, comment, commentId) {

		const data = { item: id, collection, comment };

		if (commentId) {
			return Server.patch.bind(this)('/activity/comment/' + commentId + '?fields=' + defaultFields, data);
		} else {
			return Server.post.bind(this)('/activity/comment?fields' + defaultFields, data);
		}
	}

	static delete(id) {

		return Server.delete.bind(this)('/activity/comment/' + id);
	}
}
