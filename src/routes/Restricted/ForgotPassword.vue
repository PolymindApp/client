<template>
	<div class="text-center fill-height align-center d-flex">
		<v-form ref="form" class="mx-auto" v-model="formIsValid" @submit="validate" lazy-validation>

			<div v-if="isSent === true">
				<div>
					<v-icon style="font-size: 4rem">mdi-email-search</v-icon>
				</div>

				<h1 class="mt-4 display-1">{{ $t("restricted.forgotPasswordSent") }}</h1>
				<p class="mb-4">{{ $t("restricted.forgotPasswordSentDesc") }}</p>
			</div>
			<div v-else>
				<h1 class="display-1">{{$t('restricted.forgotPasswordTitle')}}</h1>
				<p>{{$t('restricted.forgotPasswordDesc')}}</p>

				<div class="my-4">
					<v-text-field :error-messages="formErrors.email" ref="email" light solo v-model="email" :label="$t('restricted.email')" :rules="[rules.required, rules.email]" prepend-inner-icon="mdi-account-circle" :autofocus="$vuetify.breakpoint.lgAndUp" hide-details></v-text-field>
				</div>

				<v-btn type="submit" color="primary" style="width: 100%" dark large>
					{{ $t("restricted.resetPassword") }}
					<v-icon style="align-self: flex-end" right>mdi-lock-reset</v-icon>
				</v-btn>
			</div>
		</v-form>
	</div>
</template>

<script>
import Vue from 'vue';
import ErrorDialog from '../../components/ErrorDialog.vue';
import Rules from "../../utils/Rules";
import UserService from "../../services/UserService";
import Form from "../../utils/Form";

export default Vue.extend({

	methods: {

		validate (event) {

			event.preventDefault();

			if (this.$refs.form.validate()) {
				this.$root.isLoading = true;
				UserService.forgotPassword.bind(this)(this.email)
					.then(response => this.isSent = true)
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
			} else {
				this.$refs.email.focus();
			}
		},
	},

	data() {
		return {
			email: '',
			isSent: false,
			formIsValid: false,
			formErrors: {},
			rules: {
				required: value => Rules.required(value) || this.$t('rules.required'),
				email: value => Rules.email(value) || this.$t('rules.email'),
			},
		};
	},
});
</script>

<style lang="scss" scoped>
	.v-form {
		max-width: 25rem;
	}
</style>
