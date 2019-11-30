export default class File {

	static toBase64(file) {

		return new Promise((resolve, reject) => {

			let reader = new FileReader();
			reader.onload = (event) => {
				resolve(event);
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	static base64toBlob(base64, mimeType) {

		let data = base64.split(',')[1];
		return new Blob([window.atob(data)], {
			type: mimeType.type,
		});
	}

	static getChecksum(file) {

		return new Promise((resolve, reject) => {

			this.toBase64(file).then((event) => {
				let string = event.target.result;

				let index;
				let checksum = 0x12345678;

				for (index = 0; index < string.length; index++) {
					checksum += (string.charCodeAt(index) * (index + 1));
				}

				resolve(checksum);
			}).catch(reject);
		});
	}

	static downloadAs(mimeType, fileName, content) {

		let data = 'data:' + mimeType.type + 'charset=utf-8,' + content;
		data = encodeURI(data);

		let link = document.createElement('a');
		link.setAttribute('href', data);
		link.setAttribute('download', fileName);
		link.style = 'display: none';
		link.click();
		link.remove();
	}

	static getFilenameFromUrl(url) {
		return url.substring(url.lastIndexOf('/') + 1);
	}

	static promptFileDialog(callback = () => {}, accept, multiple = false) {

		let input = document.createElement('input');
		input.type = 'file';
		input.style = 'display: none';
		input.accept = accept;

		if (multiple) {
			input.multiple = true;
		}

		document.body.appendChild(input);
		input.click();

		input.onchange = (event) => {

			let files = Array.from(event.target.files);
			input.remove();

			callback(files);
		};
	}
}
