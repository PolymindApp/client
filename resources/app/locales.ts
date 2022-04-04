import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enCA from '../lang/en-CA.json';
import frCA from '../lang/fr-CA.json';
import esMX from '../lang/es-MX.json';

Vue.use(VueI18n);

const messages: any = {
	'en-CA': enCA,
	'fr-CA': frCA,
	'es-MX': esMX,
};

let lang = localStorage.getItem('lang');
if (!lang) {
    const navLang = navigator.language.substring(0, 2);
    const availableLanguages = Object.keys(messages).map(lang => lang.substring(0, 2));
    const index = availableLanguages.indexOf(navLang);
    if (index === -1) {
        lang = 'en-CA';
    } else {
        lang = Object.keys(messages)[index];
    }
} else if (Object.keys(messages).indexOf(lang) === -1) {
    lang = 'en-CA';
}

const i18n = new VueI18n({
	locale: lang,
	fallbackLocale: 'en-CA',
	messages,
});

export default i18n;
