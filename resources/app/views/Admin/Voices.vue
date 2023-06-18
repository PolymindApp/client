<template>
    <Page class="fill-height pa-0 d-flex flex-column w-100" fluid>
        <div class="w-100" style="flex: 1">
            <DataManager
                v-model="voices"
                :headers="headers"
                :fields="fields"
                :default-model="defaultModel"
                :sort-by="['data.name']"
                :sort-desc="[false]"
                :available-views="['datatable', 'calendar']"
                resource="/admin/voice"
                id="adminVoices"
                class="fill-height"
                tile
                flex-height
            />
        </div>
    </Page>
</template>

<script lang="ts">
import Page from "@/components/layout/Page.vue";
import VoiceModel from '@/models/VoiceModel';
import { Component, Vue } from 'vue-property-decorator';
import Rules from '@/utils/Rules';

@Component({
    components: {
        Page,
    }
})
export default class Voices extends Vue {

    voices: Array<VoiceModel> = []
    defaultModel: new () => VoiceModel = VoiceModel
    headers: Array<any> = []
    fields: Array<any> = []

    created() {
        const rules = {
            required: (value: any) => Rules.required(value) || this.$t('rules.required'),
        };

        this.headers = [
            { value: 'data.name', text: 'Name', field: {
                rules: [rules.required],
            } },
            { value: 'data.language.data.name', text: 'Language', },
            { value: 'data.gender', text: 'Female', },
            { value: 'data.neural', text: 'Neural', },
            { value: 'data.standard', text: 'Standard', },
            { value: 'data.bilingual', text: 'Bilingual', },
            { value: 'data.child', text: 'Child', },
        ];

        this.fields = [
            { value: 'data.name', text: 'Name', field: {
                rules: [rules.required],
            } },
            { value: 'data.language_id', text: 'Language', hasOne: {
                resource: '/language',
                itemText: 'name',
                itemValue: 'id',
            }, field: {
                rules: [rules.required],
            } },
            { value: 'data.gender', text: 'Female', type: 'boolean', },
            { value: 'data.neural', text: 'Neural', type: 'boolean', },
            { value: 'data.standard', text: 'Standard', type: 'boolean', },
            { value: 'data.bilingual', text: 'Bilingual', type: 'boolean', },
            { value: 'data.child', text: 'Child', type: 'boolean', },
        ];
    }
}
</script>
