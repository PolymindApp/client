<template>
    <Modal v-model="_visible" :title="$t('dictionary.filtersModal.title').toString()" scrollable fullscreen>
        <template #body>

            <!-- SORTING -->
            <h2 v-text="$t('label.sorting')"></h2>
            <DictionarySorting
                v-model="settings"
                class="mt-4"
            />

            <!-- FILTERS -->
            <DictionaryFilters
                v-model="settings"
                :dictionaries="dictionaries"
                :languages="languages"
                :categories="categories"
                :skeleton="skeleton"
                :search-attrs="{
                    outlined: true,
                }"
                class="d-flex align-center flex-wrap mt-8"
                style="gap: 1rem"
            />
        </template>
        <template #buttons>
            <v-btn :block="$vuetify.breakpoint.smAndDown" :disabled="!hasModifications" color="primary" large @click="handleApplyClick">
                <span v-text="$t('btn.apply')"></span>
            </v-btn>
            <v-btn :block="$vuetify.breakpoint.smAndDown" outlined large @click="_visible = false">
                <span v-text="$t('btn.cancel')"></span>
            </v-btn>
        </template>
    </Modal>
</template>

<script lang="ts">
import Modal from '@/components/generic/Modal.vue';
import DictionarySorting from '@/components/dictionary/DictionarySorting.vue';
import DictionaryFilters from '@/components/dictionary/DictionaryFilters.vue';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { ISettings } from "@/models/SettingsModel";

@Component({
    components: {
        Modal,
        DictionarySorting,
        DictionaryFilters,
    }
})
export default class DictionaryFiltersModal extends Vue {
    @Prop({ type: Object, default: () => ({}) }) value: ISettings;
    @Prop({ type: Boolean, default: false }) visible: boolean;
    @Prop({ type: Array, default: () => ([]) }) dictionaries: Array<any>;
    @Prop({ type: Array, default: () => ([]) }) languages: Array<any>;
    @Prop({ type: Array, default: () => ([]) }) categories: Array<any>;
    @Prop({ type: Boolean, default: () => ([]) }) skeleton: boolean;

    originalSettingsJson: string = ''
    settings: any = {}

    @Watch('visible')
    onVisibleChanged(visible: boolean) {
        if (visible) {
            this.originalSettingsJson = JSON.stringify(this.$deepClone(this.value));
            this.settings = this.$deepClone(this.value);
        }
    }

    get _visible() {
        return this.visible;
    }

    set _visible(value) {
        this.$emit('update:visible', value);
    }

    get hasModifications() {
        return this.originalSettingsJson !== JSON.stringify(this.settings);
    }

    handleApplyClick() {
        this.$emit('update', this.settings);
        this._visible = false;
    }

}
</script>
