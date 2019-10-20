<template>
	<v-sheet color="transparent">
		<v-row>
			<v-col cols="12" sm="4">
				<v-text-field autofocus v-model="deck.name" :disabled="deck.isArchived" :label="$t('deck.details.name')" outlined />

				ACTIVATE SYNTHESIS VOZ
				<br />CARD HAS TWO-SIDES

				<v-autocomplete v-model="deck.defaultLangFront" :disabled="deck.isArchived" :label="$t('deck.details.defaultLangFront')" :items="languages" outlined />
				<v-autocomplete v-model="deck.defaultLangBack" :disabled="deck.isArchived" :label="$t('deck.details.defaultLangBack')" :items="languages" outlined />
				<IconListField height="200" v-model="deck.icon" :disabled="deck.isArchived" :label="$t('deck.details.icon')" outlined />
			</v-col>
			<v-col cols="12" sm="8">
				<HTMLEditorField :label="$t('deck.details.presentation')" v-model="deck.presentation" />
			</v-col>
		</v-row>
	</v-sheet>
</template>

<script>
import Vue from 'vue';
import IconListField from "../../../../components/IconListField";
import HTMLEditorField from "../../../../components/HTMLEditorField";
import CodeEditorField from "../../../../components/CodeEditorField";

export default Vue.extend({

	components: { IconListField, HTMLEditorField, CodeEditorField },

	props: {
	    deck: {
	        type: Object,
			default: {
			    name: ''
			}
		}
	},

	data: function() {
		return {
			editor: null,
			languages: [
				{ text: 'Abkhazian', value: 'ab', },
				{ text: 'Afar', value: 'aa', },
				{ text: 'Afrikaans', value: 'af', },
				{ text: 'Albanian', value: 'sq', },
				{ text: 'Amharic', value: 'am', },
				{ text: 'Arabic', value: 'ar', },
				{ text: 'Armenian', value: 'hy', },
				{ text: 'Assamese', value: 'as', },
				{ text: 'Aymara', value: 'ay', },
				{ text: 'Azerbaijani', value: 'az', },
				{ text: 'Bashkir', value: 'ba', },
				{ text: 'Basque', value: 'eu', },
				{ text: 'Bengali, Bangla', value: 'bn', },
				{ text: 'Bangla', value: 'bn', },
				{ text: 'Bhutani', value: 'dz', },
				{ text: 'Bihari', value: 'bh', },
				{ text: 'Bislama', value: 'bi', },
				{ text: 'Breton', value: 'br', },
				{ text: 'Bulgarian', value: 'bg', },
				{ text: 'Burmese', value: 'my', },
				{ text: 'Byelorussian', value: 'be', },
				{ text: 'Cambodian', value: 'km', },
				{ text: 'Catalan', value: 'ca', },
				{ text: 'Chinese', value: 'zh', },
				{ text: 'Corsican', value: 'co', },
				{ text: 'Croatian', value: 'hr', },
				{ text: 'Czech', value: 'cs', },
				{ text: 'Danish', value: 'da', },
				{ text: 'Dutch', value: 'nl', },
				{ text: 'English', value: 'en', },
				{ text: 'Esperanto', value: 'eo', },
				{ text: 'Estonian', value: 'et', },
				{ text: 'Faeroese', value: 'fo', },
				{ text: 'Fiji', value: 'fj', },
				{ text: 'Finnish', value: 'fi', },
				{ text: 'French', value: 'fr', },
				{ text: 'Frisian', value: 'fy', },
				{ text: 'Gaelic (Scots Gaelic)', value: 'gd', },
				{ text: 'Galician', value: 'gl', },
				{ text: 'Georgian', value: 'ka', },
				{ text: 'German', value: 'de', },
				{ text: 'Greek', value: 'el', },
				{ text: 'Greenlandic', value: 'kl', },
				{ text: 'Guarani', value: 'gn', },
				{ text: 'Gujarati', value: 'gu', },
				{ text: 'Hausa', value: 'ha', },
				{ text: 'Hebrew', value: 'iw', },
				{ text: 'Hindi', value: 'hi', },
				{ text: 'Hungarian', value: 'hu', },
				{ text: 'Icelandic', value: 'is', },
				{ text: 'Indonesian', value: 'in', },
				{ text: 'Interlingua', value: 'ia', },
				{ text: 'Interlingue', value: 'ie', },
				{ text: 'Inupiak', value: 'ik', },
				{ text: 'Irish', value: 'ga', },
				{ text: 'Italian', value: 'it', },
				{ text: 'Japanese', value: 'ja', },
				{ text: 'Javanese', value: 'jw', },
				{ text: 'Kannada', value: 'kn', },
				{ text: 'Kashmiri', value: 'ks', },
				{ text: 'Kazakh', value: 'kk', },
				{ text: 'Kinyarwanda', value: 'rw', },
				{ text: 'Kirghiz', value: 'ky', },
				{ text: 'Kirundi', value: 'rn', },
				{ text: 'Korean', value: 'ko', },
				{ text: 'Kurdish', value: 'ku', },
				{ text: 'Laothian', value: 'lo', },
				{ text: 'Latin', value: 'la', },
				{ text: 'Latvian, Lettish', value: 'lv', },
				{ text: 'Lingala', value: 'ln', },
				{ text: 'Lithuanian', value: 'lt', },
				{ text: 'Macedonian', value: 'mk', },
				{ text: 'Malagasy', value: 'mg', },
				{ text: 'Malay', value: 'ms', },
				{ text: 'Malayalam', value: 'ml', },
				{ text: 'Maltese', value: 'mt', },
				{ text: 'Maori', value: 'mi', },
				{ text: 'Marathi', value: 'mr', },
				{ text: 'Moldavian', value: 'mo', },
				{ text: 'Mongolian', value: 'mn', },
				{ text: 'Nauru', value: 'na', },
				{ text: 'Nepali', value: 'ne', },
				{ text: 'Norwegian', value: 'no', },
				{ text: 'Occitan', value: 'oc', },
				{ text: 'Oriya', value: 'or', },
				{ text: 'Oromo, Afan', value: 'om', },
				{ text: 'Pashto, Pushto', value: 'ps', },
				{ text: 'Persian', value: 'fa', },
				{ text: 'Polish', value: 'pl', },
				{ text: 'Portuguese', value: 'pt', },
				{ text: 'Punjabi', value: 'pa', },
				{ text: 'Quechua', value: 'qu', },
				{ text: 'Rhaeto-Romance', value: 'rm', },
				{ text: 'Romanian', value: 'ro', },
				{ text: 'Russian', value: 'ru', },
				{ text: 'Samoan', value: 'sm', },
				{ text: 'Sangro', value: 'sg', },
				{ text: 'Sanskrit', value: 'sa', },
				{ text: 'Serbian', value: 'sr', },
				{ text: 'Serbo-Croatian', value: 'sh', },
				{ text: 'Sesotho', value: 'st', },
				{ text: 'Setswana', value: 'tn', },
				{ text: 'Shona', value: 'sn', },
				{ text: 'Sindhi', value: 'sd', },
				{ text: 'Singhalese', value: 'si', },
				{ text: 'Siswati', value: 'ss', },
				{ text: 'Slovak', value: 'sk', },
				{ text: 'Slovenian', value: 'sl', },
				{ text: 'Somali', value: 'so', },
				{ text: 'Spanish', value: 'es', },
				{ text: 'Sudanese', value: 'su', },
				{ text: 'Swahili', value: 'sw', },
				{ text: 'Swedish', value: 'sv', },
				{ text: 'Tagalog', value: 'tl', },
				{ text: 'Tajik', value: 'tg', },
				{ text: 'Tamil', value: 'ta', },
				{ text: 'Tatar', value: 'tt', },
				{ text: 'Tegulu', value: 'te', },
				{ text: 'Thai', value: 'th', },
				{ text: 'Tibetan', value: 'bo', },
				{ text: 'Tigrinya', value: 'ti', },
				{ text: 'Tonga', value: 'to', },
				{ text: 'Tsonga', value: 'ts', },
				{ text: 'Turkish', value: 'tr', },
				{ text: 'Turkmen', value: 'tk', },
				{ text: 'Twi', value: 'tw', },
				{ text: 'Ukrainian', value: 'uk', },
				{ text: 'Urdu', value: 'ur', },
				{ text: 'Uzbek', value: 'uz', },
				{ text: 'Vietnamese', value: 'vi', },
				{ text: 'Volapuk', value: 'vo', },
				{ text: 'Welsh', value: 'cy', },
				{ text: 'Wolof', value: 'wo', },
				{ text: 'Xhosa', value: 'xh', },
				{ text: 'Yiddish', value: 'ji', },
				{ text: 'Yoruba', value: 'yo', },
				{ text: 'Zulu', value: 'zu', },
			],
		}
	},
});
</script>
