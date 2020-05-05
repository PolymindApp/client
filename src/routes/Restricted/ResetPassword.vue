<template>
	<div class="text-center fill-height align-center justify-center d-flex">

		<div class="d-flex justify-center w-100" v-if="isActive === null">
			<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
		</div>

		<v-form v-else ref="form" v-model="formIsValid" @submit="validate" lazy-validation>
			<v-alert v-if="isActive === false" color="secondary" style="background-color: rgba(0, 0, 0, 0.333) !important" outlined>
				<v-icon size="48">mdi-alert</v-icon>
				<div class="title my-2">{{ $t('restricted.resetPasswordExpired') }}</div>
				<v-btn to="/user/forgot-password" class="w-100 d-block text-wrap py-2" style="height: auto" text>
					<span v-text="$t('restricted.resetPasswordAnotherOne')"></span>
					<v-icon right>mdi-lock-reset</v-icon>
				</v-btn>
			</v-alert>

			<v-alert v-if="isResetted === true" color="success" style="background-color: rgba(0, 0, 0, 0.333) !important" outlined>
				<v-icon size="48">mdi-shield-check</v-icon>
				<div class="title my-4">{{ $t("restricted.resetPasswordResetted") }}</div>
				<v-btn to="/login" class="w-100 d-block text-wrap py-2" style="height: auto" text>
					<v-icon left>mdi-login</v-icon>
					<span v-text="$t('restricted.backToLogin')"></span>
				</v-btn>
			</v-alert>

			<div v-if="isActive === true && isResetted === false">
				<v-alert color="success" style="background-color: rgba(0, 0, 0, 0.333) !important" outlined>
					<div class="title mb-2">{{ $t("restricted.resetPasswordTitle") }}</div>
					<div class="overline white--text" v-text="$t('restricted.resetPasswordDesc')"></div>
				</v-alert>
				<div class="my-4">
					<v-text-field :error-messages="formErrors.password" :hide-details="!formErrors.password" @input="formErrors.password = null" v-model="password" loading :rules="[rules.required, rules.min]" :placeholder="$t('restricted.passwordPlaceholder')" class="mt-2 mb-4" light solo prepend-inner-icon="mdi-lock" :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword" autocomplete="new-password">
						<template v-slot:progress>
							<v-progress-linear :value="progress" :color="color" absolute height="7"></v-progress-linear>
						</template>
					</v-text-field>
					<v-text-field :error-messages="formErrors.confirmation" :hide-details="!formErrors.confirmation" @input="formErrors.confirmation = null" v-model="confirmation" :rules="[rules.required, rules.min, rules.identical]" :placeholder="$t('restricted.confirmationPlaceholder')" class="mt-2" light solo prepend-inner-icon="mdi-lock" :type="showConfirmPassword ? 'text' : 'password'" :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showConfirmPassword = !showConfirmPassword" autocomplete="new-password"></v-text-field>
				</div>

				<v-btn type="submit" color="primary" :disabled="!formIsValid" style="width: 100%" dark large>
					{{ $t("restricted.resetPasswordBtn") }}
					<v-icon style="align-self: flex-end" right>mdi-lock-reset</v-icon>
				</v-btn>
			</div>
		</v-form>
	</div>
</template>

<script>
import Vue from 'vue';
import { Rules, UserService } from "@polymind/sdk-js";

export default Vue.extend({

	mounted() {
	    this.verify();
	},

	methods: {

	    verify () {
	        UserService.verifyResetPasswordToken(this.token)
				.then(response => this.isActive = true)
				.catch(error => {
                    this.isActive = false
				    if (error.message) {
				        switch (error.message) {
							case 'BAD_TOKEN':
							case 'USER_PASSWORD_REQUEST_TOKEN_EXPIRED':
							case 'USER_PASSWORD_REQUEST_NOT_FOUND':
							    break;
							default:
								this.$handleError(this, error);
						}
					}
				});
		},

		validate (event) {

			event.preventDefault();

			if (this.$refs.form.validate()) {
				this.$root.isLoading = true;
				UserService.resetPassword(this.token, this.password)
					.then(response => this.isResetted = true)
					.catch(error => {
						switch (parseInt(error.code)) {
							case 105:
								this.isActive = false;
								return this.$forceUpdate();
						}
						this.$handleError(this, error);
					})
					.finally(() => this.$root.isLoading = false);
			} else {
				this.$refs.email.focus();
			}
		},
	},

	computed: {

		progress () {
			return Math.min(100, this.password.length * 10)
		},

		color () {
			return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
		},
	},

	data() {
		return {
			isActive: null,
			isResetted: false,
			formIsValid: false,
			formErrors: {},
			password: '',
			confirmation: '',
			showPassword: false,
			showConfirmPassword: false,
			token: this.$route.params.token,
			rules: {
				required: value => Rules.required(value) || this.$t('rules.required'),
				min: value => Rules.min(8, value) || this.$t('rules.min', { amount: 8 }),
				identical: value => Rules.identical(value, this.password) || this.$t('rules.passwordConfirm'),
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
