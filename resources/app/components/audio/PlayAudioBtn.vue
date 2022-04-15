<template>
    <v-btn v-bind="$attrs" v-on="$listeners" :disabled="!canPlay" icon @mousedown.stop @click.stop="handleClick">
        <v-icon v-if="!playing" size="15">mdi-play</v-icon>
        <v-icon v-else size="15">mdi-pause</v-icon>
        <v-progress-circular :value="canPlay ? progress : 0" size="25" width="3" color="primary" />
    </v-btn>
</template>

<script>
export default {
    name: "PlayAudioBtn",

    props: {
        value: {
            type: String,
            default: null,
        },
    },

    data: () => ({
        audio: null,
        playing: false,
        progress: 0,
    }),

    computed: {
        canPlay() {
            return this.value;
        },
    },

    watch: {
        value: {
            immediate: true,
            handler(value) {
                if (this.audio) {
                    this.audio.src = value;
                }
            },
        },
    },

    methods: {
        handleClick() {
            this.playing ? this.stop() : this.play();
        },

        pause() {
            this.audio.pause();
        },

        stop() {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio.onstop();
        },

        play() {
            this.audio.play();
        },

        init() {

            if (!this.value) {
                return;
            }

            this.audio = new Audio(this.value);
            this.audio.onplay = () => {
                this.playing = true;
                this.paused = false;
            };
            this.audio.onstop = () => {
                this.playing = false;
                this.paused = false;
            };
            this.audio.onpause = () => {
                this.playing = false;
                this.paused = true;
            };
            this.audio.onended = () => {
                this.playing = false;
                this.paused = false;
                setTimeout(() => {
                    this.audio.currentTime = 0;
                }, 300);
            };
            this.audio.onloadedmetadata = () => {
                this.duration = this.audio.duration;
                this.progress = 0;
            };
            this.audio.ontimeupdate = () => {
                this.progress = this.audio.currentTime * 100 / this.audio.duration;
                // this.$forceUpdate();
            };
        },
    },

    created() {
        this.init();
    },
}
</script>

<style lang="scss" scoped>
.v-progress-circular {
    position: absolute;
    pointer-events: none;

    ::v-deep circle {
        transition-duration: 0.3s !important;
    }
}
</style>
