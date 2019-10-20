export default class User {

	constructor() {

		Object.assign(this, {
			profile: {
				screen_name: '',
				picture: {
					url: false
				},
				wallpaper: {
					url: false
				}
			},
			roles: [
				{ name: '' }
			]
		});
	}
}
