import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify);

const userPrefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

export default new Vuetify({
	theme: {
        dark: localStorage.getItem('dark') === null ? userPrefersDarkMode : localStorage.getItem('dark') === 'true',
		options: {
			customProperties: true,
		},
		themes: {
			light: {
				background: '#EEE',
				surface: '#DDD',
				discreet: '#888',
				primary: '#1B8E8A',
				selected: '#0f726f',
				secondary: '#FF7383',
				third: '#F9BE6C',
				accent: '#82B1FF',
				error: '#FF7383',
				info: '#2196F3',
				success: '#1B8E8A',
				warning: '#F9BE6C'
			},
			dark: {
				background: '#333',
                surface: '#444',
                discreet: '#888',
				primary: '#1B8E8A',
                selected: '#0f726f',
				secondary: '#FF7383',
				third: '#F9BE6C',
				accent: '#82B1FF',
				error: '#FF7383',
				info: '#2196F3',
				success: '#1B8E8A',
				warning: '#F9BE6C'
			},
		},
	},
});
