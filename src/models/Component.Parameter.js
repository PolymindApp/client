import Model from "./Model";

export default class ComponentParameter extends Model {

	constructor(props) {

		super({});

		this.setDefaultValues({
			name: '',
			value: null,
		}, props);
	}
}
