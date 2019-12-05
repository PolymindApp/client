import Vue from 'vue';
import objectAssignDeep from 'object-assign-deep';
import Modal from './utils/Modal';
import Help from './utils/Help';
import Shortcuts from './utils/Shortcuts';
import Thumbnails from './utils/Thumbnails';
import Crop from './utils/Crop';
import Error from './utils/Error';
import Comments from './utils/Comments';
import sendSound from './assets/sounds/send.mp3';

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

Vue.prototype.$playSound = function(name) {

	switch(name) {
		case 'send': new Audio(sendSound).play(); break;
	}
};
