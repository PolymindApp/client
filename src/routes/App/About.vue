<template>
	<v-sheet class="panel-overflow d-flex flex-column about" :style="'width: 100%; border-radius: 0; background-color: ' + about.backgroundColor">
		<v-tabs show-arrows style="flex: 0" v-model="tab" centered :color="about.color" background-color="rgba(0, 0, 0, 0.1)" :dark="about.dark" @change="updateContext()">
			<v-tab to="/about" exact>
				<v-icon left>mdi-information-outline</v-icon>
				{{$t('about.general.title')}}
			</v-tab>
			<v-tab to="/about/privacy">
				<v-icon left>mdi-security</v-icon>
				{{$t('about.privacy.title')}}
			</v-tab>
			<v-tab to="/about/terms">
				<v-icon left>mdi-gavel</v-icon>
				{{$t('about.terms.title')}}
			</v-tab>
			<v-tab to="/about/contact">
				<v-icon left>mdi-email</v-icon>
				{{$t('about.contact.title')}}
			</v-tab>
		</v-tabs>

		<v-tabs-items style="flex: 1; overflow: auto;" v-model="tab">
			<v-tab-item value="/about" class="pa-4 fill-height">
				<General v-model="about" />
			</v-tab-item>
			<v-tab-item value="/about/privacy" class="pa-4 fill-height">
				<Privacy v-model="about" />
			</v-tab-item>
			<v-tab-item value="/about/terms" class="pa-4 fill-height">
				<Terms v-model="about" />
			</v-tab-item>
			<v-tab-item value="/about/contact" class="pa-4 fill-height">
				<Contact v-model="about" />
			</v-tab-item>
		</v-tabs-items>
	</v-sheet>
</template>

<script>
import Vue from 'vue';
import General from './About/General.vue';
import Privacy from './About/Privacy.vue';
import Terms from './About/Terms.vue';
import Contact from './About/Contact.vue';

export default Vue.extend({

	components: { General, Privacy, Terms, Contact },

	mounted() {
	    this.updateContext();
	},

	methods: {

	    updateContext() {

	        const section = (this.$route.params.section ? this.$route.params.section : 'general');
			const secondTitle = this.$t('about.' + section + '.title');

			this.$root.breadcrumbs = [
				this.$t('title.about'),
				secondTitle,
			];
			document.title = secondTitle + ' | ' + this.$t('title.about');

			this.about = this.states[section];
		},
	},

	data() {
		return {
		    tab: 'general',
			about: {
			    dark: true,
			    backgroundColor: '',
			    color: '',
			},
			states: {
			    general: {
					dark: true,
					backgroundColor: '#56BEBB',
					color: '',
				},
				terms: {
					dark: true,
					backgroundColor: 'grey',
					color: '',
				},
				privacy: {
					dark: true,
					backgroundColor: 'grey',
					color: '',
				},
				contact: {
					dark: true,
					backgroundColor: '#56BEBB',
					color: 'white',
				}
			}
		}
	},
});
</script>

<style lang="scss" scoped>
	.about::v-deep .v-tabs-items {
		background-color: transparent !important;
	}
	.about::v-deep .container {
		max-width: 800px;
	}

	.about::v-deep a {
		color: white;
	}

	/*.panel-overflow {*/
	/*	position: absolute;*/
	/*	width: 100%;*/
	/*	height: 100%;*/
	/*}*/
</style>
