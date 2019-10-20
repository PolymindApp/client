<template>
	<div>

		FONT-SIZE... DARK/LIGHT

		<v-tooltip bottom>
			<template v-slot:activator="{ on }">
				<v-btn text v-on="on" @click="toggleFullScreen()">
					<v-icon v-if="!isFullScreen">mdi-fullscreen</v-icon>
					<v-icon v-else>mdi-fullscreen-exit</v-icon>
				</v-btn>
			</template>
			<span>
				<span v-if="!isFullScreen">{{$t('component.deck.enterFullScreen')}}</span>
				<span v-else>{{$t('component.deck.exitFullScreen')}}</span>
			</span>
		</v-tooltip>
		<v-btn v-if="!isFullScreen" class="ml-1" text :to="'/deck/' + $route.params.id + '/edit/data'">
			<v-icon left>mdi-pencil</v-icon>
			{{$t('component.deck.edit')}}
		</v-btn>
	</div>
</template>

<script>
import Vue from 'vue';
import Device from '../../../../utils/Device';

export default Vue.extend({

	methods: {
		toggleFullScreen() {
			Device.toggleFullScreen();
			this.isFullScreen = !this.isFullScreen;
			setTimeout(() => {
				this.isFullScreen = Device.isFullScreen();
			}, 500);
			this.$root.$emit('FULLSCREEN', this.isFullScreen);
		}
	},

	data() {
	    return {
			isFullScreen: Device.isFullScreen(),
		}
	}
})
</script>

<style lang="scss" scoped>

</style>
