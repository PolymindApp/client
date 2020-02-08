import User from "./User";
import moment from "moment";
import Hash from "../utils/Hash";

export default class DatasetRow {

	constructor(props = {}) {

		Object.assign(this, {
			id: null,
			guid: Hash.guid(),
			status: "published",
			sort: null,
			created_by: new User(),
			created_on: moment().format('YYYY-MM-DD HH:mm:ss'),
			modified_by: null,
			modified_on: null,
			dataset: null,
			cells: [],
		}, props);
	}
}
