<template>
    <Page class="fill-height pa-0 d-flex flex-column w-100" fluid>
        <div class="w-100" style="flex: 1">
            <DataManager
                v-model="languages"
                :headers="headers"
                :fields="headers"
                :default-model="defaultModel"
                :sort-by="['data.name']"
                :sort-desc="[false]"
                :available-views="['datatable']"
                resource="/admin/language"
                id="adminLanguages"
                class="fill-height"
                tile
                flex-height
            />
        </div>
    </Page>
</template>

<script lang="ts">
import Page from "@/components/layout/Page.vue";
import LanguageModel from '@/models/LanguageModel';
import { Component, Vue } from 'vue-property-decorator';
import Rules from '@/utils/Rules';

@Component({
    components: {
        Page,
    }
})
export default class Languages extends Vue {

    languages: Array<LanguageModel> = []
    defaultModel: new () => LanguageModel = LanguageModel
    headers: Array<any> = []

    created() {
        const rules = {
            required: (value: any) => Rules.required(value) || this.$t('rules.required'),
        };

        this.headers = [
            { value: 'data.code', text: 'Code', editable: true, width: 0, class: 'text-no-wrap', field: {
                rules: [rules.required],
            } },
            { value: 'data.name', text: 'Name', editable: true, field: {
                rules: [rules.required],
            } },
        ];
    }
}
</script>
