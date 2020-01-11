export default class Response {

	constructor() {

		Object.assign(this, {
			data: [],
			meta: {
				filter_count: 0,
				total_count: 0,
			}
		});
	}
}
