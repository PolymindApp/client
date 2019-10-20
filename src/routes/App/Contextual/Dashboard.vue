<template>
	<span>
		<v-row v-if="$vuetify.breakpoint.mdAndUp" class="align-center justify-end">
			<v-select v-model="selectedFilters" @change="emitFilters()" chips style="max-width: 300px" prepend-inner-icon="mdi-filter-variant" hide-details solo clearable :items="filters" :label="$t('dashboard.contextual.filters')" multiple>
				<template v-slot:selection="{ item, index }">
					<v-chip v-if="index === 0">
						<span>{{ item.text }}</span>
					</v-chip>
					<span v-if="index === 1" class="grey--text caption">({{$t('dashboard.contextual.andMore', {
						total: selectedFilters.length - 1
				})}})</span>
				</template>
			</v-select>

			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn v-on="on" class="ml-4" color="primary" to="/deck/new/edit">
						<v-icon>mdi-plus</v-icon>
						<span>{{$t('component.deck.add')}}</span>
					</v-btn>
				</template>
				<span>{{$t('toolbar.tooltip.adddecks')}}</span>
			</v-tooltip>
		</v-row>

		<template v-if="$vuetify.breakpoint.smAndDown">
			<v-list-item to="/deck/new/edit">
				<v-icon left>mdi-plus</v-icon>
				<v-list-item-title>{{$t('component.deck.add')}}</v-list-item-title>
			</v-list-item>

			<v-divider class="my-4"></v-divider>

			<v-list-item-group v-model="selectedFilters" multiple active-class="" @change="emitMobileFilters()">
				<v-list-item v-for="(item, index) in filters">
				  <template v-slot:default="{ active }">
					<v-list-item-action>
					  <v-checkbox v-model="active"></v-checkbox>
					</v-list-item-action>

					<v-list-item-content>
					  <v-list-item-title>{{item.text}}</v-list-item-title>
					</v-list-item-content>
				  </template>
				</v-list-item>
			</v-list-item-group>
		</template>
	</span>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({

	methods: {
		emitFilters() {
			this.$root.$emit('DASHBOARD_FILTERS', this.selectedFilters);
		},
		emitMobileFilters() {
			const filters = this.selectedFilters.map(index => {
				return this.filters[index].value;
			});
			this.$root.$emit('DASHBOARD_FILTERS', filters);
		},
	},

	data() {
		return {
			filters: [
				{ text: this.$t('dashboard.contextual.favourite'), value: 'isFavourite' },
				{ text: this.$t('dashboard.contextual.public'), value: 'isPublic' },
				{ text: this.$t('dashboard.contextual.archived'), value: 'isArchived' },
			],
			selectedFilters: [],
		}
	}
});
</script>

<style lang="scss" scoped>

</style>
