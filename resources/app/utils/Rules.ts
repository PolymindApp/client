export default class Rules {
	static required(value: Array<any>|string = ''): boolean {
		return (Array.isArray(value) && value.length > 0) || (typeof value === 'string' && !!value);
	}

	static email(value = ''): boolean {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(value).toLowerCase());
	}

	static min(min = 8, value = ''): boolean {
		return (value && value.length >= min) || false;
	}

	static max(min = 16, value = ''): boolean {
		return (value && value.length <= min) || false;
	}

	static identical(value = '', compare = ''): boolean {
		return value === compare;
	}
}
