<template>
    <v-card v-bind="$attrs" class="d-flex flex-column w-100">
        <v-card-title
            class="d-flex align-center justify-space-between"
            style="flex: 0; gap: 1rem"
        >

            <div class="order-md-last d-flex align-center justify-end" style="gap: 1rem; flex: 2">

                <!-- ADD NEW ITEM -->
                <v-btn
                    :block="$vuetify.breakpoint.smAndDown"
                    :disabled="!canEdit"
                    color="primary"
                    height="40"
                    @click="onAddItemClick"
                >
                    <v-icon left>mdi-plus-thick</v-icon>
                    <span v-text="$t('dataManager.addNew')"></span>
                </v-btn>

                <!-- VIEWS -->
                <v-btn-toggle v-if="availableViews.length > 1" v-model="preset.data.meta.view" mandatory>
                    <v-btn v-if="availableViews.includes('datatable')" value="datatable" height="40">
                        <v-icon>mdi-table</v-icon>
                    </v-btn>
                    <v-btn v-if="availableViews.includes('cards')" value="cards" height="40">
                        <v-icon>mdi-cards-outline</v-icon>
                    </v-btn>
                    <v-btn v-if="availableViews.includes('calendar')" value="calendar" height="40">
                        <v-icon>mdi-calendar-multiselect</v-icon>
                    </v-btn>
                </v-btn-toggle>
            </div>

            <div class="d-flex align-center order-md-first" style="gap: 1rem; flex: 2">

                <!-- SEARCH -->
                <v-text-field
                    v-if="!hideSearch"
                    v-model="search"
                    :placeholder="$t('dataManager.filter')"
                    :disabled="loading"
                    outlined
                    dense
                    hide-details
                    clearable
                    prepend-inner-icon="mdi-magnify"
                    @keyup.enter="onSearchKeyUpEnter"
                    @click:clear="onSearchClear"
                />

                <!-- PRESET FILTERS -->
                <PresetManager
                    v-if="!hidePresets"
                    ref="presetManager"
                    :value="preset"
                    :default-item="defaultPreset"
                    label="Filter presets"
                    hide-details="auto"
                    outlined
                    dense
                    clearable
                    style="max-width: 30rem"
                />
            </div>
        </v-card-title>
        <v-card-text
            class="w-100 px-md-0 fill-height d-flex flex-column pb-0"
            style="flex: 1"
        >
            <!-- ADD/EDIT MODAL -->
            <Modal
                v-model="modalEdit.visible"
                v-bind="_modalAttrs"
            >
                <!-- NAVIGATION -->
                <template #header_right>
                    <template v-if="modalEdit.list.length > 1">
                        <v-divider v-if="$vuetify.breakpoint.smAndDown" class="my-3" />
                        <div class="d-flex align-center" style="gap: 1rem">
                            <v-btn :disabled="!canNavigate" icon @click="onEditPreviousClick">
                                <v-icon>mdi-arrow-left</v-icon>
                            </v-btn>
                            <span class="text-center" style="flex: 1" v-text="$t('dataManager.xOfY', {
                                x: modalEdit.index + 1,
                                y: modalEdit.list.length
                            })"></span>
                            <v-btn :disabled="!canNavigate" icon @click="onEditNextClick">
                                <v-icon>mdi-arrow-right</v-icon>
                            </v-btn>
                        </div>
                    </template>
                </template>
                <template #body>
                    <v-form ref="editForm" v-model="modalEdit.isFormValid">
                        <Field
                            v-model="item.value"
                            v-for="(item, fieldIdx) in fieldComponents"
                            v-bind="item.field.field"
                            :key="item.valueKey + '_' + fieldIdx"
                            :field="item.field"
                            :item="item"
                            :label="item.field.text"
                            :error-messages="modalEdit.formErrors[item.errorKey]"
                            :class="{
                                'mt-6': fieldIdx > 0
                            }"
                            outlined
                            clearable
                            hide-details="auto"
                            @input="(value) => onFieldInput(item, value)"
                        />
                    </v-form>
                </template>
                <template #left_actions>

                    <!-- DELETE -->
                    <v-btn v-if="currentItem.data.id" :block="$vuetify.breakpoint.smAndDown" :disabled="!canDelete" color="error" text large @click="onModalEditDeleteClick">
                        <span v-text="$t('btn.delete')"></span>
                    </v-btn>
                </template>
                <template #buttons>

                    <!-- SAVE -->
                    <v-btn :block="$vuetify.breakpoint.smAndDown" :loading="saving" :disabled="!canSave" color="primary" large @click="onModalEditSaveClick">
                        <span v-text="!currentItem.data.id ? $t('btn.create') : $t('btn.save')"></span>
                    </v-btn>

                    <!-- CANCEL -->
                    <v-btn :block="$vuetify.breakpoint.smAndDown" :disabled="saving" outlined large @click="onModalEditCloseClick">
                        <span v-text="$t('btn.cancel')"></span>
                    </v-btn>
                </template>
            </Modal>

            <!-- DATA (DESKTOP) -->
            <DataTable
                v-if="preset.data.meta.view === 'datatable'"
                v-model="selectedItems"
                :preset.sync="preset"
                :items="list"
                :search="search"
                :headers="_headers"
                :loading="loading"
                :options="preset.data.meta"
                :server-items-length="serverItemsLength"
                :items-per-page="preset.data.meta.itemsPerPage"
                :can-edit="canEdit"
                :can-delete="canDelete"
                :style="flexStyle"
                hide-default-footer
                show-select
                fixed-header
                item-key="data.id"
                class="fill-height overflow-y-auto"
                @update:options="onDatatableUpdate"
                @edit="onEditClick"
                @delete="onDeleteClick"
            />

            <!-- DATA (CARDS) -->
            <div
                v-else-if="preset.data.meta.view === 'cards'"
                :style="flexStyle"
                class="d-flex flex-column"
            >
                <FilterBar
                    v-if="filterableHeaders.length > 0"
                    v-model="preset"
                    :headers="headers"
                    dense
                    flat
                    style="flex: 0"
                    color="transparent"
                />

                <v-container :style="flexStyle" class="pa-4 overflow-auto background" fluid>
                    <DataCards
                        v-model="selectedItems"
                        :items="list"
                        :headers="_headers"
                        :can-edit="canEdit"
                        :can-delete="canDelete"
                        @edit="onEditClick"
                        @delete="onDeleteClick"
                    />
                </v-container>
            </div>

            <!-- DATA (CALENDAR) -->
            <v-sheet
                v-else-if="preset.data.meta.view === 'calendar'"
                class="d-flex flex-column fill-height"
            >
                <FilterBar
                    v-if="filterableHeaders.length > 0"
                    v-model="preset"
                    :headers="headers"
                    dense
                    style="flex: 0"
                    flat
                    color="transparent"
                />
                <v-divider />
                <DataCalendar
                    v-model="selectedItems"
                    :items="list"
                    :headers="_headers"
                    :can-edit="canEdit"
                    :can-delete="canDelete"
                    style="flex: 1"
                    @edit="onEditClick"
                    @delete="onDeleteClick"
                />
            </v-sheet>

            <!-- FOOTER -->
            <v-divider />
            <v-sheet class="px-4 py-3 d-flex align-center justify-space-between" style="gap: 1rem">
                <div class="d-flex align-center" style="gap: 1rem">
                    <v-menu transition="slide-y-reverse-transition" top>
                        <template #activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" color="primary" :disabled="!canBulkAction">
                                <span v-text="$t('menu.bulk')"></span>
                                <v-icon right>mdi-chevron-up</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item :disabled="!canEdit" @click="onBulkEditClick">
                                <v-list-item-icon>
                                    <v-icon>mdi-pencil</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title v-text="$t('btn.edit')"></v-list-item-title>
                            </v-list-item>
                            <v-list-item :disabled="!canDelete" class="error--text" @click="onBulkDeleteClick">
                                <v-list-item-icon>
                                    <v-icon color="error">mdi-trash-can-outline</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title v-text="$t('btn.delete')"></v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <!-- REFRESH -->
                    <v-btn
                        :block="$vuetify.breakpoint.smAndDown"
                        :disabled="!canRefresh"
                        text
                        @click="onRefreshClick"
                    >
                        <v-icon left>mdi-refresh</v-icon>
                        <span v-text="$t('btn.refresh')"></span>
                    </v-btn>
                </div>
                <div class="d-flex align-center caption" style="gap: 2rem">
                    <span v-text="$t('footer.rowsPerPage')"></span>

                    <v-select
                        v-model="preset.data.meta.itemsPerPage"
                        :items="[10, 25, 50, -1]"
                        style="width: min-content"
                        class="pa-0"
                        outlined
                        hide-details
                        dense
                    >
                        <template #item="{ item }">
                            <span v-if="item === -1" v-text="$t('label.all')"></span>
                            <span v-else v-text="item"></span>
                        </template>
                        <template #selection="{ item }">
                            <span v-if="item === -1" v-text="$t('label.all')"></span>
                            <span v-else v-text="item"></span>
                        </template>
                    </v-select>

                    <span>{{ offsetStart + 1 }}-{{ offsetEnd }} of {{ serverItemsLength }}</span>

                    <div>
                        <v-btn :disabled="!canGoPrevious" icon @click="onPreviousClick">
                            <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-btn :disabled="!canGoNext" class="ml-3" icon @click="onNextClick">
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-btn>
                    </div>
                </div>
            </v-sheet>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import {Vue, Component, VModel, Prop, Watch, Ref} from 'vue-property-decorator';
