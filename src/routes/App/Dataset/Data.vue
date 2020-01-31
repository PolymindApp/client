<template>
	<div class="d-flex fill-height flex-column" @click.stop="!$event.ctrlKey && !$event.shiftKey && resetSelection()">
		{{menu.rowIdx}}-{{menu.columnIdx}}-{{menu.cellIdx}}
		{{transactions}}

		<v-menu v-model="menu.visible" :position-x="menu.x" :position-y="menu.y" :close-on-content-click="false" absolute offset-y>
			<v-list dense>
				<template v-for="(item, index) in menu.items">
					<v-list-item v-if="item.text" :disabled="item.disabled()" :key="index" v-on="item.click ? { click: item.click } : {}">
						<v-list-item-icon class="mr-2">
							<v-icon v-text="item.icon" small></v-icon>
						</v-list-item-icon>
						<v-list-item-title>{{ item.text }}</v-list-item-title>
					</v-list-item>
					<v-divider v-else :key="index"></v-divider>
				</template>
			</v-list>
		</v-menu>
		<v-menu v-model="columnMenu.visible" :position-x="columnMenu.x" :position-y="columnMenu.y" :close-on-content-click="false" absolute offset-y>
			<v-list dense>
				<div class="pa-2" v-if="columnMenu.columnIdx !== null">
					<v-text-field v-model="dataset.columns[columnMenu.columnIdx].name" label="Title" outlined dense hide-details />
				</div>
<!--				<v-divider></v-divider>-->
				<template v-for="(item, index) in columnMenu.items">
					<v-list-item v-if="item.text" :disabled="item.disabled()" :key="index" v-on="item.click ? { click: item.click } : {}" @mouseenter="" @mouseleave="">
						<v-list-item-icon class="mr-2">
							<v-icon v-text="item.icon" small></v-icon>
						</v-list-item-icon>
						<v-list-item-title>{{ item.text }}</v-list-item-title>
						<v-list-item-icon v-if="item.childs && item.childs.length > 0">
							<v-icon small>mdi-chevron-right</v-icon>
						</v-list-item-icon>
					</v-list-item>
					<v-divider v-else :key="index"></v-divider>
				</template>
<!--				<v-divider class="mb-2"></v-divider>-->
<!--				<div class="pa-2" v-if="columnMenu.columnIdx !== null">-->
<!--					TBD-->
<!--				</div>-->
			</v-list>
		</v-menu>

		<table class="table w-100">
			<thead>
			<tr>
				<th class="shrink text-no-wrap default"></th>
<!--				<th class="shrink text-no-wrap default">-->
<!--					<v-icon x-small left>mdi-key-variant</v-icon>-->
<!--					<span>ID</span>-->
<!--				</th>-->
				<th class="shrink text-no-wrap default">
					<v-icon x-small left>mdi-state-machine</v-icon>
					<span>Status</span>
				</th>
				<th @contextmenu.prevent="openMenu($event, 'column', null, headerIdx, header.id)" @click.stop="toggleColumn(headerIdx, $event)" :class="{ 'grow': true, highlighted: selectedColumns.indexOf(headerIdx) !== -1 }" v-for="(header, headerIdx) in dataset.columns">
					<span v-text="header.name"></span>
					<v-btn @click.stop="openColumnMenu($event, headerIdx)" class="float-right ml-2" icon x-small>
						<v-icon>mdi-chevron-down</v-icon>
					</v-btn>
				</th>
				<th class="shrink text-no-wrap default">
					<v-icon x-small left>mdi-account</v-icon>
					<span>Created By</span>
				</th>
				<th class="shrink text-no-wrap default">
					<v-icon x-small left>mdi-calendar-month</v-icon>
					<span @click.stop="sort($event, 'status')">Created On</span>
					<v-icon class="ml-2" small>mdi-sort-descending</v-icon>
				</th>
			</tr>
			</thead>
			<tbody>
			<tr :class="{ highlighted: selectedRows.indexOf(rowIdx) !== -1 }" v-for="(row, rowIdx) in dataset.rows">
				<th @contextmenu.prevent="openMenu($event, 'row', rowIdx, null, row.id)" @click.stop="toggleRow(rowIdx, $event)" class="default shrink text-center">
					{{ rowIdx + 1 }}
				</th>
