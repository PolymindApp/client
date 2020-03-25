import Vue from 'vue';
import Modal from './utils/Modal';
import Help from './utils/Help';
import Shortcuts from './utils/Shortcuts';
import Thumbnails from './utils/Thumbnails';
import Crop from './utils/Crop';
import Error from './utils/Error';
import Comments from './utils/Comments';

Vue.use(Modal);
Vue.use(Crop);
Vue.use(Help);
Vue.use(Comments);
Vue.use(Error);
Vue.use(Shortcuts);
Vue.use(Thumbnails);

Vue.prototype.$deepClone = function(obj) {
	return JSON.parse(JSON.stringify(obj));
};

const sounds = {
	send: new Audio('https://polymind.s3.ca-central-1.amazonaws.com/assets/client/sounds/send.mp3'),
	notification: new Audio('https://polymind.s3.ca-central-1.amazonaws.com/assets/client/sounds/notification.mp3'),
};
Vue.prototype.$playSound = function(name) {
	sounds[name].play();
};
