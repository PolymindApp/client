import Server from "../utils/Server";

export default class FormService {

	static send(type, data) {
		return Server.post.bind(this)('/form/' + type + '?lang=' + this.$i18n.locale, data);
	}
}