import Modal from "@/components/generic/Modal.vue";
import Field from "@/components/fields/Field.vue";
import DataTable from "@/components/DataTable.vue";
import DataCards from "@/components/DataCards.vue";
import DataCalendar from "@/components/DataCalendar.vue";
import PresetManager from "@/components/PresetManager.vue";
import FilterBar from "@/components/FilterBar.vue";
import BaseModel from "@/models/BaseModel";
import MediaModel from "@/models/MediaModel";
import Query from "@/utils/Query";
import DatatablePresetModel from '@/models/DatatablePresetModel';
import { VForm } from 'vuetify/lib';

let searchTimeout: any;

@Component({
    components: {
        Modal,
        Field,
        DataTable,
        DataCards,
        DataCalendar,
        PresetManager,
        FilterBar,
    }
})
export default class DataManager extends Vue {

    // @ts-ignore
    @Ref() readonly editForm: VForm;

    @VModel({ default: () => ([]) }) list!: Array<any>
    @Prop() defaultModel: new (props: any) => BaseModel
    @Prop({ default: () => ([]) }) headers!: Array<any>
    @Prop({ default: () => ([]) }) fields!: Array<any>
    @Prop() resource!: string | ((context: null | BaseModel, props?: any) => string)
    @Prop() sortBy!: Array<string>
    @Prop() sortDesc!: Array<boolean>
    @Prop() id!: string
    @Prop({ default: null }) context: null | BaseModel
    @Prop({ default: () => ({}) }) modalAttrs: any
    @Prop({ default: 'datatable' }) view!: string
    @Prop({ type: Boolean, default: false }) hideSearch: boolean
    @Prop({ type: Boolean, default: false }) hidePresets: boolean
    @Prop({ type: Boolean, default: false }) flexHeight: boolean
    @Prop({ default: () => (['datatable', 'cards', 'calendar']) }) availableViews!: Array<string>

