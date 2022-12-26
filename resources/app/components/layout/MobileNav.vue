<template>
    <v-sheet v-bind="$attrs" v-on="$listeners">
        <v-divider />
        <v-sheet class="w-100 d-flex align-center">
            <v-card v-if="$store.state.user.hasRole('dev')" id="nav_dictionary" class="text-center py-2 px-3" style="flex: 1" :disabled="loading" :to="routeDictionary" flat tile>
                <v-icon>mdi-book-open-variant</v-icon>
                <div class="caption" v-text="$t('nav.dictionary')"></div>
            </v-card>
            <v-card id="nav_custom" class="text-center py-2 px-3" style="flex: 1" :disabled="loading" :to="{ name: 'custom', params: { uuid: deckUuid } }" flat tile>
                <v-icon>mdi-cards</v-icon>
                <div class="caption" v-text="$t('nav.deck')"></div>
            </v-card>
            <v-card id="nav_session" class="text-center py-2 px-3" style="flex: 1" :disabled="loading" :to="routeSession" flat tile>
                <v-icon>mdi-headphones</v-icon>
                <div class="caption" v-text="$t('nav.session')"></div>
            </v-card>
        </v-sheet>
    </v-sheet>
</template>

<script>
import navigationMixin from '@/mixins/navigation.mixin';

export default {
    name: "MobileNav",

    mixins: [navigationMixin],

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
