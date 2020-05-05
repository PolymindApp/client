<template>
	<v-combobox
		ref="input"
		v-model="model"
		:loading="loading"
		:items="items"
		:search-input.sync="search"
		v-bind="$attrs"
		v-on="$listeners"
		clearable
	>
		<template v-slot:selection="props">
			<div>
				<v-icon v-if="props.item" :color="props.item" class="mr-2">{{ props.item }}</v-icon>
				<span>{{ props.item | iconName }}</span>
			</div>
		</template>
		<template v-slot:item="props">
			<v-icon v-if="props.item" :color="props.item" class="mr-4" x-large>{{ props.item }}</v-icon>
			<span>{{ props.item | iconName }}</span>
		</template>
	</v-combobox>
</template>

<script>
import Vue from 'vue';
import { ICONS } from '@polymind/sdk-js';

export default Vue.extend({
	props: ['value'],

	methods: {

		querySelections(query) {
			this.loading = true;
			setTimeout(() => {
				this.items = this.icons.filter(e => {
					return e.trim().toLowerCase().indexOf(query.trim().toLowerCase()) > -1
				}).map(item => 'mdi-' + item);
				this.loading = false;
			}, 500);
		},
	},

	computed: {

		model: {

			get() {
				return this.value;
			},

			set(value) {
				this.$emit('input', value);
			}
		}
	},

	data() {
		return {
			loading: false,
			items: [],
			search: null,
			icons: ICONS,
		}
	},

	watch: {

		search(value) {
			value && this.querySelections(value);
		}
	}
});
</script>
