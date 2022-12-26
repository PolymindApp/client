<template>
    <Page :title="title" class="fill-height pa-0 d-flex flex-column w-100" fluid>
        <div :class="{
            'w-100 px-md-0 pb-3': true,
            'overflow-y-auto': $vuetify.breakpoint.smAndDown,
        }" :style="{
            flexGrow: $vuetify.breakpoint.smAndDown ? 1 : null,
            height: $vuetify.breakpoint.smAndDown ? 0 : null,
        }">
            <v-data-table
                :items="users"
                item-key="data.id"
                :search="search"
                :headers="[
                    { value: 'data.name', text: 'Name', },
                    { value: 'data.email', text: 'Email', },
                    { value: 'data.roles', text: 'Roles', },
                    { value: 'data.created_at', text: 'Created at', },
                ]"
            >
                <template #item.data.roles="{ item }">
                    <span v-for="role in item.data.roles" v-text="role.name"></span>
                    <span v-if="item.data.roles.length === 0" v-text="$t('admin.users.noRole')"></span>
                </template>
            </v-data-table>
        </div>
    </Page>
</template>

<script lang="ts">
import Page from "@/components/layout/Page.vue";
import UserModel from '@/models/UserModel';
import Services from "@/utils/Services";
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {
        Page
    }
})
export default class Users extends Vue {
    title: string
    search: string = ''
    users: Array<UserModel> = []

    load(): Promise<Array<UserModel>> {
        return Services.getUsers()
            .then(users => this.users = users);
    }

    created(): void {
        this.title = this.$t('admin.users.title').toString();
        this.load();
    }
}
</script>