<!--				<td @contextmenu.prevent="openMenu($event, 'row', rowIdx, null, null)" @click="toggleRow(rowIdx, $event)" class="shrink text-center">-->
<!--					{{ row.id }}-->
<!--				</td>-->
				<td class="shrink default">
					<DataType type="list" :items="statuses" v-model="row.status" @input="$emit('update:dataset', dataset)" />
				</td>
				<td @click.stop="toggleCell(rowIdx, columnIdx, $event)" @contextmenu.prevent="openMenu($event, 'cell', rowIdx, columnIdx, row.cells[columnIdx].id)" :class="{ 'grow': true, highlighted: selectedCells.indexOf(rowIdx + '_' + columnIdx) !== -1 || selectedColumns.indexOf(columnIdx) !== -1 }" :style="{ width: (100 / dataset.columns.length) + '%' }" v-for="(column, columnIdx) in dataset.columns">
					<DataType :type="column.type" v-model="row.cells[columnIdx][column.type]" :options="true" :id="row.cells[columnIdx].id" collection="dataset_cell" @input="$emit('update:dataset', dataset)" />
				</td>
				<td class="default shrink text-no-wrap">
					<div class="d-flex align-center">
						<UserAvatar :user="row.created_by" :size="24" />
						<div class="text-truncate ml-1" v-text="$options.filters.userScreenName(row.created_by)"></div>
					</div>
				</td>
				<td class="default shrink text-no-wrap">
					<DataType type="date" v-model="row.created_on" @input="$emit('update:dataset', dataset)" />
				</td>
			</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import Vue from 'vue';
import DataType from "../../../components/DataType";
import UserAvatar from "../../../components/UserAvatar";
import DatasetColumn from "../../../models/DatasetColumn";
import DatasetRow from "../../../models/DatasetRow";
import DatasetCell from "../../../models/DatasetCell";
import Transaction from "../../../models/Transaction";

