<template>
	<v-sheet color="transparent">
		<div ref="page" class="mx-auto contact-form">
			<h1 class="display-1 my-8">
				{{$t('contact.title')}}
			</h1>

			<ContactForm @sent="$vuetify.goTo($refs.page)" :inputDark="false" />
		</div>
	</v-sheet>
</template>

<script>
import Vue from 'vue';
import ContactForm from '../../components/ContactForm.vue';

export default Vue.extend({
	components: { ContactForm },
});
</script>

<style lang="scss" scoped>
	.contact-form {
		width: 100%;
		max-width: 500px;
	}
</style>
