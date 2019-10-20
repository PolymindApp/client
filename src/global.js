import User from "./models/User";

const globalVariables = {
	user: new User(),
	error: null,
	languages: [],
	breadcrumbs: [],
	isLoading: false,
	isSaved: false,
	isDeleted: false,
	toolbarOptions: [],
	toolbarContextual: {
		component: false
	},
};

export default globalVariables;
