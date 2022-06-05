export default class Hash {

	/**
	 * GUID generator
	 */
	static s4(): string {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1)
	}

	static guid(limit = 16): string {
		let result = ''
		while (result.length < limit) {
			result += this.s4()
		}
		return result.substring(0, limit)
	}
}
