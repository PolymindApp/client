import Vue from 'vue';
import moment from 'moment';

Vue.filter('currency', (value) => {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

Vue.filter('timeAgo', (value) => {
	return moment(value).fromNow();
});

Vue.filter('date', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
	return moment(value).format(format);
});

Vue.filter('userScreenName', (user) => {
	return user.screen_name || (user.first_name + ' ' + user.last_name).trim();
});

Vue.filter('plainExcerpt', (value, limit = 250) => {

	let tmp = document.createElement('div');
	tmp.innerHTML = value;
	let excerpt = (tmp.textContent || tmp.innerText || "");

	if (excerpt.length > limit) {
		return excerpt.substring(0, limit) + '...';
	}

	return excerpt;
});
