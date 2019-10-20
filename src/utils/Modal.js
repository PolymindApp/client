const $modal = {};

$modal.install = function (Vue, options) {

	Vue.prototype.$modal = {

		data: {
			visible: false,
			options: {},
		},
		defaultOptions: {
			type: 'default',
			title: 'Untitled',
			desc: 'No description',
		},

		show: function (options = {}) {
			options = Object.assign({}, this.defaultOptions, options);
			this.data.options = options;
			this.data.visible = true;
		}
	};
}

export default $modal;
