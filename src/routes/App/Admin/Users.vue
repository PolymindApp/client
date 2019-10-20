<template>
	<v-container>
		<v-layout column fill-height>
			<v-data-table :headers="headers" :items="desserts" sort-by="calories" class="elevation-1 flex-column">
				<template v-slot:item.action="{ item }">
					<v-icon small class="mr-2" @click="editItem(item)">
						mdi-pencil
					</v-icon>
					<v-icon small @click="deleteItem(item)">
						mdi-delete
					</v-icon>
				</template>
				<template v-slot:no-data>
					<v-btn color="primary" @click="initialize">Reset</v-btn>
				</template>
			</v-data-table>
		</v-layout>
	</v-container>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
	data: function() {
		return {
			dialog: false,
			headers: [
				{
					text: 'Dessert (100g serving)',
					align: 'left',
					sortable: false,
					value: 'name',
				},
				{ text: 'Calories', value: 'calories' },
				{ text: 'Fat (g)', value: 'fat' },
				{ text: 'Carbs (g)', value: 'carbs' },
				{ text: 'Protein (g)', value: 'protein' },
				{ text: 'Actions', value: 'action', sortable: false },
			],
			desserts: [],
			editedIndex: -1,
			editedItem: {
				name: '',
				calories: 0,
				fat: 0,
				carbs: 0,
				protein: 0,
			},
			defaultItem: {
				name: '',
				calories: 0,
				fat: 0,
				carbs: 0,
				protein: 0,
			},
		}
	},

	computed: {
		formTitle () {
			return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
		},
	},

	watch: {
		dialog (val) {
			val || this.close()
		},
	},

	created () {
		this.initialize()
	},

	methods: {
		initialize () {
			this.desserts = [
				{
					name: 'Frozen Yogurt',
					calories: 159,
					fat: 6.0,
					carbs: 24,
					protein: 4.0,
				},
				{
					name: 'Ice cream sandwich',
					calories: 237,
					fat: 9.0,
					carbs: 37,
					protein: 4.3,
				},
				{
					name: 'Eclair',
					calories: 262,
					fat: 16.0,
					carbs: 23,
					protein: 6.0,
				}
			]
		},

		editItem (item) {
			this.editedIndex = this.desserts.indexOf(item)
			this.editedItem = Object.assign({}, item)
			this.dialog = true
		},

		deleteItem (item) {
			const index = this.desserts.indexOf(item)
			confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
		},

		close () {
			this.dialog = false
			setTimeout(() => {
				this.editedItem = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
			}, 300)
		},

		save () {
			if (this.editedIndex > -1) {
				this.desserts[this.editedIndex] = Object.assign({}, this.desserts[this.editedIndex], this.editedItem);
			} else {
				this.desserts.push(this.editedItem)
			}
			this.close()
		},
	},
});
</script>

<style>
	.v-data-table__wrapper {
		flex: 1;
	}
</style>
