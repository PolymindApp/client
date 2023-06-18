<template>
    <Page class="fill-height pa-0 d-flex flex-column w-100" fluid>
        <div class="w-100" style="flex: 1">
            <DataManager
                v-model="users"
                :headers="headers"
                :fields="fields"
                :default-model="defaultModel"
                resource="/admin/user"
                id="adminUsers"
                class="fill-height"
                tile
                view="cards"
                flex-height
            />
        </div>
    </Page>
</template>

<script lang="ts">
import Page from "@/components/layout/Page.vue";
import UserModel from '@/models/UserModel';
import { Component, Vue } from 'vue-property-decorator';
import Rules from '@/utils/Rules';
import Services from '@/utils/Services';
import RoleModel from '@/models/RoleModel';

@Component({
    components: {
        Page,
    }
})
export default class Users extends Vue {

    users: Array<UserModel> = []
    defaultModel: new () => UserModel = UserModel
    headers: Array<any> = []
    fields: Array<any> = []

    created() {
        const rules = {
            required: (value: any) => Rules.required(value) || this.$t('rules.required'),
            email: (value: any) => Rules.email(value) || this.$t('rules.email'),
        };

        this.fields = [
            { value: 'data.avatar', text: 'Avatar', class: 'text-no-wrap', width: 0, sortable: false, field: {
                rules: [rules.required],
            } },
            { value: 'data.name', text: 'Name', class: 'v-card__title pb-0', truncate: true, field: {
                rules: [rules.required],
            }, filterable: {
                type: 'text',
            }, },
            { value: 'data.email', text: 'Email', truncate: true, field: {
                rules: [rules.required, rules.email],
            }, filterable: {
                type: 'text',
            }, },
            { value: 'data.roles', text: 'Roles', class: 'py-0', hasMany: {
                resource: () => Services.getList('/admin/role', 'roles', RoleModel),
                itemValue: 'data.id',
                itemText: 'data.name',
            }, field: {
                rules: [rules.required],
            } },
        ];

        this.headers = [
            ...this.fields,
            { value: 'data.created_at', text: 'Created at', width: 0, },
        ];

        this.fields.push(
            { value: 'data.password', text: 'Password', type: 'password', },
        );
    }
}
</script>
