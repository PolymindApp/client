import Model from "./Model";

export default class ComponentFunction extends Model {

	constructor(props) {

		super({});

		this.setDefaultValues({
			name: '',
		}, props);
	}
}
