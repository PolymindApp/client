import RestError from './RestError';

export default class Server {

	static get(url, params) {

		return Server.prepare.bind(this)('GET', url, params);
	}

	static post(url, data) {

		return Server.prepare.bind(this)('POST', url, undefined, data);
	}

	static put(url, data) {

		return Server.prepare.bind(this)('PUT', url, undefined, data);
	}

	static patch(url, data) {

		return Server.prepare.bind(this)('PATCH', url, undefined, data);
	}

	static delete(url, params) {

		return Server.prepare.bind(this)('DELETE', url, params);
	}

	static upload(files = [], onProgress = () => {}) {

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
							return this.$router.go(0); // Return necessary to avoid popups
						}
						break;
				}

				return Promise.reject(error);
			});
	}
}
