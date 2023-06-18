<template>
	<v-snackbar v-model="visible" v-bind="$attrs" v-on="$listeners">
        <v-icon v-if="icon" v-text="icon" :left="!$vuetify.rtl" :right="$vuetify.rtl"></v-icon>
        <span v-text="body" class="mr-4"></span>

        <template #action="{ attrs }">
            <v-btn icon @click="visible = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
	</v-snackbar>
</template>

<script lang="ts">
import { TranslateResult } from 'vue-i18n';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

@Component
export default class Snack extends Vue {

    @Prop({ default: false }) value: boolean
    @Prop({ default: null }) icon: string | null
    @Prop({ default: null }) body: string | TranslateResult | null

    visible = false

    @Watch('visible')
    onVisibleChanged(value: boolean){
        if (!value) {
            this.$emit('input', value);
        }
    }
    @Watch('value')
    onValueChanged(value: any){
        if (value) {
            this.visible = true;
        }
    }
}
</script>
