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
					<v-tab :to="'/account/' + id + '/elements'">
						<v-icon left>mdi-group</v-icon>
						{{$t('account.elements.title')}}
						<v-chip x-small :color="elementCount > 0 ? 'primary' : ''" class="ml-2">
							{{ elementCount }}
						</v-chip>
					</v-tab>
					<v-tab v-if="isCurrentUser" :to="'/account/' + id + '/messaging'">
						<v-icon left>mdi-email</v-icon>
						{{$t('account.messaging.title')}}
					</v-tab>
					<v-tab v-if="isCurrentUser" :to="'/account/' + id + '/notifications'">
						<v-icon left>mdi-bell</v-icon>
						{{$t('account.notifications.title')}}
					</v-tab>
					<v-tab v-if="isCurrentUser" :to="'/account/' + id + '/settings'">
						<v-icon left>mdi-settings-outline</v-icon>
						{{$t('account.settings.title')}}
					</v-tab>
				</v-tabs>
			</v-container>
		</v-card>

		<!-- TAB-ITEMS -->
		<v-container class="pa-0">
			<v-tabs-items touchless style="background-color: transparent" v-model="tab">
				<v-tab-item color="transparent" :value="'/account/' + id + '/wall'" class="pa-4">
					<Activities :user="user" />
				</v-tab-item>
				<v-tab-item color="transparent" :value="'/account/' + id + '/information'" class="pa-4">
					<Information @update="updateValue($event)" :user="user" :is-different="isDifferent" />
				</v-tab-item>
				<v-tab-item color="transparent" :value="'/account/' + id + '/elements'" class="pa-4">
					<Elements :user="user" />
				</v-tab-item>
				<v-tab-item v-if="isCurrentUser" color="transparent" :value="'/account/' + id + '/messaging'" class="pa-4">
					<Messaging :user="user" />
				</v-tab-item>
				<v-tab-item v-if="isCurrentUser" color="transparent" :value="'/account/' + id + '/notifications'" class="pa-4">
					<Notifications :user="user" />
				</v-tab-item>
				<v-tab-item v-if="isCurrentUser" color="transparent" :value="'/account/' + id + '/settings'" class="pa-4">
					<Settings @update="updateValue($event)" :user="user" :is-different="isDifferent" />
				</v-tab-item>
			</v-tabs-items>
		</v-container>
	</v-card>
</template>

<script>
import Vue from 'vue';
import UserService from '../../services/UserService';
import Activities from './Account/Activities.vue';
import Information from "./Account/Information";
import Header from "./Account/Header";
import User from "../../models/User";
import Messaging from "./Account/Messaging";
import Settings from "./Account/Settings";
import Notifications from "./Account/Notifications";
import Elements from "./Account/Elements";
import ComponentService from "../../services/ComponentService";

export default Vue.extend({
	components: { Elements, Activities, Information, Header, Messaging, Notifications, Settings },

	mounted() {
	    this.load();
	},

	methods: {

	    updateValue(user) {
	        this.user = new User(this.$deepClone(user));
	        this.originalUser = new User(this.$deepClone(user));
	        this.$root.user = new User(this.$deepClone(user));
	        this.updateContext();
		},

		updateContext() {

			const section = (this.$route.params.section ? this.$route.params.section : 'general');
			const secondTitle = this.$options.filters.userScreenName(this.user);
			const thirdTitle = this.$t('account.' + section + '.title');

			this.$root.breadcrumbs = [
				this.$t('title.account'),
				secondTitle,
				thirdTitle,
			];
			document.title = thirdTitle + ' | ' + secondTitle + ' | ' + this.$t('title.account');

			this.id = parseInt(this.$route.params.id);
		},

	    load() {

			this.$root.isLoading = true;
			Promise.all([
                UserService.get.bind(this)(this.id),
				ComponentService.countByUser.bind(this)(this.id)
			]).then(([user, component]) => {
                this.user = new User(user.data);
                this.originalUser = this.$deepClone(this.user);
                this.elementCount = component.meta.filter_count;
                this.updateContext();
			})
				.catch(error => this.$handleError(this, error))
				.finally(() => this.$root.isLoading = false);
		},
	},

	computed: {

	    isCurrentUser() {
	        return this.$root.user.id === this.id;
		},

	    isDifferent() {
	        return JSON.stringify(this.user) !== JSON.stringify(this.originalUser);
		}
	},

	data: function() {

		return {
			tab: '/account/' + this.$route.params.id + '/' + this.$route.params.section,
			id: parseInt(this.$route.params.id),
			user: new User(),
            originalUser: new User(),
            elementCount: 0,
		}
	},

	watch: {
	    '$root.user': {
	        deep: true,
	        handler: function(user) {
	            if (user.id === this.user.id) {
                	this.user = new User(this.$deepClone(user));
                	this.originalUser = new User(this.$deepClone(user));
				}
			},
		},
		'$route.params.id': function(id) {
	        this.id = parseInt(id);
			this.load();
		}
	}
});
</script>

<style lang="scss" scoped>

</style>
