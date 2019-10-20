import Server from "../utils/Server";

export default class FileService {

	static upload(files = []) {

		if (!(files instanceof Array)) {
			files = [files];
		}

		let form = new FormData();
		files.forEach(file => {
			form.append('file', file);
		});

		return Server.post.bind(this)('/file', form);
	}
}
