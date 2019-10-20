import Server from "../utils/Server";

export default class HistoryService {

	static fromUser(id) {
		return Server.get.bind(this)('/history/user/' + id);
	}
}
