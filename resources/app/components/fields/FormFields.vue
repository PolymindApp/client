<template>
    <v-form ref="editForm" v-model="formValid" v-bind="attrs" autocomplete="off">
        <Field
            v-model="item.value"
            v-for="(item, fieldIdx) in fieldComponents"
            v-bind="item.field.field"
            :key="item.valueKey + '_' + fieldIdx"
            :field="item.field"
            :item="item"
            :label="item.field.text"
            :loading="loading"
            :error-messages="mergedFormErrors[item.errorKey]"
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

<script lang="ts">
import { Vue, Component, VModel, Prop } from 'vue-property-decorator';
import Field from '@/components/fields/Field.vue';
import BaseModel from '@/models/BaseModel';

@Component({
    components: {
        Field,
    }
})
export default class FormFields extends Vue {

    @VModel() model!: BaseModel
    @Prop({ default: () => [] }) fields!: Array<any>
    @Prop({ default: false }) loading!: boolean
    @Prop({ default: () => ({}) }) formErrors!: any

    formValid = false
    innerFormErrors: any = {}

    get attrs(): Record<string, string> {
        return this.$attrs;
    }

    get mergedFormErrors(): any {
        return Object.assign({}, this.formErrors, this.innerFormErrors);
    }

    get fieldComponents(): Array<any> {
        return this.fields.map((field: any) => {
            const valueKey = (field.field && field.field.value) || field.value;
            let value = this.model.nestedProp(valueKey);

            const errorKey = valueKey.indexOf('data.') === 0
                ? valueKey.substring(5)
                : valueKey;

            return {
                field,
                value,
                errorKey,
                valueKey,
                item: this.model,
            };
        });
    }

    onFieldInput(field: any, value: any) {
        const splitValue = field.valueKey.split('.');
        const lastValue = splitValue[splitValue.length - 1]
        let obj = field.item;
        for (let i = 0; i < splitValue.length - 1; i++) {
            obj = obj[splitValue[i]];
        }
        obj[lastValue] = value;

        this.innerFormErrors[field.errorKey] = [];
    }
}
</script>
