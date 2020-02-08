import Server from '../utils/Server';

export default class TransactionService {

	static run(transactions = []) {
		return Server.post.bind(this)('/custom/transaction/run', transactions);
	}
}
