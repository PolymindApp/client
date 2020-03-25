import Server from '../utils/Server';

const defaultFields = '*,created_by.*,created_by.avatar.private_hash';

export default class DocumentService {

	static getAll() {
		return Server.get.bind(this)('/items/document?fields=' + defaultFields);
	}

	static getAllMine() {
		return Server.get.bind(this)('/items/document?filter[created_by]=' + this.$root.user.id + '&fields=' + defaultFields);
	}

	static getByUser(userId) {
		return Server.get.bind(this)('/items/document?fields=' + defaultFields + '&filter[created_by]=' + userId);
	}

	static countByUser(userId) {
		return Server.get.bind(this)('/items/document?filter[created_by]=' + userId + '&meta=filter_count&limit=0');
	}

	static get(id, revisionOffset) {
		return Server.get.bind(this)('/items/document/' + id + (revisionOffset !== undefined ? '/revisions/' + revisionOffset : '') + '?fields=' + defaultFields);
	}

	static getRevisions(id) {
		return Server.get.bind(this)('/items/document/' + id + '/revisions?limit=25');
	}

	static fork(revisionId) {
		return Server.post.bind(this)('/custom/document/fork/' + revisionId);
	}

	static save(id, data) {

		if (id) {
			return Server.patch.bind(this)('/items/document/' + id, data);
		} else {
			return Server.post.bind(this)('/items/document', data);
		}
	}

	static remove(id) {
		return Server.delete.bind(this)('/items/document/' + id);
	}
}
