<template>
    <div>
        <v-data-table v-bind="$attrs" v-on="$listeners" :headers="headers">

            <!-- HEADER SLOTS -->
            <template v-for="headerSlot in headerSlots" #[headerSlot]="props">
                <slot :name="headerSlot" v-bind="props">
                    <span :key="headerSlot">{{ props.header.text }}</span>
                    <template v-if="props.header.filterable">
                        <DataTableColumnFilter
                            v-model="_preset.data.meta.filters"
                            :header="props.header"
                        />
                    </template>
                </slot>
            </template>

            <!-- ACTION -->
            <template #header._action>
                <div class="text-right">
                    <v-tooltip v-if="filterableHeaders.length > 0" bottom>
                        <template #activator="{ attrs, on }">
                            <v-btn
                                v-bind="attrs"
                                v-on="on"
                                :disabled="_preset.data.meta.filters.length === 0"
                                small
                                icon
                                @click="onClearFiltersClick"
                            >
                                <v-icon small>mdi-filter-remove-outline</v-icon>
                            </v-btn>
                        </template>
                        <span v-text="$t('dataManager.clearFilters')"></span>
                    </v-tooltip>
                </div>
            </template>

            <!-- ITEM SLOTS -->
            <template v-for="itemSlot in itemSlots" #[itemSlot]="props">
                <slot :name="itemSlot" v-bind="props">
                    <template v-if="props.header.hasMany">
                        <div v-if="(props.value || props.header.hasMany.items(props.item)).filter(props.header.hasMany.filter || (() => true)).length > 0" class="d-flex align-center" style="gap: 0.5rem">
                            <v-chip
                                v-for="item in (props.value || props.header.hasMany.items(props.item)).slice(0, 3)"
                                v-text="item.nestedProp(props.header.hasMany.itemText || 'data.text')"
                                :key="item.nestedProp(props.header.hasMany.itemText || 'data.text')"
                                x-small
                            ></v-chip>
                            <v-chip
                                v-if="(props.value || props.header.hasMany.items(props.item)).length > 3"
                                v-text="'+ ' + ((props.value || props.header.hasMany.items(props.item)).length - 3)"
                                x-small
                                color="opacity-33"
                            ></v-chip>
                        </div>
                        <span v-else v-text="props.header.emptyText || $t('dataManager.emptyText')"></span>
                    </template>
                    <template v-else-if="typeof props.value === 'boolean'">
                        <v-icon v-if="props.value" color="success">mdi-check</v-icon>
                        <v-icon v-else color="error">mdi-close</v-icon>
                    </template>
                    <template v-else-if="typeof props.value === 'number'">
                        <v-chip small v-text="props.value"></v-chip>
                    </template>
                    <template v-else-if="props.value instanceof MediaModel">
                        <v-img :src="props.value.data.url" width="3rem" height="3rem">
                            <template #placeholder>
                                <v-skeleton-loader type="image" />
                            </template>
                        </v-img>
                    </template>
                    <template v-else-if="props.header.hasOne && props.header.hasOne.i18n">

                        <PlayAudioBtn
                            v-if="props.header.hasOne.i18n.synthesized"
                            v-model="props.item.text_synthesized"
                            tabindex="-1"
                            class="mr-2"
                        />

                        <span v-text="getI18nText(props.header, props.value)"></span>
                    </template>
                    <span v-else v-text="props.value"></span>
                </slot>
            </template>

            <!-- CREATED AT -->
            <template #item.data.created_at="{ item }">
                <span class="text-no-wrap">{{ item.data.created_at | humanDate }}</span>
            </template>

            <!-- UPDATED AT -->
            <template #item.data.updated_at="{ item }">
                <span class="text-no-wrap">{{ item.data.updated_at | humanDate }}</span>
            </template>

            <!-- ACTIONS -->
            <template #item._action="{ item, index }">
                <div class="d-flex">

                    <!-- EDIT -->
                    <v-tooltip left>
                        <template #activator="{ attrs, on }">
                            <v-btn v-bind="attrs" v-on="on" :disabled="!canEdit" icon @click.stop="onEditClick(item)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </template>
                        <span v-text="$t('btn.edit')"></span>
                    </v-tooltip>

                    <!-- DELETE -->
                    <v-tooltip left>
                        <template #activator="{ attrs, on }">
                            <v-btn v-bind="attrs" v-on="on" :disabled="!canDelete" icon @click.stop="onDeleteClick(item)">
                                <v-icon color="error">mdi-delete</v-icon>
                            </v-btn>
                        </template>
                        <span v-text="$t('btn.delete')"></span>
                    </v-tooltip>
                </div>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import DataTableColumnFilter from "@/components/DataTableColumnFilter.vue";
import PlayAudioBtn from '@/components/audio/PlayAudioBtn.vue';
import { Vue, Component, Prop, PropSync, Emit } from 'vue-property-decorator';
import DatatablePresetModel from '@/models/DatatablePresetModel';
import MediaModel from '@/models/MediaModel';
import I18nModel from '@/models/I18nModel';
import BaseModel from '@/models/BaseModel';

@Component({
    components: {
        DataTableColumnFilter,
        PlayAudioBtn,
    }
})
export default class DataTable extends Vue {

    @Prop({ default: () => ([]) }) headers!: Array<any>
    @Prop({ type: Boolean, default: false }) canEdit: boolean
    @Prop({ type: Boolean, default: false }) canDelete: boolean

    @PropSync('preset', {
        default: () => new DatatablePresetModel()
    }) _preset!: DatatablePresetModel;

    MediaModel = MediaModel

    get headerSlots(): Array<any> {
        return this.headers.map((header: any) => 'header.' + header.value);
    }

    get itemSlots(): Array<any> {
        return this.headers.map((header: any) => 'item.' + header.value);
    }

    get filterableHeaders(): Array<any> {
        return this.headers.filter(header => header.filterable);
    }

    onClearFiltersClick(): void {
        this._preset.data.meta.filters = [];
    }

    onEditClick(item: BaseModel): void {
        this.edit(item);
    }

    onDeleteClick(item: BaseModel): void {
        this.delete(item);
    }

    getI18nText(header: any, values: Array<I18nModel>): string {
        const relationship = (header.hasOne || header.hasMany) || {};
        const languageFiltered = values.filter(value => value.data.language.data.code.substring(0, 2) === this.$i18n.locale.substring(0, 2));
        if (relationship.i18n === true || !relationship.i18n.type) {
            return languageFiltered.length > 0
                ? languageFiltered[0].data.text
                : values[0].data.text;
        }

        const typeAndLangFiltered = languageFiltered.filter(value => value.data.type === relationship.i18n.type);
        if (typeAndLangFiltered.length === 0) {
            const typeFiltered = values.filter(value => value.data.type === relationship.i18n.type);
            return typeFiltered.length > 0
                ? typeFiltered[0].data.text
                : this.$i18n.t('dataManager.noItem');
        }
        return typeAndLangFiltered.length > 0
            ? typeAndLangFiltered[0].data.text
            : this.$i18n.t('dataManager.noItem');
    }

    @Emit()
    edit(item: BaseModel): BaseModel {
        return item;
    }

    @Emit()
    delete(item: BaseModel): BaseModel {
        return item;
    }
}
</script>

<style lang="scss" scoped>
.v-data-table {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.v-data-table ::v-deep .v-data-table__wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
}
.v-data-table ::v-deep .v-data-footer {
    flex: 0;
}
</style>
