<template>
    <v-input>
        <v-card
            outlined
            flat
            class="w-100"
        >
            <v-image-input
                v-model="_value.data.url"
                v-on="$listeners"
                :image-width="width"
                :image-height="height"
                image-format="jpg"
                hide-actions
                class="w-100"
                @file-info="onFileInfo"
            />
        </v-card>
    </v-input>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import VImageInput from 'vuetify-image-input'
import MediaModel from "@/models/MediaModel";

@Component({
    components: {
        VImageInput
    }
})
export default class MediaField extends Vue {

    @Prop({
        default: 1,
    }) value!: MediaModel

    @Prop({
        default: 256,
    }) height?: number

    @Prop({
        default: 256,
    }) width?: number

    get _value(): MediaModel {
        return this.value;
    }

    set _value(value: MediaModel) {
        console.log(value);
        this.$emit('input', value);
    }

    onFileInfo(args: any) {
        console.log(args);
    }
}
</script>
