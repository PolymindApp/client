<template>
	<v-card class="mx-auto" hover>
		<v-img :src="model.picture && cdnPrefix + model.picture.url" v-bind:style="'background-image: linear-gradient(to bottom, ' + model.setting.colorFrom + ', ' + model.setting.colorTo + ')'">
			<v-responsive :aspect-ratio="16/9">
				<v-icon :dark="model.setting.dark" class="bg-icon">
					{{model.icon || 'mdi-cards'}}
				</v-icon>

				<v-card color="transparent" :dark="model.setting.dark" class="fill-height d-flex flex-column justify-space-between" :to="'/deck/' + model.id">
					<v-card-title class="d-flex justify-space-between">
					</v-card-title>

					<v-card-title class="d-flex justify-space-between">
						<span>
							{{model.name}}
						</span>
						<span style="opacity: 0.75">
							{{model.totalCards}} cards
						</span>
					</v-card-title>
				</v-card>
			</v-responsive>
		</v-img>

		<v-card-actions>
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn v-on="on" :color="model.isFavourite ? 'error' : null" icon @click="toggleFavourite()" class="mr-4">
						<v-icon v-if="!model.isFavourite">mdi-heart-outline</v-icon>
						<v-icon v-if="model.isFavourite">mdi-heart</v-icon>
					</v-btn>
				</template>
				<span>{{$t('component.deck.favourite')}}</span>
			</v-tooltip>

			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn v-on="on" :color="model.isPublic ? 'accent' : null" icon @click="togglePublic()" class="mr-4">
						<v-icon v-if="!model.isPublic">mdi-lock</v-icon>
						<v-icon v-if="model.isPublic">mdi-lock-open</v-icon>
					</v-btn>
				</template>
				<span>{{$t('component.deck.public')}}</span>
			</v-tooltip>

			<v-spacer></v-spacer>

			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn v-on="on" text class="mr-1" :to="'/deck/' + model.id">
						<v-icon>mdi-play</v-icon>
					</v-btn>
				</template>
				<span>{{$t('component.deck.play')}}</span>
			</v-tooltip>

			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn v-on="on" text :to="'/deck/' + model.id + '/edit'">
						<v-icon>mdi-pencil</v-icon>
					</v-btn>
				</template>
				<span>{{$t('component.deck.edit')}}</span>
			</v-tooltip>
		</v-card-actions>
	</v-card>
</template>

<script>
import Vue from 'vue';
import DeckService from "../services/Deck";

export default Vue.extend({
	name: 'Deck',
	props: ['model'],

	methods: {
		toggleFavourite() {
			this.model.isFavourite = !this.model.isFavourite;
			this.applyData({
				id: this.model.id,
				isFavourite: this.model.isFavourite,
			});
		},

		togglePublic() {
			this.model.isPublic = !this.model.isPublic;
			this.applyData({
				id: this.model.id,
				isPublic: this.model.isPublic,
			});
		},

		applyData(data) {
		    DeckService.save.bind(this)(data).then(deck => {

			});
		}
	},

	data() {
		return {
			cdnPrefix: process.env.VUE_APP_API_URL,
			value: {}
		};
	},
});
</script>

<style lang="scss" scoped>
	.bg-icon {
		position: absolute;
		font-size: 8rem;
		opacity: 0.2;
		right: 1rem;
		top: 1rem;
	}
</style>
