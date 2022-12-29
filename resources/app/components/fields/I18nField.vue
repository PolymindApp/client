<template>
    <v-input>
        <v-card outlined flat class="w-100">
            <v-alert
                border="left"
                class="mb-0 w-100"
            >
                <!-- LABEL -->
                <v-subheader v-text="label"></v-subheader>

                <!-- LANGUAGES -->
                <v-select
                    v-model="selectedLanguages"
                    v-bind="$attrs"
                    v-on="$listeners"
                    :items="languages"
                    :label="$t('i18nField.languages')"
                    item-text="data.name"
                    item-value="data.id"
                    class="mx-3"
                    multiple
                    return-object
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
                            v-for="item in i18n"
                            :key="item.data.id"
                        >
                            <td v-text="item.data.language.data.name"></td>
                            <td>
                                <v-text-field
                                    v-model="item.data.text"
                                    :placeholder="$t('i18nField.placeholder')"
                                    :rules="[rules.required]"
                                    hide-details
                                    dense
                                    outlined
                                    clearable
                                />
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
import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import LanguageModel from "@/models/LanguageModel";
import DictionaryI18nModel from "@/models/DictionaryI18nModel";
import Rules from '@/utils/Rules';

@Component
export default class I18nField extends Vue {

    @Prop({
        default: () => ([])
    }) value!: Array<DictionaryI18nModel>

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
    i18n: Array<DictionaryI18nModel> = []

    @Watch('value', {
        deep: true,
        immediate: true,
    })
    onValueChanged(value: Array<DictionaryI18nModel>) {
        this.selectedLanguages = this.languages.filter(language => value.findIndex(i18n => language.data.code === i18n.data.language.data.code) !== -1);
        this.i18n = this.value.filter(i18n => (this.type ? this.type === i18n.data.type : true) && this.selectedLanguages.findIndex(language => language.data.code === i18n.data.language.data.code) !== -1);
    }

    @Watch('selectedLanguages', {
        deep: true,
        immediate: true,
    })
    onSelectedLanguagesChanged(selectedLanguages: Array<DictionaryI18nModel>) {
        this.i18n = this.value.filter(i18n => (this.type ? this.type === i18n.data.type : true) && selectedLanguages.findIndex(language => language.data.code === i18n.data.language.data.code) !== -1);
        while (selectedLanguages.length > this.i18n.length) {
            this.i18n.push(new DictionaryI18nModel({
                type: this.type,
                language: selectedLanguages[this.i18n.length].clone().data,
            }));
        }
    }

    get _value(): Array<DictionaryI18nModel> {
        return this.value;
    }

    set _value(value: Array<DictionaryI18nModel>) {
        this.$emit('input', value);
    }

    created(): void {
        this.rules.required = (value: string) => Rules.required(value) || this.$t('rules.required');
    }
}
</script>
