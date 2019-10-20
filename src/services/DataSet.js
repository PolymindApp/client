import Server from '../utils/Server';

export default class DataSetService {

	static getAll() {
		return Server.get.bind(this)('/dataset');
	}

	static get(id) {
		return Server.get.bind(this)('/dataset/' + id);
	}

	static save(id, data) {

		if (id) {
			return Server.put.bind(this)('/dataset/' + id, data);
		} else {
			return Server.post.bind(this)('/dataset', data);
		}
	}

	static remove(id) {
		return Server.delete.bind(this)('/dataset/' + id);
	}
}
