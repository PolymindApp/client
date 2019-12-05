<template>
	<v-card flat class="general-container" dark>
		<v-container>
			<Page slug="about">
				<template v-slot:content="props">
					<v-row>
						<v-scale-transition>
							<v-col cols="12" md="4" class="d-flex align-center" v-if="$vuetify.breakpoint.mdAndUp">
								<v-img v-if="logo" :src="logo" max-height="256" transition="slide-y-reverse-transition" contain />
							</v-col>
						</v-scale-transition>
						<v-col cols="12" md="8">
							<div class="text-left">
								<div v-html="props.page.content" />
							</div>
						</v-col>
					</v-row>
				</template>
			</Page>
		</v-container>
	</v-card>
</template>

<script>
import Vue from 'vue';
import Page from "../../../components/Page";
import logo from '../../../assets/images/polymind-light.svg';

export default Vue.extend({

	components: { Page },
	props: ['value'],

	methods: {

	},

	data() {
		return {
			logo: logo,
		}
	}
})
</script>

<style lang="scss" scoped>
	.general-container {
		background-color: transparent;
	}
</style>
