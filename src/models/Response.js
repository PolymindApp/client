import Model from "./Model";

export default class Response extends Model {

	constructor(props) {

		super({});

		this.setDefaultValues({
			data: [],
			meta: {
				filter_count: 0,
				total_count: 0,
			}
		});
	}
}
