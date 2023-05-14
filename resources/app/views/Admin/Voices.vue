<template>
    <Page class="fill-height pa-0 d-flex flex-column w-100" fluid>
        <div class="w-100" style="flex: 1">
            <DataManager
                v-model="voices"
                :headers="headers"
                :default-model="defaultModel"
                :sort-by="['data.name']"
                :sort-desc="[false]"
                resource="/admin/voice"
                id="adminVoices"
                class="fill-height"
                tile
            />
        </div>
    </Page>
</template>

<script lang="ts">
import Page from "@/components/layout/Page.vue";
import DataManager from "@/components/DataManager.vue";
import VoiceModel from '@/models/VoiceModel';
import { Component, Vue } from 'vue-property-decorator';
import Rules from '@/utils/Rules';

@Component({
    components: {
        Page,
        DataManager,
    }
})
export default class Voices extends Vue {

    voices: Array<VoiceModel> = []
    defaultModel: new () => VoiceModel = VoiceModel
    headers: Array<any> = []

    created() {
        const rules = {
            required: (value: any) => Rules.required(value) || this.$t('rules.required'),
        };

        this.headers = [
            { value: 'data.name', text: 'Name', editable: true, field: {
                rules: [rules.required],
            } },
            { value: 'data.language.data.name', text: 'Language', },
            { value: 'data.language_id', text: 'Language', editOnly: true, hasOne: {
                resource: '/language',
                itemText: 'name',
                itemValue: 'id',
            }, field: {
                rules: [rules.required],
            } },
            { value: 'data.gender', text: 'Female', editable: true, },
            { value: 'data.neural', text: 'Neural', editable: true, },
            { value: 'data.standard', text: 'Standard', editable: true, },
            { value: 'data.bilingual', text: 'Bilingual', editable: true, },
            { value: 'data.child', text: 'Child', editable: true, },
        ]
    }
}
</script>
