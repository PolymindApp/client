<template>
    <v-data-table
        v-bind="$attrs"
        v-on="$listeners"
        :footer-props="{
            itemsPerPageText: $t('table.itemsPerPageText'),
            itemsPerPageOptions: [10,25,50,100,-1],
        }"
        :search="_search"
    >
        <template #header>
            <thead v-if="!hideSearch">
            <tr>
                <td colspan="10" class="py-3">
                    <v-text-field
                        v-model="_search"
                        id="card_listing_search_mobile"
                        :placeholder="$t('table.searchPlaceholder')"
                        prepend-inner-icon="mdi-magnify"
                        class="w-100"
                        outlined
                        dense
                        hide-details
                    ></v-text-field>

                    <slot name="search_after"></slot>
                </td>
            </tr>
            </thead>
        </template>
        <template v-for="(slot, key) in $scopedSlots" #[key]="props">
            <slot :name="key" v-bind="props"></slot>
        </template>
        <template #loading>
            {{ $t('table.loading') }}
        </template>
        <template #no-data>
            {{ $t('table.noData') }}
        </template>
        <template #no-results>
            {{ $t('table.noResults') }}
        </template>
        <template #item.created_at="{ item }">
            <slot name="item.created_at" :item="item">
                {{ item.created_at | moment('YYYY-MM-DD HH:mm:ss') }}
            </slot>
        </template>
    </v-data-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Table extends Vue {
    @Prop({ type: Boolean, default: false }) loading: boolean
    @Prop({ type: Boolean, default: false }) skeleton: boolean
    @Prop({ type: Boolean, default: false }) hideSearch: boolean
    @Prop({ type: String, default: '' }) search: string

    get _search() {
        return this.search;
    }

    set _search(value) {
        this.$emit('update:search', value);
    }
}
</script>
