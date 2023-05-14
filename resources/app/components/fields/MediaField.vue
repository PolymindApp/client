<template>
    <v-input
        v-model="media.data.url"
        v-bind="inputAttrs"
        :label="null"
    >
        <v-card
            outlined
            flat
            class="w-100"
            style="position: relative"
        >
            <!-- LABEL -->
            <v-sheet class="d-inline-block ml-2" style="top: -0.65rem; position: absolute; z-index: 1">
                <v-subheader class="px-1" v-text="inputAttrs.label" style="height: auto"></v-subheader>
            </v-sheet>

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
                v-model="base64Url"
                :image-width="width"
                :image-height="height"
                image-format="jpg"
                hide-actions
                class="w-100 v-image-input"
                @input="onInput"
            />
        </v-card>
    </v-input>
</template>

<script lang="ts">
import {Vue, Component, Prop, VModel, Watch} from 'vue-property-decorator';
import VImageInput from 'vuetify-image-input'
import MediaModel from "@/models/MediaModel";
import File from "@/utils/File";

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

    @Watch('media', {
        deep: true,
        immediate: true,
    })
    onMediaChanged(media: MediaModel) {
        this.url = this.media.data.url;
        if (this.url && !File.isBase64(this.url)) {
            File.urlToBase64(media.data.url)
                .then(base64 => {
                    this.base64Url = base64;
                });
        } else {
            this.base64Url = this.url;
        }
    }

    url: string | null = null;
    base64Url: string | null = null;

    get inputAttrs(): Record<string, string> {
        return this.$attrs;
    }

    get showOverlay(): boolean {
        return !!(this.media.data.url);
    }

    onInput(data: string) {
        this.media.data.url = data;
    }

    onClear(): void {
        this.media.data.url = null;
        this.url = '';
    }
}
</script>

<style lang="scss" scoped>
.v-input.error--text {
    .v-card {
        border-color: var(--v-error-base);

        & ::v-deep .v-card {
            border: 0;
        }
    }

    & ::v-deep {
        .v-messages {
            padding-left: 0.5rem;
        }
        .v-subheader,
        .v-icon {
            color: var(--v-error-base) !important;
        }
    }
}

.v-subheader {
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    letter-spacing: normal;
}

.v-image-input ::v-deep > div > div {
    background: none !important;

    & > div {
        box-shadow: none !important;
    }
}
</style>
