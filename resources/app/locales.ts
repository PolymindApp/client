import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enCA from '../lang/en-CA.json';
import zhCN from '../lang/zh-CN.json';
import hiIN from '../lang/hi-IN.json';
import esMX from '../lang/es-MX.json';
import arEG from '../lang/ar-EG.json';
import frCA from '../lang/fr-CA.json';
import ruRU from '../lang/ru-RU.json';
import ptPT from '../lang/pt-PT.json';
import urPK from '../lang/ur-PK.json';

Vue.use(VueI18n);

const messages: any = {
	'en-CA': enCA,
	'zh-CN': zhCN,
	'hi-IN': hiIN,
	'es-MX': esMX,
	'ar-EG': arEG,
	'fr-CA': frCA,
	'ru-RU': ruRU,
	'pt-PT': ptPT,
	'ur-PK': urPK,
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

const rtlLanguages = [
    'ar-EG',
    'ur-PK',
];

export {
    rtlLanguages
}

export default i18n;
