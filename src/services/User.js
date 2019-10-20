import Server from "../utils/Server";

export default class UserService {

	static me(lookup, token) {
		return Server.get.bind(this)('/user/me');
	}

	static get(id) {
		return Server.get.bind(this)('/user/' + id);
	}

	static login(email, password) {
		return Server.post.bind(this)('/auth/login', {
			email: email,
			password: password,
		});
	}

	static register(email, password) {
		return Server.post.bind(this)('/user', {
			email: email,
			password: password,
		});
	}

	static forgotPassword(email) {
		return Server.post.bind(this)('/user/forgot-password', {
			email: email,
		});
	}

	static resetPassword(lookup, token, password, confirmation) {
		return Server.post.bind(this)('/user/reset-password/' + lookup + '/' + token, {
			password: password,
			confirmation: confirmation,
		});
	}

	static verifyResetPasswordToken(lookup, token) {
		return Server.get.bind(this)('/user/reset-password/verify/' + lookup + '/' + token);
	}

	static activate(lookup, token) {
		return Server.get.bind(this)('/user/activate/' + lookup + '/' + token);
	}

	static resendActivation(lookup) {
		return Server.get.bind(this)('/user/resend-activation/' + lookup);
	}

	static resendActivationLost(email) {
		return Server.post.bind(this)('/user/resend-activation-lost', {
			email: email
		});
	}

	static setPassword(userId, actual, password, confirmation) {
		return Server.post.bind(this)('/user/' + userId + '/set-password', {
			actual: actual,
			password: password,
			confirmation: confirmation,
		});
	}

	static update(id, data) {
		return Server.put.bind(this)('/user/' + id, data);
	}
}
