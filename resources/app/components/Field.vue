<template>
    <div>
        <v-text-field
            v-if="type === 'string'"
            v-model="model"
            v-bind="attrs"
            v-on="$listeners"
        />
        <v-text-field
            v-else-if="type === 'number'"
            v-model="model"
            v-bind="attrs"
            v-on="$listeners"
            type="number"
        />
        <v-autocomplete
            v-else-if="type === 'select'"
            v-model="model"
            v-bind="attrs"
            v-on="$listeners"
            :items="items"
            :item-text="getItemText"
            :item-value="getItemValue"
            :multiple="multiple"
            :loading="loadingResources"
        />
        <I18nField
            v-else-if="type === 'i18n'"
            v-model="model"
            v-bind="attrs"
            v-on="$listeners"
            :languages="languages"
            :loading="loadingLanguages"
        />
        <v-text-field
            v-else-if="type === 'password'"
            v-model="model"
            v-bind="attrs"
            v-on="$listeners"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            prepend-inner-icon="mdi-lock"
            autocomplete="password"
            @click:append="showPassword = !showPassword"
        />
        <v-switch
            v-else-if="type === 'boolean'"
            v-model="model"
            v-bind="attrs"
            v-on="$listeners"
            inset
        />
        <MediaField
            v-else-if="type === 'media'"
            v-model="model"
            v-bind="attrs"
            v-on="$listeners"
        />
        <v-alert v-else type="error">
            <span v-text="$t('field.unsupported', { type })"></span>
        </v-alert>
    </div>
</template>

<script lang="ts">
import {Vue, Component, VModel, Prop} from 'vue-property-decorator';
import Query from "@/utils/Query";
import MediaModel from "@/models/MediaModel";
import I18nField from "@/components/fields/I18nField.vue";
import MediaField from "@/components/fields/MediaField.vue";
import Services from "@/utils/Services";
import I18nModel from "@/models/I18nModel";
import BaseModel from "@/models/BaseModel";

@Component({
    components: {
        I18nField,
        MediaField
    }
})
export default class Field extends Vue {
    @VModel({ default: null }) model!: any
    @Prop() header!: any
    @Prop() modelClass: new (props: any) => BaseModel

    loadingResources = false
    loadingLanguages = false
    showPassword = false
    loadedItems = null
    languages = []

    get items(): Array<any> {
        return this.loadedItems || [];
    }

    get i18n(): Array<any> | null {
        return (
            this.isI18n
            && (this.model || []).filter(this.relationship.filter)
        ) || this.loadedItems;
    }

    set i18n(values) {
        this.$emit('input', values);
    }

    get attrs(): Record<string, string> {
        return this.$attrs;
    }

    get isI18n(): boolean {
        return (this.relationship || {}).i18n || false;
    }

    get type(): string {
        return this.header.type
            || (this.model instanceof MediaModel ? 'media' : false)
            || ((this.header.hasMany || {}).i18n ? 'i18n' : false)
            || (this.relationship ? 'select' : false)
            || (this.model === null ? 'string' : typeof this.model);
    }

    get multiple(): boolean {
        return !!(Array.isArray(this.loadedItems) && this.header.hasMany);
    }

    get relationship(): any {
        return this.header.hasOne || this.header.hasMany;
    }

    getItemText(item: any): string {
        if (this.isI18n) {
            let value = item.nestedProp(this.header.value || 'id');
            if (Array.isArray(value)) {
                let index = value.findIndex((i18n: I18nModel) => i18n.data.language.data.code === this.$i18n.locale)
                if (index === -1 && value.length > 0) {
                    index = 0;
                }
                if (value.length > 0) {
                    return value[index].data.text;
                }
            }
        }

        const itemText = this.relationship?.itemText || (item instanceof BaseModel ? 'data.name' : 'text');
        return item.nestedProp(itemText)
    }

    getItemValue(item: any): string {
        if (this.isI18n) {
            let value = item.nestedProp(this.header.value || 'id');
            return value;
        }

        const itemValue = this.relationship?.itemValue || (item instanceof BaseModel ? 'data.id' : 'value');
        return item.nestedProp(itemValue)
    }

    loadResource(resource: (() => Promise<BaseModel>) | string): Promise<BaseModel> {
        this.loadingResources = true;
        return (typeof resource === 'string' ? Query.get(resource) : resource())
                .then(response => this.loadedItems = Array.isArray(response.data) ? response.data : response)
                .catch(this.$handleError)
                .finally(() => this.loadingResources = false);
    }

    loadLanguages() {
        this.loadingLanguages = true;
        return Services.getLanguages()
            .then(languages => this.languages = languages)
            .catch(this.$handleError)
            .finally(() =>  this.loadingLanguages = false);
    }

    created() {
        if (this.relationship?.resource) {
            this.loadResource(this.relationship.resource)
        }
        if (this.isI18n) {
            this.loadLanguages();
        }
    }
}
</script>
