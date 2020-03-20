import Model from "./Model";

export default class ComponentTest extends Model {

	constructor(props) {

		super({});

		this.setDefaultValues({
			name: '',
			js: '',
		}, props);
	}
}
