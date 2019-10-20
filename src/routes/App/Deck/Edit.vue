<template>
	<v-card flat class="deck-edit panel-overflow d-flex flex-column" style="width: 100%">
		<v-dialog v-model="modal.deleteVisible" max-width="500px">
			<v-card color="error" class="white--text">
				<v-card-title class="headline">
					<v-icon slot="icon" color="white" size="36" left>mdi-alert</v-icon>
					{{$t('deck.removeModal.title')}}
				</v-card-title>

				<v-card-text class="my-5 white--text">
					{{$t('deck.removeModal.desc')}}
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn text @click="execRemove">
						{{$t('modal.delete')}}
					</v-btn>

					<v-btn @click="modal.deleteVisible = false">
						{{$t('modal.cancel')}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-tabs show-arrows v-model="tab" style="flex: 0" @change="setBreadcrumbs()">
			<v-tab :disabled="deck.isArchived" :to="'/deck/' + id + '/edit'" exact>{{$t('deck.details.title')}}</v-tab>
			<v-tab :disabled="id === 'new' || !deck.name || deck.isArchived" :to="'/deck/' + id + '/edit/data'">
				{{$t('deck.data.title')}}
				<span v-if="deck.cards && deck.cards.length > 0">&nbsp;({{deck.cards.length}})</span>
			</v-tab>
			<v-tab :disabled="deck.isArchived" :to="'/deck/' + id + '/edit/theme'">{{$t('deck.theme.title')}}</v-tab>
			<v-tab :disabled="true || deck.isArchived" :to="'/deck/' + id + '/stats'">{{$t('deck.stats.title')}}</v-tab>
		</v-tabs>

		<v-card flat class="pa-4" v-if="deck.isArchived" style="flex: 0; background-color: rgba(0, 0, 0, 0.025)">

			<v-alert prominent type="error" class="mb-0">
				<v-row align="center">
					<v-col class="grow">{{$t('deck.edit.isArchivedWarning')}}</v-col>
					<v-col class="shrink">
						<v-btn @click="archive()">{{$t('deck.edit.isArchivedReactivate')}}</v-btn>
					</v-col>
				</v-row>
			</v-alert>
		</v-card>

		<v-tabs-items v-model="tab" style="flex: 1; overflow: auto; background-color: rgba(0, 0, 0, 0.025)">
			<v-tab-item :value="'/deck/' + id + '/edit'" class="pa-4">
				<Details :deck="deck" />
			</v-tab-item>
			<v-tab-item :value="'/deck/' + id + '/edit/data'" class="pa-4 fill-height">
				<Data :deck="deck" />
			</v-tab-item>
			<v-tab-item :value="'/deck/' + id + '/edit/theme'" class="pa-4">
				<Theme :deck="deck" />
			</v-tab-item>
			<v-tab-item :value="'/deck/' + id + '/stats'" class="pa-4">
				<Stats :deck="deck" />
			</v-tab-item>
		</v-tabs-items>

		<v-card style="flex: 0" flat class="pa-4">
			<v-btn :disabled="!dataHasChanged || !deck.name || $root.isDeleted || deck.isArchived" @click="save()" color="primary" class="mr-1">
				{{$t('modal.save')}}
			</v-btn>
			<v-btn :disabled="!dataHasChanged || deck.isArchived" @click="reset()" text>
				{{$t('modal.cancel')}}
			</v-btn>

			<div class="float-right">
				<v-btn v-if="deck.id" @click="archive()" :disabled="deck.isArchived" color="secondary" text>
					<v-icon left>mdi-archive</v-icon>
					{{$t('modal.archive')}}
				</v-btn>

				<v-btn v-if="deck.id" @click="remove()" color="error" text>
					<v-icon left>mdi-delete</v-icon>
					{{$t('modal.delete')}}
				</v-btn>
			</div>
		</v-card>
	</v-card>
</template>

<script>
import Vue from 'vue';
import Details from './Edit/Details.vue';
import Data from './Edit/Data.vue';
import Theme from "./Edit/Theme";
import Stats from "./Edit/Stats";
import DeckService from "../../../services/Deck.js";
import Hash from "../../../utils/Hash.js";
import EditContextualOptions from './Contextual/Edit';

export default Vue.extend({

	components: { Data, Details, Theme, Stats },

	mounted() {
		this.init();
	},

	methods: {

	    init() {

			this.deck = JSON.parse(JSON.stringify(this.initDeck));
			this.updateOriginalData();

			if (this.id === 'new') {
				return;
			}

			this.$root.toolbarContextual.component = EditContextualOptions;
			this.load();
		},

		setBreadcrumbs() {

	        const suffix = (this.id === 'new' ? (' (' + this.$t('general.new') + ')') : '');
			const secondTitle = this.$t('deck.' + (this.$route.params.section ? this.$route.params.section : 'details') + '.title');

			this.$root.breadcrumbs = [
				this.$t('title.deck') + suffix,
				secondTitle,
			];
			document.title = secondTitle + ' | ' + this.$t('title.deck') + suffix;
		},

		updateOriginalData() {
			this.deck.cards.map(item => {
				item.guid = Hash.guid();
			});

			this.originalDeck = JSON.parse(JSON.stringify(this.deck));
		},

		remove() {
			this.modal.deleteVisible = true;
		},

		execRemove() {
			this.$root.isLoading = true;
			this.modal.deleteVisible = false;
			DeckService.delete.bind(this)(this.id).then(deck => {
				this.$root.isDeleted = true;
				this.$router.push('/');
			}).finally(() => {
				this.$root.isLoading = false;
			});
		},

		reset() {
			this.deck = JSON.parse(JSON.stringify(this.originalDeck));
		},

		load() {
			this.$root.isLoading = true;
			DeckService.get.bind(this)(this.id).then(deck => {
				this.deck = Object.assign({}, this.deck, deck);
				this.updateOriginalData();
			}).finally(() => {
				this.$root.isLoading = false;
			});
		},

		archive() {
			this.$root.isLoading = true;
			DeckService.updateSpecific.bind(this)(this.deck.id, {
				isArchived: !this.deck.isArchived,
			}).then(result => {
				this.$root.isSaved = true;
				this.deck = Object.assign({}, this.deck, result);
				this.updateOriginalData();
			}).finally(() => {
				this.$root.isLoading = false;
			});
		},

		save() {
			this.$root.isLoading = true;
			this.deck.cards.forEach(card => {
				delete card.guid;
			});
			DeckService.save.bind(this)(this.deck).then(result => {
				this.$root.isSaved = true;

				if (this.id === 'new') {
					return this.$router.push('/deck/' + result.id + '/edit');
				}

				this.deck = Object.assign({}, this.deck, result);
				this.updateOriginalData();
			}).finally(() => {
				this.$root.isLoading = false;
			});
		},
	},

	computed: {

		dataHasChanged() {
			return JSON.stringify(this.deck) !== JSON.stringify(this.originalDeck);
		},
	},

	data() {
		return {
			tab: 'general',
			id: this.$route.params.id,
			initDeck: {
				name: '',
				cards: [],
				presentation: '',
				setting: {
					dark: false,
					shadow: false,
					colorFrom: '#aa076b',
					colorTo: '#61045f',
				}
			},
			modal: {
				deleteVisible: false,
			},
			deck: {},
			originalDeck: {},
		}
	},

	watch: {
		'$route.params.id': function(newVal) {
			this.id = newVal;
			this.init();
		},

		$route() {
			this.$root.breadcrumbs = [];
		}
	}
});
</script>

<style lang="scss">
	.deck-edit .v-window__container {
		height: 100%;
	}
	.deck-edit .v-data-table {
		display: flex;
		flex-direction: column;
		overflow: auto;
	}
	.deck-edit .v-data-table > .v-data-table__wrapper {
		flex: 1;
	}
	.deck-edit .v-data-table > .v-data-footer {
		flex: 0;
	}
</style>


<style lang="scss" scoped>
	.panel-overflow {
		position: absolute;
		width: 100%;
		height: 100%;
	}
</style>
