<template>
    <div>

        <!-- EDIT/CREATE DIALOG -->
        <Modal
            v-model="editDialog.visible"
            :title="$t('presetManager.save.' + (editDialog.model.data.id ? 'edit' : 'create'))"
            :persistent="saving"
            max-width="500"
        >
            <template #body>
                <v-form v-model="editDialog.formIsValid">
                    <v-text-field
                        v-model="editDialog.model.data.name"
                        :label="$t('label.name')"
                        :rules="[rules.required]"
                        hide-details="auto"
                        autofocus
                        required
                        outlined
                        dense
                    />
                </v-form>
            </template>
            <template #buttons>
                <v-btn
                    color="primary"
                    :disabled="!canSaveDialog"
                    :loading="saving"
                    @click="() => onSaveDialogClick(editDialog.model)"
                >
                    <span v-text="$t(editDialog.model.data.id ? 'btn.save' : 'btn.create')"></span>
                </v-btn>
                <v-btn
                    outlined
                    :disabled="saving"
                    @click="onCancelDialogClick"
                >
                    <span v-text="$t('btn.cancel')"></span>
                </v-btn>
            </template>
        </Modal>

        <!-- SELECT OPTIONS -->
        <v-autocomplete
            v-model="selection"
            v-bind="_attrs"
            :items="_items"
            :loading="loading"
            :disabled="!canInteract"
            item-value="data.id"
            item-text="data.name"
            return-object
            @change="onPresetChange"
            @click:clear="onClearClick"
        >
            <template #item="{ item }">
                <v-icon v-if="!item.data.id" color="primary" left small>mdi-plus-circle</v-icon>
                <span v-text="item.data.name || $t('btn.new')"></span>
            </template>
            <template #selection="{ item }">
                <v-icon v-if="!item.data.id" color="primary" left small>mdi-plus-circle</v-icon>
                <span v-text="item.data.name || $t('btn.new')"></span>
            </template>
            <template #append>
                <div class="d-flex align-center" style="gap: 0.5rem; margin-top: -0.15rem">
                    <v-btn
                        :disabled="!canEdit"
                        color="primary"
                        small
                        icon
                        @mousedown.prevent.stop="() => onEditClick(selection)"
                    >
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                        :disabled="!canSave"
                        color="primary"
                        small
                        icon
                        @mousedown.prevent.stop="() => onSaveClick(selection)"
                    >
                        <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                    <v-btn
                        :disabled="!canRemove"
                        color="error"
                        small
                        icon
                        @mousedown.prevent.stop="() => onRemoveClick(selection)"
                    >
                        <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                </div>
            </template>
        </v-autocomplete>
    </div>
</template>

<script lang="ts">
import Modal from '@/components/generic/Modal.vue';
import { Vue, Component, Prop, VModel } from 'vue-property-decorator';
import Rules from '@/utils/Rules';
import DatatablePresetModel from '@/models/DatatablePresetModel';
import Services from '@/utils/Services';

@Component({
    components: {
        Modal
    }
})
export default class PresetManager extends Vue {

    @VModel() model!: DatatablePresetModel;
    @Prop() readonly defaultItem!: any
    @Prop() readonly id!: string
    @Prop() readonly defaultItemArgs!: any

    selection: DatatablePresetModel | null = null
    modelTmp: any = null
    items: Array<DatatablePresetModel> = []
    loading = false
    saving = false
    removing = false
    rules = {}
    editDialog: {
        visible: boolean,
        saving: boolean,
        formIsValid: boolean,
        model: DatatablePresetModel
        original: DatatablePresetModel
    } = {
        visible: false,
        saving: false,
        formIsValid: false,
        model: new DatatablePresetModel(),
        original: new DatatablePresetModel(),
    }

    get canSaveDialog(): boolean {
        return this.editDialog.formIsValid && !this.editDialog.saving && !this.saving;
    }

    get _attrs(): any {
        return this.$attrs;
    }

    get _items(): Array<any> {
        return this.items.concat(new DatatablePresetModel());
    }

