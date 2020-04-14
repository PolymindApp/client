export default class Model {

	constructor(props = {}) {
		Object.assign(this, props);
	}

	setDefaultValues(defaultValues, props) {

		function enforceProperties(context, structure, props) {

			const structureKeys = Object.keys(structure);
			structureKeys.forEach(key => {

				const structureValue = structure[key];
				const propsValue = props instanceof Object ? props[key] : props;

				context[key] = propsValue;

				if (propsValue === undefined || (structureValue instanceof Object && !(propsValue instanceof Object))) {
					context[key] = structureValue;
				}

				if (!Array.isArray(structureValue) && structureValue instanceof Object) {
					context[key] = {};
					enforceProperties(context[key], structureValue, propsValue);
				}
			});
		}

		enforceProperties(this, defaultValues, props)
	}

	flat(includeNulls = true, includeArray = false) {

		const result = {};
		const keys = Object.keys(this);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const value = this[key];

			if (Array.isArray(value) && !includeArray) {
				continue;
			} else if (value === null && !includeNulls) {
				continue;
			} else if (value instanceof Object && value.id !== undefined) {
				result[key] = value.id;
			} else {
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
