<template>
    <v-row>
        <v-col cols="12" md="6">
            <FormCard
                v-if="canEditProfile"
                v-model="profile.user"
                :loading="loading"
                :fields="fields"
                :service="service"
                icon="mdi-account-edit"
                :title="$t('profile.profile')"
            />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import FormCard from '@/components/fields/FormCard.vue';
import UserModel from '@/models/UserModel';
import Query from '@/utils/Query';
import Rules from '@/utils/Rules';
import DeckModel from '@/models/DeckModel';
import LogModel from '@/models/LogModel';
import NotificationModel from '@/models/NotificationModel';

@Component({
    components: {
        FormCard,
    }
})
export default class ProfileSettings extends Vue {

    @Prop() profile!: {
        user: UserModel,
        decks: Array<DeckModel>,
        logs: Array<LogModel>,
        notifications: Array<NotificationModel>,
    }

    @Prop({ type: Boolean, default: false }) loading!: boolean

    rules: any = {}
    fields: Array<any> = []

    service: (model: UserModel) => Promise<UserModel> = (model: UserModel) => {
        return Query.post('/user/' + model.data.id, model)
            .then(response => this.profile.user = new UserModel(response))
    }

    get canEditProfile(): boolean {
        return this.profile.user.data.id === this.$store.state.user.data.id;
    }

    created() {
        const rules = {
            required: (value: any) => Rules.required(value) || this.$t('rules.required'),
        };

        this.fields = [
            { value: 'data.avatar', text: this.$i18n.t('field.avatar'), width: 0, field: {
                rules: [rules.required],
            } },
            { value: 'data.name', text: this.$i18n.t('field.name'), field: {
                rules: [rules.required],
            }, filterable: {
                type: 'text',
            }, },
            { value: 'data.email', text: this.$i18n.t('field.email'), field: {
                disabled: true,
            } },
            { value: 'data.password', text: this.$i18n.t('field.password'), type: 'password', field: {
                hint: '* ' + this.$i18n.t('profile.leavePasswordEmpty'),
                persistentHint: true,
            } },
        ];
    }
}
</script>
