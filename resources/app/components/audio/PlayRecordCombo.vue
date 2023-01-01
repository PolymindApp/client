<template>
    <div>
        <v-tooltip bottom>
            <template #activator="{ attrs, on }">
                <MicAudioRecorder
                    v-model="model"
                    v-bind="attrs"
                    v-on="on"
                    :on-before-record="() => onBeforeRecord(
                        _voice,
                        () => _voice = null
                    )"
                    :disabled="!canRecord"
                    tabindex="-1"
                    icon
                />
            </template>
            <span v-text="$t('btn.record')"></span>
        </v-tooltip>
        <v-tooltip bottom>
            <template #activator="{ attrs, on }">
                <PlayAudioBtn
                    v-model="model"
                    v-bind="attrs"
                    v-on="on"
                    tabindex="-1"
                />
            </template>
            <span v-text="$t('btn.listen')"></span>
        </v-tooltip>
    </div>
</template>

<script lang="ts">
import MicAudioRecorder from '@/components/audio/MicAudioRecorder.vue';
import PlayAudioBtn from '@/components/audio/PlayAudioBtn.vue';
import {Vue, Component, VModel, Prop} from 'vue-property-decorator';
import VoiceModel from "@/models/VoiceModel";

@Component({
    components: {
        MicAudioRecorder,
        PlayAudioBtn,
    }
})
export default class PlayRecordCombo extends Vue {

    @VModel({
        default: null,
    }) model!: string

    @Prop({
        default: false,
    }) loading?: boolean

    @Prop({
        default: () => ([]),
    }) voices!: Array<VoiceModel>

    @Prop({
        default: null
    }) voice?: number

    onBeforeRecord(voice: VoiceModel, callback = () => ({})) {
        return new Promise((resolve: (value?: unknown) => void) => {
            if (!voice) {
                callback();
                resolve();
            } else {
                this.$confirm(
                    this.$i18n.t('cardEditorForm.confirmBeforeRecord.title'),
                    this.$i18n.t('cardEditorForm.confirmBeforeRecord.body'),
                    this.$i18n.t('btn.continue'),
                    modal => {
                        callback();
                        modal.visible = false;
                        resolve();
                    }
                )
            }
        });
    }

    get canRecord(): boolean {
        return !this.loading;
    }

    get _voice(): VoiceModel | undefined {
        return this.voices.find(voice => voice.data.id === this.voice);
    }

    set _voice(voice: VoiceModel | undefined) {
        this.$emit('update:voice', voice)
    }
}
</script>
