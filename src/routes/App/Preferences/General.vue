<template>
	<div>
		<v-row class="align-center">
			<v-col cols="12" sm="3">
				<v-subheader>{{$t('preferences.general.lang')}}</v-subheader>
			</v-col>
			<v-col cols="12" sm="9">
				<LanguageSwitcher ref="langSwitch" v-model="user.language.abbreviation" :auto-apply="false" />
			</v-col>
		</v-row>
		<v-row class="align-center">
			<v-col cols="12" sm="3">
				<v-subheader>{{$t('preferences.general.manualLaterality')}}</v-subheader>
			</v-col>
			<v-col cols="12" sm="9">
				<v-select v-model="user.profile.manualLaterality" :items="manualLateralities"></v-select>
			</v-col>
		</v-row>
		<v-row class="align-center">
			<v-col cols="12" sm="3">
				<v-subheader>{{$t('preferences.general.deckMode')}}</v-subheader>
			</v-col>
			<v-col cols="12" sm="9">
				<v-select v-model="user.profile.deckMode" :items="deckModes"></v-select>
			</v-col>
		</v-row>
		<v-row class="align-center">
			<v-col cols="12" sm="3">
				<v-subheader>{{$t('preferences.general.sound')}}</v-subheader>
			</v-col>
			<v-col cols="12" sm="9">
				<v-switch color="primary" class="ma-0" v-model="user.profile.sound" hide-details :label="user.profile.sound ? $t('switch.activated') : $t('switch.disabled')" />
			</v-col>
		</v-row>
	</div>
</template>

<script>
import Vue from 'vue';
import LanguageSwitcher from '../../../components/LanguageSwitcher.vue';

export default Vue.extend({

	components: { LanguageSwitcher },

	props: ['user'],

	computed: {

		deckModes() {
			return [
				{ text: this.$t('preferences.general.deckModeView'), value: 0 },
				{ text: this.$t('preferences.general.deckModeEdit'), value: 1 },
				{ text: this.$t('preferences.general.deckModeEditData'), value: 2 },
			];
		},

		manualLateralities() {
			return [
				{ text: this.$t('preferences.general.manLatLeft'), value: -1 },
				{ text: this.$t('preferences.general.manLatRight'), value: 1 },
				{ text: this.$t('preferences.general.manLatAmbi'), value: 0 },
			];
		},
	},

	data: function() {
		return {

		}
	}
});
</script>
