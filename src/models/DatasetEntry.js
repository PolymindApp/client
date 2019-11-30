export default class DatasetEntry {

	constructor() {

		Object.assign(this, {
			dataset_column_id: null,
			value_boolean: null,
			value_date: null,
			value_int: null,
			value_relation_dataset: null,
			value_relation_id: null,
			value_text: null,
			file: [],
		});
	}
}
