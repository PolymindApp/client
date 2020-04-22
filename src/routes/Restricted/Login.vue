<template>
	<div class="text-center fill-height align-center d-flex">
		<v-slide-y-transition hide-on-leave>
			<div class="limited-width" v-if="isLoggedIn">
				<v-alert color="primary" style="background-color: rgba(0, 0, 0, 0.333) !important" outlined>
					<v-icon class="mb-4" color="primary" size="64" left>mdi-shield-check</v-icon>
					<h1 class="display-1 white--text">{{ $t("restricted.loginConfirmTitle") }}</h1>
					<p class="mb-0">{{ $t("restricted.loginConfirmDesc") }}</p>
				</v-alert>

				<v-progress-linear class="mb-4" v-model="progress" rounded></v-progress-linear>

				<v-btn color="primary" @click="goToApp()" class="w-100 d-block text-wrap py-3" style="height: auto">
					<v-icon left>mdi-send</v-icon>
					<span v-text="$t('restricted.goToDashboard')"></span>
				</v-btn>
			</div>
		</v-slide-y-transition>
		<v-slide-y-transition hide-on-leave>
			<div class="limited-width" v-if="!isLoggedIn">
				<div v-if="activationResent">
					<div>
						<v-icon style="font-size: 4rem">mdi-email-search</v-icon>
					</div>

					<h1 class="mt-4 display-1">{{ $t("restricted.accountActivationResentTitle") }}</h1>
					<p class="mb-4" v-html="$t('restricted.accountActivationResentDesc')"></p>
				</div>

				<v-form v-if="!activationResent" ref="form" v-model="formIsValid" @submit="validate" lazy-validation>

					<v-alert color="secondary" style="background-color: rgba(0, 0, 0, 0.333) !important" outlined>
						<div class="mb-4">{{ $t('restricted.registrationLocked') }}</div>

						<v-btn to="/contact?subject=invitation" class="w-100 d-block text-wrap py-2" style="height: auto" text>
							<v-icon left>mdi-send</v-icon>
							<span v-text="$t('restricted.requestInvite')"></span>
						</v-btn>
					</v-alert>

					<v-row v-if="registrationOpen" class="mx-n1">
						<v-col cols="3" class="px-1 py-0">
							<v-tooltip bottom>
								<template v-slot:activator="{ on }">
									<v-btn v-on="on" color="#CF4332" class="py-6" :href="googleLoginUrl" dark style="width: 100%">
										<v-icon>mdi-google</v-icon>
									</v-btn>
								</template>
								<span>{{$t('restricted.googleLogin')}}</span>
							</v-tooltip>
						</v-col>
						<v-col cols="3" class="px-1 py-0">
							<v-tooltip bottom>
								<template v-slot:activator="{ on }">
									<v-btn v-on="on" color="#3C66C4" class="py-6" :href="facebookLoginUrl" dark style="width: 100%">
										<v-icon>mdi-facebook</v-icon>
									</v-btn>
								</template>
								<span>{{$t('restricted.facebookLogin')}}</span>
							</v-tooltip>
						</v-col>
						<v-col cols="3" class="px-1 py-0">
							<v-tooltip bottom>
								<template v-slot:activator="{ on }">
									<v-btn v-on="on" color="#00ACEE" class="py-6" :href="twitterLoginUrl" dark style="width: 100%">
										<v-icon>mdi-twitter</v-icon>
									</v-btn>
								</template>
								<span>{{$t('restricted.twitterLogin')}}</span>
							</v-tooltip>
						</v-col>
						<!--				<v-col cols="3" class="px-1 py-0">-->
						<!--					<v-tooltip bottom>-->
						<!--						<template v-slot:activator="{ on }">-->
						<!--							<v-btn v-on="on" color="#0E76A8" class="py-6" :href="linkedInLoginUrl" dark style="width: 100%">-->
						<!--								<v-icon>mdi-linkedin</v-icon>-->
						<!--							</v-btn>-->
						<!--						</template>-->
						<!--						<span>{{$t('restricted.linkedInLogin')}}</span>-->
						<!--					</v-tooltip>-->
						<!--				</v-col>-->
						<v-col cols="3" class="px-1 py-0">
							<v-tooltip bottom>
								<template v-slot:activator="{ on }">
									<v-btn v-on="on" color="#211F1F" class="py-6" :href="githubLoginUrl" dark style="width: 100%">
										<v-icon>mdi-github-circle</v-icon>
									</v-btn>
								</template>
								<span>{{$t('restricted.githubLogin')}}</span>
							</v-tooltip>
						</v-col>
					</v-row>

					<div class="my-4">
						<v-text-field :error-messages="formErrors.email" ref="email" v-model="email" :rules="[rules.required]" :placeholder="$t('restricted.emailPlaceholder')" hide-details light solo prepend-inner-icon="mdi-account" :autofocus="$vuetify.breakpoint.lgAndUp" autocomplete="email"></v-text-field>
						<v-text-field :error-messages="formErrors.password" v-model="password" :rules="[rules.required, rules.min]" :placeholder="$t('restricted.passwordPlaceholder')" class="mt-2" hide-details light solo prepend-inner-icon="mdi-lock" :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword" autocomplete="password"></v-text-field>
					</div>

					<v-btn type="submit" color="primary" :disabled="!formIsValid" large style="width: 100%" dark>
						{{$t('restricted.loginBtn')}}
					</v-btn>

					<p class="mt-4 overline mb-0" v-html="$t('restricted.acceptTermsLoginHint')" style="opacity: 0.5"></p>

					<div>
						<v-divider class="my-4"></v-divider>

						<v-btn class="white--text" to="/register" v-if="registrationOpen" text>
							{{ $t("restricted.registerLink") }}
						</v-btn>

						<v-btn class="white--text" to="/user/forgot-password" text>
							{{ $t("restricted.forgotPasswordLink") }}
						</v-btn>
					</div>
				</v-form>
			</div>
		</v-slide-y-transition>
	</div>
