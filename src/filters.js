import Vue from 'vue';
import moment from 'moment';

Vue.filter('currency', (value) => {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

Vue.filter('timeAgo', (value) => {
	return moment.utc(value).local().fromNow();
});

Vue.filter('daysFromToday', (value) => {
	const a = moment();
	const b = moment(value);
	return a.diff(b, 'days');
});

Vue.filter('activityColor', (value) => {
	switch(value.action) {
		case 'comment': return 'blue'; break;
		case 'create': return 'green'; break;
		case 'update': return 'orange'; break;
		case 'delete': return 'red'; break;
		case 'soft-delete': return 'red'; break;
	}
});

Vue.filter('activityIcon', (value) => {
	switch(value.action) {
		case 'comment': return 'mdi-comment-text-outline'; break;
		case 'create': return 'mdi-plus-circle-outline'; break;
		case 'update': return 'mdi-update'; break;
		case 'delete': return 'mdi-window-close'; break;
		case 'soft-delete': return 'mdi-window-close'; break;
	}
});

Vue.filter('monthName', (value) => {
	return moment().set('month', value).format('MMM');
});

Vue.filter('weekdayName', (value) => {
	return moment().set('day', value).format('dd');
});

Vue.filter('date', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
	return moment.utc(value).local().format(format);
});

Vue.filter('userScreenName', (user) => {
	return user.screen_name || (user.first_name + ' ' + user.last_name).trim();
});

Vue.filter('humanNumber', (number, separator = ',') => {
	const parts = number.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
	return parts.join(".");
});

Vue.filter('shortcutKey', (key) => {
	return key.replace('Key', '')
	    .replace('Digit', '')
	    .replace('ControlLeft', 'Ctrl')
	    .replace('ControlRight', 'Ctrl')
	    .replace('AltLeft', 'Alt')
		.toUpperCase();
});

Vue.filter('plainExcerpt', (value, limit = 250) => {

	let tmp = document.createElement('div');
	tmp.innerText = value;
	let excerpt = (tmp.textContent || tmp.innerText || "");

	if (excerpt.length > limit) {
		return excerpt.substring(0, limit) + '...';
	}

	return excerpt;
});
