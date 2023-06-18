<template>
    <v-card>
        <v-card-title v-if="title">
            <v-icon v-if="icon" v-text="icon" left></v-icon>
            <span v-text="title"></span>
        </v-card-title>
        <v-card-text>
            <FormFields
                v-model="model"
                :disabled="saving || loading"
                :loading="loading"
                :fields="fields"
                :form-errors="formErrors"
            />
        </v-card-text>
        <v-card-actions class="justify-end">
            <v-btn
                :loading="saving"
                :disabled="!canSave"
                color="primary"
                @click="onSaveClick"
            >
                <span v-text="$t('btn.save')"></span>
            </v-btn>
            <v-btn
                :disabled="!canReset"
                text
                @click="onResetClick"
            >
                <span v-text="$t('btn.reset')"></span>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { Vue, Component, VModel, Prop } from 'vue-property-decorator';
import BaseModel from '@/models/BaseModel';
import FormFields from '@/components/fields/FormFields.vue';

@Component({
    components: {
        FormFields
    }
})
export default class FormCard extends Vue {

    @VModel() model!: BaseModel
    @Prop({ default: () => [] }) fields!: Array<any>
    @Prop({ default: false }) loading!: boolean
    @Prop({ default: null }) title!: string | null
    @Prop({ default: null }) icon!: string | null
    @Prop() service: (model: any) => Promise<any>

    saving = false
    formErrors: any = {}

    get canSave(): boolean {
        return !this.loading && !this.saving && this.model.isDifferentFromOriginal();
    }

    get canReset(): boolean {
        return !this.loading && !this.saving && this.model.isDifferentFromOriginal();
    }

    onSaveClick(): void {
        this.save();
    }

    onResetClick(): void {
        this.model.resetValues();
    }

    save(): Promise<BaseModel> {
        this.saving = true;
        return this.service(this.model)
            .then((response: any) => {
                this.formErrors = {};
                return response;
            })
            .catch((reason: any) => {
                this.formErrors = {};
                return this.$handleError(reason, this.formErrors, false)
            })
            .finally(() => this.saving = false);
    }
}
</script>
