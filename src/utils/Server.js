import Model from "../models/Model";

export default class Server {

	static get(url, params) {

		return Server.prepare.bind(this)('GET', url, params);
	}

	static post(url, data, modelize = true) {

		if (modelize) {
			data = new Model(data).flat(false);
		}

		return Server.prepare.bind(this)('POST', url, undefined, data);
	}

	static put(url, data, modelize = true) {

		if (modelize) {
			data = new Model(data).flat(false);
		}

		return Server.prepare.bind(this)('PUT', url, undefined, data);
	}

	static patch(url, data, modelize = true) {

		if (modelize) {
			data = new Model(data).flat(false);
		}

		return Server.prepare.bind(this)('PATCH', url, undefined, data);
	}

	static delete(url, params, modelize = true) {

		return Server.prepare.bind(this)('DELETE', url, params);
	}

	static upload(files = [], onProgress = () => {}, modelize = true) {

		if (!(files instanceof Array)) {
			files = [files];
		}

		let form = new FormData();
		files.forEach(file => {
			form.append('file', file);
		});

		return this.$server.uploadFiles(form, onProgress);
	}

	static prepare(method, url, params, data) {

		return this.$server.request(method, url, params, data)
			.catch(error => {

				switch (error.code) {
					case 3:
					case 401:
						if (!this.$server.loggedIn) {
							localStorage.setItem('redirect_uri', this.$route.fullPath);
							localStorage.setItem('lockedUser', JSON.stringify(this.$root.user));
							return this.$router.push('/locked'); // Return necessary to avoid popups
						}
						break;
				}

				return Promise.reject(error);
			});
	}
}
