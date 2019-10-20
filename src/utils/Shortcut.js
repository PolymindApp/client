import Hash from "./Hash";

export default class Shortcut {

	constructor() {
		this.list = {};
		this.callbacks = {};
		this.rootElement = null;
	}

	attachEvent(event) {
		let inputTags = ['INPUT', 'TEXTAREA'];
		let target = event.target;
		let tagName = target.tagName.toUpperCase();

		let isInInput = inputTags.indexOf(tagName) !== -1
			|| target.getAttribute('contenteditable') !== null;

		if (!event.altKey && isInInput) {
			return;
		}

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
	}

	attach(rootElement) {
		this.rootElement = rootElement;
		this.rootElement.addEventListener('keydown', this.attachEvent.bind(this));
	}

	detach() {

		if (!this.rootElement) {
			return;
		}

		this.rootElement.removeEventListener('keydown', this.attachEvent.bind(this));
	}

	keysToString(keys) {

		return keys.sort().join('+');
	}

	add(name, keys, callback = () => {}) {

		let originalKeys = keys;

		let arrKeys = keys;
		if (!(arrKeys instanceof Array)) {
			arrKeys = [arrKeys];
		}

		let keysStr = this.keysToString(arrKeys);

		if (!this.list[keysStr]) {
			this.list[keysStr] = [];
		}

		this.list[keysStr].push({
			name: name,
			keys: keys,
			originalKeys: originalKeys,
			callback: callback
		});

		let callbackRef = Hash.guid();
		this.callbacks[callbackRef] = {
			keys: arrKeys,
			index: this.list[keysStr].length - 1
		};
		Object.getPrototypeOf(callback).__zmShortcutReference = callbackRef;
	}

	remove(callback = () => {}) {

		let proto = Object.getPrototypeOf(callback);
		let ref = proto.__zmShortcutReference;
		if (!ref) {
			return;
		}

		let info = this.callbacks[ref];
		if (info) {
			let keyStr = this.keysToString([info.keys]);
			this.list[keyStr].splice(info.index, 1);
			delete this.callbacks[ref];
		}
	}

	run(keys, event) {

		let keyStr = this.keysToString(keys);

		if (!this.list[keyStr]) {
			return;
		}

		this.list[keyStr].forEach(shortcut => {
			shortcut.callback(event);
		});

		event.preventDefault();

		return false;
	}
}
