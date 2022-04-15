<template>
    <v-btn v-bind="$attrs" v-on="$listeners" @click="handleClick">
        <v-icon v-text="recording ? 'mdi-stop' : 'mdi-microphone'">mdi-microphone</v-icon>
    </v-btn>
</template>

<script>
import MicRecorder from 'mic-recorder-to-mp3';

export default {
    name: "MicAudioRecorder",

    props: {
        value: {
            type: String,
            default: null,
        },
        onBeforeRecord: {
            type: Function,
            default: () => new Promise(resolve => resolve()),
        },
    },

    data: () => ({
        recorder: null,
        recording: false,
    }),

    computed: {
        _value: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
    },

    methods: {
        handleClick() {
            this.recording ? this.stop() : this.record();
        },

        handleStartRecord() {
            this.record();
        },

        handleStopRecord() {
            this.stop();
        },

        init() {
            this.audioRecord = new Audio('/assets/sounds/record.wav');
            this.recorder = new MicRecorder({
                bitRate: 128
            });
        },

        record() {
            this.onBeforeRecord()
                .then(() => {
                    this.audioRecord.onended = () => {
                        this.recorder.start()
                            .then(() => this.recording = true)
                            .catch(this.$handleError);
                    };
                    this.audioRecord.currentTime = 0;
                    this.audioRecord.play();
                });
        },

        stop() {
            this.recorder.stop()
                .then(([buffer, blob]) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        this._value = reader.result;
                        this.recording = false;
                    }
                })
                .catch(this.$handleError);
        }
    },

    created() {
        this.init();
    },
}
</script>
