import { User } from "@polymind/sdk-js";

const globalVariables = {
	user: new User(),
	isMobile: false,
	error: null,
	languages: [],
	breadcrumbs: [],
	datasets: [],
	components: [],
	strategies: [],
	isLoading: false,
	isSaved: false,
	copiedToClipboard: false,
	isDeleted: false,
	shortcuts: {
		visible: false,
	},
	help: {
		visible: false,
	},
};

export default globalVariables;
