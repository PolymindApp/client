import Server from '../utils/Server';

export default class StrategyService {

	static getAll() {
		return Server.get.bind(this)('/strategy');
	}

	static get(id) {
		return Server.get.bind(this)('/strategy/' + id);
	}

	static save(id, data) {

		if (id) {
			return Server.put.bind(this)('/strategy/' + id, data);
		} else {
			return Server.post.bind(this)('/strategy', data);
		}
	}

	static remove(id) {
		return Server.delete.bind(this)('/strategy/' + id);
	}
}