</template>

<script>
import Vue from 'vue';
import { Rules, UserService, User } from "@polymind/sdk-js";
import ServerError from "../../utils/ServerError";

export default Vue.extend({

	created() {

		const lockedUser = localStorage.getItem('lockedUser');
		if (lockedUser) {
			this.user = JSON.parse(lockedUser);

			if (this.user.email) {
				this.$router.push('/locked');
			}
		}
	},

	methods: {

		initProgress() {
			this.progressInterval = setInterval(() => {
				this.progress++;

				if(this.progress === 100) {
					clearInterval(this.progressInterval);
					this.goToApp();
				}
			}, 3000 / 100);
		},

		goToApp() {
			window.location.href = localStorage.getItem('redirect_uri') || '/';
		},

		validate (event) {

			event.preventDefault();

			if (this.$refs.form.validate()) {
				this.$root.isLoading = true;
				this.$polymind.login(this.email, this.password)
					.then(response => {
						UserService.me().then(response => {
							this.$root.user = new User(response.data);
							if (this.$root.user.force_reset_password) {
								this.$router.push('/update-access');
							} else {
								this.isLoggedIn = true;
								this.initProgress();
							}
						});
					})
					.catch(error => {
						switch (error.code) {
							case 103:
								return this.$root.error = new ServerError(this, error, {
									buttons: [
										{ text: this.$t('restricted.resendActivation'), callback: (modal) => {
											this.$root.isLoading = true;
											UserService.resendActivationLost(this.email).then(response => {
												this.activationResent = true;
												modal.close();
											})
												.catch(error => this.$handleError(this, error))
												.finally(() => this.$root.isLoading = false);
										} },
										{ text: this.$t('modal.close') },
									],
								});
								break;
						}
						this.$handleError(this, error);
					})
					.finally(() => this.$root.isLoading = false);
			} else {
				this.$refs.email.focus();
			}
		},
	},

	data() {
		return {
			isLoggedIn: false,
			progressInterval: null,
			progress: 0,
			activationResent: false,
			formIsValid: false,
			formErrors: {},
			registrationOpen: false,
			googleLoginUrl: process.env.VUE_APP_API_URL + '/polymind/auth/sso/google',
			facebookLoginUrl: process.env.VUE_APP_API_URL + '/polymind/auth/sso/facebook',
			twitterLoginUrl: process.env.VUE_APP_API_URL + '/polymind/auth/sso/twitter',
			linkedInLoginUrl: process.env.VUE_APP_API_URL + '/polymind/auth/sso/linkedin',
			githubLoginUrl: process.env.VUE_APP_API_URL + '/polymind/auth/sso/github',
			email: '',
			password: '',
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
	.limited-width,
	.v-form {
		margin: 0 auto;
		max-width: 20rem;
	}
</style>
