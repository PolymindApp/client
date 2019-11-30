import objectAssignDeep from 'object-assign-deep';

export default class User {

	constructor(props) {

		objectAssignDeep(this, {
			first_name: '',
			last_name: '',
			avatar: null,
			wallpaper: null,
			role: {
				name: ''
			},
		}, props);
	}
}
