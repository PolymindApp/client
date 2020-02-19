import Server from '../utils/Server';
import Model from "../models/Model";
import CommentService from "./CommentService";
import HistoryService from "./HistoryService";

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

	static get(id, includeData = false, revisionOffset) {

		let suffix = '';
		if (includeData) {
			suffix += '?fields=*,rows.*,columns.*,rows.cells.*,rows.created_by.*,rows.created_by.avatar.filename';
		}

		return Server.get.bind(this)('/items/dataset/' + id + (revisionOffset !== undefined ? '/revisions/' + revisionOffset : '') + suffix);
	}

	static getRevisions(id) {
		return Server.get.bind(this)('/items/dataset/' + id + '/revisions?limit=25');
	}

	static fork(revisionId) {
		return Server.post.bind(this)('/custom/dataset/fork/' + revisionId);
	}

	static save(id, dataset, transactions = []) {

		const promises = [];

		if (id) {
			const datasetClone = new Model(dataset).flat(false);
			delete datasetClone.columns;
			delete datasetClone.rows;

			promises.push(Server.patch.bind(this)('/items/dataset/' + id, datasetClone));
			promises.push(Server.post.bind(this)('/custom/transaction/run', transactions));
		} else {
			promises.push(Server.post.bind(this)('/items/dataset', dataset));
		}

		return Promise.all(promises);
	}

	static remove(id) {
		return Server.delete.bind(this)('/items/dataset/' + id);
	}
}
