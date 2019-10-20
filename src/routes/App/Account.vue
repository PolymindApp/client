<template>
	<v-card flat tile class="fill-height grey lighten-2" style="width: 100%">

		<!-- HEADER -->
		<Header :user="user" />

		<!-- TABS -->
		<v-card tile flat>
			<v-container class="pa-0">
				<v-tabs show-arrows v-model="tab" @change="updateContext()">
					<v-tab :to="'/account/' + id + '/wall'">{{$t('account.wall.title')}}</v-tab>
					<v-tab :to="'/account/' + id + '/information'">{{$t('account.information.title')}}</v-tab>
				</v-tabs>
			</v-container>
		</v-card>

		<!-- TAB-ITEMS -->
		<v-container class="pa-0">
			<v-tabs-items style="background-color: transparent" v-model="tab">
				<v-tab-item color="transparent" :value="'/account/' + id + '/wall'" class="pa-4">
					<Wall :user="user" />
				</v-tab-item>
				<v-tab-item color="transparent" :value="'/account/' + id + '/information'" class="pa-4">
					<Information @update="updateContext()" :user="user" />
				</v-tab-item>
			</v-tabs-items>
		</v-container>
	</v-card>
</template>

<script>
import Vue from 'vue';
import UserService from '../../services/User';
import Wall from './Account/Wall.vue';
import Information from "./Account/Information";
import Header from "./Account/Header";
import User from "../../models/User";

export default Vue.extend({
	components: { Wall, Information, Header },

	mounted() {
	    this.load();
	},

	methods: {

		updateContext() {

			const section = (this.$route.params.section ? this.$route.params.section : 'general');
			const secondTitle = this.user.profile.screen_name;
			const thirdTitle = this.$t('account.' + section + '.title');

			this.$root.breadcrumbs = [
				this.$t('title.account'),
				secondTitle,
				thirdTitle,
			];
			document.title = thirdTitle + ' | ' + secondTitle + ' | ' + this.$t('title.account');

			this.id = this.$route.params.id;
		},

	    load() {

			this.$root.isLoading = true;
			UserService.get.bind(this)(this.id)
				.then(response => {
					this.user = response.data;
					this.updateContext();
				})
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
		},
	},

	data: function() {

		return {
			tab: '/account/' + this.$route.params.id + '/' + this.$route.params.section,
			id: this.$route.params.id,
			user: new User(),
		}
	},

	watch: {
	    '$root.user': {
	        deep: true,
	        handler: function(user) {
	            if (user.id === this.user.id) {
                	this.user = user;
				}
			},
		},
		'$route.params.id': function() {
			this.load();
		}
	}
});
</script>

<style lang="scss" scoped>

</style>
