import BaseModel from "@/models/BaseModel";

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

        if (Array.isArray(body)) {
            const newBody = [];
            for (let i = 0; i < body.length; i++) {
                newBody[i] = body[i] instanceof BaseModel
                    ? body[i].toSaveObject()
                    : body[i]
            }
            body = newBody;
        }
        if (body instanceof BaseModel) {
            body = body.toSaveObject();
        }
        if (body) {
            body = JSON.stringify(body);
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
		return this.doCall(path, 'POST', data, params, blob);
	}

	static put(path: string, data: any = {}, params?: any): Promise<any> {
		return this.doCall(path, 'PUT', data);
	}

	static delete(path: string, data: any = {}, params?: any): Promise<any> {
		return this.doCall(path, 'DELETE', data);
	}
}
