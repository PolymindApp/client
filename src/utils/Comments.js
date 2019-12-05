const $comments = {};

$comments.install = function (Vue) {

	Vue.prototype.$comments = {

		setRef(ref) {
			Object.assign(this, ref);
		},
	}
};

export default $comments;
