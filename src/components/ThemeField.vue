<template>
	<div>
		<v-row>
			<v-col cols="12" md="4" v-for="background in backgrounds">
				<v-card :disabled="disabled" @click="select(background)" hover>
					<v-img v-bind:style="'background-image: linear-gradient(to bottom, ' + background.colorFrom + ', ' + background.colorTo + ');'">
						<v-responsive :aspect-ratio="16/9">
							<v-card v-bind:class="background.dark && 'white--text'" tile color="transparent" class="justify-stretch fill-height d-flex flex-column">
									<v-card-title style="flex: 1" class="align-start justify-end">
										<div v-if="background.colorFrom === value.colorFrom && background.colorTo === value.colorTo">
											<v-icon large left :dark="background.dark">
												mdi-check
											</v-icon>
										</div>
									</v-card-title>

									<v-card-title>
										{{ background.title }}
									</v-card-title>
							</v-card>
						</v-responsive>
					</v-img>
				</v-card>
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="12" md="12">
				<v-card :disabled="disabled" @click="select(custom)" hover>
					<v-img v-bind:class="!custom.dark && 'white--text'" v-bind:style="'background-image: linear-gradient(to bottom, ' + custom.colorFrom + ', ' + custom.colorTo + ');'">
						<v-responsive :aspect-ratio="16/9">
							<v-card v-bind:class="!custom.dark && 'white--text'" tile color="transparent" class="justify-stretch fill-height d-flex flex-column">
								<v-card-title style="flex: 1" class="align-start justify-end">
									<div v-if="custom.colorFrom === value.colorFrom && custom.colorTo === value.colorTo">
										<v-icon large left :dark="!custom.dark">
											mdi-check
										</v-icon>
									</div>
								</v-card-title>

								<v-card-title>
									{{ $t('preferences.theme.custom') }}
								</v-card-title>
							</v-card>
						</v-responsive>
					</v-img>
				</v-card>
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="12" md="2">
				<h4>{{$t('preferences.theme.text')}}</h4>
				<v-switch :disabled="disabled" v-model="custom.dark" @change="select(custom)" color="primary" :label="$t('preferences.theme.dark')"></v-switch>
				<!--								<v-switch v-model="custom.shadow" color="primary" :label="$t('preferences.theme.shadow')"></v-switch>-->
			</v-col>
			<v-col cols="12" md="5">
				<h4>{{$t('preferences.theme.colorFrom')}}</h4>
				<v-color-picker :disabled="disabled" v-model="custom.colorFrom" @input="select(custom)" width="100%" :hide-canvas="true" :hide-inputs="true" :hide-mode-switch="true" mode.sync="rgba" :show-swatches="!disabled"></v-color-picker>
			</v-col>
			<v-col cols="12" md="5">
				<h4>{{$t('preferences.theme.colorTo')}}</h4>
				<v-color-picker :disabled="disabled" v-model="custom.colorTo" @input="select(custom)" width="100%" :hide-canvas="true" :hide-inputs="true" :hide-mode-switch="true" mode.sync="rgba" :show-swatches="!disabled"></v-color-picker>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
	props: ['value', 'disabled'],

	methods: {

		save() {
			this.$root.isLoading = true;
			SettingService.set.bind(this)(this.$root.user.setting.id, this.value).then(result => {
				this.$root.isSaved = true;
				this.applyTheme(result);
			}).finally(() => {
				this.$root.isLoading = false;
			});
		},

		applyTheme(setting) {
			this.$root.user.setting = Object.assign({}, this.$root.user.setting, setting);
			this.$vuetify.theme.themes.light.primary = setting.colorFrom;
		},

		select(background) {

			this.$emit('input', { ...this.value, ...background });
		}
	},

	data() {
		return {
			custom: {
				dark: false,
				shadow: false,
				colorFrom: '#00BCD4',
				colorTo: '#B2EBF2',
			},
			backgrounds: [
				{ title: 'Default', colorFrom: '#aa076b', colorTo: '#61045f', dark: true },
				{ title: 'Premium Dark', colorFrom: '#434343', colorTo: '#000000', dark: true },
				{ title: 'Mountain Rock', colorFrom: '#868f96', colorTo: '#596164', dark: true },
				{ title: 'Eternal Constance', colorFrom: '#09203f', colorTo: '#537895', dark: true },
				{ title: 'Plum Plate', colorFrom: '#667eea', colorTo: '#764ba2', dark: true },
				{ title: 'Aqua Splash', colorFrom: '#13547a', colorTo: '#80d0c7', dark: true },
				{ title: 'Morning Salad', colorFrom: '#B7F8DB', colorTo: '#50A7C2', dark: true },
				{ title: 'Passionate Bed', colorFrom: '#ff758c', colorTo: '#ff7eb3', dark: true },
				{ title: 'Desert Hump', colorFrom: '#c79081', colorTo: '#dfa579', dark: true },
				{ title: 'Warm Flame', colorFrom: '#ff9a9e', colorTo: '#fad0c4', dark: true },
				{ title: 'Winter Neva', colorFrom: '#a1c4fd', colorTo: '#c2e9fb', dark: false },
				{ title: 'Heavy Rain', colorFrom: '#cfd9df', colorTo: '#e2ebf0', dark: false },
			]
		}
	},
});
</script>
