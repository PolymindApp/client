import Server from '../utils/Server';
import moment from 'moment';

export default class ActivityService {

	static getLatestCommits(userId) {
		return Server.get.bind(this)('/activity?fields=action_on&filter[action_by]=' + userId + '&limit=2500&filter[collection][in]=component,strategy,dataset,dataset_column,dataset_row');
	}

	static getCommitsByDate(userId, date) {
		return Server.get.bind(this)('/custom/activity?filter[action_by]=' + userId + '&filter[action_on][between]=' + moment(date).utc().format() + ',' + moment(date).add(1, 'day').utc().format() + '&limit=100&filter[collection][in]=component,strategy,dataset,dataset_column,dataset_row&page_fields=id,title,slug&component_fields=id,name,description&documentation_fields=id,title,slug&meta=filter_count&sort=-id');
	}
}
