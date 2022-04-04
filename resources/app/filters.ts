import Vue from 'vue';
import moment from 'moment';

Vue.filter('moment', (date: any, format: string) => {
    return moment(date).format(format);
});
