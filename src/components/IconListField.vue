<template>
	<v-input v-bind="$attrs" :class="{ 'focused primary--text': focused }">
		<fieldset style="width: 100%">
			<legend class="v-label">{{label}}</legend>
			<v-card :height="height" flat style="background-color: transparent">
				<div class="icon-container">
					<div v-for="item in icons" class="icon pa-2">
						<v-btn :disabled="$attrs.disabled" v-bind:input-value="value === ('mdi-' + item)" :color="(value === 'mdi-' + item) ? 'primary' : 'secondary'" icon @click="icon = item; $emit('input', 'mdi-' + icon)">
							<v-icon>mdi-{{ item }}</v-icon>
						</v-btn>
					</div>
				</div>
			</v-card>
		</fieldset>
	</v-input>
</template>

<script>
import Vue from 'vue';
// import icons from '../assets/icons.json';

export default Vue.extend({
	props: ['label', 'value', 'height'],

	methods: {

		titleCase(str) {
			var splitStr = str.toLowerCase().split(' ');
			for (var i = 0; i < splitStr.length; i++) {
				splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
			}
			return splitStr.join(' ');
		},
	},

	data() {
		return {
			focused: false,
		    icons: ['airplane', 'album', 'ambulance', 'anchor', 'apple-safari', 'asterisk', 'atom', 'axe', 'baby-face', 'baguette', 'balloon', 'bank', 'beach', 'bell', 'biathlon', 'bible', 'bike', 'blender', 'bomb', 'book-open-variant', 'book-variant', 'bowl', 'bowling', 'bread-slice-outline', 'bridge', 'bus', 'cactus', 'car', 'car-convertible', 'car-pickup', 'card-text', 'cards-club', 'cards-diamond', 'cards-heart', 'cards-outline', 'cat', 'charity', 'chef-hat', 'city', 'clock', 'coffee', 'controller-classic-outline', 'delta', 'desk-lamp', 'diamond-stone', 'disc', 'dog-side', 'drama-masks', 'earth', 'elephant', 'emoticon-outline', 'fingerprint', 'flash-outline', 'flask', 'flower-tulip', 'food-apple', 'food-croissant', 'foot-print', 'football', 'fountain', 'gamepad-variant', 'ghost', 'glass-cocktail', 'glass-wine', 'guy-fawkes-mask', 'halloween', 'hand-peace-variant', 'heart', 'hexagram', 'home', 'horseshoe', 'knife', 'lifebuoy', 'music-note', 'one-up', 'palette-outline', 'panda', 'paw', 'penguin', 'piano', 'pig-variant', 'pirate', 'pistol', 'puzzle', 'rocket', 'sailing', 'school', 'shape', 'silverware-variant', 'skull-outline', 'sprout', 'star', 'subway-variant', 'sword', 'telescope', 'tennis-ball', 'tooth-outline', 'tshirt-crew-outline', 'volleyball', 'weather-windy-variant', 'white-balance-sunny', 'yin-yang'],
		    icon: this.value,
		}
	},

	watch: {
	    value: function(val) {
	        this.icon = val;
		},
	}
});
</script>

<style lang="scss" scoped>
	.v-input {

		padding-top: 4px;
		margin-top: 8px;

		.icon {
			display: inline-block;
		}

		fieldset {
			border: currentColor solid 1px;
			transition: border .333s ease;
			border-radius: 4px;
			color: rgba(0,0,0,.24);
			margin-top: -9.5px;

			legend {
				margin-left: 10px;
				transform: scale(0.75);
				color: rgba(0,0,0,.54);
				z-index: 1;
				position: relative;
			}

			.v-card {
				margin-top: -0.6rem;
				overflow-x: hidden;
				overflow-y: auto;
			}

			&:hover {
				color: rgba(0,0,0,.87);
			}
		}

		&:focus fieldset {
			border-color: currentColor;
			border-width: 2px;

			legend {
				color: inherit;
			}

			color: inherit;
		}
	}
</style>
