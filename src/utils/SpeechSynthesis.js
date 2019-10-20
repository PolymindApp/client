import DefaultError from './Error';

export class SpeechSynthesisSettings {

	constructor(settings) {

		this.lang = 'en';
		this.onBeforeStart = () => {};
		this.onEnd = () => {};

		Object.assign(this, settings);
	}
}

export default class SpeechSynthesis {

	constructor(settings) {
		this.voices = [];
		this.instance = window.speechSynthesis;
		this.settings = new SpeechSynthesisSettings(settings);
	}

	init() {

		if (!SpeechSynthesis.isSupported()) {
			throw new DefaultError('SpeechSynthesis is not supported.');
		}

		let loadVoices = () => {
			this.voices = this.getVoices();
		};

		this.instance.onvoiceschanged = loadVoices;
		this.voices = this.getVoices();
	}

	static isSupported() {
		return 'speechSynthesis' in window;
	}

	getVoices() {
		return this.instance.getVoices();
	}

	getSettings() {
		return this.settings;
	}

	setSettings(settings) {
		this.settings = Object.assign({}, this.settings, settings);
	}

	resume() {
		this.instance.resume();
	}

	pause() {
		this.instance.pause();
	}

	cancel() {
		this.instance.cancel();
	}

	read(text, settings = this.settings) {

		let mergedSettings = new SpeechSynthesisSettings();
		Object.assign(mergedSettings, settings);

		// Create a new instance of SpeechSynthesisUtterance.
		var msg = new SpeechSynthesisUtterance();

		// Set the text.
		msg.text = text;

		// Set the attributes.
		msg.volume = 3;
		msg.rate = 1;
		msg.pitch = 1;

		if (this.voices.length === 0) {
			this.voices = this.getVoices();
		}

		// If a voice has been selected, find the voice and set the
		// utterance instance's voice attribute.
		let fallbackLanguages = [];
		let voiceByLang = this.voices.find(voice => {
			let voiceLang = voice.lang.toLowerCase().replace('-', '_');
			let settingLang = mergedSettings.lang.toLowerCase().replace('-', '_');

			if (voiceLang === settingLang) {
				return voice;
			}

			if (voice.lang.toLowerCase().substr(0, 2) === mergedSettings.lang.toLowerCase().substr(0, 2)) {
				fallbackLanguages.push(voice);
			}
		});

		if (voiceByLang) {
			msg.voice = voiceByLang;
			msg.lang = voiceByLang.lang;
		} else if (fallbackLanguages.length > 0) {
			msg.voice = fallbackLanguages[0];
			msg.lang = fallbackLanguages[0].lang;
		} else if (this.voices.length > 0) {
			msg.voice = this.voices[0];
			msg.lang = this.voices[0].lang;
		} else {
			msg.lang = settings.lang;
		}

		if (mergedSettings.onEnd) {
			msg.onend = mergedSettings.onEnd;
		}

		if (mergedSettings.onBeforeStart) {
			mergedSettings.onBeforeStart();
		}

		// CHEAT LOL:
		// http://translate.google.com/translate_tts?tl=en&q=hi&client=tw-ob
		// let sound = new Sound();
		// sound.register(text, 'https://translate.google.com/translate_tts?tl=' + settings.lang + '&q=' + encodeURIComponent(text) + '&client=tw-ob');
		// sound.play(text, 100, mergedSettings.onEnd);
		// return;

		// Queue this utterance.
		this.instance.cancel();
		this.instance.speak(msg);
	}
}
