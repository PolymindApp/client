import Server from '../utils/Server';

export default class LikeService {

	static toggle(activityId, positive = true) {
		return Server.post.bind(this)('/custom/like/toggle/' + activityId + '/' + (positive ? 1 : -1));
	}
}
