<template>
	<v-sheet class="w-100" color="grey lighten-4" dark tile>

		<v-sheet color="white" class="py-2 px-4" tile>
			<v-row>
				<v-col cols="12" :md="12 / objectives.length" v-for="(objective, objectiveIdx) in objectives" :key="objectiveIdx">
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
				<v-col cols="12" md="6">

					<!-- BARS -->
					<v-card light color="white">
						<div class="d-flex align-center pa-4">
							<div class="shrink">
								<v-btn :disabled="strategies.data.length < 2" icon>
									<v-icon>mdi-chevron-left</v-icon>
								</v-btn>
							</div>
							<div class="flex-md-grow-1">
								<v-select class="pa-0 ma-0 mx-4" label="Strategie" item-text="name" :items="strategies.data" v-model="selectedStrategy" solo flat dense hide-details></v-select>
							</div>
							<div class="shrink">
								<v-btn :disabled="strategies.data.length < 2" icon>
									<v-icon>mdi-chevron-right</v-icon>
								</v-btn>
							</div>
						</div>

						<div class="pa-4 pt-0">
							<bar-chart style="height: 350px" :chart-data="strategyData" :options="chartOptions"></bar-chart>
						</div>
					</v-card>

					<!-- RADAR -->
<!--					<v-card light>-->
<!--						<v-list color="white">-->
<!--							<v-list-item>-->
<!--								<v-list-item-icon class="mr-4">-->
<!--									<v-icon>mdi-newspaper-variant-multiple-outline</v-icon>-->
<!--								</v-list-item-icon>-->
<!--								<v-list-item-content>-->
<!--									<v-list-item-title class="headline primary&#45;&#45;text" v-text="$t('dashboard.objectives.title')"></v-list-item-title>-->
<!--								</v-list-item-content>-->
<!--							</v-list-item>-->
<!--						</v-list>-->
<!--						<v-divider></v-divider>-->
<!--						<div class="pa-4">-->
<!--							<Radar class="my-4" height="200" :labels="radar.labels" :datasets="radar.datasets" :colors="radar.colors" />-->
<!--							<Radar class="mt-12" height="200" :labels="radar2.labels" :datasets="radar2.datasets" :colors="radar2.colors" />-->
<!--						</div>-->
<!--					</v-card>-->
				</v-col>
				<v-col cols="12" md="6">

					<!-- NEWS -->
					<v-card light color="grey lighten-4">
						<v-list color="white">
							<v-list-item>
								<v-list-item-icon class="mr-4">
									<v-icon>mdi-newspaper-variant-multiple-outline</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title class="headline primary--text" v-text="$t('dashboard.news.title')"></v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list>
						<v-divider></v-divider>
						<v-list color="transparent" max-height="400" class="scrollable" tile>

							<!-- EMPTY -->
							<v-slide-y-reverse-transition>
								<EmptyView key="empty" v-if="!newsIsLoading && news.data.length === 0" desc="Aucune actualité" />
							</v-slide-y-reverse-transition>

							<!-- HAS CONTENT -->
							<v-slide-y-reverse-transition group>
								<v-card class="mx-2" outlined v-for="(newsItem, newsIdx) in news.data" :key="newsIdx">
									<v-list-item three-line>
										<v-list-item-content>
											<div class="overline mb-4" v-text="$t('dashboard.news.types.' + newsItem.type)"></div>
											<v-list-item-title class="headline mb-1">
												<span v-text="newsItem.content[0].title"></span>
											</v-list-item-title>
											<v-list-item-subtitle>
												<span v-text="newsItem.content[0].abstract"></span>
											</v-list-item-subtitle>
										</v-list-item-content>

										<v-list-item-avatar v-if="newsItem.thumbnail" tile size="80">
											<v-img height="80" width="80" :src="$thumbnails(newsItem.thumbnail.private_hash, 200, 200)"></v-img>
										</v-list-item-avatar>
									</v-list-item>
									<v-card-actions>
										<v-btn :to="'/news/' + newsItem.content[0].language + '/' + newsItem.content[0].slug" text>
											<span v-text="$t('dashboard.news.seeMore')"></span>
											<v-icon right>mdi-plus</v-icon>
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-slide-y-reverse-transition>
						</v-list>
					</v-card>
				</v-col>
			</v-row>
		</v-sheet>

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
<!--			<v-btn to="/document/new" dark small>-->
<!--				<v-icon>mdi-file-document-outline</v-icon>-->
<!--&lt;!&ndash;				<v-icon left>mdi-file-document-outline</v-icon>&ndash;&gt;-->
<!--&lt;!&ndash;				<span v-text="$t('dashboard.new.document')"></span>&ndash;&gt;-->
<!--			</v-btn>-->
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
import BarChart from "../../components/Chart/Bar";
import { Response, NewsService } from "@polymind/sdk-js";
import Radar from "../../components/Chart/Radar";
import UserAvatar from "../../components/UserAvatar";

