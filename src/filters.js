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

Vue.filter('iconName', (iconName) => {
	const name = iconName.substring(4).replace(/-/gim, ' ');
	// return name.charAt(0).toUpperCase() + name.slice(1);
	return name;
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

Vue.filter('plainExcerpt', (value, limit = 250, stripTags = true) => {

	let tmp = document.createElement('div');
	tmp.innerText = value;
	let excerpt = (tmp.textContent || tmp.innerText || "");

	if (stripTags) {
		const tmp = document.createElement("DIV");
		tmp.innerHTML = excerpt;
		excerpt = tmp.textContent || tmp.innerText || "";
	}

	if (excerpt.length > limit) {
		return excerpt.substring(0, limit) + '...';
	}

	return excerpt;
});

Vue.filter('buildColor', (state) => {
	switch (state) {
		case 'completed': return 'success';
		case 'failed': return 'error';
		case 'running': return 'grey';
	}
	return null;
});

Vue.filter('buildIcon', (state) => {
	switch (state) {
		case 'completed': return 'mdi-check';
		case 'failed': return 'mdi-close';
		case 'running': return 'mdi-loading mdi-spin';
	}
	return null;
});
