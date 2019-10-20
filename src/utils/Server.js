import RestError from './RestError';

export default class Server {

	static get(url) {

		return Server.prepare.bind(this)('GET', url);
	}

	static post(url, data) {

		return Server.prepare.bind(this)('POST', url, data);
	}

	static put(url, data) {

		return Server.prepare.bind(this)('PUT', url, data);
	}

	static delete(url) {

		return Server.prepare.bind(this)('DELETE', url);
	}

	static prepare(method, url, data) {

		const jwt = localStorage.getItem('jwt');
		const headers = new Headers();

		if (jwt) {
			headers.append('Authorization', jwt);
		}

		let params = {
			method: method,
			headers: headers,
		};

		if (data instanceof FormData) {
			params.body = data;
		} else if (data) {
			headers.append('Content-Type', 'application/json');
			params.body = JSON.stringify(data);
		}

		return fetch(process.env.VUE_APP_API_URL + url, params).then(response => {
			let clonedRes = response.clone();
			return clonedRes.json().catch(error => {
				return response.text().then(data => {
					return Promise.reject(new RestError(clonedRes, data));
				});
			}).then(data => {
				if (response.status >= 200 && response.status < 300) {
					return data;
				}

				return Promise.reject(new RestError(response, data));
			});
		})
			.catch(error => {

				if (typeof error === 'string') {
					return Promise.reject(error);
				}

				if (error.data && error.data.message) {
					switch (error.data.message) {
					case 'SESSION_TOKEN_EXPIRED':
						localStorage.removeItem('jwt');
						this.$router.go(0);
						break;
					}
				}

				if (process.env.NODE_ENV === 'development') {
					console.error(error);
				}

				return Promise.reject(error);
			});
	}
}
