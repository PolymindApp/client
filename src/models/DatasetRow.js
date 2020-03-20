import User from "./User";
import moment from "moment";
import Hash from "../utils/Hash";
import Model from "./Model";
import DatasetCell from "./DatasetCell";

export default class DatasetRow extends Model {

	constructor(props = {}) {

		super({});

		this.setDefaultValues({
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

		this.cells = this.cells.map(cell => new DatasetCell(cell));
	}
}
