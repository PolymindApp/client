import Model from "./Model";

export default class Transaction extends Model {

	constructor(props = {}) {

		super({});

		this.setDefaultValues({
			guid: null,
			id: null,
			action: null,
			collection: null,
			data: null,
		}, props);
	}
}
