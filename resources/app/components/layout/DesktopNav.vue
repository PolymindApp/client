<template>
    <v-tabs id="desktop_nav" v-bind="$attrs" v-on="$listeners">
        <v-tab v-if="$store.state.user.hasRole('dev')" id="nav_dictionary" :to="routeDictionary">
            <v-icon :left="!$vuetify.rtl" :right="$vuetify.rtl">mdi-book-variant</v-icon>
            <span v-text="$t('nav.dictionary')"></span>
        </v-tab>
        <v-tab id="nav_custom" :to="{ name: 'custom', params: { uuid: deckUuid } }">
            <v-icon :left="!$vuetify.rtl" :right="$vuetify.rtl">mdi-cards</v-icon>
            <span v-text="$t('nav.deck')"></span>
        </v-tab>
        <v-tab id="nav_session" :to="routeSession">
            <v-icon :left="!$vuetify.rtl" :right="$vuetify.rtl">mdi-headphones</v-icon>
            <span v-text="$t('nav.session')"></span>
        </v-tab>
    </v-tabs>
</template>

<script>
import navigationMixin from "@/mixins/navigation.mixin";

export default {
    name: "DesktopNav",

    mixins: [navigationMixin],
}
</script>
