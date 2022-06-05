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

<script>
import Modal from './generic/Modal';

export default {
    name: "ShortcutDialog",

    components: { Modal },

    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        shortcuts: {
            type: Array,
            default: () => ([]),
        },
    },

    computed: {
        _visible: {
            get() {
                return this.visible;
            },
            set(value) {
                this.$emit('update:visible', value);
            },
        },
    },
}
</script>
