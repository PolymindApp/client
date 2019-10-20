export default class RestError {

	constructor(response, data) {
		this.response = response;
		this.data = data;
		this.stack = new Error().stack;
	}
}
