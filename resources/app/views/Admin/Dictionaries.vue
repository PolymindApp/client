<template>
    <Page class="fill-height pa-0 d-flex flex-column w-100" fluid>
        <div class="w-100" style="flex: 1">
            <DataManager
                v-model="dictionaries"
                :headers="headers"
                :fields="fields"
                :default-model="defaultModel"
                :sort-by="['data.created_at']"
                :sort-desc="[true]"
                :modal-attrs="{
                    maxWidth: 1000,
                }"
                resource="/admin/dictionary"
                id="adminDictionaries"
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
import DictionaryModel from '@/models/DictionaryModel';
import Services from "@/utils/Services";
import Rules from '@/utils/Rules';
import DictionaryItemModel from '@/models/DictionaryItemModel';
import Query from '@/utils/Query';

@Component({
    components: {
        Page,
    }
})
export default class Dictionaries extends Vue {

    dictionaries: Array<DictionaryModel> = []
    defaultModel: new () => DictionaryModel = DictionaryModel
    headers: Array<any> = []
    fields: Array<any> = []

    created() {
        const rules = {
            required: (value: any) => Rules.required(value) || this.$t('rules.required'),
        };

        this.headers = [
            { value: 'data.cover', text: 'Cover', width: 0, class: 'text-no-wrap', sortable: false, field: {
                rules: [rules.required],
            } },
            { value: 'data.i18n', text: 'Title', hasOne: {
                i18n: {
                    type: 'title',
                },
            }, class: 'text-no-wrap' },
            { value: 'data.category.data.i18n', text: 'Category', hasOne: {
                i18n: true,
            }, class: 'text-no-wrap', width: 0 },
            // { value: 'data.languages', text: 'Languages', hasMany: {
            //     items: (item: DictionaryModel) => item.languages(),
            //     itemText: (item: I18nModel) => item.data.language.data.name,
            // } },
            { value: 'data.total_items', text: 'Total items', class: 'text-no-wrap', width: 0, },
            { value: 'data.created_at', text: 'Created at', class: 'text-no-wrap', width: 0, },
        ];

        this.fields = [
            { value: 'data.cover', text: 'Cover', field: {
                rules: [rules.required],
            } },
            { value: 'data.dictionary_category_id', text: 'Category', hasOne: {
                i18n: true,
                resource: () => Services.getDictionaryCategories(),
            }, field: {
                rules: [rules.required],
            } },
            { value: 'data.i18n', text: 'Title', hasMany: {
                i18n: {
                    type: 'title',
                },
            }, field: {
                rules: [rules.required],
            } },
            { value: 'data.i18n', text: 'Body', hasMany: {
                i18n: {
                    type: 'body',
                },
            }, field: {
                rules: [rules.required],
            } },
            { text: 'Items', type: 'data', field: {
                headers: [
                    { value: 'data.cover', text: 'Cover', width: 0, class: 'text-no-wrap', sortable: false, field: {
                        rules: [rules.required],
                    } },
                    { value: 'data.i18n', text: 'Title', hasOne: {
                        i18n: {
                            synthesized: true,
                        },
                    }, class: 'text-no-wrap' },
                    { value: 'data.created_at', text: 'Created at', class: 'text-no-wrap', width: 0, },
                ],
                id: 'adminDictionariesItems',
                availableViews: ['datatable'],
                hidePresets: true,
                fields: [
                    { value: 'data.cover', text: 'Cover', field: {
                        rules: [rules.required],
                    } },
                    { value: 'data.i18n', text: 'Title', hasMany: {
                        i18n: {
                            synthesized: true,
                        },
                    }, field: {
                        rules: [rules.required],
                    } },
                ],
                defaultModel: DictionaryItemModel,
                resource: (item: DictionaryModel) => '/admin/dictionary/' + item.data.id + '/items',
            } },
        ];
    }
}
</script>
