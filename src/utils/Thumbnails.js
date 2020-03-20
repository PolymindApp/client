const $thumbnails = {};

$thumbnails.install = function (Vue, options) {

	Vue.prototype.$thumbnails = (filename, width, height, quality = 'better', action = 'crop') => {
		return process.env.VUE_APP_API_URL + '/thumbnail/polymind/' + width + '/' + height + '/' + action + '/' + quality + '/' + filename;
	};
}

export default $thumbnails;
