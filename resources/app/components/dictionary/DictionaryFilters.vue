<template>
    <div>

        <!-- SEARCH -->
        <v-text-field
            v-model="_value.dictionary_search"
            v-bind="searchAttrs"
            :placeholder="$t('label.search')"
            :disabled="!canSearch"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            outlined
            dense
        ></v-text-field>

        <!-- LANGUAGES -->
        <v-select
            v-model="_value.dictionary_languages"
            :items="availableLanguages"
            :label="'Languages'"
            :placeholder="$t('label.any')"
            item-text="data.name"
            item-value="data.code"
            clearable
            outlined
            multiple
            hide-details
            dense
        />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ISettings } from "@/models/SettingsModel";
import I18nModel from "@/models/I18nModel";
import LanguageModel from "@/models/LanguageModel";
import DictionaryModel from "@/models/DictionaryModel";
import DictionaryCategoryModel from "@/models/DictionaryCategoryModel";

@Component
export default class DictionaryFilters extends Vue {
    @Prop({ type: Object, default: () => ({}) }) value: ISettings;
    @Prop({ type: Array, default: () => ([]) }) dictionaries: Array<DictionaryModel>;
    @Prop({ type: Array, default: () => ([]) }) languages: Array<LanguageModel>;
    @Prop({ type: Array, default: () => ([]) }) categories: Array<DictionaryCategoryModel>;
    @Prop({ type: Boolean, default: () => ([]) }) skeleton: boolean;
    @Prop({ type: Object, default: () => ({ solo: true }) }) searchAttrs!: Object;

    get _value() {
        return this.value;
    }

    set _value(value) {
        this.$emit('input', value);
    }

    get groupedLanguages(): Array<LanguageModel> {
        const groupedLanguages: Array<any> = [];
        this.languages.forEach(language => {
            let group = groupedLanguages.find(groupedLanguage => groupedLanguage.data.code === language.data.code.substring(0, 2));
            if (!group) {
                const splittedName = language.data.name.split(',');
                groupedLanguages.push(new LanguageModel({
                    ...language.data,
                    name: splittedName[0],
                    code: language.data.code.substring(0, 2),
                }));
            }
        });
        return groupedLanguages.sort((a, b) => a.name - b.name);
    }

    get availableLanguages(): Array<LanguageModel> {
        return this.groupedLanguages.filter(groupedLanguage => {
            return this.dictionaries.find(dictionary => dictionary.data.i18n.find((translation: I18nModel) => translation.data.language.data.code.substring(0, 2) === groupedLanguage.data.code));
        });
    }

    get canSearch() {
        return !this.skeleton;
    }

    get hasFilters() {
        const search = (this._value.dictionary_search || '').trim().toLowerCase();
        return search || this._value.dictionary_languages.length > 0 || this._value.dictionary_categories.length > 0;
    }

    handleClearFilters() {
        this._value.dictionary_languages = [];
        this._value.dictionary_categories = [];
        this._value.dictionary_search = '';
    }
}
</script>
