<template>
	<v-sheet class="panel-overflow d-flex flex-column" style="width: 100%">
		<v-tabs show-arrows v-model="tab" style="flex: 0" @change="setBreadcrumbs()">
			<v-tab to="/preferences" exact>
				<v-icon left>mdi-card-bulleted-settings</v-icon>
				{{$t('preferences.tab.general')}}
			</v-tab>
			<v-tab to="/preferences/theme">
				<v-icon left>mdi-palette-swatch</v-icon>
				{{$t('preferences.tab.theme')}}
			</v-tab>
			<v-tab to="/preferences/interface" disabled>
				<v-icon left>mdi-monitor-dashboard</v-icon>
				{{$t('preferences.tab.interface')}}
			</v-tab>
			<v-tab to="/preferences/shortcuts">
				<v-icon left>mdi-keyboard-settings</v-icon>
				{{$t('preferences.tab.shortcuts')}}
			</v-tab>
			<v-tab to="/preferences/notifications" disabled>
				<v-icon left>mdi-car-brake-alert</v-icon>
				{{$t('preferences.tab.notifications')}}
			</v-tab>
		</v-tabs>

		<v-tabs-items v-model="tab" style="flex: 1; overflow: auto; background-color: rgba(0, 0, 0, 0.025)">
			<v-tab-item value="/preferences" class="pa-4">
				<General ref="general" :user="user" />
			</v-tab-item>
			<v-tab-item value="/preferences/theme" class="pa-4">
				<Theme :user="user" />
			</v-tab-item>
			<v-tab-item value="/preferences/interface" class="pa-4">
				<Interface :user="user" />
			</v-tab-item>
			<v-tab-item value="/preferences/shortcuts" class="pa-4">
				<Shortcuts :user="user" />
			</v-tab-item>
			<v-tab-item value="/preferences/notifications" class="pa-4">
				<Notifications :user="user" />
			</v-tab-item>
		</v-tabs-items>

		<v-card flat class="pa-4" style="flex: 0">
			<v-btn :disabled="!dataHasChanged || $root.isDeleted" @click="save()" color="primary" class="mr-1">
				{{$t('modal.save')}}
			</v-btn>
			<v-btn :disabled="!dataHasChanged" @click="reset()" text>
				{{$t('modal.cancel')}}
			</v-btn>
		</v-card>
	</v-sheet>
</template>

<script>
import Vue from 'vue';
import General from './Preferences/General.vue';
import Theme from './Preferences/Theme.vue';
import Interface from './Preferences/Interface.vue';
import Shortcuts from './Preferences/Shortcuts.vue';
import Notifications from './Preferences/Notifications.vue';
import UserService from "../../services/User";
import ProfileService from "../../services/Profile";
import SettingService from "../../services/Setting";
import LanguageService from "../../services/Language";

export default Vue.extend({

	components: { General, Theme, Interface, Shortcuts, Notifications },

	mounted() {
	    this.init();
	},

	methods: {

		init() {
			this.updateOriginalData();
			this.load();
		},

	    setBreadcrumbs() {

			const secondTitle = this.$t('preferences.tab.' + (this.$route.params.section ? this.$route.params.section : 'general'));

			this.$root.breadcrumbs = [
				this.$t('title.preferences'),
				secondTitle,
			];
			document.title = secondTitle + ' | ' + this.$t('title.preferences');
		},

		updateOriginalData() {
			this.originalUser = JSON.parse(JSON.stringify(this.user));
		},

		load() {
			this.$root.isLoading = true;
			UserService.me.bind(this)().then(user => {
				this.user = user;
				this.updateOriginalData();
			}).finally(() => {
				this.$root.isLoading = false;
			});
		},

		reset() {
			this.user = JSON.parse(JSON.stringify(this.originalUser));
		},

		save() {
			this.$root.isLoading = true;
			console.log(this.user.setting);
			Promise.all([
				LanguageService.set.bind(this)(this.user.id, this.user.language.abbreviation),
				ProfileService.set.bind(this)(this.user.profile.id, this.user.profile),
				SettingService.set.bind(this)(this.user.setting.id, this.user.setting),
			]).then(profile => {
				this.$vuetify.theme.themes.light.primary = this.user.setting.colorFrom;
				this.$refs.general.$refs.langSwitch.applyLang(this.user.language.abbreviation);
				this.$root.user = Object.assign({}, this.$root.user, this.user);
				this.updateOriginalData();

				this.$root.isSaved = true;
			}).catch(error => this.$root.error = error).finally(() => {
				this.$root.isLoading = false;
			});
		}
	},

	computed: {
		dataHasChanged() {
			return JSON.stringify(this.user) !== JSON.stringify(this.originalUser);
		},
	},

	data() {
		return {
		    tab: 'general',
			user: {
				language: {
					abbreviation: this.$i18n.locale,
				},
				profile: {},
				setting: {
					shortcuts: [],
				},
			},
			originalUser: {},
		}
	},
});
</script>

<style lang="scss" scoped>
	.panel-overflow {
		position: absolute;
		width: 100%;
		height: 100%;
	}
</style>
