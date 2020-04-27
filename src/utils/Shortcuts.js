import { Hash, Shortcuts } from "@polymind/sdk-js";

const $shortcuts = {};

$shortcuts.install = function (Vue, options) {
	Vue.prototype.$shortcuts = new Shortcuts();
};

export default $shortcuts;
