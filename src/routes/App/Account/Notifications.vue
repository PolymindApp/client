<template>
	<v-expand-transition>
		<v-alert v-if="loaded && notifications.length === 0" type="info" class="mb-6" transition="scale-transition" border="left" colored-border light elevation="2">
			{{$t('account.activities.historyEmpty')}}
		</v-alert>
    	<v-card v-else>
			<v-list tile flat color="transparent" three-line>
				<template v-for="(notification, index) in notifications">
					<v-list-item :to="'/account/' + $root.user.id + '/messaging/' + notification.created_by.id" :key="index + '_item'" :class="(!notification.aknowledged_on ? 'v-list-item--active primary--text' : '') + ' align-center'">
						<v-col class="shrink">
							<UserAvatar :size="48" :user="notification.created_by" />
						</v-col>
						<v-col>
							<v-list-item-title>{{notification.created_by | userScreenName}}</v-list-item-title>
							<v-list-item-subtitle>test</v-list-item-subtitle>
						</v-col>
						<v-list-item-icon v-if="!notification.aknowledged_on">
							<v-icon color="primary" xSmall>
								mdi-checkbox-blank-circle
							</v-icon>
						</v-list-item-icon>
					</v-list-item>
					<v-divider v-if="index < notifications.length - 1" :key="index + '_sep'"></v-divider>
				</template>
			</v-list>
		</v-card>
	</v-expand-transition>
</template>

<script>
    import Vue from 'vue';
    import NotificationService from "../../../services/Notification";
    import UserAvatar from "../../../components/UserAvatar";

    export default Vue.extend({

        name: 'Notifications',

        props: [],

        components: { NotificationService, UserAvatar },

        mounted() {

            this.init();
        },

        destroyed() {

        },

        methods: {

            init() {

                NotificationService.get.bind(this)()
                    .then(response => {
                        this.loaded = true;
                        this.notifications = response.data;
                    })
                    .catch(error => this.$handleError(this, error));
			}
		},

        computed: {

		},

        data() {
            return {
                loaded: false,
                notifications: [],
			};
        }
    });
</script>

<style lang="scss" scoped>

</style>
