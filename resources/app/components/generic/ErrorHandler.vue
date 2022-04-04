<template>
    <Modal v-model="visible" v-bind="$attrs" v-on="$listeners" :title="_title">
        <template #body>

            <!-- MESSAGE -->
            <v-alert v-text="value.body"></v-alert>

            <!-- LINE -->
            <p v-if="value.line !== null" class="mt-4">
                <strong v-text="$t('error.line', {
                    line: value.line
                })"></strong>
            </p>

            <!-- TRACE -->
            <v-alert color="#666" v-if="value.trace.length > 0" class="overflow-auto" style="max-height: 50vh">
                <pre><div :key="traceIdx" v-for="(trace, traceIdx) in value.trace" v-text="trace"></div></pre>
            </v-alert>
        </template>
    </Modal>
</template>

<script>
import Modal from './Modal';

export default {
    name: "ErrorHandler",

    components: { Modal },

    props: {
        value: {
            type: Object,
            default: () => ({
                title: null,
                body: null,
                line: null,
                trace: [],
            }),
        },
    },

    data: () => ({
        visible: false,
    }),

    computed: {
        _title() {
            return this.value.title || this.$i18n.t('error.defaultTitle');
        },
    },

    watch: {
        value: {
            deep: true,
            handler() {
                this.visible = true;
            },
        },
    },
}
</script>
