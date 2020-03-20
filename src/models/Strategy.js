import Model from "./Model";

export default class Strategy extends Model {

	constructor(props) {

		super({});

		this.setDefaultValues({
			id: null,
			name: '',
			description: '<p></p>',
			instructions: '<p></p>',
			is_invisible: false,
			is_private: false,
			icon: '',
			interface: {},
			workflow: {},
		}, props);
	}
}
