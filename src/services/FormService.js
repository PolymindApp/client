import Server from "../utils/Server";

export default class FormService {

	static send(type, data) {
		return Server.post.bind(this)('/items/form', {
			type,
			content: data,
		});
	}
}
