const $help = {};

$help.install = function (Vue) {

	Vue.prototype.$help = {

		items: [],

		add: function(key, title, type, component, parent) {

			let newItem = { key, name: title, type, component };

			if (type === 'cat') {
				newItem.children = [];
			}

			if (parent) {
				const parents = parent.split('.');
				const lastItems = this.items;
				for (let i = 0; i < parents.length; i++) {
					const curParent = parents[i];
					lastItems.filter(item => {
						if (item.key === curParent && i === parents.length - 1) {
							item.children.push(newItem);
						}
					});
				}
			} else {
				this.items.push(newItem);
			}
		}
	}
};

export default $help;
