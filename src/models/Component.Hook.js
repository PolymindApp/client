import Model from "./Model";

export default class ComponentHook extends Model {

	constructor(props) {

		super(props);

		this.setDefaultValues({
			name: '',
			defaultValue: '',
		}, props);
	}
}
