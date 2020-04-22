<template>
	<div class="text-center fill-height align-center d-flex justify-center" style="margin: 0 auto; max-width: 25rem;">
		<div v-if="!errorCode && isActivated === true">
			<div>
				<v-icon style="font-size: 4rem">mdi-account-check</v-icon>
			</div>

			<h1 class="mt-4 display-1">{{ $t("restricted.accountActivatedTitle") }}</h1>
			<p class="mb-4">{{ $t("restricted.accountActivatedDesc") }}</p>

			<v-btn color="primary" @click="accessAccount()" large dark>
				{{$t('restricted.accessMyAccount')}}
			</v-btn>
		</div>
		<div v-else-if="errorCode === 100">
			<div>
				<v-icon style="font-size: 4rem">mdi-account-alert</v-icon>
			</div>

			<h1 class="mt-4 display-1">{{ $t("error.user_already_activated.title") }}</h1>
			<p class="mb-4">{{ $t("error.user_already_activated.desc") }}</p>

			<v-btn color="primary" to="/login" large dark>
				{{$t('restricted.login')}}
			</v-btn>
		</div>
		<div v-else-if="errorCode === 99">
			<div>
				<v-icon style="font-size: 4rem">mdi-shield-alert</v-icon>
			</div>

			<h1 class="mt-4 display-1">{{ $t("error.bad_token.title") }}</h1>
			<p class="mb-4">{{ $t("error.bad_token.desc") }}</p>

			<v-btn color="primary" @click="resendActivation()" large dark>
				{{$t('restricted.resendActivation')}}
			</v-btn>
		</div>
		<div v-else-if="errorCode === 105">
			<div>
				<v-icon style="font-size: 4rem">mdi-shield-alert</v-icon>
			</div>

			<h1 class="mt-4 display-1">{{ $t("error.token_expired.title") }}</h1>
			<p class="mb-4">{{ $t("error.token_expired.desc") }}</p>

			<v-btn color="primary" @click="resendActivation()" large dark>
				{{$t('restricted.resendActivation')}}
			</v-btn>
		</div>
		<div v-else-if="isResent">
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
import { UserService } from "@polymind/sdk-js";

export default Vue.extend({

	mounted() {
	    this.verify();
	},

	methods: {

		verify () {

			this.$root.isLoading = true;
			UserService.activate(this.token)
				.then(response => this.isActivated = true)
				.catch(error => {
                    this.isActivated = false;
				    switch (error.code) {
						case 105:
						    this.errorCode = error.code;
						    break;
						default:
						    this.$handleError(this, error);
					}
				})
				.finally(() => this.$root.isLoading = false);
		},

		resendActivation() {

			this.$root.isLoading = true;
			UserService.resendActivation(this.lookup)
				.then(response => {
					this.errorCode = null;
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
            errorCode: null,
			isResent: false,
			lookup: this.$route.params.lookup,
			token: this.$route.params.token,
		};
	},
});
</script>

<style lang="scss" scoped>

</style>
