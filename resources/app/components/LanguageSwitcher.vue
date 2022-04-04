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
				'd-flex align-center text-no-wrap': true,
				'caption': dense,
			}">
				<v-icon :x-small="dense" left>mdi-translate</v-icon>
                <template v-if="!iconOnly">
                    <span v-if="abbreviation" v-text="item.text.toUpperCase()"></span>
                    <span v-else v-text="$i18n.t('language.' + item.text)"></span>
                </template>
			</div>
		</template>
		<template #item="{ item }">
			<span v-text="$i18n.t('language.' + item.text)"></span>
		</template>
	</v-select>
</template>

<script>
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
			text: lang,
		}));
	},
}
</script>

<style lang="scss" scoped>
.v-text-field ::v-deep > .v-input__control > .v-input__slot:before {
	border: 0 !important;
}
</style>
