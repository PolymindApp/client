<template>
	<v-sheet class="w-100" color="grey lighten-2" dark tile>

		<v-sheet color="white" class="py-2 px-4" tile>
			<v-row>
				<v-col :cols="12 / objectives.length" v-for="(objective, objectiveIdx) in objectives">
					<v-card class="pa-4 d-flex align-center" :color="objective.color">
						<div class="shrink mr-4">
							<v-progress-circular :rotate="-90" :size="80" :width="15" :value="objective.percentage" color="white">
								{{ objective.percentage }} %
							</v-progress-circular>
						</div>
						<div class="grow">
							<div class="overline">{{ objective.title }}</div>
							<div class="display-1">{{ objective.value | humanNumber }}</div>
						</div>
					</v-card>
				</v-col>
			</v-row>
		</v-sheet>

		<v-sheet color="transparent" class="py-2 px-4" tile>
			<v-row>
				<v-col cols="6">
					<v-card light color="white">
						<div class="d-flex align-center pa-4">
							<div class="shrink">
								<v-btn :disabled="strategies.data.length < 2" icon>
									<v-icon>mdi-chevron-left</v-icon>
								</v-btn>
							</div>
							<div class="grow mx-4">
								<v-select class="pa-0 ma-0" label="Strategy" item-text="name" :items="strategies.data" v-model="selectedStrategy" solo flat dense hide-details></v-select>
							</div>
							<div class="shrink">
								<v-btn :disabled="strategies.data.length < 2" icon>
									<v-icon>mdi-chevron-right</v-icon>
								</v-btn>
							</div>
						</div>

						<div class="pa-4 pt-0">
							<bar-chart style="height: 400px" :chart-data="strategyData" :options="chartOptions"></bar-chart>
						</div>
					</v-card>
				</v-col>
				<v-col cols="6">
					<v-card light color="white">
						<v-list color="transparent">
							<v-list-item>
								<v-list-item-icon class="mr-8">
									<v-icon>mdi-comment-multiple-outline</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title class="headline primary--text">Feed</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-divider></v-divider>
						</v-list>
						<v-list color="transparent" height="413" class="scrollable">
							<v-list-item v-for="(feedItem, i) in feed" :key="i">
								<v-list-item-avatar>
									<UserAvatar :size="40" :user="feedItem.created_by" />
								</v-list-item-avatar>
								<v-list-item-content>
									<v-list-item-title>{{ feedItem.created_by | userScreenName }}</v-list-item-title>
									<v-list-item-subtitle v-text="feedItem.comment"></v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-card>
				</v-col>
			</v-row>
		</v-sheet>

<!--		<v-sheet color="secondary" class="py-2 px-4" tile>-->
<!--			WORD LIST-->
<!--		</v-sheet>-->

<!--		<EmptyView v-if="!$root.isLoading && !hasItems" :title="$t('dashboard.filteredNoResults')" :desc="$t('dashboard.filteredNoResultsDesc')" />-->

<!--		<v-row v-else-if="!$root.isLoading">-->
<!--			<v-col cols="12" :md="3" v-for="(category, index) in categories">-->
<!--				<h2 class="mb-4 title" v-text="$t('dashboard.' + category, { total: getItems(category).length })"></h2>-->

<!--				<v-alert v-if="getItems(category).length === 0" type="warning" border="left" colored-border light elevation="2">-->
<!--					{{$t('dashboard.' + category + 'Empty')}}-->
<!--				</v-alert>-->
<!--				<template v-else v-for="(item, index) in getItems(category)">-->
<!--					<Deck :key="index" :type="types[index]" :model="item" :class="{ 'mt-2': index > 0 }" dense />-->
<!--				</template>-->
<!--			</v-col>-->
<!--		</v-row>-->

		<v-speed-dial fixed right bottom v-model="fab" direction="top">
			<template v-slot:activator>
				<v-tooltip left>
					<template v-slot:activator="{ tooltip }">
						<v-btn v-on="tooltip" v-model="fab" color="primary" fab>
							<v-icon v-if="fab">mdi-close</v-icon>
							<v-icon v-else>mdi-plus</v-icon>
						</v-btn>
					</template>
					<span>{{$t('toolbar.tooltip.adddecks')}}</span>
				</v-tooltip>
			</template>
			<v-btn to="/dataset/new" dark small>
				<v-icon>mdi-database</v-icon>
<!--				<v-icon left>mdi-database</v-icon>-->
<!--				<span v-text="$t('dashboard.new.dataset')"></span>-->
			</v-btn>
			<v-btn to="/document/new" dark small>
				<v-icon>mdi-file-document-outline</v-icon>
<!--				<v-icon left>mdi-file-document-outline</v-icon>-->
<!--				<span v-text="$t('dashboard.new.document')"></span>-->
			</v-btn>
			<v-btn to="/component/new" dark small>
				<v-icon>mdi-cube-outline</v-icon>
