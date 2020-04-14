import Server from '../utils/Server';
import Model from "../models/Model";
import CommentService from "./CommentService";
import HistoryService from "./HistoryService";

const defaultFields = '*,created_by.*,created_by.avatar.private_hash';

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
			suffix += '?fields=*,rows.*,columns.*,rows.cells.*,rows.created_by.*,rows.created_by.avatar.private_hash';
		}

		return Server.get.bind(this)('/items/dataset/' + id + (revisionOffset !== undefined ? '/revisions/' + revisionOffset : '') + suffix);
	}

	static getRevisions(id) {
		return Server.get.bind(this)('/items/dataset/' + id + '/revisions?limit=25&fields=*,activity.action_by.first_name,activity.action_by.last_name,activity.action_by.screen_name,activity.action_by.avatar.private_hash');
	}

	static fork(revisionId) {
		return Server.post.bind(this)('/custom/dataset/fork/' + revisionId);
	}

	static save(id, dataset, transactions = []) {

		const promises = [];
		// const datasetClone = new Model(this.$deepClone(dataset)).flat(false, true);

		// delete datasetClone.columns;
		// delete datasetClone.rows;

		transactions = transactions.map(transaction => transaction.flat());

		// promises.push(Server.patch.bind(this)('/items/dataset' + (id ? '/' + id : ''), datasetClone));

		if (transactions.length > 0) {
			promises.push(Server.post.bind(this)('/custom/transaction/run', transactions, false));
		}

		// if (id) {
		//
		// 	delete datasetClone.columns;
		// 	delete datasetClone.rows;
		//
		// 	transactions = transactions.map(transaction => transaction.flat());
		//
		// 	promises.push(Server.patch.bind(this)('/items/dataset/' + id, datasetClone));
		//
		// 	if (transactions.length > 0) {
		// 		promises.push(Server.post.bind(this)('/custom/transaction/run', transactions, false));
		// 	}
		// } else {
		//
		// 	for (let i = 0; i < datasetClone.columns.length; i++) {
		// 		datasetClone.columns[i] = new Model(datasetClone.columns[i]).flat(false, true);
		// 	}
		//
		// 	for (let i = 0; i < datasetClone.rows.length; i++) {
		// 		datasetClone.rows[i] = new Model(datasetClone.rows[i]).flat(false, true);
		// 		for (let y = 0; y < datasetClone.rows[i].cells.length; y++) {
		// 			datasetClone.rows[i].cells[y] = new Model(datasetClone.rows[i].cells[y]).flat(false, true);
		// 		}
		// 	}
		//
		// 	promises.push(Server.post.bind(this)('/items/dataset', datasetClone, false));
		// }

		return Promise.all(promises);
	}

	static remove(id) {
		return Server.delete.bind(this)('/items/dataset/' + id);
	}
}
