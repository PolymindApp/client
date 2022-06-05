<template>
    <div class="d-flex align-center">
        <div v-if="audio" class="mr-3">
            <PlayAudioBtn v-model="audio" tabindex="-1" />
        </div>
        <div style="line-height: 1rem" class="overflow-hidden">
            <div class="font-weight-bold two-lines-truncate">
            <span :class="{
              'd-inline-block text-capitalize-first': true,
              'primary--text': primary && !selected
            }" v-text="value"></span>
            </div>
            <div v-if="voice" class="mb-n1">
                <small :class="{
                    'opacity-33': !selected
                }">
                    <span v-text="voice.language.name"></span>
                    - <span v-text="voice.name"></span>
                </small>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import PlayAudioBtn from "@/components/audio/PlayAudioBtn.vue";
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    components: {
        PlayAudioBtn
    }
})
export default class SynthesizedTableItem extends Vue {
    @Prop({ type: String, default: null }) value: string
    @Prop({ type: Object, default: null }) voice: any
    @Prop({ type: String, default: null }) audio: string
    @Prop({ type: Boolean, default: false }) primary: boolean
    @Prop({ type: Boolean, default: false }) selected: boolean
}
</script>
