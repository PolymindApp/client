import User from "./User";
import moment from "moment";
import Hash from "../utils/Hash";

export default class DatasetColumn {

	constructor(props = {}) {

		Object.assign(this, {
			id: null,
			guid: Hash.guid(),
			name: "Name",
			type: "text",
			is_required: true,
			sort: null,
			dataset: null,
			created_by: new User(),
			created_on: moment().format('YYYY-MM-DD HH:mm:ss'),
			modified_by: new User(),
			modified_on: null,
		}, props);
	}
}
