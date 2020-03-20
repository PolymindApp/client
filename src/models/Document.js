import Model from "./Model";

export default class Document extends Model {

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
		}, props);
	}
}
