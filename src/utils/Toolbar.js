class Toolbar {

	constructor(Vue) {

		this.storeVM = new Vue({
			data() {
				return {
					hasItem: false,
					ref: null,
					props: {},
					listeners: {},
				};
			},
		});
	}

	get state() {
		return this.storeVM.$data;
	}

	setContextual(ref, props = {}, listeners = {}) {
		this.state.ref = ref;
		this.state.props = props;
		this.state.listeners = listeners;
		this.state.hasItem = true;
	}

	clear() {
		this.state.ref = null;
		this.state.props = {};
		this.state.listeners = {};
		this.state.hasItem = false;
	}
}

export default {

	install: (Vue) => {
		Vue.prototype.$toolbar = new Toolbar(
			Vue
		);
	},
};
