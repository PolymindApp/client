<template>
	<v-form ref="form" :disabled="loading || mustVerify" v-model="formIsValid" @submit="handleFormSubmit" lazy-validation>

        <v-expand-transition>
            <v-alert v-if="mustVerify" class="text-left" type="info" prominent>
                <span v-text="$t('register.mustVerify')"></span>
            </v-alert>
        </v-expand-transition>

        <template v-if="!mustVerify">
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
                tabindex="1"
                @input="handleInput"
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
                outlined
                required
                tabindex="2"
                @click:append="showPassword = !showPassword"
                @input="handleInput"
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
                tabindex="3"
                @click:append="showConfirmation = !showConfirmation"
                @input="handleInput"
            />

    <!--		<v-checkbox-->
    <!--			v-model="acceptTerms"-->
    <!--			class="mt-0 pt-0"-->
    <!--			tabindex="4"-->
    <!--			:rules="[rules.true]"-->
    <!--		>-->
    <!--			<template #label>-->
    <!--				<i18n path="register.acceptTerms" tag="label">-->
    <!--					<a v-text="$t('register.acceptTermsText')" @click.stop="$emit('terms')"></a>-->
    <!--				</i18n>-->
    <!--			</template>-->
    <!--		</v-checkbox>-->

            <v-btn class="mt-4" tabindex="5" type="submit" color="primary" :disabled="!canSubmit" :loading="loading" block @click="handleFormSubmit">
                <span v-text="$t('btn.register')"></span>
            </v-btn>
        </template>

		<v-btn class="mt-4" tabindex="6" block text :to="{ name: 'login' }">
			<v-icon :left="!$vuetify.rtl" :right="$vuetify.rtl">mdi-arrow-left</v-icon>
			<span v-text="$t('btn.back')"></span>
		</v-btn>
	</v-form>
</template>

<script>
import Vue from 'vue'
import Services from '@/utils/Services';
import Rules from '@/utils/Rules';
import EventBus from "@/utils/EventBus";

export default Vue.extend({
	name: 'Login',

	data: () => ({
		skeleton: true,
		loading: false,
        mustVerify: false,
		formIsValid: true,
		showPassword: false,
		showConfirmation: false,
		formErrors: {},
		rules: {},
		data: {
			email: '',
			password: '',
			confirmation: '',
		},
		// acceptTerms: false,
	}),

	computed: {
		canSubmit() {
			return !this.loading && this.formIsValid && !this.mustVerify;
		},
	},

	methods: {
		handleInput() {
			this.formErrors = {};
			this.$refs.form.validate();
		},
		handleFormSubmit(event) {

			event.preventDefault();
			this.formErrors = {};

			if (this.$refs.form && this.$refs.form.validate()) {
				this.loading = true;
				Services.register(this.data.email, this.data.password, this.data.confirmation, this.$route.query.redirect)
					.then(response => this.mustVerify = true)
                    .catch(reason => this.$handleError(reason, this.formErrors, false))
					.finally(() => this.loading = false);
			}
		},
	},

	created() {
		this.rules = {
			required: value => Rules.required(value) || this.$t('rules.required'),
			email: value => Rules.email(value) || this.$t('rules.email'),
			true: value => value || this.$t('rules.checkbox'),
			identical: () => Rules.identical(this.data.password, this.data.confirmation) || this.$t('rules.passwordConfirmation'),
		};
	},
})
</script>
