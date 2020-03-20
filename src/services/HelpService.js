import Server from "../utils/Server";

export default class HelpService {

	static getAll() {
		return Server.get.bind(this)('/items/documentation', {
			filter: {
				'language.abbreviation': this.$i18n.locale,
			}
		});
	}
}