export default Vue.extend({

	components: { EmptyView, UserAvatar, BarChart, Radar },

	mounted() {

		this.load();
	},

	destroyed() {

	},

	methods: {

	    load() {

            this.newsIsLoading = true;
            Promise.all([
                NewsService.getAll(this.$i18n.locale),
                // StrategyService.getAll(this.$root.user.id),
                // ComponentService.getAll(this.$root.user.id),
                // DocumentService.getAll(this.$root.user.id),
                // DatasetService.getAll(this.$root.user.id)
            ])
                .then(([news, strategies, components, documents, datasets]) => {
                	this.news = news;
                    // this.strategies = strategies;
                    // this.components = components;
                    // this.documents = documents;
                    // this.datasets = datasets;
                })
                .catch(error => this.$handleError(this, error))
                .finally(() => this.newsIsLoading = false);
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
				{ title: 'Facile', percentage: Math.ceil(Math.random() * 100), value: Math.ceil(Math.random() * 10000), color: 'primary', },
				{ title: 'Incertain', percentage: Math.ceil(Math.random() * 100), value: Math.ceil(Math.random() * 1000), color: 'third', },
				{ title: 'Difficile', percentage: Math.ceil(Math.random() * 100), value: Math.ceil(Math.random() * 1000), color: 'secondary', },
				// { title: 'Daily Objectives', percentage: 66, value: 12039, color: 'white', },
			],
			news: new Response(),
			newsIsLoading: false,
			// categories: ['strategies', 'components', 'documents', 'datasets'],
			// types: ['strategy', 'component', 'document', 'dataset'],
			strategyData: {
				labels: [Math.floor(Math.random() * (50 - 5 + 1)) + 5, Math.floor(Math.random() * (50 - 5 + 1)) + 5],
				datasets: [
					{
						label: 'Facile',
						backgroundColor: this.$vuetify.theme.themes.light.primary,
						data: [Math.floor(Math.random() * (50 - 5 + 1)) + 5, Math.floor(Math.random() * (50 - 5 + 1)) + 5]
					}, {
						label: 'Incertain',
						backgroundColor: this.$vuetify.theme.themes.light.third,
						data: [Math.floor(Math.random() * (50 - 5 + 1)) + 5, Math.floor(Math.random() * (50 - 5 + 1)) + 5]
					}, {
						label: 'Difficile',
						backgroundColor: this.$vuetify.theme.themes.light.secondary,
						data: [Math.floor(Math.random() * (50 - 5 + 1)) + 5, Math.floor(Math.random() * (50 - 5 + 1)) + 5]
					}
				]
			},
			strategies: new Response(),
			components: new Response(),
			documents: new Response(),
			datasets: new Response(),
			chartOptions: {
				responsive: true,
				maintainAspectRatio: false,
			},

			radar: {
				colors: [
					this.$vuetify.theme.themes.light.primary,
					this.$vuetify.theme.themes.light.third,
					this.$vuetify.theme.themes.light.third,
				],
				labels: [
					'Russe',
					'Français',
					'Anglais',
					'Espagnol',
					'Hindi',
				],
				datasets: [
					{ data: [13, 10, 9, 8, 8] },
					{ data: [12, 19, 16, 14, 17] },
				]
			},
			radar2: {
				colors: [
					this.$vuetify.theme.themes.light.secondary,
					this.$vuetify.theme.themes.light.third,
					this.$vuetify.theme.themes.light.third,
				],
				labels: [
					'Prononciation',
					'Conjugaison',
					'Grammaire',
					'Autre',
					'Vocabulaire',
				],
				datasets: [
					{ data: [14, 2, 11, 6, 14] },
					{ data: [8, 7, 12, 15, 19] },
				]
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
