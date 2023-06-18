<template>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-title>
                    <v-icon left>mdi-bell</v-icon>
                    <span v-text="$t('profile.latestNotifications')"></span>
                </v-card-title>
                <v-card-text>
                    <v-progress-linear
                        v-if="loading"
                        indeterminate
                    />
                    <v-alert
                        v-else-if="profile.notifications.length === 0"
                        type="info"
                        text
                        border="left"
                        class="mb-0"
                    >
                        <span v-text="$t('profile.noNotifications')"></span>
                    </v-alert>
                    <v-list v-else dense>
                        <v-list-item
                            v-for="notification in profile.notifications"
                            :key="notification.data.id"
                            :color="!notification.data.acknowledged ? 'primary' : null"
                            :input-value="!notification.data.acknowledged"
                            class="not-clickable"
                            @click="() => {}"
                        >
                            <v-list-item-icon>
                                <v-icon :color="notification.getColor()" v-text="notification.getIcon()"></v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-text="$t('notification.type.' + notification.data.type.toLowerCase(), notification.data.meta)"></v-list-item-title>
                                <v-list-item-subtitle v-text="$options.filters.humanDate(notification.data.created_at)"></v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import UserModel from '@/models/UserModel';
import DeckModel from '@/models/DeckModel';
import LogModel from '@/models/LogModel';
import NotificationModel from '@/models/NotificationModel';
import Services from '@/utils/Services';

@Component
export default class ProfileNotifications extends Vue {

    @Prop() profile!: {
        user: UserModel,
        decks: Array<DeckModel>,
        logs: Array<LogModel>,
        notifications: Array<NotificationModel>,
    }

    @Prop({ type: Boolean, default: false }) loading!: boolean

    acknowledgeNotifications(): void {
        const unacknowledgedNotifications = this.profile.notifications.filter(notification => !notification.data.acknowledged);
        if (unacknowledgedNotifications.length > 0) {
            Services.acknowledgeNotifications(unacknowledgedNotifications)
                .then(notifications => {
                    this.profile.notifications = notifications;
                    this.$store.commit('acknowledgeNotifications', notifications);
                })
                .catch(this.$handleError);
        }
    }

    destroyed() {
        this.acknowledgeNotifications();
    }

}
</script>
