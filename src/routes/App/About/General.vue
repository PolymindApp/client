<template>
	<v-card flat class="general-container" dark>
		<v-container>
<!--			<v-row>-->
<!--				<v-col cols="12" md="4" v-if="$vuetify.breakpoint.mdAndUp">-->
<!--					<v-img :src="cdnPrefix + wallpaper" :style="{ marginTop: scrollY + 'px' }" />-->
<!--				</v-col>-->
<!--				<v-col cols="0" md="1"></v-col>-->
<!--				<v-col cols="12" md="7">-->

					<Page slug="about">
						<template v-slot:content="props">
							<div class="text-center text-md-left">
								<img src="../../../assets/images/logo-light.svg" height="128" class="mb-4" />
								<div v-html="props.page.content" />
							</div>
						</template>
					</Page>
<!--				</v-col>-->
<!--			</v-row>-->
		</v-container>
	</v-card>
</template>

<script>
import Vue from 'vue';
import Page from "../../../components/Page";

export default Vue.extend({

	components: { Page },
	props: ['value'],

	created () {
		window.addEventListener('scroll', this.handleScroll);
	},
	destroyed () {
		window.removeEventListener('scroll', this.handleScroll);
	},

	methods: {
		handleScroll () {
			// this.scrollY = window.scrollY;
		}
	},

	data() {
		return {
			scrollY: window.scrollY,
			cdnPrefix: process.env.VUE_APP_API_URL,
			wallpaper: '/uploads/238da55f6b654f3bab5922027a7e43a3.png',
		}
	}
})
</script>

<style lang="scss" scoped>
	.general-container {
		background-color: transparent;
	}
</style>
