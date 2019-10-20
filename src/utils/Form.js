export default class Form {

	static applyErrors(vue, fields = {}, refs = {}) {

		let items = {};
		for(let key in fields) {

			if (fields[key] instanceof Array) {
				fields[key].forEach(field => {
					items[key] = fields[key] = vue.$t('form.validation.' + field);
				});
			} else {
				items[key] = fields[key] = vue.$t('form.validation.' + fields[key]);
			}
		}

		let keys = Object.keys(fields);
		if (refs[keys[0]]) {
			refs[keys[0]].focus();
		}

		return items;
	}
}
