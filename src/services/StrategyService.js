import Server from '../utils/Server';

const defaultFields = '*,created_by.*,created_by.avatar.private_hash';

export default class StrategyService {

	static getAll() {
		return Server.get.bind(this)('/items/strategy');
	}

	static getAllMine() {
		return Server.get.bind(this)('/items/strategy?filter[created_by]=' + this.$root.user.id + '&fields=' + defaultFields);
	}

	static get(id, revisionOffset) {
		return Server.get.bind(this)('/items/strategy/' + id + (revisionOffset !== undefined ? '/revisions/' + revisionOffset : ''));
	}

	static getRevisions(id) {
		return Server.get.bind(this)('/items/strategy/' + id + '/revisions?limit=25&fields=*,activity.action_by.first_name,activity.action_by.last_name,activity.action_by.screen_name,activity.action_by.avatar.private_hash');
	}

	static save(id, data) {

		if (id) {
			return Server.put.bind(this)('/items/strategy/' + id, data);
		} else {
			return Server.post.bind(this)('/items/strategy', data);
		}
	}

	static remove(id) {
		return Server.delete.bind(this)('/items/strategy/' + id);
	}

	static restore(id) {
		return Server.patch.bind(this)('/items/strategy/' + id, {
			status: 'draft'
		});
	}
}
