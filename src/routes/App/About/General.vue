<template>
	<v-card flat class="general-container" dark>
		<v-container>
			<Page slug="about">
				<template v-slot:content="props">
					<v-row>
						<v-scale-transition>
							<v-col cols="12" md="4" class="d-flex align-center" v-if="$vuetify.breakpoint.mdAndUp">
								<video key="counting" class="w-100" autoplay loop muted>
									<source :src="video" type="video/mp4">
									Your browser does not support the video tag.
								</video>
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

export default Vue.extend({

	components: { Page },
	props: ['value'],

	methods: {

	},

	data() {
		return {
			video: 'https://polymind.s3.ca-central-1.amazonaws.com/assets/client/about-explaning.mp4',
		}
	}
})
</script>

<style lang="scss" scoped>
	.general-container {
		background-color: transparent;
	}
</style>
