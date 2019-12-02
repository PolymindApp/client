<template>
	<v-sheet class="panel-overflow d-flex flex-column" style="width: 100%">
		<v-tabs show-arrows v-model="tab" style="flex: 0" @change="setBreadcrumbs()">
			<v-tab to="/customize" exact>
				<v-icon left>mdi-card-bulleted-settings</v-icon>
				{{$t('customize.tab.general')}}
			</v-tab>
		</v-tabs>

		<v-tabs-items v-model="tab" style="flex: 1; overflow: auto; background-color: rgba(0, 0, 0, 0.025)">
			<v-tab-item value="/customize" class="pa-4">
				<General ref="general" :customize="customize" />
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
import General from './Customize/General.vue';

export default Vue.extend({

	components: { General },

	mounted() {
		this.init();
	},

	methods: {

		init() {
			this.updateOriginalData();
			this.load();
		},

		setBreadcrumbs() {

			const secondTitle = this.$t('customize.tab.' + (this.$route.params.section ? this.$route.params.section : 'general'));

			this.$root.breadcrumbs = [
				this.$t('title.customize'),
				secondTitle,
			];
			document.title = secondTitle + ' | ' + this.$t('title.customize');
		},

		updateOriginalData() {
			this.originalData = JSON.parse(JSON.stringify(this.data));
		},

		load() {
			// this.$root.isLoading = true;
			// UserService.me.bind(this)().then(user => {
			//     this.data = user;
			//     this.updateOriginalData();
			// }).finally(() => {
			//     this.$root.isLoading = false;
			// });
		},

		reset() {
			this.data = JSON.parse(JSON.stringify(this.originalData));
		},

		save() {
			// this.$root.isLoading = true;
			// Promise.all([
			//     LanguageService.set.bind(this)(this.data.id, this.data.language.abbreviation),
			//     ProfileService.set.bind(this)(this.data.profile.id, this.data.profile),
			//     SettingService.set.bind(this)(this.data.setting.id, this.data.setting),
			// ]).then(profile => {
			//     this.$vuetify.theme.themes.light.primary = this.data.setting.colorFrom;
			//     this.$refs.general.$refs.langSwitch.applyLang(this.data.language.abbreviation);
			//     this.$root.user = Object.assign({}, this.$root.user, this.data);
			//     this.updateOriginalData();
			//
			//     this.$root.isSaved = true;
			// }).catch(error => this.$root.error = error).finally(() => {
			//     this.$root.isLoading = false;
			// });
		}
	},

	computed: {
		dataHasChanged() {
			return JSON.stringify(this.data) !== JSON.stringify(this.originalData);
		},
	},

	data() {
		return {
			tab: 'general',
			data: {},
			originalData: {},
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
