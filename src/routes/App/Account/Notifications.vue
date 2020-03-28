<template>
	<v-row>
		<v-col cols="12" md="8">

			<v-card-title v-text="$t('account.notifications.myTitle', { total: notAcknowledged.length })"></v-card-title>

			<v-expand-transition group>

				<v-alert key="empty" v-if="loaded && notifications.data.length === 0" type="info" border="left" colored-border light elevation="2">
					{{$t('account.notifications.emptyTitle')}}
				</v-alert>

				<v-card key="notEmpty" v-else-if="loaded">
					<v-list three-line>
						<template v-for="(notification, index) in notifications.data">
							<v-list-item :to="'/' + notification.collection + '/' + notification.item" :key="index + '_item'" :class="(!notification.acknowledged_on ? 'v-list-item--active primary--text' : '') + ' align-center'">
								<v-col class="shrink">
									<UserAvatar :size="48" :user="notification.created_by" />
								</v-col>
								<v-col>
									<v-list-item-title class="mb-1">
										<span class="font-weight-medium">{{notification.created_by | userScreenName }}</span>
										<span class="font-weight-light d-block d-md-inline ml-md-4">{{notification.activity.action_on | timeAgo}}</span>
									</v-list-item-title>
									<v-list-item-subtitle>
										<span class="text-break" v-html="$t('notification.types.' + notification.type + '_' + notification.collection, {
											name: notification.relation.data.name
										})"></span>
									</v-list-item-subtitle>
								</v-col>
								<v-col class="d-none d-md-block" v-if="notification.activity.action === 'comment'">
									<v-icon>mdi-format-quote-open</v-icon>
									<span class="title font-italic font-weight-light mx-4">
										{{ notification.activity.comment | plainExcerpt(100) }}
									</span>
									<v-icon>mdi-format-quote-close</v-icon>
								</v-col>
								<v-list-item-icon v-if="!notification.acknowledged_on">
									<v-icon color="primary" xSmall>
										mdi-checkbox-blank-circle
									</v-icon>
								</v-list-item-icon>
							</v-list-item>
							<v-divider v-if="index < notifications.data.length - 1" :key="index + '_sep'"></v-divider>
						</template>
					</v-list>
				</v-card>
			</v-expand-transition>
		</v-col>
		<v-col cols="12" md="4">

			<v-card-title v-text="$t('account.notifications.followingTitle', { total: followings.meta.filter_count })"></v-card-title>

			<v-expand-transition group>

				<v-alert key="empty" v-if="loaded && followings.data.length === 0" type="info" border="left" colored-border light elevation="2">
					{{$t('account.notifications.emptyFollowing')}}
				</v-alert>

				<v-list v-else-if="loaded" key="notEmpty" tile flat color="transparent" three-line>
					<v-expand-transition group>
						<template v-for="(following, index) in followings.data">
							<v-list-item :to="'/account/' + following.user.id" :key="index + '_item'">
								<v-col class="shrink">
									<UserAvatar :size="48" :user="following.user" />
								</v-col>
								<v-col>
									<v-list-item-title>
										{{following.user | userScreenName }}
									</v-list-item-title>
									<v-list-item-subtitle>
										{{following.created_on | timeAgo}}
									</v-list-item-subtitle>
								</v-col>
							</v-list-item>
							<v-divider v-if="index < followings.data.length - 1" :key="index + '_sep'"></v-divider>
						</template>
					</v-expand-transition>
				</v-list>
			</v-expand-transition>
		</v-col>
	</v-row>
</template>

<script>
    import Vue from 'vue';
    import Response from "../../../models/Response";
    import NotificationService from "../../../services/NotificationService";
    import FollowingService from "../../../services/FollowingService";
    import UserAvatar from "../../../components/UserAvatar";
    import EmptyView from "../../../components/EmptyView";

    export default Vue.extend({

        name: 'Notifications',

        props: [],

        components: { NotificationService, FollowingService, UserAvatar, EmptyView },

        mounted() {

            this.init();
        },

        destroyed() {

        },

        methods: {

            init() {

                Promise.all([
                    NotificationService.getAll.bind(this)(),
                    FollowingService.getFollowings.bind(this)(this.$root.user.id),
				]).then(([notifications, followings]) => {
                    this.loaded = true;
                    this.notifications = notifications;
                    this.followings = followings;
				}).catch(error => this.$handleError(this, error));

                // this.wsSubscription = this.$ws.session.subscribe('activity', data => {
                //     // console.log('ACTIVITY', data[0]);
				// 	//
                //     // if (data[0].action_by !== this.$root.user.id) {
				//
                //         if (data[0].collection === 'directus_activity')  {
				//
                //             NotificationService.get.bind(this)(data[0].item.id)
                //                 .then(response => {
                //                     response.data.acknowledged_on = null;
                //                     this.notifications.data.unshift(response.data);
                //                     if (this.$root.user.settings.newMessageSound) {
                //                         this.$playSound('notification');
                //                     }
                //                 })
                //                 .catch(error => this.$handleError(this, error));
                //         }
                //     // }
                // });
			}
		},

        computed: {

            notAcknowledged() {
                return this.notifications.data.filter(notification => {
                    return !notification.acknowledged_on;
				});
			}
		},

        data() {
            return {
                loaded: false,
                notifications: new Response(),
                followings: new Response(),
			};
        }
    });
</script>

<style lang="scss" scoped>

</style>
