import Server from '../utils/Server';
import Model from "../models/Model";

const defaultFields = '*,created_by.*,created_by.avatar.filename';

export default class ComponentService {

	static getAll() {
		return Server.get.bind(this)('/items/component?fields=' + defaultFields);
	}

	static getAllMine() {
		return Server.get.bind(this)('/items/component?filter[created_by]=' + this.$root.user.id + '&fields=' + defaultFields);
	}

	static getByUser(userId) {
		return Server.get.bind(this)('/items/component?fields=' + defaultFields + '&filter[created_by]=' + userId);
	}

	static countByUser(userId) {
		return Server.get.bind(this)('/items/component?filter[created_by]=' + userId + '&meta=filter_count&limit=0');
	}

	static get(id, revisionOffset) {
		return Server.get.bind(this)('/items/component/' + id + (revisionOffset !== undefined ? '/revisions/' + revisionOffset : '') + '?fields=' + defaultFields);
	}

	static getRevisions(id) {
		return Server.get.bind(this)('/items/component/' + id + '/revisions?limit=25');
	}

	static fork(revisionId) {
		return Server.post.bind(this)('/custom/component/fork/' + revisionId);
	}

	static save(id, data) {

		if (id) {
			return Server.patch.bind(this)('/items/component/' + id, data);
		} else {
			return Server.post.bind(this)('/items/component', data);
		}
	}

	static remove(id) {
		return Server.patch.bind(this)('/items/component/' + id, {
			status: 'deleted'
		});
	}

	static restore(id) {
		return Server.patch.bind(this)('/items/component/' + id, {
			status: 'draft'
		});
	}
}
