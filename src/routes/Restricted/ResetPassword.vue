<template>
	<div class="text-center fill-height align-center d-flex">
		<v-form ref="form" v-model="formIsValid" @submit="validate" lazy-validation>

			<v-progress-circular v-if="isActive === null" :size="50" color="primary" indeterminate></v-progress-circular>

			<div v-if="isActive === false">
				<p>{{ $t("restricted.resetPasswordExpired") }}</p>

				<v-btn color="primary" dark large to="/user/forgot-password">
					{{ $t("restricted.resetPasswordAnotherOne") }}
					<v-icon right>mdi-lock-reset</v-icon>
				</v-btn>
			</div>

			<div v-if="isResetted === true">

				<div>
					<v-icon style="font-size: 4rem">mdi-shield-check</v-icon>
				</div>

				<h1 class="my-4 display-1">{{ $t("restricted.resetPasswordResetted") }}</h1>

				<v-btn color="primary" dark large to="/login">
					{{ $t("restricted.backToLogin") }}
				</v-btn>
			</div>

			<div v-if="isActive === true && isResetted === false">
				<h1 class="display-1">{{$t('restricted.resetPasswordTitle')}}</h1>
				<p>{{$t('restricted.resetPasswordDesc')}}</p>

				<div class="my-4">
					<v-text-field :error-messages="formErrors.password" v-model="password" loading :rules="[rules.required, rules.min]" :placeholder="$t('restricted.passwordPlaceholder')" class="mt-2" light solo prepend-inner-icon="mdi-lock" :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword">
						<template v-slot:progress>
							<v-progress-linear :value="progress" :color="color" absolute height="7"></v-progress-linear>
						</template>
					</v-text-field>
					<v-text-field :error-messages="formErrors.confirmation" v-model="confirmation" :rules="[rules.required, rules.min, rules.identical]" :placeholder="$t('restricted.confirmationPlaceholder')" class="mt-2" light solo prepend-inner-icon="mdi-lock" :type="showConfirmPassword ? 'text' : 'password'" :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showConfirmPassword = !showConfirmPassword"></v-text-field>
				</div>

				<v-btn type="submit" color="primary" style="width: 100%" dark large>
					{{ $t("restricted.resetPasswordBtn") }}
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
import UserService from "../../services/User";
import Form from "../../utils/Form";

export default Vue.extend({

	mounted() {
	    this.verify();
	},

	methods: {

	    verify () {
	        UserService.verifyResetPasswordToken.bind(this)(this.lookup, this.token)
				.then(response => this.isActive = true)
				.catch(error => {
				    if (error.data.message) {
				        switch (error.data.message) {
							case 'BAD_TOKEN':
							case 'USER_PASSWORD_REQUEST_TOKEN_EXPIRED':
							case 'USER_PASSWORD_REQUEST_NOT_FOUND':
							    this.isActive = false;
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
				UserService.resetPassword.bind(this)(this.lookup, this.token, this.password, this.confirmation)
					.then(response => this.isResetted = true)
					.catch(error => this.$handleError(this, error))
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
			lookup: this.$route.params.lookup,
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
