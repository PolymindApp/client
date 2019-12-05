<template>
	<v-expand-transition>
    	<v-card>

			<EmptyView :title="$t('account.notifications.emptyTitle')" :desc="$t('account.notifications.emptyDesc')" class="py-12" />

			<v-list tile flat color="transparent" three-line>
				<template v-for="(notification, index) in notifications">
					<v-list-item :to="'/account/' + $root.user.id + '/messaging/' + notification.created_by.id" :key="index + '_item'" :class="(!notification.aknowledged_on ? 'v-list-item--active primary--text' : '') + ' align-center'">
						<v-col class="shrink">
							<UserAvatar :size="48" :user="notification.created_by" />
						</v-col>
						<v-col>
							<v-list-item-title>
								<span class="font-weight-medium">{{notification.created_by | userScreenName }}</span>
								<span class="font-weight-light ml-4">{{notification.activity.action_on | timeAgo}}</span>
							</v-list-item-title>
							<v-list-item-subtitle v-html="$t('notification.types.' + notification.type + '_' + notification.collection, {
								name: notification.relation.data.name
							})"></v-list-item-subtitle>
						</v-col>
						<v-col v-if="notification.activity.action === 'comment'">
							<v-icon>mdi-format-quote-open</v-icon>
							<span class="title font-italic font-weight-light mx-4">
								{{ notification.activity.comment | plainExcerpt(100) }}
							</span>
							<v-icon>mdi-format-quote-close</v-icon>
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
    import NotificationService from "../../../services/NotificationService";
    import UserAvatar from "../../../components/UserAvatar";
    import EmptyView from "../../../components/EmptyView";

    export default Vue.extend({

        name: 'Notifications',

        props: [],

        components: { NotificationService, UserAvatar, EmptyView },

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
