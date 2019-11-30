import Server from '../utils/Server';

export default class ComponentService {

	static getAll() {
		return Server.get.bind(this)('/items/component');
	}

	static get(id) {
		return Server.get.bind(this)('/items/component/' + id);
	}

	static save(id, data) {

		if (id) {
			return Server.put.bind(this)('/items/component/' + id, data);
		} else {
			return Server.post.bind(this)('/items/component', data);
		}
	}

	static remove(id) {
		return Server.delete.bind(this)('/items/component/' + id);
	}
}
