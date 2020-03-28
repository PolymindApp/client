<template>
	<v-row>
		<v-col cols="12" md="7" lg="8" class="py-0 py-md-3">
			<v-card class="pa-4 pa-md-8" :flat="isMobile" :tile="isMobile">
				<h1 class="title">{{ $t('account.information.generalTitle') }}</h1>

				<v-form ref="generalForm" @submit="apply" lazy-validation v-model="form.general">
					<div class="mt-4">
						<v-text-field :disabled="!isOwner" :error-messages="formErrors.screen_name" v-model="user.screen_name" :label="$t('account.information.screenNameLabel')" class="mt-2" type="text"></v-text-field>
						<v-row>
							<v-col cols="12" md="6" class="py-0">
								<v-text-field :disabled="!isOwner" :error-messages="formErrors.first_name" v-model="user.first_name" :label="$t('account.information.firstNameLabel')" class="mt-2" type="text"></v-text-field>
							</v-col>
							<v-col cols="12" md="6" class="py-0">
								<v-text-field :disabled="!isOwner" :error-messages="formErrors.last_name" v-model="user.last_name" :label="$t('account.information.lastNameLabel')" class="mt-2" type="text"></v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="12" md="6" class="py-0">
								<v-select :disabled="!isOwner" :error-messages="formErrors.gender" v-model="user.gender" :items="genders" :label="$t('account.information.genderLabel')" class="mt-2"></v-select>
							</v-col>
							<v-col cols="12" md="6" class="py-0">
								<DirectUsSelect class="mt-0 mt-md-2" :disabled="!isOwner" @mapped="results => m2m.language = results" :error-messages="formErrors.language" v-model="user.language" root-key="language_id" return-object item-text="english_title" item-value="id" multiple :items="languages" :label="$t('account.information.languagesLabel')" />
							</v-col>
						</v-row>

						<v-text-field :disabled="!isOwner" :error-messages="formErrors.quote" max v-model="user.quote" :label="$t('account.information.quoteLabel')" class="mt-2" type="text"></v-text-field>

						<HTMLEditorField :disabled="!isOwner" :error-messages="formErrors.biography" :label="$t('account.information.biographyLabel')" class="mt-2" v-model="user.biography" />
					</div>

					<v-btn v-if="isOwner" class="mt-4" type="submit" color="primary" :disabled="!isDifferent" large>
						<v-icon left>mdi-content-save</v-icon>
						<span class="text-break">{{ $t("account.information.applyChanges") }}</span>
					</v-btn>
				</v-form>

			</v-card>
		</v-col>
		<v-col v-if="isOwner" cols="12" md="5" lg="4" class="py-0 py-md-3">
			<v-card class="pa-4 pa-md-8" :flat="isMobile" :tile="isMobile">
				<h1 class="title">{{$t('restricted.resetPasswordTitle')}}</h1>
				<p>{{$t('restricted.resetPasswordDesc')}}</p>

				<v-form ref="passwordForm" @submit="resetPassword" lazy-validation v-model="form.password">
					<div class="mt-4">
						<v-text-field :error-messages="formErrors.actual" v-model="actual" :rules="[rules.required, rules.min]" :label="$t('restricted.actualPassPlaceholder')" class="mt-2" prepend-inner-icon="mdi-lock" :type="showActualPassword ? 'text' : 'password'" :append-icon="showActualPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showActualPassword = !showActualPassword"></v-text-field>
						<v-text-field :error-messages="formErrors.password" v-model="password" loading :rules="[rules.required, rules.min]" :label="$t('restricted.newPassPlaceholder')" class="mt-2" prepend-inner-icon="mdi-lock" :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword">
							<template v-slot:progress>
								<v-slide-y-transition>
									<v-progress-linear :value="progress" :color="color" absolute height="7"></v-progress-linear>
								</v-slide-y-transition>
							</template>
						</v-text-field>
						<v-text-field :error-messages="formErrors.confirmation" v-model="confirmation" :rules="[rules.required, rules.min, rules.identical]" :label="$t('restricted.newConfirmationPlaceholder')" class="mt-2" prepend-inner-icon="mdi-lock" :type="showConfirmPassword ? 'text' : 'password'" :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showConfirmPassword = !showConfirmPassword"></v-text-field>
					</div>

					<v-btn type="submit" class="mt-4" color="primary" style="width: 100%" :disabled="!isPasswordSectionDifferent" large>
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
import UserService from '../../../services/UserService';
import Rules from "../../../utils/Rules";
import LanguageService from "../../../services/LanguageService";
import HTMLEditorField from "../../../components/HTMLEditorField";
import DirectUsSelect from "../../../components/DirectUsSelect";

export default Vue.extend({

	props: ['user', 'isDifferent'],
	components: { HTMLEditorField, DirectUsSelect },

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

	        this.formErrors = {};
			this.$refs.generalForm.resetValidation();
			this.$root.isLoading = true;
			UserService.update.bind(this)(this.user.id, {
			    screen_name: this.user.screen_name,
			    first_name: this.user.first_name,
                last_name: this.user.last_name,
			    gender: this.user.gender,
			    quote: this.user.quote,
			    biography: this.user.biography,
				language: this.m2m.language,
			})
				.then(response => {
					this.$root.isSaved = true;
					this.$emit('update', response.data);
				})
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
		},

		resetPassword() {

			event.preventDefault();

			this.formErrors = {};
			this.$refs.passwordForm.resetValidation();
			this.$root.isLoading = true;
			UserService.setPassword.bind(this)(this.user.email, this.actual, this.password, this.confirmation)
				.then(response => {
				    this.$root.isSaved = true;
				    this.$refs.passwordForm.resetValidation();
				    this.$refs.passwordForm.reset();
                    // TODO: Password field not cleared.. bug in Vuetify
                })
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
		},
	},

	computed: {

		isMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		},

	    isOwner() {
	        return this.$root.user.id === this.user.id;
		},

		progress() {
			return Math.min(100, this.password.length * 10)
		},

		color() {

		    if (!this.password) {
		        return 'grey darken-2';
			}

			return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
		},

        isPasswordSectionDifferent() {
            return this.actual && this.password && (this.password === this.confirmation);
		}
	},

	data: function() {
		return {
			formErrors: {},
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
            m2m: {
			    language: [],
			},
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
