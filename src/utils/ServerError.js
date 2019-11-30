export default class RestError {

	constructor(vm, error, options) {

		if (typeof error === 'string') {
			this.title = vm.$t('error.code500');
			this.desc = '<pre>' + error + '</pre>';
		} else if (typeof error.code === 'number') {
			this.title = vm.$t('error.code' + error.code);
			this.desc = '<pre>' + JSON.stringify(error.message, null, 2).trim() + '</pre>';
		} else if (error.data.message instanceof Array) {
			this.title = vm.$t('error.code500');
			this.desc = '<pre>' + JSON.stringify(error.data.message, null, 2).trim() + '</pre>';
		} else {
			this.title = vm.$t('error.' + error.data.message.toLowerCase() + '.title');

			if (error.data.trace) {
				this.desc = '<pre>' + JSON.stringify(error.data.trace, null, 2).trim() + '</pre>';
			} else {
				this.desc = vm.$t('error.' + error.data.message.toLowerCase() + '.desc');
			}
		}

		this.options = options;
	}
}
