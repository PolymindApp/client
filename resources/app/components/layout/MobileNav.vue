<template>
    <v-sheet v-bind="$attrs" v-on="$listeners">
        <v-divider />
        <v-sheet class="w-100 d-flex align-center">
            <v-card class="text-center py-2 px-3" style="flex: 1" :disabled="loading" :to="{ name: 'deck.edit', params: { uuid: $route.params.uuid } }" flat tile>
                <v-icon>mdi-pencil</v-icon>
                <div class="caption" v-text="$t('btn.edit')"></div>
            </v-card>
            <v-card class="text-center py-2 px-3" style="flex: 1" :disabled="loading" :to="{ name: 'deck.play', params: { uuid: $route.params.uuid } }" flat tile>
                <v-icon>mdi-play</v-icon>
                <div class="caption" v-text="$t('btn.play')"></div>
            </v-card>
        </v-sheet>
    </v-sheet>
</template>

<script>
import EventBus from "@/utils/EventBus";

export default {
    name: "MobileNav",

    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        skeleton: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style scoped>
.router-link-exact-active,
.router-link-exact-active .v-icon {
    color: var(--v-primary-base) !important;
}
</style>
