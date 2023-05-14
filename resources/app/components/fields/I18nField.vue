<template>
    <v-input hide-details="auto">
        <v-card outlined flat class="w-100">
            <v-alert
                border="left"
                class="mb-0 w-100"
            >
                <!-- LABEL -->
                <v-subheader v-text="label" class="mb-3" style="height: auto"></v-subheader>

                <!-- LIST OF LANGUAGE/TEXT -->
                <v-simple-table>
                    <template #default>
                        <thead>
                        <tr>
                            <th class="text-left" style="width: 33%">
                                <span v-text="$t('i18nField.language')"></span>
                            </th>
                            <th class="text-left" style="width: 66%">
                                <span v-text="$t('i18nField.text')"></span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                            v-for="i18n in model"
                            :key="i18n.data.id"
                        >
                            <td v-text="i18n.data.language.data.name"></td>
                            <td valign="top" class="d-flex align-center" style="gap: 1rem">
                                <v-text-field
                                    v-model="i18n.data.text"
                                    :placeholder="$t('i18nField.placeholder')"
                                    :rules="[rules.required]"
                                    hide-details="auto"
                                    dense
                                    outlined
                                    clearable
                                />
                                <slot name="append" :i18n="i18n"></slot>

                                <v-btn
                                    :disabled="!canRemove"
                                    color="error"
                                    icon
                                    style="margin-top: 1px"
                                    @click="() => onRemoveClick(i18n)"
                                >
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                        <tr v-if="getRemainingLanguages().length > 0">
                            <td valign="top">
                                <v-select
                                    v-model="newI18n.data.language_id"
                                    :items="getRemainingLanguages()"
                                    :label="$t('i18nField.language')"
                                    item-text="data.name"
                                    item-value="data.id"
                                    hide-details="auto"
                                    dense
                                    outlined
                                    clearable
                                />
                            </td>
                            <td valign="top" class="d-flex align-start" style="gap: 1rem">
                                <v-text-field
                                    v-model="newI18n.data.text"
                                    :placeholder="$t('i18nField.placeholder')"
                                    hide-details="auto"
                                    dense
                                    outlined
                                    clearable
                                    @keyup.enter="onKeyUpEnter"
                                />

                                <v-btn
                                    :disabled="!canAdd"
                                    color="primary"
                                    icon
                                    style="margin-top: 1px"
                                    @click="onAddClick"
                                >
                                    <v-icon>mdi-plus-circle</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-alert>
        </v-card>
    </v-input>
</template>

<script lang="ts">
import { Vue, Component, Prop, VModel } from 'vue-property-decorator';
import LanguageModel from "@/models/LanguageModel";
import I18nModel from "@/models/I18nModel";
import Rules from '@/utils/Rules';

@Component
export default class I18nField extends Vue {

    @VModel({
        default: () => ([])
    }) model!: Array<I18nModel>

    @Prop({
        default: () => ([])
    }) languages!: Array<LanguageModel>

    @Prop({
        default: null
    }) label?: string

    @Prop({
        default: 'text'
    }) itemKey?: string

    rules: any = {}
    newI18n: I18nModel = new I18nModel();
    selectedLanguages: Array<LanguageModel> = []

    get inputAttrs(): Record<string, string> {
        return this.$attrs;
    }

    get canAdd(): boolean {
        return this.newI18n.isValid();
    }

    get canRemove(): boolean {
        return true;
    }

    getRemainingLanguages(): Array<LanguageModel> {
        return this.languages.filter(language => {
            return !this.model.find(model => model.data.language_id === language.data.id);
        })
    }

    onKeyUpEnter(): void {
        if (this.canAdd) {
            this.onAddClick();
        }
    }

    onAddClick(): void {
        const clone = this.newI18n.clone();
        const language = this.languages.find(language => language.data.id === clone.data.language_id);
        if (language) {
            clone.data.language = language.clone();
            this.model.push(clone as I18nModel);
            this.newI18n = new I18nModel();
            this.$forceUpdate();
        }
    }

    onRemoveClick(i18n: I18nModel): void {
        const index = this.model.findIndex(item => item.data.id === i18n.data.id);
        if (index >= 0) {
            this.model.splice(index, 1);
            this.$forceUpdate();
        }
    }

    created(): void {
        this.rules.required = (value: string) => Rules.required(value) || this.$t('rules.required');
    }
}
</script>

<style lang="scss" scoped>
.v-data-table td {
    height: auto !important;
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
}
</style>
