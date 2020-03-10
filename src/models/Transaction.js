import Model from "./Model";

export default class Transaction extends Model {

	constructor(props = {}) {

		super(props);

		this.setDefaultValues({
			// guid: null,
			action: null,
			collection: null,
			// data
			// id
		}, props);
	}
}
