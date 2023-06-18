<template>
    <div>
        <v-text-field
            v-if="type === 'string'"
            v-model="model"
            v-bind="attrs"
            v-on="$listeners"
            autocomplete="off"
        />
        <v-text-field
            v-else-if="type === 'number'"
            v-model="model"
            v-bind="attrs"
            v-on="$listeners"
            type="number"
            autocomplete="off"
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
            autocomplete="off"
        />
        <I18nField
            v-else-if="type === 'i18n'"
            v-model="model"
            v-bind="attrs"
            v-on="$listeners"
            :languages="languages"
            :loading="loadingLanguages"
            :type="relationship.i18n.type"
            :synthesized="relationship.i18n.synthesized"
        />
        <v-text-field
            v-else-if="type === 'password'"
            v-model="model"
            v-bind="attrs"
            v-on="$listeners"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            prepend-inner-icon="mdi-lock"
            autocomplete="new-password"
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
        <v-input
            v-else-if="type === 'data'"
            hide-details="auto"
        >
            <v-card outlined flat class="w-100">
                <v-alert
                    border="left"
                    class="mb-0 w-100"
                >
                    <!-- LABEL -->
                    <v-subheader v-text="field.text" class="mb-3" style="height: auto"></v-subheader>

                    <DataManager
                        v-model="dataItems"
                        v-bind="field.field"
                        :sort-by="['data.created_at']"
                        :sort-desc="[true]"
                        :context="item.item"
                        id="adminDictionaryItems"
                        tile
                    />
                </v-alert>
            </v-card>
        </v-input>
        <v-alert v-else type="error">
            <span v-text="$t('field.unsupported', { type })"></span>
        </v-alert>
    </div>
</template>

<script lang="ts">
import {Vue, Component, VModel, Prop, Watch} from 'vue-property-decorator';
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
        MediaField,
    }
})
export default class Field extends Vue {
    @VModel({ default: () => new BaseModel() }) model!: any
    @Prop() field!: any
    @Prop() item!: any
    @Prop() modelClass: new (props: any) => BaseModel

    loadingResources = false
    loadingLanguages = false
    showPassword = false
    serverItemsLength = 0
    loadedItems = []
    languages = []
    dataItems: Array<BaseModel> = []

    @Watch('item.data.id', {
        deep: true,
        immediate: true,
    })
    onFieldValueChange() {
        this.reload();
    }

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

    get valueKey(): any {
        return (this.field && this.field.value) || this.field.value;
    }

    get type(): string {
        return this.field.type
            || (this.field.data ? 'data' : false)
            || (this.model instanceof MediaModel ? 'media' : false)
            || ((this.field.hasMany || {}).i18n ? 'i18n' : false)
            || (this.relationship ? 'select' : false)
            || (this.model === null ? 'string' : typeof this.model);
    }

    get multiple(): boolean {
        return !!(this.field.hasMany);
    }

    get relationship(): any {
        return this.field.hasOne || this.field.hasMany;
    }

    getItemText(item: any): string {
        if (this.isI18n && this.field.hasMany) {
            let value = item.nestedProp('data.text');
            if (Array.isArray(value) && value.length > 0) {
                let index = value.findIndex((i18n: I18nModel) => i18n.data.language.data.code === this.$i18n.locale)
                if (index === -1 && value.length > 0) {
                    index = 0;
                }
                return value[index].data.text;
            }
        } else if (this.isI18n && this.field.hasOne) {
            let i18ns = item.nestedProp('data.i18n');
            if (Array.isArray(i18ns) && i18ns.length > 0) {
                let index = i18ns.findIndex((i18n: I18nModel) => i18n.data.language.data.code === this.$i18n.locale)
                if (index === -1 && i18ns.length > 0) {
                    index = 0;
                }
                return i18ns[index].data.text;
            }
        }

        const itemText = this.relationship?.itemText || (item instanceof BaseModel ? 'data.name' : 'text');
        return item.nestedProp(itemText)
    }

    getItemValue(item: any): string {
        if (this.isI18n) {
            return item.nestedProp('data.id');
        }

        const itemValue = this.relationship?.itemValue || (item instanceof BaseModel ? 'data.id' : 'value');
        return item.nestedProp(itemValue)
    }

    reload() {
        this.loadedItems = [];
        if (this.relationship?.resource) {
            this.loadResource(this.relationship.resource)
        }
    }

    loadResource(resource: ((item?: BaseModel) => Promise<BaseModel>) | string): Promise<BaseModel> {
        this.loadingResources = true;
        return (typeof resource === 'string' ? Query.get(resource) : resource(this.item.item))
                .then(response => {
                    this.serverItemsLength = response.length;
                    this.loadedItems = Array.isArray(response.data) ? response.data : response;
                    return this.loadedItems;
                })
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
        if (this.isI18n) {
            this.loadLanguages();
        }
    }
}
</script>
