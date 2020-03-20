import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
	options: {
		customProperties: true, // Enabling customProperties will also generate a css variable for each theme color, which you can then use in your components' blocks.
	},
	icons: {
		iconfont: 'mdi',
	},
	theme: {
		themes: {
			light: {
				primary: '#1B8E8A',
				secondary: '#FF7383',
				third: '#F9BE6C',
				// accent: '#8c9eff',
				// error: '#b71c1c',
			},
		},
	},
});
