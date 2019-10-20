import Server from '../utils/Server';

export default class LanguageService {

	static getAll() {
		return Server.get.bind(this)('/language');
	}
}
