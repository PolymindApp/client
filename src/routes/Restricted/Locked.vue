<template>
	<div class="text-center fill-height align-center d-flex w-100">
		<v-form ref="form" v-model="formIsValid" @submit="validate" lazy-validation>

			<div class="my-4">
				<div class="d-flex align-center mb-4">
					<UserAvatar :user="user" :clickable="false" :state="false" />
					<h3 class="ml-4 display-1 text-left">{{ user | userScreenName }}</h3>
				</div>
				<div>
<!--					<div class="mb-4" v-text="$t('restricted.tempLocked')"></div>-->
					<v-text-field :error-messages="formErrors.password" v-model="password" :rules="[rules.required, rules.min]" :placeholder="$t('restricted.passwordPlaceholder')" class="mt-2" hide-details light solo prepend-inner-icon="mdi-lock" :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" autocomplete="password" @click:append="showPassword = !showPassword" autofocus></v-text-field>
				</div>
			</div>

			<v-btn type="submit" color="primary" large style="width: 100%" dark>
				{{$t('restricted.unlockBtn')}}
			</v-btn>

			<v-divider class="my-4"></v-divider>

			<v-btn class="white--text" :disabled="!formIsValid" @click="useOtherAccount()" text>
				{{ $t("restricted.lockedOtherAccount") }}
			</v-btn>
		</v-form>
	</div>
</template>

<script>
import Vue from 'vue';
import { Rules, UserService, User } from "@polymind/sdk-js";
import UserAvatar from "../../components/UserAvatar";

export default Vue.extend({

	components: { UserAvatar },

	created() {

		const lockedUser = localStorage.getItem('lockedUser');
		if (lockedUser) {
			this.user = JSON.parse(lockedUser);

			if (!this.user.email) {
				this.$router.push('/login');
			}
		} else {
			this.$router.push('/login');
		}
	},

	methods: {

		useOtherAccount() {
			localStorage.removeItem('lockedUser');
			this.$router.push('/login');
		},

		validate (event) {

			event.preventDefault();

			if (this.$refs.form.validate()) {
				this.$root.isLoading = true;
				this.$polymind.login(this.user.email, this.password)
					.then(response => {
						localStorage.removeItem('lockedUser');
						window.location.href = localStorage.getItem('redirect_uri') || '/';
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.$root.isLoading = false);
			} else {
				this.$refs.email.focus();
			}
		},
	},

	data() {
		return {
			user: new User(),
			formIsValid: false,
			formErrors: {},
			password: '',
			showPassword: false,
			rules: {
				required: value => Rules.required(value) || this.$t('rules.required'),
				min: value => Rules.min(8, value) || this.$t('rules.min', { amount: 8 }),
			},
		};
	},
});
</script>

<style lang="scss" scoped>
	.v-form {
		margin: 0 auto;
		max-width: 20rem;
	}
</style>
