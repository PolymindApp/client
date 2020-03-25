<template>
	<div class="text-center fill-height align-center d-flex">
		<v-form ref="form" v-model="formIsValid" @submit="validate" lazy-validation>

			<div v-if="hasSucceeded">
				<div>
					<v-icon style="font-size: 4rem">mdi-email-search</v-icon>
				</div>

				<h1 class="mt-4 display-1">{{ $t("restricted.registerSent") }}</h1>
				<p class="mb-4">{{ $t("restricted.registerSentDesc") }}</p>
			</div>
			<div v-else>
				<h1 class="display-1">{{$t('restricted.registerTitle')}}</h1>

				<div class="my-4">
					<v-text-field :error-messages="formErrors.email" ref="email" v-model="email" :rules="[rules.required, rules.email]" :placeholder="$t('restricted.emailPlaceholder')" light solo prepend-inner-icon="mdi-account" :autofocus="$vuetify.breakpoint.lgAndUp" autocomplete="email" hide-details></v-text-field>
					<v-text-field :error-messages="formErrors.password" v-model="password" loading :rules="[rules.required, rules.min]" :placeholder="$t('restricted.passwordPlaceholder')" class="mt-2" light solo prepend-inner-icon="mdi-lock" :type="showPassword ? 'text' : 'password'" autocomplete="password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword" hide-details>
						<template v-slot:progress>
							<v-progress-linear :value="progress" :color="color" absolute height="7"></v-progress-linear>
						</template>
					</v-text-field>
				</div>

				<v-btn type="submit" color="primary" large style="width: 100%" dark>
					{{$t('restricted.registerBtn')}}
				</v-btn>

				<p class="mt-4 overline mb-0" v-html="$t('restricted.acceptTermsRegisterHint')" style="opacity: 0.5"></p>
			</div>
		</v-form>
	</div>
</template>

<script>
import Vue from 'vue';
import Rules from "../../utils/Rules";
import UserService from "../../services/UserService";
import Form from "../../utils/Form";

export default Vue.extend({

	methods: {

		validate (event) {

			event.preventDefault();

			if (this.$refs.form.validate()) {
				this.$root.isLoading = true;
				UserService.register.bind(this)(this.email, this.password)
					.then(response => this.hasSucceeded = true)
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
		    hasSucceeded: false,
		    email: '',
		    password: '',
			formIsValid: false,
			formErrors: {},
			googleLoginUrl: process.env.VUE_APP_API_URL + '/auth/google',
			facebookLoginUrl: process.env.VUE_APP_API_URL + '/auth/facebook',
			twitterLoginUrl: process.env.VUE_APP_API_URL + '/auth/twitter',
			linkedInLoginUrl: process.env.VUE_APP_API_URL + '/auth/linkedin',
			showPassword: false,
			rules: {
				required: value => Rules.required(value) || this.$t('rules.required'),
				email: value => Rules.email(value) || this.$t('rules.email'),
				min: value => Rules.min(8, value) || this.$t('rules.min', { amount: 8 }),
			},
		};
	},
});
</script>

<style lang="scss" scoped>
	.v-form {
		margin: 0 auto;
		max-width: 22rem;
	}
</style>
