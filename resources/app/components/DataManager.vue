<template>
    <v-card v-bind="$attrs" class="d-flex flex-column w-100">
        <v-card-title
            class="d-flex align-center justify-space-between"
            style="flex: 0; gap: 1rem"
        >
            <div class="order-md-last d-flex align-center" style="gap: 1rem">

                <!-- ADD NEW ITEM -->
                <v-btn
                    :block="$vuetify.breakpoint.smAndDown"
                    :disabled="!canEdit"
                    color="primary"
                    @click="onAddItemClick"
                >
                    <v-icon left>mdi-plus-circle</v-icon>
                    <span v-text="$t('dataManager.addNew')"></span>
                </v-btn>
            </div>

            <!-- SEARCH -->
            <v-text-field
                v-model="search"
                :placeholder="$t('dataManager.filter')"
                :disabled="loading"
                outlined
                dense
                hide-details
                clearable
                prepend-inner-icon="mdi-magnify"
                class="order-md-first"
                @keyup.enter="onSearchKeyUpEnter"
                @click:clear="onSearchClear"
            >
            </v-text-field>
        </v-card-title>
        <v-card-text
            class="w-100 px-md-0 fill-height d-flex flex-column pb-0"
            style="flex: 1"
        >
            <!-- ADD/EDIT MODAL -->
            <Modal
                v-model="modalEdit.visible"
                :title="!currentItem.data.id ? $t('admin.modal.add') : $tc('admin.modal.edit', modalEdit.list.length)"
                :persistent="dataIsDifferent"
                max-width="800"
                scrollable
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
                            v-model="field.value"
                            v-for="(field, fieldIdx) in fields"
                            v-bind="field.header.field"
                            :key="field.header.value + '_' + fieldIdx"
                            :header="field.header"
                            :label="field.header.text"
                            :error-messages="modalEdit.formErrors[field.errorKey]"
                            :class="{
                                'mt-6': fieldIdx > 0
                            }"
                            outlined
                            clearable
                            hide-details="auto"
                            @input="(value) => onFieldInput(field, value)"
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
            <v-data-table
                v-model="selectedItems"
                :items="list"
                :search="search"
                :headers="_headers"
                :loading="loading"
                :options.sync="options"
                :server-items-length="serverItemsLength"
                :style="{
                    flexGrow: 1,
                    height: 0,
                }"
                :footer-props="{
                    itemsPerPageOptions: [5, 10, 25, 50, -1],
                }"
                show-select
                fixed-header
                item-key="data.id"
                class="fill-height overflow-y-auto"
                @update:options="onDatatableUpdate"
            >
                <!-- V-SLOT -->
                <template v-for="header in headerSlots" #[header]="props">
                    <slot :name="header" v-bind="props">
                        <template v-if="props.header.hasMany">
                            <div v-if="(props.value || props.header.hasMany.items(props.item)).filter(props.header.hasMany.filter || (() => true)).length > 0" class="d-flex align-center" style="gap: 0.5rem">
                                <v-chip
                                    v-for="item in (props.value || props.header.hasMany.items(props.item)).slice(0, 3)"
                                    v-text="item.nestedProp(props.header.hasMany.itemText || 'data.text')"
                                    :key="item.nestedProp(props.header.hasMany.itemText || 'data.text')"
                                    x-small
                                ></v-chip>
                                <v-chip
                                    v-if="(props.value || props.header.hasMany.items(props.item)).length > 3"
                                    v-text="'+ ' + ((props.value || props.header.hasMany.items(props.item)).length - 3)"
                                    x-small
                                    color="opacity-33"
                                ></v-chip>
                            </div>
                            <span v-else v-text="props.header.emptyText || $t('dataManager.emptyText')"></span>
                        </template>
                        <template v-else-if="typeof props.value === 'boolean'">
                            <v-icon v-if="props.value" color="success">mdi-check</v-icon>
                            <v-icon v-else color="error">mdi-close</v-icon>
                        </template>
                        <template v-else-if="typeof props.value === 'number'">
                            <v-chip small v-text="props.value"></v-chip>
                        </template>
                        <template v-else-if="props.value instanceof MediaModel">
                            <v-img :src="props.value.data.url" width="3rem" height="3rem">
                                <template #placeholder>
                                    <v-skeleton-loader type="image" />
                                </template>
                            </v-img>
                        </template>
                        <template v-else-if="props.header.hasOne && props.header.hasOne.i18n">
                            <span v-if="!props.value[0].data.id" v-text="$t('dataManager.noItem')" class="text-no-wrap"></span>
                            <span v-else v-text="props.value[0].data.text"></span>
                        </template>
                        <span v-else v-text="props.value"></span>
                    </slot>
                </template>

                <!-- CREATED AT -->
                <template #item.data.created_at="{ item }">
                    <span class="text-no-wrap">{{ item.data.created_at | humanDate }}</span>
                </template>

                <!-- UPDATED AT -->
                <template #item.data.updated_at="{ item }">
                    <span class="text-no-wrap">{{ item.data.updated_at | humanDate }}</span>
                </template>

                <!-- ACTIONS -->
                <template #item._action="{ item, index }">
                    <div class="d-flex">

                        <!-- EDIT -->
                        <v-tooltip left>
                            <template #activator="{ attrs, on }">
                                <v-btn v-bind="attrs" v-on="on" :disabled="!canEdit" icon @click.stop="onEditClick(item)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                            <span v-text="$t('btn.edit')"></span>
                        </v-tooltip>

                        <!-- DELETE -->
                        <v-tooltip left>
                            <template #activator="{ attrs, on }">
                                <v-btn v-bind="attrs" v-on="on" :disabled="!canDelete" icon @click.stop="onDeleteClick(item)">
                                    <v-icon color="error">mdi-delete</v-icon>
                                </v-btn>
                            </template>
                            <span v-text="$t('btn.delete')"></span>
                        </v-tooltip>
                    </div>
                </template>

                <template #footer.prepend>
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
                            :loading="loading"
                            text
                            @click="onRefreshClick"
                        >
                            <v-icon left>mdi-refresh</v-icon>
                            <span v-text="$t('btn.refresh')"></span>
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import {Vue, Component, VModel, Prop, Watch, Ref} from 'vue-property-decorator';
import Modal from "@/components/generic/Modal.vue";
import Field from "@/components/Field.vue";
import BaseModel from "@/models/BaseModel";
import MediaModel from "@/models/MediaModel";
import Query from "@/utils/Query";
import { VForm } from 'vuetify/lib';

