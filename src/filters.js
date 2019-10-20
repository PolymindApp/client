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
