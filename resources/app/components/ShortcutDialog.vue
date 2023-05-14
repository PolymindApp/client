<template>
    <Modal v-model="_visible" v-bind="$attrs" v-on="$listeners">
        <template #body>
            <v-row :key="shortcutIdx" v-for="(shortcut, shortcutIdx) in shortcuts">
                <v-col cols="12" md="4" class="d-flex align-center">
                    <v-chip label v-text="shortcut.key.toUpperCase()"></v-chip>
                </v-col>
                <v-col cols="12" md="8" class="d-flex align-center">
                    <div v-text="$t(shortcut.i18n)"></div>
                </v-col>
            </v-row>
        </template>
    </Modal>
</template>

<script lang="ts">
import {Vue, Component, Prop, PropSync} from 'vue-property-decorator';
import Modal from '@/components/generic/Modal.vue';

@Component({
    components: {
        Modal,
    }
})
export default class ShortcutDialog extends Vue {
    @PropSync('visible', { default: false }) _visible!: boolean;
    @Prop({ default: () => ([]) }) shortcuts!: Array<any>;
}
</script>
