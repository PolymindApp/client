<template>
	<v-menu transition="slide-y-transition" bottom>
		<template v-slot:activator="{ on: menu }">
			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn v-on="{ ...tooltip, ...menu }" :disabled="$root.languages.length === 0" v-bind="$attrs">
						<v-icon left>mdi-earth</v-icon>
						<span v-if="hideLang !== true">
							<span v-if="!isLoading">{{ getSelectedLang() }}</span>
							<span v-else>
								<v-icon class="mdi-spin">mdi-loading</v-icon>
							</span>
						</span>
						<v-icon right>mdi-chevron-down</v-icon>
					</v-btn>
				</template>
				<span>{{$t('toolbar.tooltip.langs')}}</span>
			</v-tooltip>
		</template>
		<v-list>
			<v-list-item v-for="(lang, i) in $root.languages" :key="i" @click="switchLang(lang.abbreviation)">
				<v-list-item-title>{{ lang.origin_title }}</v-list-item-title>
			</v-list-item>
		</v-list>
	</v-menu>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';
import LanguageService from "../services/LanguageService";

export default Vue.extend({
	name: 'LanguageSwitcher',
	props: ['value', 'full', 'autoApply', 'hideLang'],

	mounted() {

		if (this.$root.languages.length === 0) {
		    this.isLoading = true;
		    LanguageService.getAll.bind(this)().then(languages => {
				this.isLoading = false;
				this.$root.languages = this.$root.languages.concat(languages.data);
			});
		}
	},

	methods: {

		getSelectedLang() {
			const lang = this.$root.languages.find(lang => lang.abbreviation === this.value);

			if (lang) {
				return this.full !== null ? lang.origin_title : lang.abbreviation;
			}

			return null;
		},

		switchLang(lang) {

			if (this.autoApply !== false) {
				this.applyLang(lang);
			}

			this.$emit('input', lang);
		},

		applyLang(lang) {
			localStorage.setItem('lang', lang);
			this.$i18n.locale = lang;
			moment.locale(lang);
			const event = new Event('resize');
			window.dispatchEvent(event);
		}
	},

	data() {
		return {
		    lang: this.value || this.$i18n.locale,
			isLoading: false,
		};
	},

	watch: {
	    value: function(val) {
	        this.lang = val || this.$i18n.locale;
	        this.switchLang(this.lang);
		},
	}
});
</script>
