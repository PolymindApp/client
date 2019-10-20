<template>
	<v-sheet color="transparent">
		<div class="mx-auto contact-form">
			<h1 class="display-1 my-8">
				{{$t('contact.title')}}
			</h1>

			<ContactForm :inputDark="false" />
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
		max-width: 600px;
	}
</style>
