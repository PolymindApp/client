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
                :available-views="['datatable', 'calendar']"
                resource="/schooling/class"
                id="schoolingClasses"
                class="fill-height"
                tile
            />
        </div>
    </Page>
</template>

<script lang="ts">
import Page from "@/components/layout/Page.vue";
import LanguageModel from '@/models/LanguageModel';
import { Component, Vue } from 'vue-property-decorator';
import Rules from '@/utils/Rules';
import ClassModel from '@/models/ClassModel';

@Component({
    components: {
        Page,
    }
})
export default class Classes extends Vue {

    languages: Array<ClassModel> = []
    defaultModel: new () => ClassModel = ClassModel
    headers: Array<any> = []

    created() {
        const rules = {
            required: (value: any) => Rules.required(value) || this.$t('rules.required'),
        };

        this.headers = [
            { value: 'data.name', text: 'Name', editable: true, field: {
                rules: [rules.required],
            } },
        ];
    }
}
</script>
