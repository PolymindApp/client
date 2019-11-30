<template>
	<v-img ref="player" class="fill-height deck-player" v-bind:style="deck.setting && 'background-image: linear-gradient(to bottom, ' + deck.setting.colorFrom + ', ' + deck.setting.colorTo + ');'">
		<v-card tile :dark="deck.setting.dark" color="transparent" class="overlay-actions d-flex flex-column justify-space-around ma-0">
			<v-row class="align-center justify-space-between ma-0" style="flex: 0">
				<v-col class="text-left">
					<div>
						<slot name="top_left" :player="player" style="flex: 0">
							&nbsp;
						</slot>
					</div>
				</v-col>
				<v-col class="text-center">
					<div>
						<slot name="top_center" :player="player" style="flex: 1">
							&nbsp;
						</slot>
					</div>
				</v-col>
				<v-col class="text-right">
					<div>
						<slot name="top_right" :player="player" style="flex: 0">
							&nbsp;
						</slot>
					</div>
				</v-col>
			</v-row>
			<v-row class="align-center justify-space-between ma-0" style="flex: 1">
				<v-col cols="2" class="text-left d-flex flex-column justify-center" style="flex: 0">
					<div>
						<slot name="middle_left" :player="player">
							<v-btn text style="padding: 8rem 1rem; height: auto" @click="previous()" :disabled="!canNavigate" v-if="deck.cards.length > 0">
								<v-icon style="font-size: 3rem">mdi-chevron-left</v-icon>
							</v-btn>
						</slot>
					</div>
				</v-col>
				<v-col cols="8" class="text-center d-flex flex-column justify-center" style="flex: 1">
					<div>
						<slot name="middle_center" :player="player">
							<v-btn text style="padding: 3rem; height: auto" @click="toggle()" :disabled="!canPlay" v-if="!player.isPlaying">
								<v-icon style="font-size: 3rem">mdi-play</v-icon>
							</v-btn>
							<template v-for="(card, index) in deck.cards" v-if="player.isPlaying">
								<transition name="appear" :key="index">
									<div v-if="player.showFront === index && player.position === index" class="front">{{ card.front }}</div>
								</transition>
								<transition name="appear" :key="index">
									<div v-if="player.showBack === index && player.position === index" class="back">{{ card.back }}</div>
								</transition>
							</template>
						</slot>
					</div>
				</v-col>
				<v-col cols="2" class="text-right d-flex flex-column justify-center" style="flex: 0">
					<div>
						<slot name="middle_right" :player="player">
							<v-btn text style="padding: 8rem 1rem; height: auto" @click="next()"
								   :disabled="!canNavigate" v-if="deck.cards.length > 0">
								<v-icon style="font-size: 3rem">mdi-chevron-right</v-icon>
							</v-btn>
						</slot>
					</div>
				</v-col>
			</v-row>
			<v-row class="align-center justify-space-between ma-0" style="flex: 0">
				<v-col class="text-left" style="flex: 0">
					<div>
						<slot name="bottom_left" :player="player">
							&nbsp;
						</slot>
					</div>
				</v-col>
				<v-col class="text-center" style="flex: 1">
					<div>
						<slot name="bottom_center" :player="player">
						<span v-if="deck.cards.length > 0">
							{{ $t('deck.view.position', {
								current: player.position + 1,
								total: deck.cards.length
							}) }}
						</span>
						</slot>
					</div>
				</v-col>
				<v-col class="text-right" style="flex: 0">
					<div>
						<slot name="bottom_right" :player="player">
							&nbsp;
						</slot>
					</div>
				</v-col>
			</v-row>
		</v-card>
	</v-img>
</template>

<script>
import Vue from 'vue';
// import Shortcut from '../utils/Shortcut';

export default Vue.extend({

	props: {
	    deck: {
	        type: Object,
			default: {
			    name: '',
			    cards: [],
			}
		}
	},

	methods: {

	    init() {
			this.player.showFront = -1;
			this.player.showBack = -1;
			this.player.position = 0;
			this.player.isPlaying = false;

			// const shortcut = new Shortcut();
			// shortcut.attach(document.body);

			// this.$root.user.setting.shortcuts.forEach(userShortcut => {
			// 	shortcut.add(userShortcut.action, userShortcut.action.keys, () => {
			// 		switch (userShortcut.action) {
			// 			case 'previous': this.previous(); break;
			// 			case 'next': this.next(); break;
			// 		}
			// 	});
			// });
		},

		toggle() {
	        this.player.isPlaying = !this.player.isPlaying;
	        if (this.player.isPlaying) {
				this.setPosition(this.player.position);
				this.$emit('play', this.player);
			} else {
				this.$emit('stop', this.player);
			}
		},

	    previous() {

	        if (!this.canNavigate) {
	            return;
			}

	        let pos = this.player.position;
	        pos--;
	        if (pos < 0) {
	            pos = this.deck.cards.length - 1;
			}
			this.setPosition(pos);
		},

	    next() {

			if (!this.canNavigate) {
				return;
			}

	        let pos = this.player.position + 1;
			if (pos > this.deck.cards.length - 1) {
				pos = 0;
			}
	        this.setPosition(pos);
		},

		setPosition(index) {

	        if (!this.canPlay) {
				return;
			}

			this.player.position = index;

			setTimeout(() => {
				this.player.showFront = index;
			}, 500);

			this.$emit('change', this.player);
		},
	},

	computed: {
	    canNavigate() {
	        return !this.$root.isLoading && this.deck.cards.length > 1 && this.player.isPlaying;
		},
	    canPlay() {
	        return !this.$root.isLoading && this.deck.cards.length > 0;
		},
	    canToggle() {
	        return !this.$root.isLoading && this.deck.cards.length > 0;
		}
	},

	data() {
	    return {
			player: {
				isPlaying: false,
				oldPosition: 0,
			    position: 0,
				showFront: -1,
				showBack: -1,
			}
		}
	},

	watch: {
	    'deck.id': function() {
	        this.init();
		},
	}
});
</script>

<style lang="scss" scoped>

	.appear-enter-active, .appear-leave-active {
		transform: scale(1) translate(-50%, -50%);
		transition: transform .333s ease,
					opacity 0.333s ease;
	}
	.appear-enter, .appear-leave-to {
		transform: scale(0.333);
		opacity: 0;
	}

	html {
		overflow-y: hidden;
	}
	.front, .back {
		font-size: 6rem;
		position: absolute;
		transform: scale(1) translate(-50%, -50%);
		top: 50%;
		left: 50%;
	}
	.overlay-actions {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		& > * > * > * {
			pointer-events: auto;
		}
	}
</style>