    get canEdit(): boolean {
        return this.canInteract && this.selection?.data.id;
    }

    get canSave(): boolean {
        return this.presetsAreDifferent && !this.presetsAreDefault && this.canInteract
    }

    get canRemove(): boolean {
        return this.selection?.data.id && this.canInteract;
    }

    get canInteract(): boolean {
        return !this.loading && !this.saving && !this.removing;
    }

    get presetsAreDifferent(): boolean {
        try {
            return this.modelTmp !== JSON.stringify(this.model);
        } catch (e) {
            return false;
        }
    }

    get presetsAreDefault(): boolean {
        return this.modelTmp === JSON.stringify(this.model);
    }

    onEditClick(model: any) {
        Object.assign(this.editDialog, {
            visible: true,
            model: model.clone(),
            original: model,
            formIsValid: true,
        })
    }

    onSaveClick(model: DatatablePresetModel) {
        if (!model) {
            this.onEditClick(new DatatablePresetModel());
        } else if (!model.data.id) {
            this.onEditClick(model);
        } else {
            this.onSaveDialogClick(model);
        }
    }

    onRemoveClick(model: DatatablePresetModel) {
        this.remove([model]);
    }

    onSaveDialogClick(model: DatatablePresetModel): void {
        this.save(model)
            .then(() => {
                Object.assign(this.editDialog, {
                    visible: false,
                })
            })
    }

    onCancelDialogClick(): void {
        Object.assign(this.editDialog, {
            visible: false,
        })
    }

    onClearClick() {
        const modelTmp = JSON.stringify(this.defaultItem);
        this.modelTmp = modelTmp;
        this.$emit('input', JSON.parse(modelTmp || '{}'));
    }

    onPresetChange(item: any) {
        if (!item) {
            return;
        }
        try {
            let modelTmp;
            if (item.data.id) {
                modelTmp = item.data.json;
                this.modelTmp = modelTmp;
            }
            this.$emit('input', JSON.parse(modelTmp || '{}'));
        } catch (e) {

        }
    }

    save(model: DatatablePresetModel): Promise<any> {
        return new Promise((resolve, reject) => {
            Services.save('datatable_presets', [model], DatatablePresetModel)
                .then(items => {
                    if (!model.data.id) {
                        this.items.push(...items);
                        this.selection = this.items[this.items.length - 1];
                    } else {
                        this.editDialog.original.setData(items[0].data);
                    }
                    this.modelTmp = JSON.stringify(this.model);
                    this.$snack(this.$i18n.t('presetManager.snackSaved'));
                    resolve(this.modelTmp);
                })
                .catch(this.$handleError)
                .finally(() => this.saving = false)
        })
    }

    remove(models: Array<DatatablePresetModel>): Promise<Array<DatatablePresetModel>> {
        this.removing = true;
        return this.$shouldDelete((models) => Services.delete('datatable_presets', models, DatatablePresetModel), models)
            .then(response => {
                return this.load().then(() => {
                    const index = this.items.findIndex((item: any) => item === this.selection);
                    this.selection = this.items[index] || this.items[this.items.length -1] || null;
                    if ((this.selection && this.selection.data.id) || !this.selection) {
                        this.selection = null;
                        this.$emit('input', JSON.parse(JSON.stringify(this.defaultItem)));
                    } else {
                        this.$emit('input', this.selection?.data.json);
                    }
                    return true;
                });
            })
            .catch(this.$handleError)
            .finally(() => this.removing = false);
    }

    reset() {
        this.selection = null;
    }

    load(): Promise<Array<DatatablePresetModel>> {
        this.loading = true;
        return Services.getAll('datatable_presets', DatatablePresetModel)
            .then(items => this.items = items)
            .catch(this.$handleError)
            .finally(() => this.loading = false);
    }

    created() {
        this.rules = {
            required: (value: string) => Rules.required(value) || this.$t('rules.required'),
        };
        this.load();
    }
}
</script>
