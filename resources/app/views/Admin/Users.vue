<template>
    <Page class="fill-height pa-0 d-flex flex-column w-100" fluid>
        <div class="w-100" style="flex: 1">
            <DataManager
                v-model="users"
                :headers="headers"
                :default-model="defaultModel"
                resource="/admin/user"
                id="adminUsers"
                class="fill-height"
                tile
            />
        </div>
    </Page>
</template>

<script lang="ts">
import Page from "@/components/layout/Page.vue";
import DataManager from "@/components/DataManager.vue";
import UserModel from '@/models/UserModel';
import { Component, Vue } from 'vue-property-decorator';
import Rules from '@/utils/Rules';

@Component({
    components: {
        Page,
        DataManager,
    }
})
export default class Users extends Vue {

    users: Array<UserModel> = []
    defaultModel: new () => UserModel = UserModel
    headers: Array<any> = []

    created() {
        const rules = {
            required: (value: any) => Rules.required(value) || this.$t('rules.required'),
            email: (value: any) => Rules.email(value) || this.$t('rules.email'),
        };

        this.headers = [
            { value: 'data.name', text: 'Name', editable: true, field: {
                rules: [rules.required],
            } },
            { value: 'data.email', text: 'Email', editable: true, field: {
                rules: [rules.required, rules.email],
            } },
            { value: 'data.roles', text: 'Roles', editable: true, hasMany: {
                resource: '/admin/role',
                itemText: 'name',
            }, field: {
                rules: [rules.required],
            } },
            { value: 'data.password', text: 'Password', editOnly: true, type: 'password', field: {
                rules: [rules.required],
            } },
            { value: 'data.created_at', text: 'Created at', width: 0, },
        ];
    }
}
</script>
