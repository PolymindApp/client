export default class Transaction {

	constructor(props = {}) {

		Object.assign(this, {
			// guid: null,
			action: null,
			collection: null,
			// data
			// id
		}, props);
	}
}
