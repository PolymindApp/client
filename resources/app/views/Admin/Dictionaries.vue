<template>
    <Page :title="title" class="fill-height d-flex flex-column w-100">

        <!-- ADD/EDIT MODAL -->
        <Modal v-model="modalEdit.visible" :title="modalEdit.isNew ? $t('admin.modal.add').toString() : $t('admin.modal.edit').toString()" :buttons="[
            { text: modalEdit.isNew ? $t('btn.create') : $t('btn.save'), attrs: { color: 'primary' }, events: { onModalEditSave } },
            { text: $t('btn.cancel'), attrs: { text: true }, events: { click: onModalEditClose } },
        ]" max-width="600" scrollable persistent>
            <template #body>

                <!-- COVER -->
                <MediaField
                    v-model="currentDictionary.data.cover"
                    aspect-ratio="2"
                    :rules="[rules.required]"
                    class="w-100"
                    clearable
                />

                <!-- CATEGORY -->
                <v-select
                    v-model="currentDictionary.data.dictionary_category_id"
                    :items="categories"
                    :label="$t('admin.dictionaries.category')"
                    :rules="[rules.required]"
                    item-value="data.id"
                    item-text="data.i18n[0].data.text"
                    outlined
                    clearable
                />

                <!-- TITLE -->
                <I18nField
                    v-model="currentDictionary.data.i18n"
                    :label="$t('admin.dictionaries.i18n.title')"
                    :languages="languages"
                    :rules="[rules.required]"
                    type="title"
                    outlined
                    clearable
                />

                <!-- BODY -->
                <I18nField
                    v-model="currentDictionary.data.i18n"
                    :label="$t('admin.dictionaries.i18n.body')"
                    :languages="languages"
                    type="body"
                    outlined
                    clearable
                />
            </template>
        </Modal>

        <v-card class="fill-height d-flex flex-column w-100">
            <v-card-title
                class="d-flex align-center justify-space-between"
                style="flex: 0; gap: 1rem"
            >
                <v-btn
                    :block="$vuetify.breakpoint.smAndDown"
                    :disabled="loading"
                    color="primary"
                    class="order-md-last"
                    @click="onAddNewItem"
                >
                    <v-icon left>mdi-plus-circle</v-icon>
                    <span v-text="$t('admin.dictionaries.addNew')"></span>
                </v-btn>
                <v-text-field
                    v-model="search"
                    :placeholder="$t('admin.dictionaries.filter')"
                    :disabled="loading"
                    outlined
                    dense
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    class="order-md-first"
                >
                </v-text-field>
            </v-card-title>
            <v-card-text
                class="w-100 px-md-0 fill-height d-flex flex-column pb-0"
                style="flex: 1"
            >
                <v-data-table
                    :items="dictionaries"
                    :search="search"
                    :headers="headers"
                    :loading="loading"
                    :style="{
                        flexGrow: 1,
                        height: 0,
                    }"
                    fixed-header
                    item-key="data.id"
                    sort-by="data.created_at"
                    sort-desc
                    class="fill-height overflow-y-auto"
                >
                    <template #item.data.cover.url="{ item }">
                        <v-img
                            :src="item.data.cover.data.url"
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
                    <template #item.data.languages="{ item }">
                        <span v-if="item.data.i18n.length === 0" v-text="$t('admin.dictionaries.noLanguage')"></span>
                        <div v-else class="d-flex align-center flex-wrap" style="gap: 0.5rem">
                            <v-chip
                                v-for="language in item.languages().splice(0, 3)"
                                :key="language.data.language.data.code"
                                x-small
                            >
                                <span v-text="language.data.language.data.name"></span>
                            </v-chip>
                            <v-chip
                                v-if="item.languages().length > 3" v-text="'+ ' + (item.languages().length - 3)"
                                x-small
                                color="opacity-33"
                            ></v-chip>
                        </div>
                    </template>
                    <template #item.data.category="{ item }">
                        <span v-if="!item.data.category.data.id" v-text="$t('admin.dictionaries.noCategory')" class="text-no-wrap"></span>
                        <span v-else v-text="item.data.category.data.i18n[0].data.text"></span>
                    </template>
                    <template #item.data.total_items="{ item }">
                        <v-chip v-text="item.data.total_items" small></v-chip>
                    </template>
                    <template #item.data.created_at="{ item }">
                        <span class="text-no-wrap">{{ item.data.created_at | humanDate }}</span>
                    </template>
                    <template #item._action="{ item, index }">
                        <div class="d-flex">
                            <v-tooltip left>
                                <template #activator="{ attrs, on }">
                                    <v-btn v-bind="attrs" v-on="on" icon @click.stop="onEditClick(index)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                                <span v-text="$t('btn.edit')"></span>
                            </v-tooltip>
                            <v-tooltip left>
                                <template #activator="{ attrs, on }">
                                    <v-btn v-bind="attrs" v-on="on" icon @click.stop="onEditItemsClick(index)">
                                        <v-icon>mdi-cards</v-icon>
                                    </v-btn>
                                </template>
                                <span v-text="$t('btn.editItems')"></span>
                            </v-tooltip>
                            <v-tooltip left>
                                <template #activator="{ attrs, on }">
                                    <v-btn v-bind="attrs" v-on="on" icon @click.stop="onDeleteClick(item, index)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </template>
                                <span v-text="$t('btn.delete')"></span>
                            </v-tooltip>
                        </div>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </Page>
