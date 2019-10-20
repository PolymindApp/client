<template>
	<v-sheet style="width: 100%" :class="{ 'add-padding': $vuetify.breakpoint.smAndDown }">
		<v-card v-if="decks.length > 0" flat class="px-4 py-2" style="width: 100%">
			<draggable :disabled="$vuetify.breakpoint.smAndDown" class="row draggable-list" :list="decks" v-bind="dragOptions" @start="startDragging()" @end="endDragging()">
				<v-col cols="12" sm="6" md="4" lg="3" v-for="(deck, index) in decks" :key="index + '-item'">
					<Deck :model="deck" />
				</v-col>
			</draggable>
		</v-card>
		<v-card v-if="decks.length === 0 && !$root.isLoading" flat color="transparent" class="align-center text-center justify-center d-flex flex-column fill-height pa-4">
			<div>
<!--				<img src="../../assets/cats/cat-book-dark.png" height="96" />-->
			</div>
			<h1 class="display-1 mt-4">
				{{$t('dashboard.filteredNoResults')}}
			</h1>
			<p class="grey--text">
				{{$t('dashboard.filteredNoResultsDesc')}}
			</p>
		</v-card>

		<v-tooltip left>
			<template v-slot:activator="{ on }">
				<v-btn v-on="on" fixed color="primary" fab :to="'/deck/new/edit'" bottom right>
					<v-icon>mdi-plus</v-icon>
				</v-btn>
			</template>
			<span>{{$t('toolbar.tooltip.adddecks')}}</span>
		</v-tooltip>
	</v-sheet>
</template>

<script>
import Vue from 'vue';
import Deck from '../../components/Deck.vue';
import DeckService from "../../services/Deck";
import draggable from "vuedraggable";
import DashboardContextual from "./Contextual/Dashboard";

export default Vue.extend({
	components: { Deck, draggable },

	mounted() {
		this.load();

		this.$root.$on('DECK_UPDATE', this.deckUpdateEvent);
		this.$root.$on('DASHBOARD_FILTERS', this.dashboardFilterEvent);
		this.$root.toolbarContextual.component = DashboardContextual;
	},

	destroyed() {
		this.$root.$off('DECK_UPDATE', this.deckUpdateEvent);
		this.$root.$off('DASHBOARD_FILTERS', this.dashboardFilterEvent);
	},

	methods: {

	    filterDecks(decks) {

			if (this.filters.length === 0) {
				return decks.filter(deck => {
					return deck.isArchived !== true;
				});
			}

			let items = [];
			decks.forEach(deck => {
				let skip = false;
				this.filters.forEach(filter => {
					if (this.filters.indexOf('isArchived') === -1 && deck.isArchived) {
						skip = true;
					}
					if (!deck[filter]) {
						skip = true;
					}
				});
				if (!skip) {
					items.push(deck);
				}
			});
			return items;
		},

		dashboardFilterEvent(selectedFilters) {
			this.filters = selectedFilters;
			this.decks = this.filterDecks(this.decks);
		},

		deckUpdateEvent() {
			this.load(false);
		},

	    load(showOverlay = true) {
			// this.$root.isLoading = showOverlay;
			// DeckService.getAll.bind(this)().then(decks => {
			//     this.decks = decks;
			//     this.decks = this.filterDecks(this.decks);
			// }).finally(() => {
			//     this.$root.isLoading = false;
			// });
		},

	    startDragging() {
			this.isDragging = true;
		},

	    endDragging() {
			this.isDragging = false;
			this.saveOrder();
		},

		saveOrder() {
			this.$root.isLoading = true;
			DeckService.saveOrder.bind(this)(this.decks).then(decks => {
				// this.decks = decks;
			}).finally(() => {
				this.$root.isLoading = false;
			});
		}
	},

	data() {
		return {
		    decks: [],
			filters: [],
			isDragging: false,
			dragOptions: {
				animation: 200,
				group: "description",
				disabled: false,
				ghostClass: "ghost"
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
