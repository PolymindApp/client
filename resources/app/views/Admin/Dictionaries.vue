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
                :search="search"
                :headers="[
                    { value: 'data.cover.url', text: 'Cover', class: 'text-no-wrap', width: 0, sortable: false },
                    { value: 'data.i18n[0].text', text: 'Title', },
                    { value: 'data.languages', text: 'Languages' },
                    { value: 'data.total_items', text: 'Total items', class: 'text-no-wrap', width: 0 },
                    { value: 'data.created_at', text: 'Created at' },
                    { value: '_action', sortable: false },
                ]"
                item-key="data.id"
                sort-by="data.created_at"
                sort-desc
            >
                <template #item.data.languages="{ item }">
                    <div class="d-flex align-center flex-wrap" style="gap: 0.5rem">
                        <v-chip
                            v-for="language in item.languages().splice(0, 3)"
                            :key="language.language.code"
                            x-small
                        >
                            <span v-text="language.language.name"></span>
                        </v-chip>
                        <v-chip
                            v-if="item.languages().length > 3" v-text="'+ ' + (item.languages().length - 3)"
                            x-small
                            color="opacity-33"
                        ></v-chip>
                    </div>
                    <span v-if="item.data.i18n.length === 0" v-text="$t('admin.dictionaries.noLanguage')"></span>
                </template>
                <template #item.data.cover.url="{ item }">
                    <v-img
                        :src="item.data.cover.url"
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
                <template #item._action="{ item }">
                    <div class="d-flex">
                        <v-tooltip left>
                            <template #activator="{ attrs, on }">
                                <v-btn v-bind="attrs" v-on="on" icon @click.stop="onEditClick(item)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                            <span v-text="$t('btn.edit')"></span>
                        </v-tooltip>
                        <v-tooltip left>
                            <template #activator="{ attrs, on }">
                                <v-btn v-bind="attrs" v-on="on" icon @click.stop="onDeleteClick(item)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </template>
                            <span v-text="$t('btn.delete')"></span>
                        </v-tooltip>
                    </div>
                </template>
            </v-data-table>
        </div>
    </Page>
</template>

<script lang="ts">
import Page from "@/components/layout/Page.vue";
import UserModel from '@/models/UserModel';
import DictionaryModel from '@/models/DictionaryModel';
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

    onEditClick(item: DictionaryModel) {

    }

    onDeleteClick(item: DictionaryModel) {

    }

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
