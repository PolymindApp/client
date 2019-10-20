<template>
	<v-row>
		<v-col cols="12" md="7" lg="8">
			<v-card class="pa-8">
				<h1 class="display-1">{{ $t('account.information.generalTitle') }}</h1>

				<v-form ref="generalForm" @submit="apply" lazy-validation v-model="form.general">
					<div class="my-4">
						<v-text-field :error-messages="formErrors.screen_name" v-model="user.profile.screen_name" :label="$t('account.information.screenNameLabel')" class="mt-2" type="text"></v-text-field>
						<v-row>
							<v-col class="py-0">
								<v-text-field :error-messages="formErrors.first_name" v-model="user.profile.first_name" :label="$t('account.information.firstNameLabel')" class="mt-2" type="text"></v-text-field>
							</v-col>
							<v-col class="py-0">
								<v-text-field :error-messages="formErrors.last_name" v-model="user.profile.last_name" :label="$t('account.information.lastNameLabel')" class="mt-2" type="text"></v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col class="py-0">
								<v-select :error-messages="formErrors.gender" v-model="user.profile.gender" :items="genders" :label="$t('account.information.genderLabel')" class="mt-2"></v-select>
							</v-col>
							<v-col class="py-0">
								<v-select :error-messages="formErrors.languages" v-model="user.language" return-object item-text="english_name" item-value="id" multiple :items="languages" :label="$t('account.information.languagesLabel')" class="mt-2"></v-select>
							</v-col>
						</v-row>

						<v-text-field :error-messages="formErrors.quote" max v-model="user.profile.quote" :label="$t('account.information.quoteLabel')" class="mt-2" type="text"></v-text-field>

						<HTMLEditorField :error-messages="formErrors.biography" :label="$t('account.information.biographyLabel')" class="mt-2" v-model="user.profile.biography" />
					</div>

					<v-btn type="submit" color="primary" dark large>
						<v-icon left>mdi-content-save</v-icon>
						{{ $t("account.information.applyChanges") }}
					</v-btn>
				</v-form>

			</v-card>
		</v-col>
		<v-col cols="12" md="5" lg="4">
			<v-card class="pa-8">
				<h1 class="display-1">{{$t('restricted.resetPasswordTitle')}}</h1>
				<p>{{$t('restricted.resetPasswordDesc')}}</p>

				<v-form ref="passwordForm" @submit="resetPassword" lazy-validation v-model="form.password">
					<div class="my-4">
						<v-text-field :error-messages="formErrors.actual" v-model="actual" :rules="[rules.required, rules.min]" :label="$t('restricted.actualPassPlaceholder')" class="mt-2" prepend-inner-icon="mdi-lock" :type="showActualPassword ? 'text' : 'password'" :append-icon="showActualPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showActualPassword = !showActualPassword"></v-text-field>
						<v-text-field :error-messages="formErrors.password" v-model="password" loading :rules="[rules.required, rules.min]" :label="$t('restricted.newPassPlaceholder')" class="mt-2" prepend-inner-icon="mdi-lock" :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword">
							<template v-slot:progress>
								<v-progress-linear :value="progress" :color="color" absolute height="7"></v-progress-linear>
							</template>
						</v-text-field>
						<v-text-field :error-messages="formErrors.confirmation" v-model="confirmation" :rules="[rules.required, rules.min, rules.identical]" :label="$t('restricted.newConfirmationPlaceholder')" class="mt-2" prepend-inner-icon="mdi-lock" :type="showConfirmPassword ? 'text' : 'password'" :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showConfirmPassword = !showConfirmPassword"></v-text-field>
					</div>

					<v-btn type="submit" color="primary" style="width: 100%" dark large>
						{{ $t("restricted.resetPasswordBtn") }}
						<v-icon style="align-self: flex-end" right>mdi-lock-reset</v-icon>
					</v-btn>
				</v-form>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import Vue from 'vue';
import UserService from '../../../services/User';
import Rules from "../../../utils/Rules";
import LanguageService from "../../../services/Language";
import HTMLEditorField from "../../../components/HTMLEditorField";

export default Vue.extend({

	props: ['user'],
	components: { HTMLEditorField },

	mounted() {
	    this.load();
	},

	methods: {

	    load() {

	        this.$root.isLoading = true;
	        LanguageService.getAll.bind(this)()
				.then(response => this.languages = response.data)
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
		},

		apply(event) {

	        event.preventDefault();

	        this.formErrors = [];
			this.$refs.generalForm.resetValidation();
			this.$root.isLoading = true;
			UserService.update.bind(this)(this.user.id, this.user)
				.then(response => {
					this.$root.isSaved = true;
					this.$root.user = {...this.user};
					this.$emit('update', this.user);
				})
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
		},

		resetPassword() {

			event.preventDefault();

			this.formErrors = [];
			this.$refs.passwordForm.resetValidation();
			this.$root.isLoading = true;
			UserService.setPassword.bind(this)(this.user.id, this.actual, this.password, this.confirmation)
				.then(response => this.$root.isSaved = true)
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
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

	data: function() {
		return {
			formErrors: [],
			form: {
				general: true,
				password: true,
			},
			actual: '',
			password: '',
			confirmation: '',
			showActualPassword: false,
			showPassword: false,
			showConfirmPassword: false,
			languages: [],
			genders: [
				{ text: 'Male', value: 0 },
				{ text: 'Female', value: 1 },
				{ text: 'Other', value: 2 },
			],
			rules: {
				required: value => Rules.required(value) || this.$t('rules.required'),
				min: value => Rules.min(8, value) || this.$t('rules.min', { amount: 8 }),
				identical: value => Rules.identical(value, this.password) || this.$t('rules.passwordConfirm'),
			},
		}
	},
});
</script>