export default Vue.extend({

	props: ['dataset', 'formErrors', 'transactions'],

	components: { DataType, UserAvatar },

	mounted() {

	},

	destroyed() {

	},

	methods: {

		sort(event, name) {

		},

		openMenu (event, type, rowIdx, columnIdx, id) {
			event.preventDefault();

			Object.assign(this.menu, {
				x: event.clientX,
				y: event.clientY,
				type, rowIdx, columnIdx, id,
			});
			this.$nextTick(() => {
				this.menu.visible = true;
			});

			switch (type) {
				case 'row': this.toggleRow(rowIdx, event, true); break;
				case 'column': this.toggleColumn(columnIdx, event, true); break;
				case 'cell': this.toggleCell(rowIdx, columnIdx, event, true); break;
			}
		},

		openColumnMenu (event, columnIdx) {
			event.preventDefault();

			Object.assign(this.columnMenu, {
				x: event.clientX,
				y: event.clientY,
				columnIdx,
			});
			this.$nextTick(() => {
				this.columnMenu.visible = true;
				setTimeout(() => { // Hack: Keep menu open if reopening from other column
					this.columnMenu.visible = true;
				});
			});

			this.toggleColumn(columnIdx, event, true);
		},

		toggleCell(rowIdx, columnIdx, event, forceVal) {

			const idx = rowIdx + '_' + columnIdx;
			const pos = this.selectedCells.indexOf(idx);

			this.resetRowsSelection();
			this.resetColumnsSelection();

			if (forceVal === true && pos !== -1
			|| forceVal === false && pos === -1) {
				return;
			}

			if (event.shiftKey) { // Select all from original indexes

				const orderedRows = [this.menu.originalRowIdx, rowIdx].sort();
				const firstRow = orderedRows[0];
				const lastRow = orderedRows[1];

				const orderedColumns = [this.menu.originalColumnIdx, columnIdx].sort();
				const firstColumn = orderedColumns[0];
				const lastColumn = orderedColumns[1];

				this.selectedCells = [];
				for (let rowIdx = firstRow; rowIdx <= lastRow; rowIdx++) {
					for (let columnIdx = firstColumn; columnIdx <= lastColumn; columnIdx++) {
						this.selectedCells.push(rowIdx + '_' + columnIdx);
					}
				}
				return;
			} else if (!event.ctrlKey) {
				this.resetCellsSelection();

				// Keep track of original indexes if shift key is enabled
				Object.assign(this.menu, {
					originalColumnIdx: this.menu.columnIdx === null ? columnIdx : this.menu.columnIdx,
					originalRowIdx: this.menu.rowIdx === null ? rowIdx : this.menu.rowIdx,
				});
			}

			if (pos === -1) {
				this.selectedCells.push(idx);
			} else {
				this.selectedCells.splice(pos, 1);
			}
		},

		toggleColumn(idx, event, forceVal) {

			const pos = this.selectedColumns.indexOf(idx);

			this.resetRowsSelection();
			this.resetCellsSelection();

			if (forceVal === true && pos !== -1
			|| forceVal === false && pos === -1) {
				return;
			}

			if (event.shiftKey) { // Select all from original indexes
				const ordered = [this.menu.originalColumnIdx, idx].sort();
				const first = ordered[0];
				const last = ordered[1];
				this.selectedColumns = [];
				for (let i = first; i <= last; i++) {
					this.selectedColumns.push(i);
				}
				return;
			} else if (!event.ctrlKey) {

				this.resetColumnsSelection();

				// Keep track of original indexes if shift key is enabled
				Object.assign(this.menu, {
					originalColumnIdx: this.menu.columnIdx === null ? idx : this.menu.columnIdx,
				});
			}

			if (pos === -1) {
				this.selectedColumns.push(idx);
			} else {
				this.selectedColumns.splice(pos, 1);
			}
		},

		toggleRow(idx, event, forceVal) {

			const pos = this.selectedRows.indexOf(idx);

			this.resetColumnsSelection();
			this.resetCellsSelection();

			if (forceVal === true && pos !== -1
			|| forceVal === false && pos === -1) {
				return;
			}

			if (event.shiftKey) { // Select all from original indexes
				const ordered = [this.menu.originalRowIdx, idx].sort();
				const first = ordered[0];
				const last = ordered[1];
				this.selectedRows = [];
				for (let i = first; i <= last; i++) {
					this.selectedRows.push(i);
				}
				return;
			} else if (!event.ctrlKey) {
				this.resetRowsSelection();

				// Keep track of original indexes if shift key is enabled
				Object.assign(this.menu, {
					originalRowIdx: this.menu.rowIdx === null ? idx : this.menu.rowIdx,
				});
			}

			if (pos === -1) {
				this.selectedRows.push(idx);
			} else {
				this.selectedRows.splice(pos, 1);
			}
		},

		resetColumnsSelection(resetState = false) {

			this.selectedColumns = [];
			if (resetState) {
				Object.assign(this.menu, {
					// originalColumnIdx: null,
					columnIdx: null,
				});
			}
		},

		resetRowsSelection(resetState = false) {

			this.selectedRows = [];
			if (resetState) {
				Object.assign(this.menu, {
					// originalRowIdx: null,
					rowIdx: null,
				});
			}
		},

		resetCellsSelection(resetState = false) {

			this.selectedCells = [];
			if (resetState) {
				Object.assign(this.menu, {
					// originalCellIdx: null,
					cellIdx: null,
				});
			}
		},

		resetSelection() {
			this.resetColumnsSelection(true);
			this.resetRowsSelection(true);
			this.resetCellsSelection(true);
		},

		insertColumn(columnIdx, column = null) {
			let newColumn = column ? column : new DatasetColumn();

			this.dataset.columns.splice(columnIdx, 0, newColumn);

			this.transactions.push(new Transaction({
				action: 'insert',
				collection: 'dataset_column',
				data: newColumn,
			}));

			this.dataset.rows.forEach((row, rowIdx) => {
				this.insertCell(rowIdx, columnIdx, newColumn);
			});
		},

		removeColumn(columnIdx) {

			this.cleanTransactions(['insert', 'update'], 'dataset_column', this.dataset.columns[columnIdx].guid);

			this.dataset.columns.splice(index, 1);
			this.dataset.rows.forEach((row, rowIdx) => {
				this.removeCell(rowIdx, columnIdx);
			});

			if (this.dataset.columns.length === 0) {
				this.insertColumn(0);
			}
		},

		clearColumn(columnIdx) {
			this.dataset.rows.forEach((row, rowIdx) => {
				this.clearCell(rowIdx, columnIdx);
			});
			this.$forceUpdate(); // TODO: Should automatically digest
		},

		insertRow(rowIdx, row = null) {
			let newRow = row ? row : new DatasetRow({ created_by: this.$root.user });

			this.dataset.rows.splice(rowIdx, 0, newRow);

			this.transactions.push(new Transaction({
				action: 'insert',
				collection: 'dataset_row',
				data: newRow,
			}));

			this.dataset.columns.forEach((column, columnIdx) => {
				this.insertCell(rowIdx, columnIdx, new DatasetCell());
			});
		},

		removeRow(rowIdx) {

			this.cleanTransactions(['insert', 'update'], 'dataset_row', this.dataset.rows[rowIdx].guid);

			this.dataset.rows.splice(rowIdx, 1);

			if (this.dataset.rows.length === 0) {
				this.insertRow(0);
			}
		},

		insertCell(rowIdx, columnIdx, cell = null) {
			let newCell = cell ? cell : new DatasetCell({ created_by: this.$root.user });
			this.dataset.rows[rowIdx].splice(columnIdx, 0, newCell);

			this.transactions.push(new Transaction({
				action: 'insert',
				collection: 'dataset_cell',
				data: newCell,
			}));
		},

		removeCell(rowIdx, columnIdx) {
			this.dataset.rows[rowIdx].cells.splice(columnIdx, 1);

			if (this.dataset.rows[rowIdx].length === 0) {
				this.insertCell(rowIdx, columnIdx);
			}

			this.cleanTransactions(['insert', 'update'],'dataset_cell', this.dataset.rows[rowIdx].cells[columnIdx].guid);
		},

		clearCell(rowIdx, columnIdx) {
			this.dataset.rows[rowIdx].cells[columnIdx] = new DatasetCell();
		},

		cleanTransactions(type, collection, guid) {

			const types = typeof type === 'string' ? [type] : type;
			this.transactions = this.transactions.filter(transaction => {
				return types.indexOf(transaction.action) !== -1
						&& transaction.collection === collection
						&& transaction.data.guid !== guid;
			});
		}
	},

	computed: {

	},

	data() {
		return {
			statuses: [
				{ text: 'Draft', value: 'draft' },
				{ text: 'Published', value: 'published' },
				{ text: 'Deleted', value: 'deleted' },
			],
			selectedColumns: [],
			selectedRows: [],
			selectedCells: [],
			menu: {
				visible: false,
				x: 0, y: 0,
				items: [
					{ text: 'Insert row above', icon: 'mdi-table-row-plus-before', disabled: () => this.menu.type === 'column', click: (event) => this.insertRow(this.menu.rowIdx) },
					{ text: 'Insert row below', icon: 'mdi-table-row-plus-after', disabled: () => this.menu.type === 'column', click: (event) => this.insertRow(this.menu.rowIdx + 1) },
					{},
					{ text: 'Insert column left', icon: 'mdi-table-column-plus-before', disabled: () => this.menu.type === 'row', click: (event) => this.insertColumn(this.menu.columnIdx) },
					{ text: 'Insert column right', icon: 'mdi-table-column-plus-after', disabled: () => this.menu.type === 'row', click: (event) => this.insertColumn(this.menu.columnIdx + 1) },
					{},
					{ text: 'Remove row', icon: 'mdi-table-row-remove', disabled: () => this.menu.type === 'column', click: (event) => this.removeRow(this.menu.rowIdx) },
					{ text: 'Remove column', icon: 'mdi-table-column-remove', disabled: () => this.menu.type === 'row', click: (event) => this.removeColumn(this.menu.columnIdx) },
					{},
					{ text: 'Comment', icon: 'mdi-comment-plus-outline', disabled: () => false, click: (event) => this.$comments.open(this.menu.id, 'dataset_' + this.menu.type) },
				],
				type: null,
				id: null,
				rowIdx: null,
				columnIdx: null,
				originalId: null,
				originalRowIdx: null,
				originalColumnIdx: null,
			},
			columnMenu: {
				visible: false,
				columnIdx: null,
				originalColumnIdx: null,
				items: [
					{ text: 'Type', icon: 'mdi-widgets', disabled: () => this.columnMenu.type !== 'row', childs: [
						{ text: 'Text', icon: 'mdi-cursor-text', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
						{ text: 'Number', icon: 'mdi-numeric-1-box-outline', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
						{ text: 'Date', icon: 'mdi-calendar-month', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
						{ text: 'Boolean', icon: 'mdi-toggle-switch', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
						{ text: 'List', icon: 'mdi-format-list-bulleted', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
						{ text: 'Recording', icon: 'mdi-record-rec', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
						{ text: 'Audio', icon: 'mdi-file-music-outline', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
						{ text: 'File', icon: 'mdi-file-outline', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
						{ text: 'Image', icon: 'mdi-file-image-outline', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
					] },
					{},
					// { text: 'Insert column left', icon: 'mdi-table-column-plus-before', disabled: () => this.columnMenu.type === 'row', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
					// { text: 'Insert column right', icon: 'mdi-table-column-plus-after', disabled: () => this.columnMenu.type === 'row', click: (event) => this.insertColumn(this.columnMenu.columnIdx + 1) },
					// {},
					{ text: 'Clear column', icon: 'mdi-close', disabled: () => this.columnMenu.type === 'row', click: (event) => this.clearColumn(this.columnMenu.columnIdx) },
					{ text: 'Remove column', icon: 'mdi-table-column-remove', disabled: () => this.columnMenu.type === 'row', click: (event) => this.removeColumn(this.columnMenu.columnIdx) },
					// {},
					// { text: 'Alignment', icon: 'mdi-format-align-left', disabled: () => this.columnMenu.type === 'row', childs: [
					// 	{ text: 'Left', icon: 'mdi-format-align-left', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
					// 	{ text: 'Center', icon: 'mdi-format-align-center', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
					// 	{ text: 'Right', icon: 'mdi-format-align-right', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
					// 	{ text: 'Justify', icon: 'mdi-format-align-justify', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
					// 	{},
					// 	{ text: 'Top', icon: 'mdi-format-align-top', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
					// 	{ text: 'Middle', icon: 'mdi-format-align-middle', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
					// 	{ text: 'Bottom', icon: 'mdi-format-align-bottom', disabled: () => this.columnMenu.type === 'column', click: (event) => this.insertColumn(this.columnMenu.columnIdx) },
					// ] },
				],
			},
		}
	},
});
</script>

<style lang="scss" scoped>
	.scrollable {
		overflow: auto;
	}
	.table	{
		border-collapse: collapse;
		font-size: 0.8rem;
		user-select: none;

		.shrink {
			width: 1px;
		}

		tr:not(.highlighted) {
			th {
				&:not(.default):not(.highlighted):hover {
					background-color: #ddd;
				}

				&.default {
					color: rgba(0, 0, 0, 0.5);
					background-color: #ddd;
				}
			}
			td {
				&.default {
					/*color: rgba(0, 0, 0, 0.75);*/
					background-color: #eee;
				}
			}
		}

		th {
			padding: 0 0.25rem;
		}

		td, th {
			text-align: left;
			border: #ccc solid 1px;
			height: 2.25rem;
			min-width: 2rem;
			padding: 0.25rem;
		}

		tr:not(.highlighted) {
			td:not(.default):not(.highlighted):hover {
				background-color: #f6f6f6;
			}
		}

		th {
			background-color: #eee;
		}

		tr.highlighted th,
		tr > th.highlighted {
			background-color: rgba(142, 176, 231, 0.66);
		}
		tr.highlighted td,
		tr > td.highlighted {
			background-color: rgba(142, 176, 231, 0.33);
		}
	}
</style>
