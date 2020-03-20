export default class RestError {

	constructor(vm, error, options) {

		if (typeof error === 'string') {
			this.title = vm.$t('error.code500');
			this.desc = '<pre>' + error + '</pre>';
		} else if (typeof error.code === 'number') {
			this.title = vm.$t('error.codeX', { code: error.code });
			this.desc = '<pre>' + error.message + '</pre>';
		} else if (error.message instanceof Array) {
			this.title = vm.$t('error.code500');
			this.desc = '<pre>' + JSON.stringify(error.message, null, 2).trim() + '</pre>';
		} else {
			this.title = error.message.toLowerCase();

			if (error.trace) {
				this.desc = '<pre>' + JSON.stringify(error.trace, null, 2).trim() + '</pre>';
			} else {
				this.desc = error.message.toLowerCase();
			}
		}

		this.options = options;
	}
}
