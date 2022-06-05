<template>
    <div>
        <div class="d-flex align-center justify-space-between mb-3" style="gap: 1rem">
            <h2 v-text="$t('label.filters')"></h2>
            <v-btn v-if="hasFilters" color="primary" outlined x-small @click="handleClearFilters">
                <span v-text="$t('btn.clear')"></span>
            </v-btn>
        </div>

        <v-text-field
            v-model="_value.dictionary_search"
            :placeholder="$t('label.search')"
            :disabled="!canSearch"
            v-bind="searchAttrs"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
        ></v-text-field>

        <h3 class="mt-8" v-text="$t('label.languages')"></h3>
        <div class="mt-3 mb-3">
            <v-select
                v-model="_value.dictionary_languages"
                :items="availableLanguages"
                :placeholder="$t('label.any')"
                item-text="name"
                item-value="code"
                outlined
                multiple
                hide-details
            />
        </div>

        <h3 class="mt-8 mb-3" v-text="$t('label.categories')"></h3>
        <div class="mt-3">
            <template v-if="skeleton">
                <v-skeleton-loader :key="index" v-for="index in 8" :class="{
                    'mt-6': index === 1,
                    'mt-3': index > 1,
                }" type="list-item" />
            </template>
            <v-list max-height="50vh" dense color="transparent" class="pa-0 overflow-auto" rounded>
                <v-list-item-group v-model="_value.dictionary_categories" color="primary" multiple>
                    <v-list-item :key="category.id" v-for="category in categories">
                        <v-list-item-avatar size="64">
                            <v-img :src="category.cover.url"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-title>
                            <h2 v-text="category.label"></h2>
                        </v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </div>
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
            return this.dictionaries.find(dictionary => dictionary.i18n.find((translation: any) => translation.language.code.substring(0, 2) === groupedLanguage.code));
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
