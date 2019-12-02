<template>
	<v-sheet class="w-100">

		<EmptyView v-if="!$root.isLoading" :title="$t('dashboard.filteredNoResults')" :desc="$t('dashboard.filteredNoResultsDesc')" />

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

export default Vue.extend({
	components: { EmptyView },

	mounted() {

		this.load();
	},

	destroyed() {

	},

	methods: {

	    load() {

		},
	},

	data() {
		return {
            fab: false,
		}
	},
});
</script>

<style lang="scss" scoped>
	.add-padding {
		padding-bottom: 64px;
	}
</style>
