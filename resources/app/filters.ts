import Vue from 'vue';
import moment from 'moment';

Vue.filter('moment', (date: any, format: string) => {
    return moment(date).format(format);
});

Vue.filter('humanDate', (date: any) => {
    const m = moment(date);
    if (moment().subtract(1, 'week') > m) {
        return m.format('YYYY-MM-DD HH:mm:ss');
    }
    return m.fromNow();
});
