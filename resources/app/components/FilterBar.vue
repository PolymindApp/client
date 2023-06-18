<template>
    <v-toolbar v-bind="$attrs" v-on="$listeners">
        <div class="d-flex align-center" style="gap: 1rem">
            <DataTableColumnFilter
                v-model="model.data.meta.filters"
                v-for="header in filterableHeaders"
                :key="header.value"
                :header="header"
                show-label
            />
        </div>
        <v-spacer />
        <v-tooltip bottom>
            <template #activator="{ attrs, on }">
                <v-btn
                    v-bind="attrs"
                    v-on="on"
                    :disabled="model.data.meta.filters.length === 0"
                    small
                    icon
                    class="mr-0"
                    @click="onClearFiltersClick"
                >
                    <v-icon small>mdi-filter-remove-outline</v-icon>
                </v-btn>
            </template>
            <span v-text="$t('dataManager.clearFilters')"></span>
        </v-tooltip>
    </v-toolbar>
</template>

<script lang="ts">
import { Vue, Component, VModel, Prop } from 'vue-property-decorator';
import DatatablePresetModel from '@/models/DatatablePresetModel';
import DataTableColumnFilter from '@/components/DataTableColumnFilter.vue';

@Component({
    components: {
        DataTableColumnFilter
    }
})
export default class FilterBar extends Vue {

    @VModel() model!: DatatablePresetModel
    @Prop({ default: () => ([]) }) headers!: Array<any>

    get filterableHeaders(): Array<any> {
        return this.headers.filter(header => header.filterable);
    }

    onClearFiltersClick(): void {
        this.model.data.meta.filters = [];
    }
}
</script>
