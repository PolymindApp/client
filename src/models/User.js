import Model from "./Model";

export default class User extends Model {

	constructor(props) {

		super(props);

		this.setDefaultValues({
			first_name: '',
			last_name: '',
			avatar: null,
			wallpaper: null,
			role: {
				name: ''
			},
			isOnline: false,
		}, props);
	}
}
