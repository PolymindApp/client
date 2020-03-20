const $help = {};

$help.install = function (Vue) {

	Vue.prototype.$help = {

		$vue: null,
		items: [],

		setVueRef(ref) {
			this.$vue = ref;
		},

		setCompRef(ref) {
			this.$comp = ref;
		},

		open(slug) {
			this.$vue.$root.help.visible = true;
			this.$comp.open(slug);
		},

		inject(group, item, list = this.items) {

			if (group.substring(0, 1) === '/') {
				group = group.substring(1);
			}

			const splitGroup = group.split('/');
			const section = splitGroup[0];
			if (group === '') {
				return list.push(item);
			}

			let found = list.find(item => item.group === section);
			if (!found) {
				list.push({
					key: section,
					group: section,
					name: section,
					type: 'cat',
					children: [],
				});

				found = list.find(item => item.group === section);
			}

			return this.inject(group.substring(section.length + 1, group.length), item, found.children);
		},

		add: function(group, slug, title, content, type = 'doc') {

			const item = { key: slug, slug, name: title, type, content };
			this.inject(group, item);
		}
	}
};

export default $help;
