<template>
    <div class="d-flex align-center flex-wrap" style="column-gap: 1rem">
        <v-btn-toggle v-model="_value.dictionary_sort_by" color="primary" mandatory tile group>
            <v-btn value="created_at" small>
                <span v-text="$t('label.date')"></span>
            </v-btn>
            <v-btn value="label" small>
                <span v-text="$t('label.name')"></span>
            </v-btn>
            <v-btn value="total_items" small>
                <span v-text="$t('label.items')"></span>
            </v-btn>
<!--            <v-btn value="languages" small>-->
<!--                <span v-text="$t('label.languages')"></span>-->
<!--            </v-btn>-->
        </v-btn-toggle>
        <v-btn-toggle v-model="_value.dictionary_sort_order" color="primary" mandatory tile group>
            <v-btn value="asc" small>
                <v-icon>mdi-sort-ascending</v-icon>
            </v-btn>
            <v-btn value="desc" small>
                <v-icon>mdi-sort-descending</v-icon>
            </v-btn>
        </v-btn-toggle>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ISettings } from '@/models/SettingsModel';

@Component
export default class DictionarySorting extends Vue {
    @Prop({ type: Object, default: () => ({}) }) value: ISettings;

    get _value() {
        return this.value;
    }

    set _value(value) {
        this.$emit('input', value);
    }
}
</script>
