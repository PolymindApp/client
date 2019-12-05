import Server from '../utils/Server';

const defaultFields = '*,created_by.*,created_by.avatar.filename';

export default class ComponentService {

	static getAll() {
		return Server.get.bind(this)('/items/component?fields=' + defaultFields);
	}

	static get(id, revisionOffset) {
		return Server.get.bind(this)('/items/component/' + id + (revisionOffset !== undefined ? '/revisions/' + revisionOffset : '') + '?fields=' + defaultFields);
	}

	static getRevisions(id) {
		return Server.get.bind(this)('/items/component/' + id + '/revisions?limit=25');
	}

	static save(id, data) {

		if (id) {
			return Server.patch.bind(this)('/items/component/' + id, data);
		} else {
			return Server.post.bind(this)('/items/component', data);
		}
	}

	static remove(id) {
		return Server.delete.bind(this)('/items/component/' + id);
	}
}
