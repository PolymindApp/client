<template>
	<div class="text-center fill-height align-center d-flex">
		<v-form ref="form" class="mx-auto" v-model="formIsValid" @submit="validate" lazy-validation>

			<v-alert v-if="isSent === true" color="success" style="background-color: rgba(0, 0, 0, 0.333) !important" outlined>
				<v-icon size="48">mdi-email-search</v-icon>
				<div class="title my-4">{{ $t("restricted.forgotPasswordSent") }}</div>
				<div class="overline white--text" v-text="$t('restricted.forgotPasswordSentDesc')"></div>
			</v-alert>
			<div v-else>
				<v-alert color="success" style="background-color: rgba(0, 0, 0, 0.333) !important" outlined>
					<v-icon size="48">mdi-lock-question</v-icon>
					<div class="title my-2">{{ $t("restricted.forgotPasswordTitle") }}</div>
					<div class="overline white--text" v-text="$t('restricted.forgotPasswordDesc')"></div>
				</v-alert>

				<div class="my-4">
					<v-text-field :error-messages="formErrors.email" ref="email" light solo v-model="email" :label="$t('restricted.email')" :rules="[rules.required, rules.email]" prepend-inner-icon="mdi-account-circle" :autofocus="$vuetify.breakpoint.lgAndUp" :hide-details="!formErrors.email" @input="formErrors.email = null" autocomplete="email"></v-text-field>
				</div>

				<v-btn type="submit" color="primary" :disabled="!formIsValid" style="width: 100%" dark large>
					{{ $t("restricted.resetPassword") }}
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

	methods: {

		validate (event) {

			event.preventDefault();
			this.formErrors = {};

			if (this.$refs.form.validate()) {
				this.$root.isLoading = true;
				UserService.forgotPassword(this.email)
					.then(response => this.isSent = true)
					.catch(error => {
						switch (parseInt(error.code)) {
							case 107:
								this.formErrors.email = error.message;
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

	data() {
		return {
			email: '',
			isSent: false,
			formIsValid: false,
			formErrors: {},
			rules: {
				required: value => Rules.required(value) || this.$t('rules.required'),
				email: value => Rules.email(value) || this.$t('rules.email'),
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
