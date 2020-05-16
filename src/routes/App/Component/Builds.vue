<template>
	<div class="fill-height">

		<!-- LOGS -->
		<v-dialog v-model="logsModal.visible" scrollable persistent max-width="1000px">
			<v-card>
				<v-card-title class="headline">
					<v-icon color="primary" slot="icon" size="36" left>mdi-format-list-bulleted-square</v-icon>
					<span v-text="$t('component.builds.logs.title')"></span>
				</v-card-title>

				<v-card-text class="mt-5">
					<code v-text="logsModal.logs"></code>
				</v-card-text>

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
							<v-btn :href="build.publicUrl" target="_blank" v-if="build.status === 'completed'" color="primary" class="mr-4" outlined tile>
								<v-icon>mdi-play</v-icon>
							</v-btn>
							<v-btn @click="checkLogs(build)" outlined tile>
								<v-icon left>mdi-format-list-bulleted-square</v-icon>
								<span v-text="$t('component.builds.logsBtn')"></span>
							</v-btn>
						</div>
					</v-list-item-action>
				</v-list-item>
			</template>
		</v-list>
	</div>
</template>

<script>
    import Vue from 'vue';
	import EmptyView from "../../../components/EmptyView";

    export default Vue.extend({

        name: 'Builds',

        props: ['component', 'builds'],

        components: { EmptyView },

        mounted() {

        },

        destroyed() {

        },

        methods: {

        	checkLogs(build) {

        		this.logsModal.visible = true;

        		// TODO: Call service with build.id
        		this.logsModal.logs = `@ ./src/routes/App/Dataset/Data.vue?vue&type=script&lang=js&
@ ./src/routes/App/Dataset/Data.vue
@ ./node_modules/vuetify-loader/lib/loader.js?ref--17-0!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/routes/App/Dataset.vue?vue&type=script&lang=js&
@ ./src/routes/App/Dataset.vue?vue&type=script&lang=js&`;
			},
		},

        computed: {

		},

        data() {
            return {
				logsModal: {
					visible: false,
					logs: [],
				},
			};
        }
    });
</script>

<style lang="scss" scoped>
	code {
		width: 100%;
		padding: 1rem;
		background-color: black !important;
		color: rgba(255, 255, 255, 0.7) !important;
	}
</style>
