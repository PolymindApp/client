<template>
	<v-card color="transparent" :class="{ 'fill-height': builds.length === 0 }" flat tile>

		<!-- LOGS -->
		<v-dialog v-model="logsModal.visible" scrollable persistent max-width="1000px">
			<v-card>
				<v-card-title class="headline">
					<v-icon color="primary" slot="icon" size="36" left>mdi-format-list-bulleted-square</v-icon>
					<span v-text="$t('component.builds.logs.title')"></span>
				</v-card-title>

				<v-card-text class="code" v-if="formattedLogs !== ''" v-html="formattedLogs"></v-card-text>
				<v-card-text class="code" v-else><v-alert type="warning" class="ma-0" outlined><span v-text="$t('component.builds.noLogs')"></span></v-alert></v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn @click="logsModal.visible = false" text>
						{{$t('modal.close')}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- EMPTY -->
		<EmptyView v-if="builds.length === 0" :title="$t('component.builds.noBuildTitle')" :desc="$t('component.builds.noBuildDesc')" />

		<!-- BUILD LIST -->
		<v-list v-else>
			<template v-for="(build, buildIdx) in builds">
				<v-divider v-if="buildIdx > 0"></v-divider>
				<v-list-item :key="buildIdx">
					<v-list-item-avatar :color="build.status | buildColor">
						<v-icon dark>{{ build.status | buildIcon }}</v-icon>
					</v-list-item-avatar>

					<v-list-item-content>
						<v-list-item-title v-text="$t('component.builds.states.' + build.status)"></v-list-item-title>
						<v-list-item-subtitle v-text="$t('component.builds.launchedAt', {
							timeAgo: $options.filters.timeAgo(build.startTime)
						})"></v-list-item-subtitle>
					</v-list-item-content>

					<v-list-item-action>
						<div>
							<v-btn @click="launch(build, buildIdx)" target="_blank" v-if="build.status === 'succeeded'" color="primary" class="mr-4" :loading="launchLoading === buildIdx" outlined tile>
								<v-icon>mdi-play</v-icon>
							</v-btn>

							<v-btn @click="checkLogs(build, buildIdx)" :loading="logsModal.loading === buildIdx" outlined tile>
								<v-icon left>mdi-format-list-bulleted-square</v-icon>
								<span v-text="$t('component.builds.logsBtn')"></span>
							</v-btn>
						</div>
					</v-list-item-action>
				</v-list-item>
			</template>
		</v-list>
	</v-card>
</template>

<script>
    import Vue from 'vue';
	import { default as AnsiUp } from 'ansi_up';
	import EmptyView from "../../../components/EmptyView";
	import { ComponentService } from '@polymind/sdk-js';

	const ansiUp = new AnsiUp();

    export default Vue.extend({

        name: 'Builds',

        props: ['component', 'builds'],

        components: { EmptyView },

        mounted() {

        },

        destroyed() {

        },

        methods: {

			launch(build, index) {

				this.launchLoading = index;
				ComponentService.buildLaunch(this.component.id, build.pipelineExecutionId)
						.then(response => {
							const win = window.open(this.bucketUrl + '/' + response.url, '_blank');
							win.focus();
						})
						.catch(error => this.$handleError(this, error))
						.finally(() => this.launchLoading = false);
			},

			apply(build, index) {

				this.applyLoading = index;
				ComponentService.buildApply(this.component.id, build.pipelineExecutionId)
						.then(response => {

						})
						.catch(error => this.$handleError(this, error))
						.finally(() => this.applyLoading = false);
			},

        	parseLinks(str) {

				const urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
				const pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
				const emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

				return str
						.replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
						.replace(pseudoUrlPattern, '$1<a href="http://$2" target="_blank">$2</a>')
						.replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
			},

        	checkLogs(build, index) {

        		this.logsModal.loading = index;
        		ComponentService.buildLogs(this.component.id, build.pipelineExecutionId)
					.then(response => {
						this.logsModal.visible = true;
						this.logsModal.logs = response;
					})
					.catch(error => this.$handleError(this, error))
					.finally(() => this.logsModal.loading = false);
			},
		},

        computed: {

        	formattedLogs() {
        		let logs = '';
        		this.logsModal.logs.forEach(log => {
        			logs += log.message;
				});
        		return this.parseLinks(ansiUp.ansi_to_html(logs));
			}
		},

        data() {
            return {
            	bucketUrl: process.env.VUE_APP_COMPONENT_BUCKET_URL,
				launchLoading: false,
				applyLoading: false,
				logsModal: {
					loading: false,
					visible: false,
					logs: [],
				},
			};
        }
    });
</script>

<style lang="scss" scoped>
	.code {
		white-space: pre-line;
		width: 100%;
		padding: 1.5rem 1.75rem !important;
		background-color: black !important;
		color: rgba(255, 255, 255, 0.7) !important;
	}
</style>