let searchTimeout: any;

@Component({
    components: {
        Modal,
        Field,
    }
})
export default class DataManager extends Vue {

    // @ts-ignore
    @Ref() readonly editForm: VForm;

    @VModel({ default: () => ([]) }) list!: Array<any>
    @Prop() defaultModel: new (props: any) => BaseModel
    @Prop({ default: () => ([]) }) headers!: Array<any>
    @Prop() resource!: string
    @Prop() sortBy!: Array<string>
    @Prop() sortDesc!: Array<boolean>
    @Prop() id!: string

    MediaModel = MediaModel
    loaded: boolean = false
    loading: boolean = false
    deleting: boolean = false
    saving: boolean = false
    search: string | null = null
    options: any = {
        page: 1,
        itemsPerPage: 10,
        sortBy: ['data.created_at'],
        sortDesc: [true],
    }
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

    get canBulkAction(): boolean {
        return this.ready
            && this.selectedItems.length > 0
            && (
                this.canEdit
                || this.canDelete
            );
    }

    get canRefresh(): boolean {
        return this.ready && this.editableHeaders.length > 0;
    }

    get canEdit(): boolean {
        return this.ready;
    }

    get canDelete(): boolean {
        return this.ready && this.editableHeaders.length > 0;
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

    get itemSlots(): Array<any> {
        return this.headers.map((header: any) => 'item.' + header.value);
    }

    get editableHeaders(): Array<any> {
        return this.headers.filter((header: any) => header.editable || header.createOnly || header.editOnly);
    }

    get fields(): Array<any> {
        return this.editableHeaders.map((header: any) => {
            const currentItem = this.currentItem;
            let value;
            try {
                value = eval('currentItem.' + header.value);
            } catch (e) {

            }

            const relationship = header.hasMany || header.hasOne;
            if (Array.isArray(value) && relationship && relationship.filter) {
                value = value.filter(relationship.filter);
            }

            const errorKey = header.value.indexOf('data.') === 0
                ? header.value.substring(5)
                : header.value;

            return {
                header,
                value,
                errorKey,
                item: currentItem,
            };
        });
    }

    get headerSlots(): Array<any> {
        return this.headers.map((header: any) => 'item.' + header.value);
    }

    get _headers(): Array<any> {
        return this.headers
            .filter((header: any) => !header.createOnly && !header.editOnly)
            .concat({ value: '_action', sortable: false, width: 0 });
    }

    onSearchKeyUpEnter(): void {
        this.load();
    }

    onSearchClear(): void {
        this.search = null;
        this.load();
    }

    onDatatableUpdate(options: any): void {
        if (this.ready) {
            this.load(options, this.search);
        }
    }

    onRefreshClick(): void {
        this.load();
    }

    onFieldInput(field: any, value: any) {
        const splittedValue = field.header.value.split('.');
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

    saveItems(models: BaseModel | Array<BaseModel>): Promise<BaseModel | Array<BaseModel>> {
        this.saving = true;
        return Query.post(this.resource + '/bulk', models)
            .then(response => {
                this.modalEdit.formErrors = {};
                return this.load()
                    .then(() => {
                        this.$snack(this.$i18n.tc('dataManager.saveItems.success', response.length), 'success');
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
        return this.$shouldDelete((models) => Query.delete(this.resource + '/bulk', models.map((model: BaseModel) => model.data.id)), models)
            .then(response => {
                if (response === null) {
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

    load(options = this.options, search = this.search): Promise<any> {
        clearTimeout(searchTimeout);

        this.loading = true;
        return Query.get(this.resource, {
            ...options,
            search: search === null ? '' : search.trim(),
        })
            .then(response => {
                this.list = response.data.map((item: any) => new this.defaultModel(item));
                this.serverItemsLength = response.length;
                this.loaded = true;
                return this.list;
            })
            .catch(this.$handleError)
            .finally(() => this.loading = false);
    }

    created() {
        if (this.sortBy) {
            this.options.sortBy = this.sortBy;
            this.options.sortDesc = this.sortDesc || this.options.sortDesc;
        }

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
