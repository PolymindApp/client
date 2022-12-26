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
            item-text="name"
            item-value="code"
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

@Component
export default class DictionaryFilters extends Vue {
    @Prop({ type: Object, default: () => ({}) }) value: ISettings;
    @Prop({ type: Array, default: () => ([]) }) dictionaries: Array<any>;
    @Prop({ type: Array, default: () => ([]) }) languages: Array<any>;
    @Prop({ type: Array, default: () => ([]) }) categories: Array<any>;
    @Prop({ type: Boolean, default: () => ([]) }) skeleton: boolean;
    @Prop({ type: Object, default: () => ({ solo: true }) }) searchAttrs!: Object;

    get _value() {
        return this.value;
    }

    set _value(value) {
        this.$emit('input', value);
    }

    get groupedLanguages() {
        const groupedLanguages: Array<any> = [];
        this.languages.forEach(language => {
            let group = groupedLanguages.find(groupedLanguage => groupedLanguage.code === language.code.substring(0, 2));
            if (!group) {
                const splittedName = language.name.split(',');
                groupedLanguages.push({
                    ...language,
                    name: splittedName[0],
                    code: language.code.substring(0, 2),
                });
            }
        });
        return groupedLanguages.sort((a, b) => a.name - b.name);
    }

    get availableLanguages() {
        return this.groupedLanguages.filter(groupedLanguage => {
            return this.dictionaries.find(dictionary => dictionary.data.i18n.find((translation: any) => translation.language.code.substring(0, 2) === groupedLanguage.code));
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
