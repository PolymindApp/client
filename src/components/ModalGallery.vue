<template>
	<v-dialog v-model="visible" fullscreen hide-overlay transition="dialog-bottom-transition">
		<v-sheet class="loading-panel" height="100%" color="secondary" flat tile>
			<v-row no-gutters class="fill-height" align="center" justify="center">
				<v-progress-circular :size="50" color="white" indeterminate></v-progress-circular>
			</v-row>
		</v-sheet>
		<v-card color="transparent" class="fill-height d-flex flex-column" tile flat>
			<v-toolbar class="w-100" dark absolute flat style="background-color: rgba(0, 0, 0, 0.25)">
				<v-toolbar-title v-text="header"></v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn @click="download(value[$refs.carousel.selectedValues[0]])" text>
					<v-icon left>mdi-download</v-icon>
					<span v-text="$t('modalGallery.download')"></span>
				</v-btn>
				<v-btn class="ml-4" icon dark @click="visible = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-toolbar>
			<v-carousel ref="carousel" :hide-delimiters="value.length <= 1" :show-arrows="value.length > 1" height="100%">
				<v-carousel-item v-for="(item, idx) in value" :key="idx" :src="item.src"></v-carousel-item>
			</v-carousel>
		</v-card>
	</v-dialog>
</template>

<script>
    import Vue from 'vue';
    import File from "../utils/File";

    export default Vue.extend({

        name: 'Gallery',

        props: {
            value: {
                type: Array,
				default: () => ([]),
			},
			title: {
                type: String,
			}
		},

        components: {},

        mounted() {

        },

        destroyed() {

        },

        methods: {

            download(photo) {
                const link = document.createElement('a');
                link.setAttribute('href', photo.src);
                link.setAttribute('download', File.getFilenameFromUrl(photo.src));
                link.setAttribute('target', '_blank');
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },

            open(index) {
				this.visible = true;
                this.$nextTick(() => {
                    this.$refs.carousel.internalValue = index;
                    // window.test = this.$refs.carousel;
                    // console.log(this.$refs.carousel);
				});
			},

			close() {
                this.visible = false;
			}
		},

        computed: {

			header() {
				if (this.title === undefined) {
					return this.$t('component.modalGallery.title');
				}

				return this.title;
			}
		},

        data() {
            return {
                visible: false,
                notifications: false,
                sound: true,
                widgets: false,
			};
        },

		watch: {
            visible(val) {
                if (val) {
                    document.documentElement.classList.add('modal-noscroll');
				} else {
                    document.documentElement.classList.remove('modal-noscroll');
				}
			}
		}
    });
</script>

<style lang="scss" scoped>
	.loading-panel {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
