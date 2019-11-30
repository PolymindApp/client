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

		// const jwt = localStorage.getItem('jwt');
		// const headers = new Headers();

		// if (jwt) {
		// 	headers.append('Authorization', jwt);
		// }

		// let params = {
		// 	method: method,
		// 	headers: headers,
		// };
		//
		// if (data instanceof FormData) {
		// 	params.body = data;
		// } else if (data) {
		// 	headers.append('Content-Type', 'application/json');
		// 	params.body = JSON.stringify(data);
		// }

		//request(method, endpoint, params = {}, data = {}, noProject = false, headers = {})
		return this.$server.request(method, url, params, data);


		// return fetch(process.env.VUE_APP_API_URL + url, params).then(response => {
		// 	let clonedRes = response.clone();
		// 	return clonedRes.json().catch(error => {
		// 		return response.text().then(data => {
		// 			return Promise.reject(new RestError(clonedRes, data));
		// 		});
		// 	}).then(data => {
		// 		if (response.status >= 200 && response.status < 300) {
		// 			return data;
		// 		}
		//
		// 		return Promise.reject(new RestError(response, data));
		// 	});
		// })
		// 	.catch(error => {
		//
		// 		if (typeof error === 'string') {
		// 			return Promise.reject(error);
		// 		}
		//
		// 		if (error.data && error.data.message) {
		// 			switch (error.data.message) {
		// 			case 'SESSION_TOKEN_EXPIRED':
		// 				localStorage.removeItem('jwt');
		// 				this.$router.go(0);
		// 				break;
		// 			}
		// 		}
		//
		// 		if (process.env.NODE_ENV === 'development') {
		// 			console.error(error);
		// 		}
		//
		// 		return Promise.reject(error);
		// 	});
	}
}