<!--				<v-icon left>mdi-cube-outline</v-icon>-->
<!--				<span v-text="$t('dashboard.new.component')"></span>-->
			</v-btn>
			<v-btn to="/strategy/new" dark small>
				<v-icon>mdi-strategy</v-icon>
<!--				<v-icon left>mdi-arrow-decision</v-icon>-->
<!--				<span v-text="$t('dashboard.new.strategy')"></span>-->
			</v-btn>
		</v-speed-dial>

	</v-sheet>
</template>

<script>
import Vue from 'vue';
import EmptyView from "../../components/EmptyView";
import Deck from "../../components/Deck";
import BarChart from "../../components/Chart/Bar";
import Response from "../../models/Response";
import StrategyService from "../../services/StrategyService";
// import ComponentService from "../../services/ComponentService";
// import DocumentService from "../../services/DocumentService";
// import DatasetService from "../../services/DatasetService";
import UserAvatar from "../../components/UserAvatar";

export default Vue.extend({

	components: { EmptyView, Deck, UserAvatar, BarChart },

	mounted() {

		this.load();
	},

	destroyed() {

	},

	methods: {

	    load() {

            this.$root.isLoading = true;
            Promise.all([
                // StrategyService.getAllMine.bind(this)(),
                // ComponentService.getAllMine.bind(this)(),
                // DocumentService.getAllMine.bind(this)(),
                // DatasetService.getAllMine.bind(this)()
            ])
                .then(([strategies, components, documents, datasets]) => {
                    // this.strategies = strategies;
                    // this.components = components;
                    // this.documents = documents;
                    // this.datasets = datasets;
                })
                .catch(error => this.$handleError(this, error))
                .finally(() => this.$root.isLoading = false);
		},

		// getItems(category) {
	    //     return this[category].data;
		// },
	},

	computed: {

	    // hasItems() {
	    //     return this.strategies.data.length > 0
        //         || this.components.data.length > 0
        //         || this.documents.data.length > 0
        //         || this.datasets.data.length > 0;
        // },
	},

	data() {
		return {
            fab: false,
			selectedStrategy: [],
			objectives: [
				{ title: 'Daily Objectives', percentage: Math.ceil(Math.random() * 100), value: Math.ceil(Math.random() * 10000), color: 'primary', },
				{ title: 'Daily Objectives', percentage: Math.ceil(Math.random() * 100), value: Math.ceil(Math.random() * 10000), color: 'secondary', },
				{ title: 'Daily Objectives', percentage: Math.ceil(Math.random() * 100), value: Math.ceil(Math.random() * 10000), color: 'third', },
				// { title: 'Daily Objectives', percentage: 66, value: 12039, color: 'white', },
			],
			feed: [
				{ created_by: this.$root.user, comment: 'Lorem ipsum dolor amet', },
				{ created_by: this.$root.user, comment: 'Lorem ipsum dolor amet', },
				{ created_by: this.$root.user, comment: 'Lorem ipsum dolor amet', },
				{ created_by: this.$root.user, comment: 'Lorem ipsum dolor amet', },
				{ created_by: this.$root.user, comment: 'Lorem ipsum dolor amet', },
				{ created_by: this.$root.user, comment: 'Lorem ipsum dolor amet', },
				{ created_by: this.$root.user, comment: 'Lorem ipsum dolor amet', },
				{ created_by: this.$root.user, comment: 'Lorem ipsum dolor amet', },
				{ created_by: this.$root.user, comment: 'Lorem ipsum dolor amet', },
				{ created_by: this.$root.user, comment: 'Lorem ipsum dolor amet', },
			],
			// categories: ['strategies', 'components', 'documents', 'datasets'],
			// types: ['strategy', 'component', 'document', 'dataset'],
			strategies: new Response(),
			strategyData: {
				labels: [Math.floor(Math.random() * (50 - 5 + 1)) + 5, Math.floor(Math.random() * (50 - 5 + 1)) + 5],
				datasets: [
					{
						label: 'Data One',
						backgroundColor: this.$vuetify.theme.themes.light.primary,
						data: [Math.floor(Math.random() * (50 - 5 + 1)) + 5, Math.floor(Math.random() * (50 - 5 + 1)) + 5]
					}, {
						label: 'Data One',
						backgroundColor: this.$vuetify.theme.themes.light.secondary,
						data: [Math.floor(Math.random() * (50 - 5 + 1)) + 5, Math.floor(Math.random() * (50 - 5 + 1)) + 5]
					}, {
						label: 'Data One',
						backgroundColor: this.$vuetify.theme.themes.light.third,
						data: [Math.floor(Math.random() * (50 - 5 + 1)) + 5, Math.floor(Math.random() * (50 - 5 + 1)) + 5]
					}
				]
			},
			// components: new Response(),
			// documents: new Response(),
			// datasets: new Response(),
			chartOptions: {
				responsive: true,
				maintainAspectRatio: false,
			}
		}
	},
});
</script>

<style lang="scss" scoped>
	.add-padding {
		padding-bottom: 64px;
	}
</style>
