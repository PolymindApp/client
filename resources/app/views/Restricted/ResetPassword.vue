<template>
	<v-form ref="form" :disabled="loading || sent" v-model="formIsValid" @submit="handleFormSubmit" lazy-validation>

		<v-expand-transition>
			<v-alert v-if="sent" class="text-left" type="info" prominent>
				<span v-text="$t('resetPassword.requestSent')"></span>
			</v-alert>
		</v-expand-transition>
		<v-expand-transition>
			<v-alert v-if="invalidToken" class="text-left" type="error" prominent>
				<span v-text="$t('resetPassword.invalidToken')"></span>
			</v-alert>
		</v-expand-transition>

        <template v-if="skeleton">
            <v-progress-circular color="primary" indeterminate></v-progress-circular>
        </template>
        <template v-else-if="!invalidToken">

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
                tabindex="2"
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
                tabindex="3"
                outlined
                required
                @click:append="showConfirmation = !showConfirmation"
                @input="handleFormInput"
            />

            <v-btn type="submit" color="primary" tabindex="4" :disabled="!canSubmit" :loading="loading" block @click="handleFormSubmit">
                <span v-text="$t('resetPassword.btn')"></span>
            </v-btn>
        </template>

		<v-btn class="mt-4" block text tabindex="5" :to="{ name: 'login' }">
			<v-icon :left="!$vuetify.rtl" :right="$vuetify.rtl">mdi-arrow-left</v-icon>
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
        skeleton: true,
		loading: false,
		sent: false,
        invalidToken: false,
		showPassword: false,
		showConfirmation: false,
		formIsValid: true,
		formErrors: {},
		rules: {},
		data: {
			email: '',
			password: '',
			confirmation: '',
		},
	}),

	computed: {
		canSubmit() {
			return !this.loading && this.formIsValid && !this.sent && !this.invalidToken;
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
				Services.resetPassword(this.data.email, this.data.password, this.data.confirmation, this.$route.params.token)
					.then(() => this.sent = true)
                    .catch(reason => {
                        if (reason.message === 'PASSWORDS_TOKEN') {
                            this.invalidToken = true;
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
			email: value => Rules.email(value) || this.$t('rules.email'),
			required: value => Rules.required(value) || this.$t('rules.required'),
			identical: () => Rules.identical(this.data.password, this.data.confirmation) || this.$t('rules.passwordConfirmation'),
		};

        this.skeleton = false;
	},
})
</script>
