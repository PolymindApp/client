import Server from '../utils/Server';

export default class AuthService {

	static login(email, password) {

		return Server.post.bind(this)('/user/login', {
			email: email,
			password: password
		});
	}

	static register(email, password) {

		return Server.post.bind(this)('/user', {
			email: email,
			password: password
		});
	}
}
