<template>
	<v-input v-bind="$attrs" :class="{ 'focused primary--text': focused }">
		<fieldset style="width: 100%">
			<legend class="v-label">{{label}}</legend>
			<v-row no-gutters>
				<v-col class="shrink icon-selected pa-8 d-flex align-center">
					<v-scale-transition mode="out-in">
						<div key="has" v-if="value" class="text-center">
							<v-icon v-text="value" size="64" color="primary"></v-icon>
							<v-tooltip bottom>
								<template v-slot:activator="{ on }">
									<v-btn class="mt-2" icon @click="remove()" v-on="on">
										<v-icon>mdi-close</v-icon>
									</v-btn>
								</template>
								<span v-text="$t('component.iconListField.clear')"></span>
							</v-tooltip>
						</div>
						<div key="empty" class="text-center" v-else>
							<v-icon size="64">mdi-selection-ellipse mdi-dark mdi-inactive</v-icon>
<!--							<div class="overline mt-2" v-text="$t('component.iconListField.selectIcon')"></div>-->
						</div>
					</v-scale-transition>
				</v-col>
				<v-col class="grow">
					<v-card :height="height" flat style="background-color: transparent">
						<div class="icon-container">
							<div v-for="item in icons" class="icon pa-2">
								<v-btn :disabled="$attrs.disabled" v-bind:input-value="value === ('mdi-' + item)" :color="(value === 'mdi-' + item) ? 'primary' : 'grey'" icon @click="icon = item; $emit('input', 'mdi-' + icon)">
									<v-icon>mdi-{{ item }}</v-icon>
								</v-btn>
							</div>
						</div>
					</v-card>
				</v-col>
			</v-row>
		</fieldset>
	</v-input>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
	props: ['label', 'value', 'height'],

	methods: {

	    remove() {
			this.$emit('input', null);
		},

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

		.icon-selected .v-icon {

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
