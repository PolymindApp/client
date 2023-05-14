<template>
    <Page class="fill-height pa-0 d-flex flex-column w-100" fluid>
        <div class="w-100" style="flex: 1">
            <DataManager
                v-model="dictionaries"
                :headers="headers"
                :default-model="defaultModel"
                :sort-by="['data.i18n']"
                :sort-desc="[false]"
                resource="/admin/dictionary"
                id="adminDictionaries"
                class="fill-height"
                tile
            />
        </div>
    </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Page from "@/components/layout/Page.vue";
import DataManager from "@/components/DataManager.vue";
import DictionaryModel from '@/models/DictionaryModel';
import Services from "@/utils/Services";
import I18nModel from '@/models/I18nModel';
import Rules from '@/utils/Rules';
import DictionaryI18nModel from '@/models/DictionaryI18nModel';

@Component({
    components: {
        Page,
        DataManager,
    }
})
export default class Dictionaries extends Vue {

    dictionaries: Array<DictionaryModel> = []
    defaultModel: new () => DictionaryModel = DictionaryModel
    headers: Array<any> = []

    created() {
        const rules = {
            required: (value: any) => Rules.required(value) || this.$t('rules.required'),
        };

        this.headers = [
            { value: 'data.cover', text: 'Cover', editable: true, width: 0, class: 'text-no-wrap', field: {
                rules: [rules.required],
            } },
            { value: 'data.category.data.i18n', text: 'Category', editable: true, hasOne: {
                i18n: true,
                resource: () => Services.getDictionaryCategories(),
                itemValue: (item: I18nModel) => item.data.id,
            }, field: {
                rules: [rules.required],
            } },
            { value: 'data.i18n', text: 'Title', editOnly: true, hasMany: {
                i18n: true,
                filter: (item: I18nModel) => item.data.type === 'title',
            }, field: {
                rules: [rules.required],
            } },
            { value: 'data.i18n', text: 'Body', editOnly: true, hasMany: {
                i18n: true,
                filter: (item: I18nModel) => item.data.type === 'body',
            }, field: {
                rules: [rules.required],
            } },
            { value: 'data.languages', text: 'Languages', hasMany: {
                items: (item: DictionaryModel) => item.languages(),
                itemText: (item: I18nModel) => item.data.language.data.name,
            } },
            { value: 'data.total_items', text: 'Total items', },
            { value: 'data.created_at', text: 'Created at', width: 0, },
        ];
    }
}
</script>
