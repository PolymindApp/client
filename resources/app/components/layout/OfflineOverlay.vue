<template>
    <v-overlay :value="!online" v-bind="$attrs" v-on="$listeners" opacity="1">
        <v-container class="text-center" style="max-width: 20rem">
            <v-icon color="error" size="64">mdi-lan-disconnect</v-icon>
            <h2 class="mt-3" v-text="$t('offlineOverlay.title')"></h2>
            <p class="mb-0" v-text="$t('offlineOverlay.body')"></p>
        </v-container>
    </v-overlay>
</template>

<script>
export default {
    name: "OfflineOverlay",

    props: {
        value: {
            type: String,
            default: null,
        },
    },

    data: () => ({
        online: navigator.onLine,
    }),

    methods: {
        handleOnline() {
            this.online = true;
        },
        handleOffline() {
            this.online = false;
        },
    },

    created() {
        window.addEventListener('online', this.handleOnline, false);
        window.addEventListener('offline', this.handleOffline, false);
    },

    destroyed() {
        window.removeEventListener('online', this.handleOnline, false);
        window.removeEventListener('offline', this.handleOffline, false);
    },
}
</script>
