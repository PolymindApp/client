import Server from "../utils/Server";

export default class UserService {

	static me(lookup, token) {
		return Server.get.bind(this)('/users/me?fields=*,avatar.private_hash,wallpaper.private_hash,role.name,language.language_id.english_title,language.language_id.id,language.id');
	}

	static get(id) {
		return Server.get.bind(this)('/users/' + id + '?fields=*,avatar.private_hash,wallpaper.private_hash,role.name,language.language_id.english_title,language.language_id.id,language.id,last_access_on');
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
		return Server.post.bind(this)('/custom/register', {
			email: email,
			password: password,
		});
	}

	static forgotPassword(email) {
		return Server.post.bind(this)('/custom/reset-password', {
			email: email,
		});
	}

	static resetPassword(token, password) {
		return Server.post.bind(this)('/auth/password/reset', {
			password: password,
			token: token,
		});
	}

	static verifyResetPasswordToken(token) {
		return Server.get.bind(this)('/custom/verify-token/' + token);
	}

	static activate(token) {
		return Server.get.bind(this)('/custom/activate-user/' + token);
	}

	static resendActivation(lookup) {
		return Server.get.bind(this)('/custom/resend-activation/' + lookup);
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
		return Server.patch.bind(this)('/users/' + id + '?fields=*,avatar.private_hash,wallpaper.private_hash,role.name,language.language_id.english_title,language.language_id.id,language.id', data);
	}
}
