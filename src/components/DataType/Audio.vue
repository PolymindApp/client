<template>
	<div style="position: relative">
		<template v-if="!canEdit">
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn @click="toggle()" @mousedown.stop @mouseup.stop v-on="on" class="my-n2 mx-n1" icon>
						<v-progress-circular color="primary" rotate="270" size="24" :value="audioProgress">
							<v-icon v-if="!isPlaying" x-small>mdi-play</v-icon>
							<v-icon v-else x-small>mdi-stop</v-icon>
						</v-progress-circular>
					</v-btn>
				</template>
				<span v-text="isPlaying ? $t('dataType.stopAudioTooltip') : $t('dataType.playAudioTooltip')"></span>
			</v-tooltip>

			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn @mousedown.stop @mouseup.stop v-on="on" class="my-n2 mx-n1" icon>
						<v-icon small>mdi-microphone-outline</v-icon>
					</v-btn>
				</template>
				<span v-text="isPlaying ? $t('dataType.stopRecordingTooltip') : $t('dataType.playRecordingTooltip')"></span>
			</v-tooltip>

			<audio ref="audio">
				<source :src="'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3'" type="audio/mpeg">
				Your browser does not support the audio element.
			</audio>
		</template>
		<template v-else>
			<v-file-input ref="input" v-model="currentValue" v-bind="$attrs" v-on="$listeners" />
		</template>
	</div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({

        name: 'DataAudio',

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

			this.$bus.$on('PLAY_AUDIO', () => {
				this.stop();
			});
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

            reset() {
                this.$emit('input', this.originalValue);
            },

            setProgress() {
                this.audioProgress = ((this.$refs.audio.currentTime * 100 ) / this.$refs.audio.duration) || 0;
            },

            play() {
                this.$bus.$emit('PLAY_AUDIO', this.$refs.audio);
				setTimeout(() => {
					this.$refs.audio.addEventListener('ended', this.stop);
					this.$refs.audio.ontimeupdate = this.setProgress;
					this.isPlaying = true;
                	this.$refs.audio.play();
				})
            },

            toggle(event) {
                this.isPlaying ? this.stop() : this.play();
            },

            stop() {
                this.isPlaying = false;
                this.audioProgress = 0;

                if (this.$refs.audio) {
					this.$refs.audio.pause();
					this.$refs.audio.currentTime = 0;
				}
            },
		},

        computed: {

            canEdit() {
                return !this.readonly && this.isEditing;
            },

            canReset() {
                return JSON.stringify(this.value) !== JSON.stringify(this.originalValue);
            }
		},

        data() {
            return {
                currentValue: this.value,
                audio: {},
                isPlaying: false,
                audioProgress: 0,
                originalValue: {...this.value}
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
