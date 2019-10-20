import Server from '../utils/Server';

export default class ComponentService {

	static getAll() {
		return Server.get.bind(this)('/component');
	}

	static get(id) {
		return Server.get.bind(this)('/component/' + id);
	}

	static save(id, data) {

		if (id) {
			return Server.put.bind(this)('/component/' + id, data);
		} else {
			return Server.post.bind(this)('/component', data);
		}
	}

	static remove(id) {
		return Server.delete.bind(this)('/component/' + id);
	}
}
