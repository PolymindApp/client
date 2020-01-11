import Server from '../utils/Server';

export default class StrategyService {

	static getAll() {
		return Server.get.bind(this)('/items/strategy');
	}

	static getAllMine() {
		return Server.get.bind(this)('/items/strategy?filter[created_by]=' + this.$root.user.id);
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
}
