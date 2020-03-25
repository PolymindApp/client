const $thumbnails = {};

$thumbnails.install = function (Vue, options) {

	Vue.prototype.$thumbnails = (filename, key) => {
		return process.env.VUE_APP_API_URL + '/polymind/assets/' + filename + '?key=' + key;
	};
}

export default $thumbnails;
