<template>
	<div class="text-center fill-height align-center d-flex" style="max-width: 25rem;">
		<div v-if="isActivated === true">
			<div>
				<v-icon style="font-size: 4rem">mdi-account-check</v-icon>
			</div>

			<h1 class="mt-4 display-1">{{ $t("restricted.accountActivatedTitle") }}</h1>
			<p class="mb-4">{{ $t("restricted.accountActivatedDesc") }}</p>

			<v-btn color="primary" @click="accessAccount()" large dark>
				{{$t('restricted.accessMyAccount')}}
			</v-btn>
		</div>
		<div v-if="isAlreadyActivated">
			<div>
				<v-icon style="font-size: 4rem">mdi-account-alert</v-icon>
			</div>

			<h1 class="mt-4 display-1">{{ $t("error.user_already_activated.title") }}</h1>
			<p class="mb-4">{{ $t("error.user_already_activated.desc") }}</p>

			<v-btn color="primary" to="/login" large dark>
				{{$t('restricted.login')}}
			</v-btn>
		</div>
		<div v-if="hasBadToken">
			<div>
				<v-icon style="font-size: 4rem">mdi-shield-alert</v-icon>
			</div>

			<h1 class="mt-4 display-1">{{ $t("error.bad_token.title") }}</h1>
			<p class="mb-4">{{ $t("error.bad_token.desc") }}</p>

			<v-btn color="primary" @click="resendActivation()" large dark>
				{{$t('restricted.resendActivation')}}
			</v-btn>
		</div>
		<div v-if="isResent">
			<div>
				<v-icon style="font-size: 4rem">mdi-email-search</v-icon>
			</div>

			<h1 class="mt-4 display-1">{{ $t("restricted.accountActivationResentTitle") }}</h1>
			<p class="mb-4" v-html="$t('restricted.accountActivationResentDesc')"></p>
		</div>
	</div>
</template>

<script>
import Vue from 'vue';
import ErrorDialog from '../../components/ErrorDialog.vue';
import Rules from "../../utils/Rules";
import UserService from "../../services/User";
import Form from "../../utils/Form";

export default Vue.extend({

	mounted() {
	    this.verify();
	},

	methods: {

		verify () {

			this.$root.isLoading = true;
			UserService.activate.bind(this)(this.lookup, this.token)
				.then(response => {
					localStorage.setItem('jwt', response.data.jwt);
					this.isActivated = true;
				})
				.catch(error => {
				    switch (error.data.message) {
						case "BAD_TOKEN":
						    this.hasBadToken = true;
						    break;
						case "USER_ALREADY_ACTIVATED":
						    this.isAlreadyActivated = true;
						    break;
						default:
						    this.$handleError(this, error);
					}
					this.isActivated = false;
				})
				.finally(() => this.$root.isLoading = false);
		},

		resendActivation() {

			this.$root.isLoading = true;
			UserService.resendActivation.bind(this)(this.lookup)
				.then(response => {
					this.hasBadToken = false;
					this.isResent = true;
				})
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
		},

		accessAccount() {
			window.location.href = '/';
		},
	},

	data() {
		return {
			isActivated: null,
			isAlreadyActivated: false,
			isResent: false,
			hasBadToken: false,
			lookup: this.$route.params.lookup,
			token: this.$route.params.token,
		};
	},
});
</script>

<style lang="scss" scoped>

</style>
