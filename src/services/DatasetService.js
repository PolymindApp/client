import Server from '../utils/Server';

export default class DatasetService {

	static getAll() {
		return Server.get.bind(this)('/items/dataset');
	}

	static get(id) {
		return Server.get.bind(this)('/items/dataset/' + id);
	}

	static save(id, data) {

		data.datasetColumn.forEach(row => {
			row.dataset_id = data.id;
		});

		data.datasetRow.forEach(row => {
			row.dataset_id = data.id;
			row.datasetEntry.forEach(entry => {
				entry.dataset_id = data.id;
			});
		});

		if (id) {
			return Server.put.bind(this)('/dataset/' + id, data);
		} else {
			return Server.post.bind(this)('/dataset', data);
		}
	}

	static remove(id) {
		return Server.delete.bind(this)('/dataset/' + id);
	}
}
