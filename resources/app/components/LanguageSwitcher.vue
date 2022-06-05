<template>
	<v-select
		v-model="_value"
		:items="items"
		:dense="dense"
		v-bind="$attrs"
		v-on="$listeners"
	>
		<template #selection="{ item }">
			<div :class="{
				'd-flex align-center w-100 text-no-wrap': true,
				'caption': dense,
			}">
				<v-icon :x-small="dense" :left="!$vuetify.rtl" :right="$vuetify.rtl">mdi-translate</v-icon>
                <template v-if="!iconOnly">
                    <div v-if="abbreviation" v-text="item.text.toUpperCase()"></div>
                    <div v-else v-text="item.text"></div>
                </template>
			</div>
		</template>
		<template #item="{ item }">
			<span v-text="item.text"></span>
		</template>
	</v-select>
</template>

<script>
import languages from '@/assets/languages.json';
import { rtlLanguages } from "@/locales";

export default {
	name: "LanguageSwitcher",

	props: {
		value: {
			type: String,
			default: null
		},
		dense: {
			type: Boolean,
			default: false,
		},
		iconOnly: {
			type: Boolean,
			default: false,
		},
		abbreviation: {
			type: Boolean,
			default: false,
		},
	},

	data: () => ({
        rtlLanguages,
		items: [],
	}),

	computed: {
		_value: {
			get() {
				return this.value;
			},
			set(value) {
                localStorage.setItem('lang', value);
				this.$emit('input', value);
			},
		},
	},

	created() {
		this.items = this.$i18n.availableLocales.map(lang => ({
			value: lang,
			text: (languages.find(item => item.code === lang) || { native: lang }).native,
		}));
	},
}
</script>

<style lang="scss" scoped>
.v-text-field ::v-deep > .v-input__control > .v-input__slot:before {
	border: 0 !important;
}
</style>
