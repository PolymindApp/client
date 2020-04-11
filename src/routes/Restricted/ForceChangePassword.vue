<template>
	<div class="text-center fill-height align-center justify-center d-flex">

		<v-form ref="form" v-model="formIsValid" @submit="validate" lazy-validation>

			<div v-if="isResetted === true">
				<v-alert color="primary" style="background-color: rgba(0, 0, 0, 0.333) !important" outlined>
					<v-icon class="mb-4" color="primary" size="64" left>mdi-shield-check</v-icon>
					<h1 class="display-1 white--text">{{ $t("restricted.forceChangePasswordConfirmTitle") }}</h1>
					<p class="mb-0">{{ $t("restricted.forceChangePasswordConfirmDesc") }}</p>
				</v-alert>

				<v-progress-linear class="mb-4" v-model="progress" rounded></v-progress-linear>

				<v-btn color="primary" @click="goToDashboard()" class="w-100 d-block text-wrap py-3" style="height: auto">
					<v-icon left>mdi-send</v-icon>
					<span v-text="$t('restricted.goToDashboard')"></span>
				</v-btn>
			</div>
			<div v-else>
				<h1 class="display-1">{{$t('restricted.forceChangePasswordTitle')}}</h1>
				<p>{{$t('restricted.forceChangePasswordDesc')}}</p>

				<div class="my-4">
					<v-text-field :error-messages="formErrors.password" v-model="password" loading :rules="[rules.required, rules.min]" :placeholder="$t('restricted.passwordPlaceholder')" class="mt-2" light solo prepend-inner-icon="mdi-lock" :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword" autocomplete="new-password" autofocus>
						<template v-slot:progress>
							<v-progress-linear :value="progress" :color="color" absolute height="7"></v-progress-linear>
						</template>
					</v-text-field>
					<v-text-field :error-messages="formErrors.confirmation" v-model="confirmation" :rules="[rules.required, rules.min, rules.identical]" :placeholder="$t('restricted.confirmationPlaceholder')" class="mt-2" light solo prepend-inner-icon="mdi-lock" :type="showConfirmPassword ? 'text' : 'password'" :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showConfirmPassword = !showConfirmPassword" autocomplete="new-password"></v-text-field>
				</div>

				<v-btn type="submit" color="primary" style="width: 100%" :disabled="!formIsValid" dark large>
					{{ $t("restricted.forceChangePasswordBtn") }}
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

	mounted() {
		if (!this.$server.loggedIn) {
			this.$router.push('/login');
		}
	},

	methods: {

		initProgress() {
			this.progressInterval = setInterval(() => {
				this.progress++;

				if(this.progress === 100) {
					clearInterval(this.progressInterval);
					this.goToDashboard();
				}
			}, 10000 / 100);
		},

		goToDashboard() {
			window.location.href = '/';
		},

		validate (event) {

			event.preventDefault();

			if (this.$refs.form.validate()) {
				this.$root.isLoading = true;
				UserService.loggedSetPassword.bind(this)(this.password)
					.then(response => {
						this.isResetted = true;
						this.initProgress();
					})
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
			progressInterval: null,
			progress: 0,
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