</template>

<script lang="ts">
import Page from "@/components/layout/Page.vue";
import Modal from "@/components/generic/Modal.vue";
import DictionaryModel from '@/models/DictionaryModel';
import Services from "@/utils/Services";
import MediaField from "@/components/fields/MediaField.vue";
import I18nField from "@/components/fields/I18nField.vue";
import { Component, Vue, Watch } from 'vue-property-decorator';
import LanguageModel from "@/models/LanguageModel";
import DictionaryCategoryModel from "@/models/DictionaryCategoryModel";
import VueI18n from "vue-i18n";
import DictionaryI18nModel from "@/models/DictionaryI18nModel";
import Rules from "@/utils/Rules";

@Component({
    components: {
        MediaField,
        I18nField,
        Page,
        Modal,
    }
})
export default class Dictionaries extends Vue {
    title: string | VueI18n.TranslateResult
    search: string = ''
    loading: boolean = false
    skeleton: boolean = false
    dictionaries: Array<DictionaryModel> = []
    languages: Array<LanguageModel> = []
    categories: Array<DictionaryCategoryModel> = []
    rules: any = {}
    modalEdit: {
        visible: boolean,
        isNew: boolean,
        index: number,
    } = {
        visible: false,
        isNew: false,
        index: -1,
    }
    modalEditItems: {
        visible: boolean,
        index: number,
    } = {
        visible: false,
        index: -1,
    }

    get headers(): Array<any> {
        return [
            { value: 'data.cover.url', text: this.$i18n.t('admin.dictionaries.headers.cover'), class: 'text-no-wrap', width: 0, sortable: false },
            { value: 'data.i18n[0].data.text', text: this.$i18n.t('admin.dictionaries.headers.title'), class: 'text-no-wrap', },
            { value: 'data.languages', text: this.$i18n.t('admin.dictionaries.headers.languages'), class: 'text-no-wrap' },
            { value: 'data.category', text: this.$i18n.t('admin.dictionaries.headers.category'), class: 'text-no-wrap' },
            { value: 'data.total_items', text: this.$i18n.t('admin.dictionaries.headers.totalItems'), class: 'text-no-wrap', width: 0 },
            { value: 'data.created_at', text: this.$i18n.t('admin.dictionaries.headers.createdAt'), class: 'text-no-wrap' },
            { value: '_action', sortable: false },
        ];
    }

    get currentDictionary(): DictionaryModel {
        return this.dictionaries[this.modalEdit.index]
            ? this.dictionaries[this.modalEdit.index]
            : new DictionaryModel();
    }

    onEditClick(index: number): void {
        Object.assign(this.modalEdit, {
            visible: true,
            isNew: false,
            index,
        });
    }

    onModalEditSave(): void {
        this.modalEdit.visible = false;
    }

    onModalEditClose(): void {
        this.modalEdit.visible = false;
    }

    onEditItemsClick(index: number): void {
        Object.assign(this.modalEditItems, {
            visible: true,
            index,
        });
    }

    onDeleteClick(item: DictionaryModel, index: number): void {
        this.$confirm(
            this.$i18n.t('admin.dictionaries.delete.title'),
            this.$i18n.t('admin.dictionaries.delete.desc'),
            this.$i18n.t('btn.delete'),
            (modal, btn) => {
                btn.attrs.loading = true;
                modal.disabled = true;
            }, undefined, {
                color: 'error'
            }
        )
    }

    onAddNewItem(): void {
        Object.assign(this.modalEdit, {
            visible: true,
            isNew: true,
            index: -1,
        });
    }

    load(): Promise<Array<Array<any>>> {
        this.loading = true;
        return Promise.all([
            Services.getLanguages(),
            Services.getDictionaries(),
            Services.getDictionaryCategories(),
        ])
            .then(([languages, dictionaries, categories]) => {
                Object.assign(this, { languages, dictionaries, categories });
                this.skeleton = false;
                return [languages, dictionaries];
            })
            .catch(this.$handleError)
            .finally(() => this.loading = false);
    }

    created(): void {
        this.title = this.$t('admin.dictionaries.title');
        this.rules.required = (value: string) => Rules.required(value) || this.$t('rules.required');
        this.load();
    }
}
</script>

<style lang="scss" scoped>
.v-data-table {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.v-data-table ::v-deep .v-data-table__wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
}
.v-data-table ::v-deep .v-data-footer {
    flex: 0;
}
</style>
