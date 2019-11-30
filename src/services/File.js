import Server from "../utils/Server";

export default class FileService {

	static getAll() {
		return Server.get.bind(this)('/file');
	}

	static upload(files = [], onProgress = () => {}) {
		return Server.upload.bind(this)(files);
	}
}
