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
    </v-tabs>
</template>

<script>
import DeckModel from '@/models/DeckModel';

export default {
    name: "DesktopNav",

    props: {
        deck: {
            type: DeckModel,
            default: () => new DeckModel(),
        },
    },
}
</script>
