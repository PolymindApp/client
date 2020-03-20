import User from "./User";
import moment from "moment";
import Hash from "../utils/Hash";
import Model from "./Model";

export default class DatasetColumn extends Model {

	constructor(props = {}) {

		super({});

		this.setDefaultValues({
			id: null,
			guid: Hash.guid(),
			name: "Name",
			type: "text",
			is_required: false,
			sort: null,
			dataset: null,
			created_by: new User(),
			created_on: moment().format('YYYY-MM-DD HH:mm:ss'),
			modified_by: null,
			modified_on: null,
		}, props);
	}
}
