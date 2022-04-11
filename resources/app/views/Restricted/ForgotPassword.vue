<template>
	<v-form ref="form" :disabled="loading || sent" v-model="formIsValid" @submit="handleFormSubmit" lazy-validation>

		<v-expand-transition>
			<v-alert v-if="sent" class="text-left" type="info" prominent>
				<span v-text="$t('forgotPassword.requestSent')"></span>
			</v-alert>
		</v-expand-transition>

        <template v-if="!sent">
            <v-text-field
                v-model="data.email"
                :error-messages="formErrors.email"
                :label="$t('placeholder.email')"
                :rules="[rules.required, rules.email]"
                :autofocus="$vuetify.breakpoint.mdAndUp"
                prepend-inner-icon="mdi-account"
                autocomplete="email"
                outlined
                required
                @input="formErrors = {}"
            />

            <v-btn type="button" color="primary" :disabled="!canSubmit" :loading="loading" block @click="handleFormSubmit">
                <span v-text="$t('forgotPassword.btn')"></span>
            </v-btn>
        </template>

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
	name: 'ForgotPassword',

	data: () => ({
		loading: false,
		sent: false,
		formIsValid: true,
		formErrors: {},
		rules: {},
		data: {
			email: '',
		},
	}),

	computed: {
		canSubmit() {
			return !this.loading && this.formIsValid && !this.sent;
		},
	},

	methods: {
		handleFormSubmit(event) {

			event.preventDefault();
			this.formErrors = {};

			if (this.$refs.form && this.$refs.form.validate()) {
				this.loading = true;
				Services.forgotPasswordRequest(this.data.email)
					.then(response => this.sent = true)
                    .catch(reason => this.$handleError(reason, this.formErrors, false))
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
