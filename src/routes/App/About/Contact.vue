<template>
	<v-card flat dark color="transparent">
		<v-container>
			<Page slug="contact">
				<template v-slot:title="props">
					<h1 class="display-1 mb-8" v-html="props.page.title" />
				</template>
				<template v-slot:content="props">
					<p class="mb-12" v-html="props.page.content" />

					<ContactForm />
				</template>
			</Page>
		</v-container>
	</v-card>
</template>

<script>
import Vue from 'vue';
import ContactForm from "../../../components/ContactForm";
import Page from "../../../components/Page";

export default Vue.extend({

	components: { ContactForm, Page },

	props: ['value'],

	data() {
		return {

		}
	}
})
</script>

<style lang="scss" scoped>
	.contact-form {
		width: 100%;
		max-width: 600px;
	}
</style>
