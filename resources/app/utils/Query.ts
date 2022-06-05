export default class Query {

	static prefix: string|undefined = process.env.API_URL || '/api';

	static doCall(path: string, method = 'GET', body?: any, params?: any, blob = false): Promise<any> {
		const headers: any = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		};
		const token = localStorage.getItem('token');
		if (token) {
			headers['Authorization'] = 'Bearer ' + token;
		}
		const lang = localStorage.getItem('lang');
		if (lang) {
			headers['x-lang'] = lang;
		}
        const formattedParams: Array<string> = [];
        if (params) {
            Object.keys(params).forEach(key => {
                formattedParams.push(key + '=' + params[key]);
            });
        }
		return fetch(this.prefix + path + (formattedParams.length > 0 ? '?' + formattedParams.join('&') : ''), {
			method,
			cache: 'no-cache',
			credentials: "same-origin",
			headers,
			body
		})
			.then(response => {
                if (blob) {
                    return response.blob();
                }
				return response.json().then(json => {
					if (response.status < 200 || response.status > 299) {
						let error = new Error();
						error = { ...error, ...json };
						throw error;
					}
					return json;
				});
			});
	}

	static get(path: string, params?: any): Promise<any> {
		return this.doCall(path, 'GET', null, params);
	}

	static post(path: string, data: any = {}, params?: any, blob = false): Promise<any> {
		return this.doCall(path, 'POST', JSON.stringify(data), params, blob);
	}

	static put(path: string, data: any = {}, params?: any): Promise<any> {
		return this.doCall(path, 'PUT', JSON.stringify(data));
	}

	static delete(path: string, data: any = {}, params?: any): Promise<any> {
		return this.doCall(path, 'DELETE', JSON.stringify(data));
	}
}