    MediaModel = MediaModel
    isMounted: boolean = false
    loaded: boolean = false
    loading: boolean = false
    deleting: boolean = false
    saving: boolean = false
    search: string | null = null
    preset: DatatablePresetModel = new DatatablePresetModel({
        meta: {
            page: 1,
            itemsPerPage: 10,
            sortBy: ['data.created_at'],
            sortDesc: [true],
            filters: [],
            view: null,
            calendarType: 'month',
        }
    });
    defaultPreset: DatatablePresetModel | null = null
    serverItemsLength: number = 0
    selectedItems: Array<any> = []
    modalEdit: {
        visible: boolean,
        isFormValid: boolean,
        index: number,
        list: Array<any>,
        formErrors: any,
    } = {
        visible: false,
        isFormValid: false,
        index: -1,
        list: [],
        formErrors: {},
    }

    @Watch('search')
    onSearchChange() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (this.loading) {
                this.onSearchChange();
            } else {
                this.load();
            }
        }, 1000);
    }

    @Watch('preset.data.meta.view')
    onViewChanged() {
        this.isMounted = false
        setTimeout(() => {
            this.isMounted = true;
        })
    }

    @Watch('context.data.id', { deep: true })
    onContextChange() {
        this.list = [];
        this.load();
    }

    get _modalAttrs(): any {
        return Object.assign({
            title: !this.currentItem.data.id ? this.$i18n.t('admin.modal.add') : this.$i18n.tc('admin.modal.edit', this.modalEdit.list.length),
            persistent: this.dataIsDifferent,
            maxWidth: 800,
            scrollable: true,
        }, this.modalAttrs);
    }

    get flexStyle(): any {
        return this.flexHeight ? {
            height: 0,
            flexGrow: 1,
        } : null;
    }

    get offsetStart(): number {
        return this.preset.data.meta.itemsPerPage * (this.preset.data.meta.page - 1);
    }

    get offsetEnd(): number {
        const total = this.preset.data.meta.itemsPerPage === -1
            ? this.serverItemsLength
            : this.preset.data.meta.itemsPerPage;
        let offsetEnd = this.offsetStart + total;
        if (offsetEnd > this.serverItemsLength) {
            offsetEnd = this.serverItemsLength;
        }
        return offsetEnd;
    }

    get canBulkAction(): boolean {
        return this.ready
            && this.selectedItems.length > 0
            && (
                this.canEdit
                || this.canDelete
            );
    }

    get canRefresh(): boolean {
        return this.ready;
    }

    get canEdit(): boolean {
        return this.ready && this.fields.length > 0;
    }

    get canDelete(): boolean {
        return this.ready;
    }

    get canSave(): boolean {
        return this.ready && this.dataIsDifferent && this.modalEdit.isFormValid;
    }

    get canNavigate(): boolean {
        return this.ready && this.modalEdit.list.length > 1;
    }

    get dataIsDifferent(): boolean {
        return this.currentItem.isDifferentFromOriginal();
    }

    get currentItem(): BaseModel {
        return this.modalEdit.list[this.modalEdit.index] || new BaseModel();
    }

    get ready(): boolean {
        return !this.loading
            && !this.saving
            && !this.deleting;
    }

    get filterableHeaders(): Array<any> {
        return this.headers.filter(header => header.filterable);
    }

    get fieldComponents(): Array<any> {
        return this.fields.map((field: any) => {
            const valueKey = (field.field && field.field.value) || field.value;

            if (valueKey === undefined) {
                return {
                    field,
                    valueKey,
                    item: this.currentItem,
                };
            }

            let value = this.currentItem.nestedProp(valueKey);

            const errorKey = valueKey.indexOf('data.') === 0
                ? valueKey.substring(5)
                : valueKey;

            return {
                field,
                value,
                errorKey,
                valueKey,
                item: this.currentItem,
            };
        });
    }

    get _headers(): Array<any> {
        return this.headers
            .filter((header: any) => !header.createOnly && !header.editOnly)
            .concat({ value: '_action', sortable: false, width: 0 });
    }

    get canGoPrevious(): boolean {
        return this.preset.data.meta.page > 1;
    }

    get canGoNext(): boolean {
        return this.offsetEnd < this.serverItemsLength;
    }

    onSearchKeyUpEnter(): void {
        this.load();
    }

    onSearchClear(): void {
        this.search = null;
        this.load();
    }

    onDatatableUpdate(preset: DatatablePresetModel): void {
        if (this.ready) {
            this.load(new DatatablePresetModel({
                meta: preset
            }), this.search);
        }
    }

    onRefreshClick(): void {
        this.load();
    }

    onFieldInput(field: any, value: any) {
        const splittedValue = field.valueKey.split('.');
        const lastValue = splittedValue[splittedValue.length - 1]
        let obj = field.item;
        for (let i = 0; i < splittedValue.length - 1; i++) {
            obj = obj[splittedValue[i]];
        }
        obj[lastValue] = value;

        this.modalEdit.formErrors[field.errorKey] = [];
    }

    onAddItemClick(): void {
        this.editItems(null);
    }

    onEditClick(item: any): void {
        this.editItems(item);
    }

    onDeleteClick(item: any): void {
        this.deleteItems(item);
    }

    onBulkEditClick(): void {
        this.editItems(this.selectedItems);
    }

    onBulkDeleteClick(): void {
        this.deleteItems(this.selectedItems);
    }

    onEditPreviousClick(): void {
        this.previousItem();
    }

    onEditNextClick(): void {
        this.nextItem();
    }

    onModalEditDeleteClick(): void {
        this.deleteItems(this.currentItem)
            .then(response => {
                if (response === true || Array.isArray(response) && !response.find(res => !res)) {
                    const index = this.modalEdit.list.findIndex(item => item.data.id === this.currentItem.data.id);
                    if (index >= 0) {
                        this.modalEdit.list.splice(index, 1);
                        this.modalEdit.index = this.modalEdit.index > this.modalEdit.list.length - 1
                            ? this.modalEdit.list.length - 1
                            : this.modalEdit.index
                    }
                    this.modalEdit.visible = this.modalEdit.list.length !== 0;
                }
            });
    }

    onModalEditSaveClick(): void {
        this.saveItems(this.modalEdit.list.filter((model: BaseModel) => model.isDifferentFromOriginal()))
            .then(() => {
                this.modalEdit.visible = false;
            })
    }

    onModalEditCloseClick(): void {
        Object.assign(this.modalEdit, {
            visible: false,
        })
    }

    onPreviousClick(): void {
        this.preset.data.meta.page--;
    }

    onNextClick(): void {
        this.preset.data.meta.page++;
    }

    saveItems(models: BaseModel | Array<BaseModel>): Promise<BaseModel | Array<BaseModel>> {
        const toDelete: Array<BaseModel> = [];
        (Array.isArray(models) ? models : [models]).forEach((model: BaseModel) => {
            const originalModel = model.getOriginalModel();
            this.fields.forEach(field => {
                if (field.hasMany || field.hasOne) {
                    const prop = model.nestedProp(field.value);
                    const originalProp = originalModel.nestedProp(field.value);
                    if (Array.isArray(prop) && Array.isArray(originalProp)) {
                        const removedIdx = originalProp.findIndex(originalItem => prop.findIndex(item => (typeof item === 'number' ? item : item.data.id) === originalItem.data.id));
                        if (removedIdx !== -1 && !toDelete.find(item => item.data.id === originalProp[removedIdx].data.id)) {
                            toDelete.push(originalProp[removedIdx]);
                        }
                    }
                }
            });
        });

        const promises = [
            typeof this.resource === 'function'
                ? this.resource(this.context, models)
                : Query.post(this.resource + '/bulk', models)
        ];
        if (toDelete.length > 0) {
            promises.push(Query.delete(toDelete[0].resource + '/bulk', toDelete));
        }

        this.saving = true;
        return Promise.all(promises)
            .then(([postResponse, destroyResponse]) => {
                this.modalEdit.formErrors = {};
                return this.load()
                    .then(() => {
                        this.$snack(this.$i18n.tc('dataManager.saveItems.success', postResponse.length), 'success');
                        return models;
                    });
            })
            .catch(reason => {
                this.modalEdit.formErrors = {};
                return this.$handleError(reason, this.modalEdit.formErrors, false)
            })
            .finally(() => this.saving = false);
    }

    editItems(models: null | BaseModel | Array<BaseModel>) {
        if (models === null) {
            // @ts-ignore
            models = [new this.defaultModel()];
        } else if (!Array.isArray(models)) {
            models = [models];
        }
        if (Array.isArray(models)) {
            Object.assign(this.modalEdit, {
                visible: true,
                list: models.map(item => item.clone()),
                index: 0,
                formErrors: {},
            })

            setTimeout(() => {
                this.editForm.resetValidation();
            })
        }
    }

    deleteItems(models: BaseModel | Array<BaseModel>) {
        this.deleting = true;

        const path = typeof this.resource === 'function'
            ? this.resource(this.context)
            : this.resource;

        return this.$shouldDelete((models: any) => Query.delete(path + '/bulk', models.map((model: BaseModel) => model.data.id)), models)
            .then(response => {
                if (response.length === 0) {
                    return false;
                }
                return this.load().then(() => {
                    return true;
                });
            })
            .catch(this.$handleError)
            .finally(() => this.deleting = false);
    }

    previousItem(): void {
        this.modalEdit.index--;
        if (this.modalEdit.index < 0) {
            this.modalEdit.index = this.modalEdit.list.length - 1;
        }
    }

    nextItem(): void {
        this.modalEdit.index++;
        if (this.modalEdit.index > this.modalEdit.list.length - 1) {
            this.modalEdit.index = 0;
        }
    }

    load(preset = this.preset, search = this.search): Promise<any> {
        clearTimeout(searchTimeout);

        const params = {
            ...preset.data.meta,
            search: search === null ? '' : search.trim(),
        };
        const path = typeof this.resource === 'function'
            ? this.resource(this.context)
            : this.resource;

        this.loading = true;
        return Query.get(path, params)
            .then(response => {
                this.list = response.data;
                if (response.data.length > 0 && !(response.data[0] instanceof BaseModel)) {
                    this.list = response.data.map((item: any) => new this.defaultModel(item));
                }
                this.serverItemsLength = response.length;
                this.loaded = true;
                return this.list;
            })
            .catch(this.$handleError)
            .finally(() => this.loading = false);
    }

    created() {
        if (this.sortBy) {
            this.preset.data.sortBy = this.sortBy;
            this.preset.data.sortDesc = this.sortDesc || this.preset.data.sortDesc;
        }

        this.defaultPreset = (this.preset.clone() as DatatablePresetModel).data;
        this.preset.data.meta.view = this.view;
        this.load();
    }

    mounted() {
        this.isMounted = true;
    }
}
</script>
