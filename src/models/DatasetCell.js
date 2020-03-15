import User from "./User";
import moment from "moment";
import Hash from "../utils/Hash";
import Model from "./Model";

export default class DatasetCell extends Model {

	constructor(props = {}) {

		super({});

		this.setDefaultValues({
			id: null,
			guid: Hash.guid(),
			dataset_column: null,
			dataset_row: null,
			text: null,
			json: null,
			boolean: null,
			localisation: null,
			number: null,
			time: null,
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
