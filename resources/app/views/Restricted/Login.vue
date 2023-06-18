<template>
	<v-form ref="form" :disabled="loading" v-model="formIsValid" @submit="handleFormSubmit" lazy-validation>

		<v-text-field
			v-model="data.email"
			:error-messages="formErrors.email"
			:label="$t('placeholder.email')"
			:rules="[rules.required, rules.email]"
			:autofocus="$vuetify.breakpoint.mdAndUp"
			prepend-inner-icon="mdi-account"
			autocomplete="email"
			tabindex="1"
			outlined
			required
			@input="formErrors = {}"
		/>

		<v-text-field
			v-model="data.password"
			:error-messages="formErrors.password"
			:label="$t('placeholder.password')"
			:rules="[rules.required]"
			:type="showPassword ? 'text' : 'password'"
			:append-icon="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
			prepend-inner-icon="mdi-lock"
			autocomplete="password"
			tabindex="2"
			outlined
			required
			@click:append="showPassword = !showPassword"
			@input="formErrors = {}"
		/>

		<div class="d-flex align-center">
			<v-icon :left="!$vuetify.rtl" :right="$vuetify.rtl">mdi-help-circle-outline</v-icon>
			<router-link :to="{ name: 'forgot_password' }" tabindex="5">
				<span v-text="$t('login.forgotPassword')"></span>
			</router-link>
		</div>

		<v-btn class="mt-4" tabindex="3" type="submit" color="primary" :disabled="!canSubmit" :loading="loading" block @click="handleFormSubmit">
			<span v-text="$t('login.btn')"></span>
		</v-btn>

		<v-btn class="mt-4" tabindex="4" color="primary" block outlined :to="{ name: 'register' }">
			<span v-text="$t('btn.createAccount')"></span>
		</v-btn>
	</v-form>
</template>

<script>
import Vue from 'vue'
import Services from '@/utils/Services';
import Rules from '@/utils/Rules';
import EventBus from "@/utils/EventBus";
import UserModel from '@/models/UserModel';

export default Vue.extend({
	name: 'Login',

	data: () => ({
		loading: false,
		formIsValid: true,
		showPassword: false,
        emailNotVerifiedDialog: false,
		formErrors: {},
		rules: {},
		data: {
			email: '',
			password: '',
		},
	}),

	computed: {
		canSubmit() {
			return !this.loading && this.formIsValid;
		},
	},

	methods: {
		handleFormSubmit(event) {

			event.preventDefault();
			this.formErrors = {};

			if (this.$refs.form && this.$refs.form.validate()) {
				this.loading = true;
				Services.login(this.data.email, this.data.password, this.$route.query.redirect)
					.then(response => {
                        const user = new UserModel(response.user);
						this.$store.commit('user', user);
                        const accounts = this.$accounts.set({
                            ...response.user,
                            token: response.token
                        });
                        this.$store.commit('accounts', accounts);
						EventBus.publish('LOGGED_IN');
					})
					.catch(reason => {
                        if (reason.message === 'EMAIL_NOT_VERIFIED') {
                            this.$confirm(
                                this.$i18n.t('restricted.login.emailNotVerifiedConfirm.title'),
                                this.$i18n.t('restricted.login.emailNotVerifiedConfirm.body'),
                                this.$i18n.t('btn.resend'),
                                (modal, btn) => {
                                    modal.disabled = true;
                                    btn.attrs.loading = true;
                                    Services.resendVerificationEmail(this.data.email)
                                        .then(() => {
                                            modal.visible = false;
                                            this.$snack(this.$i18n.t('snack.emailNotVerifiedConfirmSent'))
                                        })
                                        .catch(reason => this.$handleError(reason, this.formErrors))
                                        .finally(() => btn.attrs.loading = false);
                                }
                            );
                        } else {
                            this.$handleError(reason, this.formErrors, false);
                        }
                    })
					.finally(() => this.loading = false);
			}
		},
	},

	created() {
		this.rules = {
			required: value => Rules.required(value) || this.$t('rules.required'),
			email: value => Rules.email(value) || this.$t('rules.email'),
		};
	},
})
</script>
