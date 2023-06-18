<template>
    <Page class="fill-height pa-0 d-flex flex-column w-100" fluid>
        <div class="w-100" style="flex: 1">
            <DataManager
                v-model="items"
                :headers="headers"
                :fields="fields"
                :default-model="defaultModel"
                :sort-by="['data.created_at']"
                :sort-desc="[true]"
                resource="/admin/dictionary/items"
                id="adminDictionaryItems"
                class="fill-height"
                tile
                flex-height
            />
        </div>
    </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Page from "@/components/layout/Page.vue";
import DictionaryItemModel from '@/models/DictionaryItemModel';
import I18nModel from '@/models/I18nModel';
import Rules from '@/utils/Rules';

@Component({
    components: {
        Page,
    }
})
export default class DictionaryItems extends Vue {

    items: Array<DictionaryItemModel> = []
    defaultModel: new () => DictionaryItemModel = DictionaryItemModel
    headers: Array<any> = []
    fields: Array<any> = []

    created() {
        const rules = {
            required: (value: any) => Rules.required(value) || this.$t('rules.required'),
        };

        this.headers = [
            { value: 'data.cover', text: 'Cover', width: 0, class: 'text-no-wrap', field: {
                rules: [rules.required],
            } },
            { value: 'data.languages', text: 'Languages', hasMany: {
                items: (item: DictionaryItemModel) => item.languages(),
                itemText: (item: I18nModel) => item.data.language.data.name,
            } },
            { value: 'data.created_at', text: 'Created at', width: 0, },
        ];

        this.fields = [
            { value: 'data.cover', text: 'Cover', width: 0, class: 'text-no-wrap', field: {
                rules: [rules.required],
            } },
            { value: 'data.i18n', text: 'Title', hasMany: {
                i18n: true
            }, field: {
                rules: [rules.required],
            } },
        ];
    }
}
</script>
