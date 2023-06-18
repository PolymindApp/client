<template>
    <v-input
        v-model="media.data.url"
        v-bind="inputAttrs"
        :label="null"
    >
        <fieldset
            class="w-100"
            style="position: relative"
        >
            <v-overlay v-model="loading" absolute opacity="0.8">
                <v-progress-circular color="primary" size="64" indeterminate />
            </v-overlay>

            <!-- LABEL -->
            <legend v-text="inputAttrs.label"></legend>

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
        </fieldset>
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

    loading = false
    wasLoaded = false

    @Watch('media', {
        deep: true,
        immediate: true,
    })
    onMediaChanged(media: MediaModel) {
        this.url = this.media.data.url;
        if (this.url && !File.isBase64(this.url)) {
            this.loading = true;
            File.urlToBase64(media.data.url)
                .then(base64 => {
                    this.base64Url = base64;
                    this.wasLoaded = true;
                })
                .finally(() => {
                    this.loading = false;
                });
        } else {
            if (!this.wasLoaded) {
                this.media.data.id = null;
            }

            this.base64Url = this.url;
            this.wasLoaded = false;
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
        this.$emit('input', this.media);
    }

    onClear(): void {
        this.media.data.id = null;
        this.media.data.url = null;
        this.url = '';
    }
}
</script>

<style lang="scss" scoped>
.v-input {
    fieldset {
        color: rgba(255, 255, 255, 0.24);
        border-radius: 4px;
        border:rgba(255, 255, 255, 0.24) solid 1px;

        legend {
            color: rgba(255, 255, 255,.698);
            padding: 0 4px;
            margin-left: 8px;
            font-size: 12px;
        }
    }
}
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
    padding: 5px !important;

    & > div {
        box-shadow: none !important;
    }
}
</style>
