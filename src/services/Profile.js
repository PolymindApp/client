import Server from "../utils/Server";

export default class ProfileService {

	static update(id, data) {
		return Server.put.bind(this)('/profile/' + id, data);
	}
}
