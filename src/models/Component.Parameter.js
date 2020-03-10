import Model from "./Model";

export default class ComponentParameter extends Model {

	constructor(props) {

		super(props);

		this.setDefaultValues({
			name: '',
			value: null,
		}, props);
	}
}
