export default class Form {

	static applyErrors(fields: any = {}, formErrors?: any): any {
		const items: any = {};
		for(const key in fields) {
			if (fields[key] instanceof Array) {
				fields[key].forEach((field: string) => {
					items[key] = fields[key];
				});
			} else {
				items[key] = fields[key];
			}
		}

		const keys = Object.keys(fields);
		if (formErrors) {
			keys.forEach(key => {
				formErrors[key] = fields[key];
			});
		}

		return items;
	}
}
