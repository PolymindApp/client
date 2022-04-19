<template>
    <v-tabs v-bind="$attrs" v-on="$listeners" height="64" grow>
        <v-tab :to="{ name: 'deck.edit', params: { uuid: deck.data.id || 'unclassified' } }">
            <v-icon :left="!$vuetify.rtl" :right="$vuetify.rtl">mdi-pencil</v-icon>
            <span v-text="$t('btn.edit')"></span>
        </v-tab>
        <v-tab :to="{ name: 'deck.play', params: { uuid: deck.data.id || 'unclassified' } }">
            <v-icon :left="!$vuetify.rtl" :right="$vuetify.rtl">mdi-play</v-icon>
            <span v-text="$t('btn.play')"></span>
        </v-tab>
<!--        <v-btn color="primary" >-->
<!--            <v-icon :left="!$vuetify.rtl" :right="$vuetify.rtl">mdi-pencil</v-icon>-->
<!--        </v-btn>-->
<!--        <v-btn color="primary" :to="{ name: 'deck.play', params: { uuid: deck.data.id || 'unclassified' } }">-->
<!--            <v-icon :left="!$vuetify.rtl" :right="$vuetify.rtl">mdi-play</v-icon>-->
<!--            <span v-text="$t('btn.play')"></span>-->
<!--        </v-btn>-->
    </v-tabs>
</template>

<script>
export default {
    name: "DesktopNav",

    props: {
        deck: {
            type: Object,
            default: () => ({}),
        },
    },
}
</script>
