<template>
    <v-input>
        <v-card outlined flat class="w-100">
            <v-alert
                border="left"
                class="mb-0 w-100"
            >
                <!-- LABEL -->
                <v-subheader v-text="label" class="mb-3"></v-subheader>

                <!-- LANGUAGES -->
                <v-select
                    v-model="selectedLanguages"
                    :items="languages"
                    :label="$t('i18nField.languages')"
                    item-text="data.name"
                    item-value="data.id"
                    class="mx-3"
                    multiple
                    outlined
                    return-object
                    clearable
                />

                <!-- LIST OF LANGUAGE/TEXT -->
                <v-simple-table v-if="selectedLanguages.length > 0">
                    <template #default>
                        <thead>
                        <tr>
                            <th class="text-left">
                                <span v-text="$t('i18nField.language')"></span>
                            </th>
                            <th class="text-left">
                                <span v-text="$t('i18nField.text')"></span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                            v-for="i18n in _selectedLanguagesLabels"
                            :key="i18n.data.id"
                        >
                            <td v-text="i18n.data.language.data.name"></td>
                            <td class="d-flex align-center">
                                <v-text-field
                                    v-model="i18n.data.text"
                                    :placeholder="$t('i18nField.placeholder')"
                                    :rules="[rules.required]"
                                    hide-details
                                    dense
                                    outlined
                                    clearable
                                />
                                <slot name="append" :i18n="i18n"></slot>
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
import {Vue, Component, Prop, Watch, VModel} from 'vue-property-decorator';
import LanguageModel from "@/models/LanguageModel";
import DictionaryI18nModel from "@/models/DictionaryI18nModel";
import Rules from '@/utils/Rules';

@Component
export default class I18nField extends Vue {

    @VModel({
        default: () => ([])
    }) model!: Array<DictionaryI18nModel>

    @Prop({
        default: () => ([])
    }) languages!: Array<LanguageModel>

    @Prop({
        default: null
    }) label?: string

    @Prop({
        default: 'text'
    }) itemKey?: string

    @Prop({
        default: null
    }) type?: string

    @Prop({
        default: false
    }) clearable?: boolean

    rules: any = {}
    selectedLanguages: Array<LanguageModel> = []

    @Watch('model', {
        deep: true
    })
    onValueChanged(value: Array<DictionaryI18nModel>) {
        this.syncSelectedLanguages(value);
    }

    get _selectedLanguagesLabels(): Array<DictionaryI18nModel> {
        const items = this.model.filter(val => {
            return (this.type ? val.data.type === this.type : true) &&
                this.selectedLanguages.findIndex(selectedLanguage => {
                    return selectedLanguage.data.code === val.data.language.data.code;
                }) !== -1;
        });
        for (let i = items.length; i < this.selectedLanguages.length; i++) {
            const selectedLanguage = this.selectedLanguages[i];
            const newItem = new DictionaryI18nModel({
                type: this.type,
                language: {
                    ...selectedLanguage.clone().data,
                },
            });
            this.model.push(newItem);
            items.push(newItem);
        }
        this.model.forEach((value, index) => {
            if (
                (this.type ? value.data.type === this.type : true) &&
                this.selectedLanguages.findIndex(selectedLanguage => {
                    return selectedLanguage.data.code === value.data.language.data.code;
                }) === -1
            ) {
                this.model.splice(index, 1);
            }
        })
        items.sort((a, b) => {
            return a.data.language.data.name > b.data.language.data.name ? 1 : -1;
        })
        return items;
    }

    syncSelectedLanguages(value: Array<DictionaryI18nModel>): void {
        this.selectedLanguages = this.languages.filter(language => {
            return value.findIndex(i18n => {
                return (this.type ? i18n.data.type === this.type : true) &&
                    language.data.code === i18n.data.language.data.code;
            }) !== -1;
        });
    }

    created(): void {
        this.rules.required = (value: string) => Rules.required(value) || this.$t('rules.required');
        this.syncSelectedLanguages(this.model);
    }
}
</script>
