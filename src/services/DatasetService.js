import Server from '../utils/Server';

const defaultFields = '*,created_by.*,created_by.avatar.filename';

export default class DatasetService {

	static getAll() {
		return Server.get.bind(this)('/items/dataset');
	}

	static getColumns(datasetId) {
		return Server.get.bind(this)('/items/dataset_column?filter[dataset]=' + datasetId);
	}

	static getRows(datasetId) {
		return Server.get.bind(this)('/items/dataset_row?filter[dataset]=' + datasetId);
	}

	static getAllMine() {
		return Server.get.bind(this)('/items/dataset?filter[created_by]=' + this.$root.user.id + '&fields=' + defaultFields);
	}

	static get(id, includeData = false) {

		let suffix = '';
		if (includeData) {
			suffix += '?fields=*,rows.*,columns.*,rows.cells.*,rows.created_by.*,rows.created_by.avatar.filename';
		}

		return Server.get.bind(this)('/items/dataset/' + id + suffix);
	}

	static save(id, data) {

		// data.columns.forEach(row => {
		// 	row.dataset_id = data.id;
		// });
		//
		// data.rows.forEach(row => {
		// 	row.dataset_id = data.id;
		// 	row.cells.forEach(entry => {
		// 		entry.dataset_id = data.id;
		// 	});
		// });

		if (id) {
			return Server.patch.bind(this)('/items/dataset/' + id, data);
		} else {
			return Server.post.bind(this)('/items/dataset', data);
		}
	}

	static remove(id) {
		return Server.delete.bind(this)('/items/dataset/' + id);
	}
}
