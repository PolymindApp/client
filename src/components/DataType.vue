<template>
	<div class="fill-height d-flex align-center inner-flex-full">

		<!-- TEXT -->
		<template v-if="type === 'text'">
			<span v-if="readonly" v-text="value"></span>
			<v-text-field v-else ref="input" type="text" v-model="value" v-bind="$attrs" v-on="$listeners" />
		</template>

		<!-- NUMBER -->
		<template v-else-if="type === 'number'">
			<span v-if="readonly" v-text="value"></span>
			<v-text-field v-else ref="input" type="number" v-model="value" v-bind="$attrs" v-on="$listeners" />
		</template>

		<!-- DATE -->
		<template v-else-if="type === 'date'">
			<span v-if="readonly" v-text="value"></span>
			<v-text-field v-else ref="input" type="date" v-model="value" v-bind="$attrs" v-on="$listeners" />
		</template>

		<!-- IMAGE -->
		<template v-else-if="type === 'image'">
			<v-card class="d-flex align-center justify-center w-100 fill-height grey lighten-2" @click="addImage()" v-bind="$attrs" v-on="$listeners" dark tile flat>

				<v-icon class="icon-abs-middle" size="32">mdi-image-outline</v-icon>

				<v-hover v-slot:default="{ hover }">
					<div v-if="!value" class="w-100 fill-height">
						<v-scale-transition>
							<div v-if="hover" class="hover">
								<v-icon>mdi-plus</v-icon>
							</div>
						</v-scale-transition>
					</div>
					<v-img v-else class="d-flex align-center text-center fill-height" width="48" height="48" src="https://picsum.photos/64/64" contain>
						<v-scale-transition>
							<div v-if="hover" class="hover">
								<v-icon dark>mdi-arrow-expand</v-icon>
							</div>
						</v-scale-transition>
					</v-img>
				</v-hover>
			</v-card>
		</template>

		<!-- AUDIO -->
		<template v-else-if="type === 'audio'">
			<div v-if="readonly" style="position: relative">
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn @click="toggleAudio()" v-on=" on" icon>
							<v-progress-circular color="primary" rotate="270" :value="audioProgress">
								<v-icon v-if="!isPlaying">mdi-play</v-icon>
								<v-icon v-else>mdi-stop</v-icon>
							</v-progress-circular>
						</v-btn>
					</template>
					<span v-text="isPlaying ? $t('dataType.stopAudioTooltip') : $t('dataType.playAudioTooltip')"></span>
				</v-tooltip>

				<audio ref="audio">
					<source :src="'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3'" type="audio/mpeg">
					Your browser does not support the audio element.
				</audio>
			</div>
			<div v-else>
				<v-file-input ref="input" v-model="value" v-bind="$attrs" v-on="$listeners" />
			</div>
		</template>

		<!-- FILE -->
		<template v-else-if="type === 'file'">
			<div v-if="readonly">
				<a :href="value" target="_blank" v-text="value" class="text-truncate d-inline-block"></a>
			</div>
			<div v-else>
				<v-file-input ref="input" v-model="value" v-bind="$attrs" v-on="$listeners" />
			</div>
		</template>

		<div style="flex: 0">
			<v-menu auto>
				<template v-slot:activator="{ on: menu }">
					<v-tooltip bottom>
						<template v-slot:activator="{ on: tooltip }">
							<v-btn class="ml-2" v-on="{ ...tooltip, ...menu }" icon>
								<v-icon>mdi-dots-vertical</v-icon>
							</v-btn>
						</template>
						<span v-text="$t('dataType.optionsTooltip')"></span>
					</v-tooltip>
				</template>

				<v-list dense>
					<v-list-item v-for="(option, index) in audioOptions" :key="index" @click="option.callback">
						<v-list-item-icon>
							<v-icon v-text="option.icon"></v-icon>
						</v-list-item-icon>
						<v-list-item-title v-text="option.title"></v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</div>
	</div>
</template>

<script>
    import Vue from 'vue';
    import File from '../utils/File';

    export default Vue.extend({

        name: 'DataType',

        props: {
            value: {
                default: null,
			},
            type: {
                type: String,
				default: 'text',
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

            focus() {
                this.$nextTick(() => {

                    if (!this.$refs.input) {
                        return;
					}

					this.$refs.input.focus();
					this.$refs.input.$el.querySelector('input').select();
				});
			},

            setAudioProgress() {
                this.audioProgress = ((this.$refs.audio.currentTime * 100 ) / this.$refs.audio.duration) || 0;
			},

			playAudio() {
                this.$refs.audio.ontimeupdate = this.setAudioProgress;
                this.$refs.audio.addEventListener('ended', this.stopAudio);
                this.isPlaying = true;
                this.$refs.audio.play();
			},

            toggleAudio() {
                this.isPlaying ? this.stopAudio() : this.playAudio();
			},

			stopAudio() {
                this.isPlaying = false;
                this.audioProgress = 0;
                this.$refs.audio.pause();
                this.$refs.audio.currentTime = 0;
			},

            addImage() {
                File.promptFileDialog(files => {
                    console.log(files);
				}, 'image/jpg', 'image/jpeg', 'image/png', 'image/gif');
			}
		},

        computed: {

		},

        data() {

            const defaultOptions = [
				{ icon: 'mdi-pencil', title: this.$t('dataType.options.edit'), callback: () => {

				} },
				{ icon: 'mdi-comment-plus-outline', title: this.$t('dataType.options.comment'), callback: () => {

				} },
				{ icon: 'mdi-file-remove-outline', title: this.$t('dataType.options.clean'), callback: () => {

				} }
			];

            return {
                audio: {},
                defaultOptions: defaultOptions,
                audioOptions: [...defaultOptions],
                isPlaying: false,
				audioProgress: 0,
			};
        }
    });
</script>

<style lang="scss" scoped>
	.inner-flex-full > * {
		flex: 1;
	}
	.hover {
		position: relative;
		z-index: 2;
		background-color: rgba(0, 0, 0, 0.25);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
	}
	.icon-abs-middle {
		position: absolute;
		top: calc(50% - 1rem);
		left: calc(50% - 1rem);
		pointer-events: none;
		z-index: 0;
	}
</style>
