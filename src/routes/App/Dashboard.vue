<template>
	<v-sheet class="w-100 py-2 px-4 grey lighten-4">

		<EmptyView v-if="!$root.isLoading && !hasItems" :title="$t('dashboard.filteredNoResults')" :desc="$t('dashboard.filteredNoResultsDesc')" />

		<v-row v-else-if="!$root.isLoading">
			<v-col cols="12" :md="index === 0 ? 12 : 4" v-for="(category, index) in categories">
				<h2 class="mb-4 title" v-text="$t('dashboard.' + category, { total: getItems(category).length })"></h2>

				<v-alert v-if="getItems(category).length === 0" type="warning" border="left" colored-border light elevation="2">
					{{$t('dashboard.' + category + 'Empty')}}
				</v-alert>
				<template v-else v-for="(item, index) in getItems(category)">
					<Deck :key="index" :model="item" :class="{ 'mt-4': index > 0 }" />
				</template>
			</v-col>
		</v-row>

		<v-speed-dial absolute right bottom v-model="fab" direction="left">
			<template v-slot:activator>
				<v-tooltip left>
					<template v-slot:activator="{ tooltip }">
						<v-btn v-on="tooltip" v-model="fab" color="primary" dark fab>
							<v-icon v-if="fab">mdi-close</v-icon>
							<v-icon v-else>mdi-plus</v-icon>
						</v-btn>
					</template>
					<span>{{$t('toolbar.tooltip.adddecks')}}</span>
				</v-tooltip>
			</template>
			<v-btn to="/dataset/new" dark small>
				<v-icon left>mdi-database</v-icon>
				<span v-text="$t('dashboard.new.dataset')"></span>
			</v-btn>
			<v-btn to="/document/new" dark small>
				<v-icon left>mdi-file-document-outline</v-icon>
				<span v-text="$t('dashboard.new.document')"></span>
			</v-btn>
			<v-btn to="/component/new" dark small>
				<v-icon left>mdi-cube-outline</v-icon>
				<span v-text="$t('dashboard.new.component')"></span>
			</v-btn>
			<v-btn to="/strategy/new" dark small>
				<v-icon left>mdi-arrow-decision</v-icon>
				<span v-text="$t('dashboard.new.strategy')"></span>
			</v-btn>
		</v-speed-dial>

	</v-sheet>
</template>

<script>
import Vue from 'vue';
import EmptyView from "../../components/EmptyView";
import Deck from "../../components/Deck";
import Response from "../../models/Response";
import StrategyService from "../../services/StrategyService";
import ComponentService from "../../services/ComponentService";
import DocumentService from "../../services/DocumentService";
import DatasetService from "../../services/DatasetService";

export default Vue.extend({
	components: { EmptyView, Deck },

	mounted() {

		this.load();
	},

	destroyed() {

	},

	methods: {

	    load() {

            this.$root.isLoading = true;
            Promise.all([
                StrategyService.getAllMine.bind(this)(),
                ComponentService.getAllMine.bind(this)(),
                DocumentService.getAllMine.bind(this)(),
                DatasetService.getAllMine.bind(this)()
            ])
                .then(([strategies, components, documents, datasets]) => {
                    this.strategies = strategies;
                    this.components = components;
                    this.documents = documents;
                    this.datasets = datasets;
                })
                .catch(error => this.$handleError(this, error))
                .finally(() => this.$root.isLoading = false);
		},

		getItems(category) {
	        return this[category].data;
		},
	},

	computed: {

	    hasItems() {
	        return this.strategies.data.length > 0
                || this.components.data.length > 0
                || this.documents.data.length > 0
                || this.datasets.data.length > 0;
        },
	},

	data() {
		return {
            fab: false,
			categories: ['strategies', 'components', 'documents', 'datasets'],
			strategies: new Response(),
			components: new Response(),
			documents: new Response(),
			datasets: new Response(),
		}
	},
});
</script>

<style lang="scss" scoped>
	.add-padding {
		padding-bottom: 64px;
	}
</style>
