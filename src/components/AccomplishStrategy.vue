<template>
	<v-dialog v-model="open" scrollable persistent max-width="400px">
		<v-card>
			<v-card-title class="headline">
				<v-icon color="primary" slot="icon" size="36" left>mdi-timetable</v-icon>
				<span v-text="$t('strategy.accomplishDialogTitle')"></span>
			</v-card-title>

			<v-card-text class="my-4">
				<span v-text="$t('strategy.accomplishDialogDesc')"></span>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn @click="accomplish(true)" :loading="sessionAccomplishLoading" color="primary">
					<v-icon left>mdi-play</v-icon>
					<span v-text="$t('modal.start')"></span>
				</v-btn>
				<v-btn @click="open = false" text>
					<span v-text="$t('modal.cancel')"></span>
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
    import Vue from 'vue';
    import { Strategy, SessionStructureService } from '@polymind/sdk-js';

    export default Vue.extend({

        name: 'AccomplishStrategy',

        props: {
        	visible: {
        		type: Boolean,
				default: false,
			},
			strategy: {
        		type: Strategy,
				default: () => new Strategy()
			}
		},

        components: {},

        mounted() {

        },

        destroyed() {

        },

        methods: {


			accomplish(force = false) {

				if (force) {
					this.sessionAccomplishLoading = true;
					SessionStructureService.generate({
						strategy: this.strategy.id,
						parameters: this.strategy.assemblies,
					})
							.then(session => {
								this.session = session;
								this.open = false;
								const win = window.open(this.generatedTestUri, '_blank');
								win.focus();
							}).finally(() => this.sessionAccomplishLoading = false);
				} else {
					this.accomplishDialog.visible = true;
				}
			},
		},

        computed: {

        	open: {
        		get() {
        			return this.visible;
				},
				set(value) {
        			this.$emit('update:visible', value);
				},
			},

			generatedTestUri() {
				return this.playerHost + '/s/' + this.session.hash + '/test';
			},
		},

        data() {
            return {
				playerHost: process.env.VUE_APP_PLAYER_URL,
				sessionAccomplishLoading: false,
			};
        }
    });
</script>
