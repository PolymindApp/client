import Model from "./Model";

export default class ComponentHook extends Model {

	constructor(props) {

		super({});

		this.setDefaultValues({
			name: '',
			defaultValue: '',
		}, props);
	}
}
