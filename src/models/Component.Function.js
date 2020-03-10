import Model from "./Model";

export default class ComponentFunction extends Model {

	constructor(props) {

		super(props);

		this.setDefaultValues({
			name: '',
		}, props);
	}
}
