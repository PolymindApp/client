import Model from "./Model";

export default class Component extends Model {

	constructor(props) {

		super(props);

		this.setDefaultValues({
			name: '',
			description: '<p></p>',
			instructions: '<p></p>',
			is_invisible: false,
			is_private: false,
			icon: '',
			html: '',
			js: '',
			scss: '',
			hooks: [],
			parameters: [],
			functions: [],
			tests: [],
		}, props);
	}
}
