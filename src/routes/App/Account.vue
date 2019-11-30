<template>
	<v-card flat tile class="fill-height grey lighten-2" style="width: 100%">

		<!-- HEADER -->
		<Header :user="user" />

		<!-- TABS -->
		<v-card tile flat>
			<v-container class="pa-0">
				<v-tabs show-arrows v-model="tab" @change="updateContext()">
					<v-tab :to="'/account/' + id + '/wall'">
						<v-icon left>mdi-timeline-text</v-icon>
						{{$t('account.wall.title')}}
					</v-tab>
					<v-tab :to="'/account/' + id + '/information'">
						<v-icon left>mdi-card-bulleted-outline</v-icon>
						{{$t('account.information.title')}}
					</v-tab>
					<v-tab :to="'/account/' + id + '/messaging'">
						<v-icon left>mdi-email</v-icon>
						{{$t('account.messaging.title')}}
					</v-tab>
					<v-tab :to="'/account/' + id + '/notifications'">
						<v-icon left>mdi-bell</v-icon>
						{{$t('account.notifications.title')}}
					</v-tab>
				</v-tabs>
			</v-container>
		</v-card>

		<!-- TAB-ITEMS -->
		<v-container class="pa-0">
			<v-tabs-items style="background-color: transparent" v-model="tab">
				<v-tab-item color="transparent" :value="'/account/' + id + '/wall'" class="pa-4">
					<Activities :user="user" />
				</v-tab-item>
				<v-tab-item color="transparent" :value="'/account/' + id + '/information'" class="pa-4">
					<Information @update="updateValue($event)" :user="user" :is-different="isDifferent" />
				</v-tab-item>
				<v-tab-item color="transparent" :value="'/account/' + id + '/messaging'" class="pa-4">
					<Messaging :user="user" />
				</v-tab-item>
				<v-tab-item color="transparent" :value="'/account/' + id + '/notifications'" class="pa-4">
					<Notifications :user="user" />
				</v-tab-item>
			</v-tabs-items>
		</v-container>
	</v-card>
</template>

<script>
import Vue from 'vue';
import UserService from '../../services/User';
import Activities from './Account/Activities.vue';
import Information from "./Account/Information";
import Header from "./Account/Header";
import User from "../../models/User";
import Messaging from "./Account/Messaging";
import Notifications from "./Account/Notifications";

export default Vue.extend({
	components: { Activities, Information, Header, Messaging, Notifications },

	mounted() {
	    this.load();
	},

	methods: {

	    updateValue(user) {
	        this.user = new User(user);
	        this.originalUser = {...this.user};
	        this.updateContext();
		},

		updateContext() {

			const section = (this.$route.params.section ? this.$route.params.section : 'general');
			const secondTitle = this.user.first_name + ' ' + this.user.last_name;
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
					this.user = new User(response.data);
					this.originalUser = {...this.user};
					this.updateContext();
				})
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
		},
	},

	computed: {

	    isDifferent() {
	        return JSON.stringify(this.user) !== JSON.stringify(this.originalUser);
		}
	},

	data: function() {

		return {
			tab: '/account/' + this.$route.params.id + '/' + this.$route.params.section,
			id: this.$route.params.id,
			user: new User(),
            originalUser: new User(),
		}
	},

	watch: {
	    '$root.user': {
	        deep: true,
	        handler: function(user) {
	            if (user.id === this.user.id) {
                	this.user = user;
                	this.originalUser = {...user};
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
