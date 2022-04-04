<template>
	<v-form ref="form" :disabled="loading || sent" v-model="formIsValid" @submit="handleFormSubmit" lazy-validation>

		<v-expand-transition>
			<v-alert v-if="sent" class="text-left" type="info" prominent>
				<span v-text="$t('resetPassword.requestSent')"></span>
			</v-alert>
		</v-expand-transition>

		<p v-text="$t('resetPassword.desc')"></p>

		<v-text-field
			v-model="data.password"
			:error-messages="formErrors.password"
			:label="$t('placeholder.password')"
			:rules="[rules.required]"
			:type="showPassword ? 'text' : 'password'"
			:append-icon="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
			prepend-inner-icon="mdi-lock"
			autocomplete="password"
			outlined
			required
			@click:append="showPassword = !showPassword"
			@input="handleFormInput"
		/>

		<v-text-field
			v-model="data.confirmation"
			:error-messages="formErrors.confirmation"
			:label="$t('placeholder.confirmation')"
			:rules="[rules.required, rules.identical]"
			:type="showConfirmation ? 'text' : 'password'"
			:append-icon="!showConfirmation ? 'mdi-eye' : 'mdi-eye-off'"
			prepend-inner-icon="mdi-lock"
			autocomplete="password"
			outlined
			required
			@click:append="showConfirmation = !showConfirmation"
			@input="handleFormInput"
		/>

		<v-btn type="button" color="primary" :disabled="!canSubmit" :loading="loading" block @click="handleFormSubmit">
			<v-icon left>mdi-lock-reset</v-icon>
			<span v-text="$t('resetPassword.btn')"></span>
		</v-btn>

		<v-btn class="mt-4" block text :to="{ name: 'login' }">
			<v-icon left>mdi-arrow-left</v-icon>
			<span v-text="$t('btn.back')"></span>
		</v-btn>
	</v-form>
</template>

<script>
import Vue from 'vue'
import Services from '@/utils/Services';
import Rules from '@/utils/Rules';

export default Vue.extend({
	name: 'ResetPassword',

	data: () => ({
		loading: false,
		sent: false,
		showPassword: false,
		showConfirmation: false,
		formIsValid: true,
		formErrors: {},
		rules: {},
		data: {
			password: '',
			confirmation: '',
		},
	}),

	computed: {
		canSubmit() {
			return !this.loading && this.formIsValid && !this.sent;
		},
	},

	methods: {
		handleFormInput() {
			this.formErrors = {};
			this.$refs.form.validate();
		},
		handleFormSubmit(event) {

			event.preventDefault();
			this.formErrors = {};

			if (this.$refs.form && this.$refs.form.validate()) {
				this.loading = true;
				Services.resetPassword(this.data.password, this.data.confirmation, this.$route.params.token)
					.then(response => this.sent = true)
                    .catch(reason => this.$handleError(reason, this.formErrors))
					.finally(() => this.loading = false);
			}
		},
		validateToken() {
			this.loading = true;
			Services.validateResetPasswordToken(this.$route.params.token)
                .catch(reason => this.$handleError(reason, this.formErrors))
				.finally(() => this.loading = false);
		}
	},

	created() {

		this.validateToken();

		this.rules = {
			required: value => Rules.required(value) || this.$t('rules.required'),
			identical: () => Rules.identical(this.data.password, this.data.confirmation) || this.$t('rules.passwordConfirmation'),
		};
	},
})
</script>
