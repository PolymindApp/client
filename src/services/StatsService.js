import Server from '../utils/Server';

export default class StatsService {

	static process(queue = []) {

		const promises = [];

		queue.forEach(item => {

			if (item.action === 'APP_LOADED') {
				item.meta = {
					navigator: {
						appCodeName: navigator.appCodeName,
						appName: navigator.appName,
						appVersion: navigator.appVersion,
						platform: navigator.platform,
						language: navigator.language,
						languages: navigator.languages,
						userAgent: navigator.userAgent,
					},
					screen: {
						availWidth: window.screen.availWidth,
						availHeight: window.screen.availHeight,
						width: window.screen.width,
						height: window.screen.height,
						colorDepth: window.screen.colorDepth,
						pixelDepth: window.screen.pixelDepth,
						availLeft: window.screen.availLeft,
						availTop: window.screen.availTop,
						orientation: {
							angle: window.screen.orientation.angle,
							type: window.screen.orientation.type,
						},
					},
				}
			}

			promises.push(Server.post.bind(this)('/items/stats', {
				action: item.action,
				meta: item.meta,
				user_date: item.date,
			}));
		});

		return Promise.all(promises);
	}
}
