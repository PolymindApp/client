import User from "./models/User";

const globalVariables = {
	user: new User(),
	isMobile: false,
	error: null,
	languages: [],
	breadcrumbs: [],
	isLoading: false,
	isSaved: false,
	copiedToClipboard: false,
	isDeleted: false,
	toolbarOptions: [],
	toolbarContextual: {
		component: false
	},
	shortcuts: {
		visible: false,
	},
	help: {
		visible: false,
	},
};

export default globalVariables;
