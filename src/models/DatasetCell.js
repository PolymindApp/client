import User from "./User";
import moment from "moment";
import Hash from "../utils/Hash";

export default class DatasetCell {

	constructor(props = {}) {

		Object.assign(this, {
			id: null,
			guid: Hash.guid(),
			text: null,
			json: null,
			boolean: false,
			localisation: null,
			number: null,
			dataset_row: null,
			time: null,
			dataset_column: null,
			created_by: new User(),
			date: null,
			created_on: moment().format('YYYY-MM-DD HH:mm:ss'),
			datetime: null,
			modified_by: null,
			wysiwyg: null,
			modified_on: null,
			file: null,
		}, props);
	}
}
