<template>
	<div>
		<v-alert v-model="viewAlert" color="info" text>
			{{$t('preferences.theme.alertInfo')}}
		</v-alert>
<!--		<h2>{{$t('preferences.theme.title')}}</h2>-->
		<ThemeField v-model="user.setting" />
	</div>
</template>

<script>
import Vue from 'vue';
import ThemeField from "../../../components/ThemeField";

export default Vue.extend({

	components: { ThemeField },

	props: ['user'],

	data: function() {
		return {
			viewAlert: true,
		}
	},
});
</script>
