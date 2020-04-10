import Hash from "./Hash";

const $shortcuts = {};

$shortcuts.install = function (Vue, options) {

	Vue.prototype.$shortcuts = {

		list: {},
		callbacks: {},
		rootElement: null,

		attachEvent: function(event) {

			let keys = [];
			if (event.ctrlKey) {
				keys.push('ControlLeft');
			}
			if (event.altKey) {
				keys.push('AltLeft');
			}

			if (keys.indexOf(event.code) === -1) {
				keys.push(event.code);
			}

			return this.run(keys, event);
		},

		attach: function(rootElement) {
			this.rootElement = rootElement;
			this.rootElement.addEventListener('keydown', this.attachEvent.bind(this));
		},

		detach: function() {

			if (!this.rootElement) {
				return;
			}

			this.rootElement.removeEventListener('keydown', this.attachEvent.bind(this));
		},

		keysToString: function(keys) {

			return keys.sort().join('+');
		},

		// TODO: Parameter to accept INPUT/TEXTAREA/CONTENTEDITABLE
		add: function(name, desc, group, keys, callback = () => {}, includeFields = false, includeInHelp = true) {

			let originalKeys = keys;

			let arrKeys = keys;
			if (!(arrKeys instanceof Array)) {
				arrKeys = [arrKeys];
			}

			let keysStr = this.keysToString(arrKeys);

			if (!this.list[keysStr]) {
				this.list[keysStr] = [];
			}

			this.list[keysStr].push({name, keys, desc, group, originalKeys, callback, includeFields, includeInHelp});

			let callbackRef = Hash.guid();
			this.callbacks[callbackRef] = {
				keys: arrKeys,
				index: this.list[keysStr].length - 1
			};
			// Object.getPrototypeOf(callback).__zmShortcutReference = callbackRef;
			callback.__zmShortcutReference = callbackRef;
		},

		remove: function(callback = () => {}) {

			// let proto = Object.getPrototypeOf(callback);
			// let ref = proto.__zmShortcutReference;
			let ref = callback.__zmShortcutReference;
			if (!ref) {
				return;
			}

			let info = this.callbacks[ref];
			if (info) {

				if (!(info.keys instanceof Array)) {
					info.keys = [info.keys];
				}

				let keyStr = this.keysToString(info.keys);
				if (this.list[keyStr]) {
					this.list[keyStr].splice(info.index, 1);
					delete this.callbacks[ref];
				}
			}
		},

		run: function(keys, event) {

			// let inputTags = ['INPUT', 'TEXTAREA'];
			let target = event.target;
			let tagName = target.tagName.toUpperCase();
			// let isInInput = inputTags.indexOf(tagName) !== -1
			// 	|| target.getAttribute('contenteditable') !== null;

			let keyStr = this.keysToString(keys);

			if (!this.list[keyStr] || this.list[keyStr].length === 0) {
				return;
			}

			this.list[keyStr].forEach(shortcut => {

				// if (!shortcut.includeFields && !event.altKey) {// && isInInput) {
				// 	return;
				// }

				shortcut.callback(event);
			});

			return;
		},
	};
};

export default $shortcuts;
