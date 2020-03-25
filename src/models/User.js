import Model from "./Model";

export default class User extends Model {

	constructor(props) {

		super({});

		this.setDefaultValues({
			id: null,
			email: null,
			first_name: '',
			last_name: '',
			biography: null,
			quote: null,
			gender: null,
			screen_name: null,
			last_access_on: null,
			locale: null,
			avatar: null,
			wallpaper: null,
			role: {
				name: '',
			},
			isOnline: false,
			settings: {
				sidebar: {
					fixed: false,
					strategies: true,
					components: true,
					dataset: true,
					document: false
				},
				theme: "light",
				newNotificationSound: true,
				newMessageSound: true,
				externalMsg: "public",
				development: {
					theme: "dark",
					fontSize: 16,
					tabSize: 4,
					showLines: true,
					autoUpdate: false,
				},
			}
		}, props);
	}
}
