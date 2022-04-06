<template>
	<v-app>
        <Snack v-model="$root.snack.visible" v-bind="$root.snack" transition="slide-y-reverse-transition" bottom left />
        <ErrorHandler :value="$root.error" max-width="500" icon="mdi-alert" color="error" dark scrollable />
        <GlobalModal v-model="$root.modal.visible" v-bind="{ ...$root.modal, ...$root.modal.attrs }" scrollable />

		<v-main>
			<Modal v-model="termsModal"
				:title="$t('restricted.termsModal.title')"
				:body="$t('restricted.termsModal.body')"
				:buttons="[
					{ text: $t('btn.close'), attrs: { outlined: true }, events: { click: () => { this.termsModal = false } } },
				]"
				icon="mdi-gavel"
				max-width="600"
				scrollable
			/>

			<v-sheet class="h-100 d-flex flex-column py-4 py-md-0" :color="background">
				<v-sheet color="transparent" class="h-100 d-flex align-center justify-center" style="flex: 1">
					<v-card :max-width="maxWidth" class="text-center w-100" :tile="flat" :flat="flat">
						<v-card-text class="d-flex flex-column align-center" :style="logoStyle">
							<v-img :src="logo" :max-width="logoSize" :height="logoSize" contain />
							<h1 class="primary--text display-1 mt-2" style="flex: 1" v-text="$t('restricted.title.' + $route.name)">Polymind</h1>
						</v-card-text>
						<v-card-text>
							<router-view @terms="termsModal = true" />
						</v-card-text>
					</v-card>
				</v-sheet>

				<v-footer :color="$vuetify.theme.dark ? 'transparent' : background" class="d-block d-md-flex text-center justify-md-space-between justify-center caption">
                    <div v-if="$vuetify.breakpoint.smAndDown" class="d-flex justify-center">
                        <LanguageSwitcher v-model="lang" class="ma-4 mr-2" menu-props="auto" style="max-width: 6rem" abbreviation dense hide-details />
                    </div>
					<span v-text="$t('footer.copyrightNoVersion', {
						name: 'Polymind',
						year,
					})"></span>
                    <div class="d-flex align-center justify-center text-no-wrap" style="flex: 0">
                        <LanguageSwitcher v-if="$vuetify.breakpoint.mdAndUp" v-model="lang" class="ma-4" menu-props="left" abbreviation dense hide-details />
                        <span v-text="$t('footer.version', {
                            version,
                        })"></span>
                    </div>
				</v-footer>
			</v-sheet>
		</v-main>
	</v-app>
</template>

<script>
import Vue from 'vue';
import ErrorHandler from "@/components/generic/ErrorHandler";
import GlobalModal from "@/components/generic/Modal";
import Snack from "@/components/generic/Snack";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import Modal from "@/components/generic/Modal.vue";
import logo from '@/assets/images/polymind-dark.svg';
import packageJson from '../../../package.json';

export default Vue.extend({
	name: 'Restricted',

	components: { LanguageSwitcher, Modal, ErrorHandler, GlobalModal, Snack },

	data: () => ({
		logo,
		lang: '',
		version: packageJson.version,
		year: new Date().getFullYear(),
		termsModal: false,
	}),

	computed: {
		flat() {
			return this.$vuetify.breakpoint.smAndDown;
		},
		background() {
			return this.$vuetify.breakpoint.smAndDown
                ? (this.$vuetify.theme.dark ? null : 'white')
                : 'background';
		},
		maxWidth() {
			return this.$vuetify.breakpoint.mdAndUp ? 350 : null;
		},
		logoStyle() {
			return this.$vuetify.breakpoint.mdAndUp
				? 'transform: translateY(-75px); margin-bottom: -75px'
				: null;
		},
        logoSize() {
			return this.$vuetify.breakpoint.mdAndUp
				? 150
				: 75;
		},
	},

	watch: {
		lang(value) {
			this.$i18n.locale = value;
			localStorage.setItem('lang', value);
		},
	},

	created() {
		this.lang = this.$i18n.locale;
		localStorage.setItem('lang', this.lang);
	},
});
</script>
