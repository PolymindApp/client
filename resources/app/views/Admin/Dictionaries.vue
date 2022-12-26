<template>
    <Page :title="title" class="fill-height pa-0 d-flex flex-column w-100" fluid>
        <div :class="{
            'w-100 px-md-0 pb-3': true,
            'overflow-y-auto': $vuetify.breakpoint.smAndDown,
        }" :style="{
            flexGrow: $vuetify.breakpoint.smAndDown ? 1 : null,
            height: $vuetify.breakpoint.smAndDown ? 0 : null,
        }">
            <v-data-table
                :items="dictionaries"
                item-key="data.id"
                :search="search"
                :headers="[
                    { value: 'cover.url', text: 'Cover', class: 'text-no-wrap', width: 0 },
                    { value: 'i18n[0].text', text: 'Title', },
                    { value: 'total_items', text: 'Total items', class: 'text-no-wrap', width: 0 },
                    { value: 'created_at', text: 'Created at' },
                ]"
            >
                <template #item.cover.url="{ item }">
                    <v-img
                        :src="item.cover.url"
                        contain
                        height="64"
                        width="64"
                        class="align-center text-center"
                    >
                        <template #placeholder>
                            <v-skeleton-loader type="image" />
                        </template>
                    </v-img>
                </template>
            </v-data-table>
        </div>
    </Page>
</template>

<script lang="ts">
import Page from "@/components/layout/Page.vue";
import UserModel from '@/models/UserModel';
import Services from "@/utils/Services";
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {
        Page
    }
})
export default class Users extends Vue {
    title: string
    search: string = ''
    dictionaries: Array<any> = []

    load(): Promise<Array<UserModel>> {
        return Services.getDictionaries()
            .then(dictionaries => this.dictionaries = dictionaries);
    }

    created(): void {
        this.title = this.$t('admin.dictionaries.title').toString();
        this.load();
    }
}
</script>
