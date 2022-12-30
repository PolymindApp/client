<template>
    <v-input>
        <v-card
            outlined
            flat
            class="w-100"
            style="position: relative"
        >
            <div
                v-if="showOverlay"
                style="position: absolute; top: 1rem; right: 1rem; z-index: 1"
            >
                <v-tooltip left>
                    <template #activator="{ attrs, on }">
                        <v-btn v-bind="attrs" v-on="on" icon @click="onClear">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>
                    <span v-text="$t('mediaField.clearImg')"></span>
                </v-tooltip>
            </div>
            <v-image-input
                v-model="media.data.url"
                :image-width="width"
                :image-height="height"
                image-format="jpg"
                hide-actions
                class="w-100"
            />
        </v-card>
    </v-input>
</template>

<script lang="ts">
import {Vue, Component, Prop, VModel} from 'vue-property-decorator';
import VImageInput from 'vuetify-image-input'
import MediaModel from "@/models/MediaModel";

@Component({
    components: {
        VImageInput
    }
})
export default class MediaField extends Vue {

    @VModel({
        default: null,
    }) media!: MediaModel

    @Prop({
        default: 256,
    }) height?: number

    @Prop({
        default: 256,
    }) width?: number

    @Prop({
        default: false,
    }) clearable?: boolean

    get showOverlay(): boolean {
        return !!(this.media.data.url);
    }

    onClear(): void {
        this.media.data.url = null;
    }
}
</script>
