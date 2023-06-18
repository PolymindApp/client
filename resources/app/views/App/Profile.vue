<template>
    <Page class="fill-height pa-0 align-start flex-column align-stretch" fluid>
        <v-sheet>
            <v-container>
                <v-row>
                    <v-col class="py-md-12 d-flex flex-column justify-center" style="flex: 0">
                        <v-avatar size="128">
                            <v-img :src="profile.user.data.avatar.data.url">
                                <template #placeholder>
                                    <v-skeleton-loader type="image" />
                                </template>
                            </v-img>
                        </v-avatar>
                    </v-col>
                    <v-col v-if="profile.user.data.id" class="py-md-12 d-flex flex-column text-no-wrap justify-center" style="flex: 0">
                        <h2 v-text="profile.user.data.name"></h2>
                        <p class="overline text--disabled mt-n3 mb-0">
                            <span v-for="(role, roleIdx) in profile.user.data.roles">
                                <span v-if="roleIdx > 0">, </span>
                                <span v-text="role.data.name"></span>
                            </span>
                        </p>
                        <p class="caption text--disabled mb-0">Member since {{ profile.user.data.created_at | moment('YYYY-MM-DD') }}</p>
                    </v-col>
                    <v-col class="pl-md-12 d-flex flex-column justify-center align-end">
                        <ContributionGraph
                            v-if="!loading"
                            v-model="contributions"
                            style="max-height: 10rem"
                        />
                    </v-col>
                </v-row>
            </v-container>
            <v-container class="py-0">
                <v-tabs v-if="isSameUser" grow>
                    <v-tab :to="{ name: 'profile.index', params: $route.params }">
                        <span v-text="$t('profile.profile')"></span>
                    </v-tab>
                    <v-tab :to="{ name: 'profile.settings', params: $route.params }" :disabled="!isSameUser">
                        <span v-text="$t('profile.settings')"></span>
                    </v-tab>
                    <v-tab :to="{ name: 'profile.notifications', params: $route.params }" :disabled="!isSameUser">
                        <v-badge
                            :value="newNotifications.length > 0"
                            :content="newNotifications.length"
                            color="error"
                        >
                            <span v-text="$t('profile.notifications')"></span>
                        </v-badge>
                    </v-tab>
                </v-tabs>
            </v-container>
        </v-sheet>

        <v-container class="py-md-12">
            <router-view :key="$route.fullPath" :loading="loading" :profile="profile" />
        </v-container>
    </Page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Page from '@/components/layout/Page.vue';
import ContributionGraph from '@/components/ContributionGraph.vue';
import Services from '@/utils/Services';
import UserModel from '@/models/UserModel';
import DeckModel from '@/models/DeckModel';
import LogModel from '@/models/LogModel';
import moment from 'moment';
import NotificationModel from '@/models/NotificationModel';

@Component({
    components: {
        Page,
        ContributionGraph,
    }
})
export default class Profile extends Vue {

    loading = false
    profile: {
        user: UserModel,
        decks: Array<DeckModel>,
        logs: Array<LogModel>,
        notifications: Array<NotificationModel>,
    } = {
        user: new UserModel(),
        decks: [],
        logs: [],
        notifications: [],
    }

    get isSameUser(): boolean {
        return this.$store.state.user.data.id === this.$route.params.uuid;
    }

    get newNotifications(): Array<NotificationModel> {
        return this.profile.notifications.filter(item => !item.data.acknowledged);
    }

    get contributions(): Array<{ date: string | Date, count: number }> {
        const contributions: any = {};
        this.profile.logs.forEach(log => {
            const day = moment(log.data.created_at).format('YYYY-MM-DD');
            if (!contributions[day]) {
                contributions[day] = 0;
            }
            contributions[day]++;
        });
        return Object.keys(contributions).map(date => ({
           date: new Date(date),
           count: parseInt(contributions[date]),
        }))
    }

    load() {
        this.loading = true;
        return Services.getProfile(this.$route.params.uuid)
            .then(profile => this.profile = profile)
            .catch(this.$handleError)
            .finally(() => this.loading = false);
    }

    created() {
        this.load();
    }
}
</script>
