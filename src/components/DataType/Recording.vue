<template>
	<div style="position: relative">
		<v-tooltip bottom>
			<template v-slot:activator="{ on }">
				<v-btn v-on="on" icon>
					<v-icon>mdi-microphone-outline</v-icon>
				</v-btn>
			</template>
			<span v-text="isPlaying ? $t('dataType.stopRecordingTooltip') : $t('dataType.playRecordingTooltip')"></span>
		</v-tooltip>
	</div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'DataRecording',

        props: {
            value: {
                default: null,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
        },

        components: {},

        mounted() {

        },

        destroyed() {

        },

        methods: {

            edit() {

            },

            focus() {

            },

            clear() {
                this.$emit('input', null);
            },

            setProgress() {
                this.audioProgress = ((this.$refs.audio.currentTime * 100 ) / this.$refs.audio.duration) || 0;
            },

            play() {
                this.$refs.audio.ontimeupdate = this.setProgress;
                this.$refs.audio.addEventListener('ended', this.stop);
                this.isPlaying = true;
                this.$refs.audio.play();
            },

            toggle() {
                this.isPlaying ? this.stop() : this.play();
            },

            stop() {
                this.isPlaying = false;
                this.audioProgress = 0;
                this.$refs.audio.pause();
                this.$refs.audio.currentTime = 0;
            },
		},

        computed: {

		},

        data() {
            return {
                currentValue: this.value,
                isPlaying: false,
                audioProgress: 0,
			};
        },

        watch: {
            value(value) {
                this.currentValue = value;
            }
        }
    });
</script>

<style lang="scss" scoped>

</style>
