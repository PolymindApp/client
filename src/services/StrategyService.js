import Server from '../utils/Server';

const defaultFields = '*,created_by.*,created_by.avatar.filename';

export default class StrategyService {

	static getAll() {
		return Server.get.bind(this)('/items/strategy');
	}

	static getAllMine() {
		return Server.get.bind(this)('/items/strategy?filter[created_by]=' + this.$root.user.id + '&fields=' + defaultFields);
	}

	static get(id) {
		return Server.get.bind(this)('/items/strategy/' + id);
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
