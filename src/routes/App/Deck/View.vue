<template>
	<v-sheet tile style="width: 100%">

		<v-card v-if="deck.isArchived" flat class="d-flex flex-column align-center justify-center fill-height" style="width: 100%" dark>
			<div>
<!--				<img src="../../../assets/cats/cat-momo-light.png" height="96" />-->
			</div>
			<h1 class="display-1 mt-4 text-center" style="max-width: 30rem">
				{{$t('deck.edit.isArchivedWarning')}}
			</h1>
			<v-btn :to="'/deck/' + deck.id + '/edit'" class="mt-4">
				<v-icon left>mdi-pencil</v-icon>
				{{$t('component.deck.edit')}}
			</v-btn>
		</v-card>

<!--		<v-layout v-if="deck.isArchived" class="fill-height align-center justify-center flex-column">-->
<!--			<v-btn dark text xLarge>-->
<!--				<v-icon xLarge>mdi-play</v-icon>-->
<!--			</v-btn>-->
<!--			-->
<!--			GAME MODE: FILL THE LETTER (PENDU)-->
<!--		</v-layout>-->

		<DeckPlayer v-if="deck.isArchived !== true" :deck="deck" @change="readWord" @play="readWord">
			<template v-if="!$root.isLoading && deck.cards.length === 0" v-slot:middle_center="props">
<!--				<img v-if="deck.setting.dark" src="../../../assets/cats/cat-pencil-light.png" height="96" class="mb-4" />-->
<!--				<img v-if="!deck.setting.dark" src="../../../assets/cats/cat-pencil-dark.png" height="96" class="mb-4" />-->
				<h1>{{$t('component.deckPlayer.noCard')}}</h1>
				<v-btn class="mt-4" :dark="!deck.setting.dark" :to="'/deck/' + deck.id + '/edit/data'">
					<v-icon left>mdi-plus</v-icon>
					{{$t('component.deckPlayer.noCardClickHere')}}
				</v-btn>
			</template>
		</DeckPlayer>
	</v-sheet>
</template>

<script>
import Vue from 'vue';
import DeckService from "../../../services/Deck";
import DeckPlayer from "../../../components/DeckPlayer";
import SpeechSynthesis from "../../../utils/SpeechSynthesis";
import ViewContextualOptions from './Contextual/View';

export default Vue.extend({

	components: { DeckPlayer },

	mounted() {
	    this.init();
	},

	methods: {

	    init() {
			this.$root.breadcrumbs = [
				this.$t('title.deck'),
				this.$t('deck.view.title'),
			];

			// this.$root.toolbarOptions = [
			//     { icon: 'mdi-pencil', title: 'Edit', callback: () => { this.$router.push('/deck/' + this.$route.params.id + '/edit') }},
			// ];

			this.$root.toolbarContextual.component = ViewContextualOptions;
			this.load();
		},

	    load() {

	        this.$root.isLoading = true;
	        DeckService.get.bind(this)(this.$route.params.id).then(deck => {
				this.$root.isLoading = false;
	            this.deck = deck;
				this.$root.breadcrumbs = [
					this.$t('title.deck'),
					deck.name
				];
				document.title = deck.name + ' | ' + this.$t('title.deck');
			});
		},

		readWord(player) {

	        clearTimeout(this.readTimeout);

	        const card = this.deck.cards[player.position];
			const speech = new SpeechSynthesis();

			speech.init();
			this.readTimeout = setTimeout(() => {
            	speech.read(card.front, {
					lang: this.deck.defaultLangFront || 'en-US',
				});

				this.readTimeout = setTimeout(() => {
					player.showFront = -1;
					player.showBack = player.position;
            	    speech.read(card.back, {
						lang: this.deck.defaultLangBack || 'en-US',
					});
				}, 3000);
			}, 666);
		}
	},

	data: function() {
		return {
			readTimeout: null,
		    deck: {
		        name: '',
		        cards: [],
				setting: {},
			},
		}
	},

	watch: {
		'$route.params.id': function(newVal) {
			this.init();
		},
	}
});
</script>

<style lang="scss" scoped>

</style>
