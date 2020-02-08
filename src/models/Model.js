export default class Model {

	constructor(props = {}) {

		Object.assign(this, props);
	}

	flat(includeNulls = true) {

		const result = {};
		const keys = Object.keys(this);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const value = this[key];
			if (value instanceof Object) {
				result[key] = value.id;
			} else if (includeNulls || value !== null) {
				result[key] = value;
			}
		}

		// Remove default values
		delete result['created_by'];
		delete result['created_on'];
		delete result['modified_by'];
		delete result['modified_on'];

		return result;
	}
}
