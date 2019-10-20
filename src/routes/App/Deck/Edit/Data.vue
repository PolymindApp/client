<template>
	<div class="ma-n4 d-flex flex-column fill-height" style="height: calc(100% + 32px)">
		<v-card-title class="d-flex d-flex-column align-center justify-center mb-2" style="flex: 0">
			<v-menu offset-y>
				<template v-slot:activator="{ on }">
					<v-btn :disabled="selected.length === 0 || deck.isArchived" v-on="on" class="mr-4">
						{{ $t('deck.data.bulkActions') }}
						<v-icon right>mdi-chevron-down</v-icon>
					</v-btn>
				</template>
				<v-list>
					<v-list-item v-for="(action, index) in bulkActions" :key="index" @click="action.callback">
						<v-list-item-icon>
							<v-icon>{{ action.icon }}</v-icon>
						</v-list-item-icon>
						<v-list-item-title>{{ action.name }}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
			<v-text-field autofocus solo class="ma-0 pa-0" :disabled="deck.cards.length === 0 || deck.isArchived" v-model="search" prepend-inner-icon="mdi-database-search" :label="$t('deck.data.search')" single-line hide-details />
			<div>
				<VDataFooter :disable-pagination="deck.isArchived" :disable-items-per-page="deck.isArchived" :items="deck.cards" v-bind="footer" :options="footerOptions" :pagination="{
					pageStart: 0,
					itemsPerPage: 15,
					itemsLength: deck.cards.length
				}" />
			</div>
		</v-card-title>

		<v-data-table style="flex: 1" flat
					  ref="table"
					  fixed-header
					  :mobile-breakpoint="100"
					  hide-default-footer
					  :show-select="!deck.isArchived"
					  v-model="selected"
					  item-key="guid"
					  :loading="isLoading"
					  :loading-text="$t('deck.data.loading')"
					  :search="search"
					  :headers="headers"
					  :disabled="deck.isArchived"
					  :items="deck.cards"
					  :footer-props="footer"
					  :no-data-text="$t('deck.data.noDataText')"
					  :no-results-text="$t('deck.data.noResultText')">

			<template v-slot:item.action="{ item }">
				<v-btn v-if="!item.deleted" :disabled="deck.isArchived" @click="removeItems([item])" text>
					<v-icon>mdi-delete</v-icon>
				</v-btn>
				<v-btn v-else @click="restoreItems([item])">
					<v-icon>mdi-delete-restore</v-icon>
				</v-btn>
			</template>

			<template v-slot:item.front="{ item }">
				<v-text-field :disabled="deck.isArchived" v-if="!item.deleted" v-model="item.front"></v-text-field>
				<span class="deleted" v-else>{{ item.front }}</span>
			</template>

			<template v-slot:item.back="{ item }">
				<v-text-field :disabled="deck.isArchived" v-if="!item.deleted" v-model="item.back"></v-text-field>
				<span class="deleted" v-else>{{ item.back }}</span>
			</template>

			<template v-slot:footer="{ headers }">
				<v-sheet :dark="deck.setting.dark">
					<table>
						<tbody>
							<tr v-show="!isLoading" style="width: 100%" class="primary">
								<td style="width: 1px; min-width: 1px;">
									<v-icon>mdi-plus</v-icon>
								</td>
								<td v-if="index >= (deck.isArchived ? 0 : 1) && index < headers.length - 1" v-for="(header, index) in headers">
									<v-text-field :disabled="deck.isArchived" :placeholder="header.text" class="first-new-input" @keyup="handleKeyUp" v-model="newItem[header.value]" :key="index"></v-text-field>
								</td>
								<td style="width: 1px; min-width: 1px;">
									<v-btn dark @click="addNewItem()" ref="newItemBtn" :disabled="!newItem.front || !newItem.back || deck.isArchived">
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</td>
							</tr>
						</tbody>
					</table>
				</v-sheet>
			</template>
		</v-data-table>
	</div>
</template>

<script>
import Vue from 'vue';
import Hash from "../../../../utils/Hash";

export default Vue.extend({

	props: {
		deck: {
			type: Object,
			default: {
				cards: {
					type: Array,
					default: []
				}
			}
		}
	},

	methods: {

		restoreItems(items) {
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const index = this.deck.cards.indexOf(item);
				const selectedIndex = this.selected.indexOf(item);

				if (selectedIndex !== -1) {
					this.selected.splice(selectedIndex, 1);
					i--;
				}

				delete item.deleted;

				// Hack to force a DOM refresh
				if (index !== -1) {
					this.deck.cards.splice(index, 1, item);
				}
			}
		},

	    removeItems(items) {
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const index = this.deck.cards.indexOf(item);
				const selectedIndex = this.selected.indexOf(item);

				if (selectedIndex !== -1) {
					this.selected.splice(selectedIndex, 1);
					i--;
				}

				item.deleted = true;

				// Hack to force a DOM refresh
				if (index !== -1) {
                	this.deck.cards.splice(index, 1, item);
				}
			}
		},

		addItems(items) {

	        items.forEach(item => {
				this.deck.cards.push({
					...item,
					order: this.deck.cards.length,
					guid: Hash.guid(),
				});
			});
		},

		addNewItem() {
	        this.addItems([this.newItem]);
	        this.newItem.front = '';
	        this.newItem.back = '';

	        setTimeout(() => {
				const wrapper = this.$refs.table.$el.querySelector('.v-data-table__wrapper');
            	wrapper.scrollTop = 1e10;

				const firstInput = this.$refs.table.$el.querySelector('.first-new-input input');
				firstInput.focus();
			});
		},

		handleKeyUp(event) {
	        if (event.code === 'Enter' && !this.$refs.newItemBtn.disabled) {
				this.$refs.newItemBtn.click();
			}
		},
	},

	computed: {
		headers() {

			const frontSuffix = (this.deck.defaultLangFront ? ' (' + this.deck.defaultLangFront + ')' : '').toUpperCase();
			const backSuffix = (this.deck.defaultLangBack ? ' (' + this.deck.defaultLangBack + ')' : '').toUpperCase();

			return [
				// { text: this.$t('deck.data.order'), align: 'left', editable: false, value: 'order' },
				{ text: this.$t('deck.data.front') + frontSuffix, value: 'front' },
				{ text: this.$t('deck.data.back') + backSuffix, value: 'back' },
				{ text: this.$t('deck.data.action'), value: 'action', editable: false, sortable: false, width: '10px' },
			];
		},
	},

	data: function() {
		return {
			isLoading: false,
			search: '',
			selected: [],
			footer: {
				itemsPerPageAllText: this.$t('deck.data.itemsPerPageAllText'),
				itemsPerPageText: this.$t('deck.data.itemsPerPageText'),
			},
			footerOptions: {},
			footerPagination: {},
			newItem: {
				front: '',
				back: '',
			},
			bulkActions: [
				{ name: this.$t('deck.data.bulkAction.delete'), icon: 'mdi-delete', callback: () => {
					this.removeItems(this.selected);
				}},
				{ name: this.$t('deck.data.bulkAction.restore'), icon: 'mdi-delete-restore', callback: () => {
					this.restoreItems(this.selected);
				}},
			]
		}
	},
});
</script>

<style lang="scss" scoped>
	.deleted {
		opacity: 0.5;
		text-decoration: line-through;
		color: red;
	}
</style>
