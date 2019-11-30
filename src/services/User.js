import Server from "../utils/Server";

export default class UserService {

	static me(lookup, token) {
		return Server.get.bind(this)('/users/me?fields=*,avatar.filename,wallpaper.filename,role.name,language.language_id.english_title,language.language_id.id,language.id');
	}

	static get(id) {
		return Server.get.bind(this)('/users/' + id + '?fields=*,avatar.filename,wallpaper.filename,role.name,language.language_id.english_title,language.language_id.id,language.id');
	}

	static login(email, password) {

		return this.$server.login({email, password});
		// return Server.post.bind(this)('/auth/authenticate', {
		// 	email: email,
		// 	password: password,
		// });
	}

	static logout() {

		return new Promise((resolve, reject) => {
			this.$server.logout();
			resolve();
		});
	}

	static register(email, password) {
		return Server.post.bind(this)('/users', {
			email: email,
			password: password,
		});
	}

	static forgotPassword(email) {
		return Server.post.bind(this)('/users/forgot-password', {
			email: email,
		});
	}

	static resetPassword(lookup, token, password, confirmation) {
		return Server.post.bind(this)('/users/reset-password/' + lookup + '/' + token, {
			password: password,
			confirmation: confirmation,
		});
	}

	static verifyResetPasswordToken(lookup, token) {
		return Server.get.bind(this)('/users/reset-password/verify/' + lookup + '/' + token);
	}

	static activate(lookup, token) {
		return Server.get.bind(this)('/users/activate/' + lookup + '/' + token);
	}

	static resendActivation(lookup) {
		return Server.get.bind(this)('/users/resend-activation/' + lookup);
	}

	static resendActivationLost(email) {
		return Server.post.bind(this)('/users/resend-activation-lost', {
			email: email
		});
	}

	static setPassword(email, actual, password, confirmation) {
		return Server.post.bind(this)('/custom/set-password', {
			email: email,
			actual: actual,
			password: password
		});
	}

	static update(id, data) {
		return Server.patch.bind(this)('/users/' + id + '?fields=*,avatar.filename,wallpaper.filename,role.name,language.language_id.english_title,language.language_id.id,language.id', data);
	}
}
