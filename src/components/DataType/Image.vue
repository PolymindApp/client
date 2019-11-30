<template>
	<v-card class="image d-flex align-center justify-center w-100 fill-height grey lighten-2" @click="currentValue ? view() : edit()" v-bind="$attrs" v-on="$listeners" dark tile flat>

		<MediaBrowser v-model="currentValue" :visible="showMediaBrowser" />
		<ModalGallery ref="gallery" :title="$t('modalGallery.title')" :value="modalGallery" />

		<v-icon class="icon-abs-middle" size="32">mdi-image-outline</v-icon>

		<v-hover v-slot:default="{ hover }">
			<div v-if="!currentValue" class="w-100 fill-height">
				<v-fade-transition>
					<div v-if="hover" class="hover">
						<v-scale-transition>
							<v-icon v-if="hover">mdi-plus</v-icon>
						</v-scale-transition>
					</div>
				</v-fade-transition>
			</div>
			<v-img v-else class="d-flex align-center text-center fill-height" width="48" height="48" :src="image" contain>
				<v-fade-transition>
					<div v-if="hover" class="hover fill-height">
						<v-scale-transition>
							<v-icon v-if="hover" dark>mdi-arrow-expand</v-icon>
						</v-scale-transition>
					</div>
				</v-fade-transition>
			</v-img>
		</v-hover>
	</v-card>
</template>

<script>
    import Vue from 'vue';
    import MediaBrowser from "../MediaBrowser";
    import ModalGallery from "../ModalGallery";

    export default Vue.extend({

        name: 'DataImage',

        props: {
            value: {
                default: null,
            },
            readonly: {
                type: Boolean,
                default: false,
            },
        },

        components: { MediaBrowser, ModalGallery },

        mounted() {

        },

        destroyed() {

        },

        methods: {

            edit() {
				this.add();
			},

			focus() {

			},

			clear() {
                this.$emit('input', null);
			},

            reset() {
                this.$emit('input', this.originalValue);
            },

            add() {
                this.showMediaBrowser = true;
            },

			view() {
                this.modalGallery = [{
                    src: this.image
				}];
				this.$refs.gallery.open();
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
                image: 'https://picsum.photos/256/256',
                showMediaBrowser: false,
                modalGallery: [],
                currentValue: this.value,
                originalValue: {...this.value},
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
	.image {
		min-width: 3rem;
	}
	.icon-abs-middle {
		position: absolute;
		top: calc(50% - 1rem);
		left: calc(50% - 1rem);
		pointer-events: none;
		z-index: 0;
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
	.v-image >>> .v-responsive__content {
		height: 100%;
	}
</style>
