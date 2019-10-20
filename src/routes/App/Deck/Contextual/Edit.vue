<template>
	<div>
		<v-btn color="primary" :to="'/deck/' + $route.params.id">
			<v-icon left>mdi-play</v-icon>
			{{$t('component.deck.play')}}
		</v-btn>
	</div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({

	data() {
	    return {

		}
	}
})
</script>

<style lang="scss" scoped>

</style>
