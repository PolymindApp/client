<template>
	<div @keydown="handleKeyDown" tabindex="0" class="fill-height" @mouseup.stop="!$event.ctrlKey && !$event.shiftKey && resetSelection()">

		<v-menu v-model="menu.visible" :position-x="menu.x" :position-y="menu.y" absolute offset-y>
			<v-list dense>
				<div @click.stop="" class="pa-2" v-if="menu.group === 'column'">
					<v-text-field v-model="dataset.columns[firstSelected.columnIdx].name" :label="$t('dataset.data.columnMenu.title')" outlined dense hide-details />
					<v-switch v-model="dataset.columns[firstSelected.columnIdx].is_required" :label="$t('dataset.data.columnMenu.isRequired')" class="ml-2" inset hide-details />
				</div>
				<template v-for="(item, index) in menu.groups[menu.group].items">
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

		<table class="table w-100 white">
			<thead>
			<tr>
				<th class="shrink text-no-wrap default"></th>
				<th class="shrink text-no-wrap default">
					<v-icon x-small left>mdi-state-machine</v-icon>
					<span v-text="$t('dataset.data.status')"></span>
				</th>
				<th @contextmenu.prevent="openMenu($event, 'default', 'column', null, columnIdx)" @click.stop="toggleColumn(columnIdx, $event)" :class="{ 'grow': true, highlighted: selectedColumns.indexOf(columnIdx) !== -1 }" :style="{ width: (100 / dataset.columns.length) + '%' }" v-for="(column, columnIdx) in dataset.columns">

					<div v-if="selectedColumns.indexOf(columnIdx) !== -1" :class="{
						'highlight-selector top': true,
						'left': selected.column.first === columnIdx,
						'right': selected.column.last === columnIdx,
					}"></div>

					<span v-text="column.name"></span>
					<v-btn @click.stop="openMenu($event, 'column', 'column', null, columnIdx)" class="float-right ml-2" icon x-small>
						<v-icon>mdi-chevron-down</v-icon>
					</v-btn>
				</th>
				<th class="shrink text-no-wrap default">
					<v-icon x-small left>mdi-account</v-icon>
					<span v-text="$t('dataset.data.created_by')"></span>
				</th>
				<th class="shrink text-no-wrap default">
					<v-icon x-small left>mdi-calendar-month</v-icon>
					<span v-text="$t('dataset.data.createdOn')" @click.stop="sort($event, 'status')"></span>
					<v-icon class="ml-2" small>mdi-sort-descending</v-icon>
				</th>
			</tr>
			</thead>
			<tbody ref="tbody">
			<tr :class="{ highlighted: selectedRows.indexOf(rowIdx) !== -1 }" v-for="(row, rowIdx) in dataset.rows">
				<th @contextmenu.prevent="openMenu($event, 'default', 'row', rowIdx, null)" @click.stop="toggleRow(rowIdx, $event)" class="default shrink text-center">
					<div v-if="selectedRows.indexOf(rowIdx) !== -1" :class="{
						'highlight-selector left': true,
						'top': selected.row.first === rowIdx,
						'bottom': selected.row.last === rowIdx,
					}"></div>
					<span v-if="!isRowValid(rowIdx)">
						<v-icon color="warning" small>mdi-alert</v-icon>
					</span>
					<span v-else-if="row.id" v-text="rowIdx + 1"></span>
					<span v-else>
						<v-icon color="primary" small>mdi-plus-circle</v-icon>
					</span>
				</th>
				<td class="shrink default">
					<div v-if="selectedRows.indexOf(rowIdx) !== -1" :class="{
						'highlight-selector': true,
						'top': selected.row.first === rowIdx,
						'bottom': selected.row.last === rowIdx,
					}"></div>
					<DataType type="list" :items="statuses" v-model="row.status" @input="$emit('update:dataset', dataset)" />
				</td>
<!--				@click.stop="toggleCell(rowIdx, columnIdx, $event)"-->
				<td @dblclick.stop="editCell(rowIdx, columnIdx)" @mousedown.stop="handleMouseDown($event, 'cell', rowIdx, columnIdx)" @mouseup.stop="handleMouseUp($event, 'cell', rowIdx, columnIdx)" @contextmenu.prevent="openMenu($event, 'default', 'cell', rowIdx, columnIdx)" :class="{ 'grow': true, invalid: !isCellValid(rowIdx, columnIdx), highlighted: selectedCells.indexOf(rowIdx + '_' + columnIdx) !== -1 || selectedColumns.indexOf(columnIdx) !== -1 }" :style="{ width: (100 / dataset.columns.length) + '%' }" v-for="(column, columnIdx) in dataset.columns">
					<div v-if="selectedCells.indexOf(rowIdx + '_' + columnIdx) !== -1 || selectedColumns.indexOf(columnIdx) !== -1 || selectedRows.indexOf(rowIdx) !== -1" :class="{
						'highlight-selector': true,
						'top': selected.row.first === rowIdx,
						'right': selected.column.last === columnIdx,
						'bottom': selected.row.last === rowIdx || (selectedColumns.indexOf(columnIdx) !== -1 && rowIdx === dataset.rows.length - 1),
						'left': selected.column.first === columnIdx
					}">
						<div class="highlight-extender" v-if="selected.column.last === columnIdx && (selected.row.last === rowIdx || (selectedColumns.indexOf(columnIdx) !== -1 && rowIdx === dataset.rows.length - 1))"></div>
					</div>
					<DataType :ref="'cell_' + rowIdx + '_' + columnIdx " :type="column.type" v-model="row.cells[columnIdx][column.type]" :options="true" :id="row.cells[columnIdx].id" collection="dataset_cell" @input="$emit('update:dataset', dataset)" @tab="tabCell" />
				</td>
				<td class="default shrink text-no-wrap">
					<div v-if="selectedRows.indexOf(rowIdx) !== -1" :class="{
						'highlight-selector': true,
						'top': selected.row.first === rowIdx,
						'bottom': selected.row.last === rowIdx,
					}"></div>
					<div class="d-flex align-center">
						<UserAvatar :user="row.created_by" :size="24" />
						<div class="text-truncate ml-1" v-text="$options.filters.userScreenName(row.created_by)"></div>
					</div>
				</td>
				<td class="default shrink text-no-wrap">
					<div v-if="selectedRows.indexOf(rowIdx) !== -1" :class="{
						'highlight-selector right': true,
						'top': selected.row.first === rowIdx,
						'bottom': selected.row.last === rowIdx,
					}"></div>
					<DataType type="date" v-model="row.created_on" @input="$emit('update:dataset', dataset)" />
				</td>
			</tr>
			</tbody>
		</table>

		<v-row no-gutters>
			<v-col>Selected<pre>{{selected}}</pre></v-col>
			<v-col>
				Transaction: {{transactions.length}}
				<br>Size: {{ (JSON.stringify(transactions).length / 1024).toFixed(2) }} Kb
				<pre>{{transactions}}</pre>
			</v-col>
		</v-row>
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
import Model from "../../../models/Model";

export default Vue.extend({

	props: ['dataset', 'formErrors', 'transactions', 'scrollingRef'],

	components: { DataType, UserAvatar },

	mounted() {

		if (this.scrollingRef) {
			this.scrollingRef.$el.addEventListener('scroll', this.listenToScrolling);
		}
	},

	destroyed() {

	},

	methods: {

		handleMouseDown(event, type, rowIdx, columnIdx) {
			Object.assign(this.firstSelected, {
				type, rowIdx, columnIdx,
			});
		},

		handleMouseUp(event, type, rowIdx, columnIdx) {
			Object.assign(this.lastSelected, {
				type, rowIdx, columnIdx,
			});

			this.applySelection(event, type, rowIdx, columnIdx);
		},

		handleKeyDown(event) {

			const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
			if (keys.indexOf(event.code) !== -1) {

				event.preventDefault();

				const cleanSelection = !event.shiftKey && !event.ctrlKey;
				let selected = this.firstSelected;
				if (event.shiftKey) {
					selected = this.lastSelected;
				}

				switch (event.code) {
					case 'ArrowUp': selected.rowIdx--; break;
					case 'ArrowDown': selected.rowIdx++; break;
					case 'ArrowLeft': selected.columnIdx--; break;
					case 'ArrowRight': selected.columnIdx++; break;
				}

				const maxRow = this.dataset.rows.length - 1;
				const maxColumn = this.dataset.columns.length - 1;

				if (selected.rowIdx < 0) {
					selected.rowIdx = 0;
				} else if (selected.rowIdx > maxRow) {
					selected.rowIdx = maxRow;
				}
				if (selected.columnIdx < 0) {
					selected.columnIdx = 0;
				} else if (selected.columnIdx > maxColumn) {
					selected.columnIdx = maxColumn;
				}

				switch (selected.type) {
					case 'row':
						cleanSelection && this.selectedRows.splice(0, this.selectedRows.length);
						this.selectedRows.push(selected.rowIdx);
						break;
					case 'column':
						cleanSelection && this.selectedColumns.splice(0, this.selectedColumns.length);
						this.selectedColumns.push(selected.columnIdx);
						break;
					case 'cell':
						cleanSelection && this.selectedCells.splice(0, this.selectedCells.length);
						this.selectedCells.push(selected.rowIdx + '_' + selected.columnIdx);
						break;
				}

				this.applySelection(event, selected.type, selected.rowIdx, selected.columnIdx);
			}
		},

		applySelection(event, type, rowIdx, columnIdx) {

			const selected = !event.shiftKey
					? this.firstSelected
					: this.lastSelected;

			Object.assign(selected, {
				type, rowIdx, columnIdx
			});

			if (!event.shiftKey) { // If not multiple
				Object.assign(this.lastSelected, {
					type, rowIdx, columnIdx
				});
			}
		},

		listenToScrolling(event) {

			if (this.$refs.tbody) {
				let top = event.target.scrollTop;
				const tbodyHeight = this.$refs.tbody.offsetHeight;
				if (top > tbodyHeight) {
					top = tbodyHeight;
				}
				this.headOffset.y = top;
			}
		},

		sort(event, name) {

		},

		openMenu (event, group, type, rowIdx, columnIdx) {
			event.preventDefault();

			Object.assign(this.menu, {
				x: event.clientX,
				y: event.clientY,
				group,
			});
			Object.assign(this.lastSelected, {
				type, rowIdx, columnIdx,
			});
			this.$nextTick(() => {
				setTimeout(() => { // Hack to fix reopening (open immediately from another location)
					this.menu.visible = true;
				});
			});

			switch (type) {
				case 'row': this.toggleRow(rowIdx, event, true); break;
				case 'column': this.toggleColumn(columnIdx, event, true); break;
				case 'cell': this.toggleCell(rowIdx, columnIdx, event, true); break;
			}
		},

		toggleCell(rowIdx, columnIdx, event, forceVal) {

			const idx = rowIdx + '_' + columnIdx;
			const pos = this.selectedCells.indexOf(idx);
			const hadMoreThanOneSelection = this.selectedCells.length > 1;

			this.resetRowsSelection();
			this.resetColumnsSelection();

			this.applySelection(event, 'cell', rowIdx, columnIdx);

			if (forceVal === true && pos !== -1
			|| forceVal === false && pos === -1) {
				return;
			}

			if (event.shiftKey) { // Select all from original indexes

				const orderedRows = [this.firstSelected.rowIdx, rowIdx].sort();
				const firstRow = orderedRows[0];
				const lastRow = orderedRows[1];

				const orderedColumns = [this.firstSelected.columnIdx, columnIdx].sort();
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
				Object.assign(this.firstSelected, {
					columnIdx: this.lastSelected.columnIdx === null ? columnIdx : this.lastSelected.columnIdx,
					rowIdx: this.lastSelected.rowIdx === null ? rowIdx : this.lastSelected.rowIdx,
				});
			}

			if (pos === -1 || (hadMoreThanOneSelection && !event.ctrlKey)) {
				this.selectedCells.push(idx);
			} else {
				this.selectedCells.splice(pos, 1);
			}
		},

		toggleColumn(columnIdx, event, forceVal) {

			const pos = this.selectedColumns.indexOf(columnIdx);
			const hadMoreThanOneSelection = this.selectedColumns.length > 1;

			this.resetRowsSelection();
			this.resetCellsSelection();

			this.applySelection(event, 'column', null, columnIdx);

			if (forceVal === true && pos !== -1
			|| forceVal === false && pos === -1) {
				return;
			}

			if (event.shiftKey) { // Select all from original indexes
				const ordered = [this.firstSelected.columnIdx, columnIdx].sort();
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
				Object.assign(this.firstSelected, {
					columnIdx: this.lastSelected.columnIdx === null ? columnIdx : this.lastSelected.columnIdx,
				});
			}

			if (pos === -1 || (hadMoreThanOneSelection && !event.ctrlKey)) {
				this.selectedColumns.push(columnIdx);
			} else {
				this.selectedColumns.splice(pos, 1);
			}
		},

		toggleRow(rowIdx, event, forceVal) {

			const pos = this.selectedRows.indexOf(rowIdx);
			const hadMoreThanOneSelection = this.selectedRows.length > 1;

			this.resetColumnsSelection();
			this.resetCellsSelection();

			this.applySelection(event, 'row', rowIdx, null);

			if (forceVal === true && pos !== -1
			|| forceVal === false && pos === -1) {
				return;
			}

			if (event.shiftKey) { // Select all from original indexes
				const ordered = [this.firstSelected.rowIdx, rowIdx].sort();
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
				Object.assign(this.firstSelected, {
					rowIdx: this.lastSelected.rowIdx === null ? rowIdx : this.lastSelected.rowIdx,
				});
			}

			if (pos === -1 || (hadMoreThanOneSelection && !event.ctrlKey)) {
				this.selectedRows.push(rowIdx);
			} else {
				this.selectedRows.splice(pos, 1);
			}
		},

		resetColumnsSelection(resetState = false) {

			this.selectedColumns = [];
			if (resetState) {
				Object.assign(this.lastSelected, {
					// originalColumnIdx: null,
					columnIdx: null,
				});
			}
		},

		resetRowsSelection(resetState = false) {

			this.selectedRows = [];
			if (resetState) {
				Object.assign(this.lastSelected, {
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
			let newColumn = column ? column : new DatasetColumn({
				dataset: this.dataset.id,
				created_by: this.$root.user,
			});

			this.dataset.columns.splice(columnIdx, 0, newColumn);

			this.transactions.push(new Transaction({
				action: 'insert',
				collection: 'dataset_column',
				guid: newColumn.guid,
				data: new Model(newColumn).flat(false),
			}));

			this.dataset.rows.forEach((row, rowIdx) => {
				this.insertCell(rowIdx, columnIdx);
			});
		},

		removeColumn(columnIdx) {

			const id = this.dataset.columns[columnIdx].id;
			const columnGuid = this.dataset.columns[columnIdx].guid;
			this.removeTransactions(['insert', 'update'], 'dataset_column', columnGuid);

			this.dataset.columns.splice(columnIdx, 1);

			if (id) {
				this.transactions.push(new Transaction({
					action: 'delete',
					collection: 'dataset_column',
					guid: columnGuid,
					id,
				}));
			}

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
			let newRow = row ? row : new DatasetRow({
				dataset: this.dataset.id,
				created_by: this.$root.user,
			});

			this.dataset.rows.splice(rowIdx, 0, newRow);

			this.transactions.push(new Transaction({
				action: 'insert',
				collection: 'dataset_row',
				guid: newRow.guid,
				data: new Model(newRow).flat(false),
			}));

			this.dataset.columns.forEach((column, columnIdx) => {
				this.insertCell(rowIdx, columnIdx);
			});
		},

		removeRow(rowIdx) {

			const id = this.dataset.rows[rowIdx].id;
			const rowGuid = this.dataset.rows[rowIdx].guid;
			this.removeTransactions(['insert', 'update'], 'dataset_row', rowGuid);

			for (let columnIdx = this.dataset.columns.length - 1; columnIdx >= 0 ; columnIdx--) {
				this.removeCell(rowIdx, columnIdx);
			}

			this.dataset.rows.splice(rowIdx, 1);

			if (id) {
				this.transactions.push(new Transaction({
					action: 'delete',
					collection: 'dataset_row',
					guid: rowGuid,
					id,
				}));
			}

			if (this.dataset.rows.length === 0) {
				this.insertRow(0);
			}
		},

		insertCell(rowIdx, columnIdx, cell = null) {

			const row = this.dataset.rows[rowIdx];
			const column = this.dataset.columns[columnIdx];
			const relation = {};

			const cellProps = {
				created_by: this.$root.user,
			};
			row.id ? cellProps.dataset_row = row.id
				: relation.dataset_row = this.dataset.rows[rowIdx].guid;
			column.id ? cellProps.dataset_column = column.id
				: relation.dataset_column = this.dataset.columns[columnIdx].guid;

			const transactionProps = {
				action: 'insert',
				collection: 'dataset_cell',
			};
			if (Object.keys(relation).length > 0) {
				transactionProps.relation = relation;
			}

			let newCell = cell ? cell : new DatasetCell(cellProps);
			this.dataset.rows[rowIdx].cells.splice(columnIdx, 0, newCell);

			Object.assign(transactionProps, {
				guid: newCell.guid,
				data: new Model(newCell).flat(false),
			});
			this.transactions.push(new Transaction(transactionProps));
		},

		removeCell(rowIdx, columnIdx) {

			const id = this.dataset.rows[rowIdx].cells[columnIdx].id;
			const cellGuid = this.dataset.rows[rowIdx].cells[columnIdx].guid;
			this.removeTransactions(['insert', 'update'],'dataset_cell', cellGuid);

			this.dataset.rows[rowIdx].cells.splice(columnIdx, 1);

			if (id) {
				this.transactions.push(new Transaction({
					action: 'delete',
					collection: 'dataset_cell',
					guid: cellGuid,
					id,
				}));
			}
		},

		clearCell(rowIdx, columnIdx) {
			this.dataset.rows[rowIdx].cells[columnIdx] = new DatasetCell();
		},

		editCell(rowIdx, columnIdx) {
			this.lastEditCell = { rowIdx, columnIdx };
			const cellRef = this.$refs['cell_' + rowIdx + '_' + columnIdx][0];
			cellRef.edit();
		},

		tabCell(event) {

			let rowIdx = this.lastEditCell.rowIdx;
			let columnIdx = this.lastEditCell.columnIdx;
			let maxRow = this.dataset.rows.length - 1;
			let maxColumn = this.dataset.columns.length - 1;

			event.shiftKey ? columnIdx-- : columnIdx++;

			if (columnIdx > maxColumn) {
				columnIdx = 0;
				rowIdx++;
			} else if (columnIdx < 0) {
				columnIdx = maxColumn;
				rowIdx--
			}

			if (rowIdx > maxRow) {
				rowIdx = 0;
			} else if (rowIdx < 0) {
				rowIdx = maxRow;
			}

			this.editCell(rowIdx, columnIdx);
		},

		removeTransactions(type, collection, guid) {

			const types = typeof type === 'string' ? [type] : type;
			for (let i = 0; i < this.transactions.length; i++) {
				const transaction = this.transactions[i];

				if (types.indexOf(transaction.action) !== -1
					&& transaction.collection === collection
					&& transaction.guid === guid
				) {
					this.transactions.splice(i, 1);
					i--;
				}
			}
		},

		updateTransactions(type, collection, guid, data) {

			const types = typeof type === 'string' ? [type] : type;
			for (let i = 0; i < this.transactions.length; i++) {
				const transaction = this.transactions[i];

				if (types.indexOf(transaction.action) !== -1
					&& transaction.collection === collection
					&& transaction.guid === guid
				) {
					this.transactions[i].data = data;
					i--;
				}
			}
		},

		isRowValid(rowIdx) {

			const row = this.dataset.rows[rowIdx];
			for (let columnIdx = 0; columnIdx < row.cells.length; columnIdx++) {
				const cell = row.cells[columnIdx];
				if (!this.isCellValid(rowIdx, columnIdx)) {
					return false;
				}
			}
			return true;
		},

		isCellValid(rowIdx, columnIdx) {
			const column = this.dataset.columns[columnIdx];
			const cell = this.dataset.rows[rowIdx].cells[columnIdx];
			const value = cell[column.type];
			if (column.is_required && (value === null || value === '')) {
				return false;
			}
			return true;
		}
	},

	computed: {

		selected() {
			const rows = [this.firstSelected.rowIdx, this.lastSelected.rowIdx].sort();
			const columns = [this.firstSelected.columnIdx, this.lastSelected.columnIdx].sort();
			return {
				row: {
					first: rows[0],
					last: rows[1],
				},
				column: {
					first: columns[0],
					last: columns[1],
				},
			}
		}
	},

	data() {
		return {
			firstSelected: {
				type: null,
				rowIdx: null,
				columnIdx: null,
			},
			lastSelected: {
				type: null,
				rowIdx: null,
				columnIdx: null,
			},
			lastEditCell: {
				rowIdx: null,
				columnIdx: null,
			},
			headOffset: { y: 0, x: 0 },
			statuses: [
				{ text: this.$t('dataset.data.statuses.draft'), value: 'draft' },
				{ text: this.$t('dataset.data.statuses.published'), value: 'published' },
				{ text: this.$t('dataset.data.statuses.deleted'), value: 'deleted' },
			],
			selectedColumns: [],
			selectedRows: [],
			selectedCells: [],
			menu: {
				visible: false,
				x: 0, y: 0,
				group: 'default',
				groups: {
					default: {
						items: [
							{ text: this.$t('dataset.data.defaultMenu.insertRowAbove'), icon: 'mdi-table-row-plus-before', disabled: () => this.lastSelected.type === 'column', click: (event) => this.insertRow(this.lastSelected.rowIdx) },
							{ text: this.$t('dataset.data.defaultMenu.insertRowBelow'), icon: 'mdi-table-row-plus-after', disabled: () => this.lastSelected.type === 'column', click: (event) => this.insertRow(this.lastSelected.rowIdx + 1) },
							{},
							{ text: this.$t('dataset.data.defaultMenu.insertColumnLeft'), icon: 'mdi-table-column-plus-before', disabled: () => this.lastSelected.type === 'row', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
							{ text: this.$t('dataset.data.defaultMenu.insertColumnRight'), icon: 'mdi-table-column-plus-after', disabled: () => this.lastSelected.type === 'row', click: (event) => this.insertColumn(this.lastSelected.columnIdx + 1) },
							{},
							{ text: this.$t('dataset.data.defaultMenu.removeRow'), icon: 'mdi-table-row-remove', disabled: () => this.lastSelected.type === 'column', click: (event) => this.removeRow(this.lastSelected.rowIdx) },
							{ text: this.$t('dataset.data.defaultMenu.removeColumn'), icon: 'mdi-table-column-remove', disabled: () => this.lastSelected.type === 'row', click: (event) => this.removeColumn(this.lastSelected.columnIdx) },
							{},
							{ text: this.$t('dataset.data.defaultMenu.comment'), icon: 'mdi-comment-plus-outline', disabled: () => !this.lastSelected.id, click: (event) => this.$comments.open(this.lastSelected.id, 'dataset_' + this.lastSelected.type) },
						],
					},
					column: {
						items: [
							{ text: this.$t('dataset.data.columnMenu.type'), icon: 'mdi-widgets', disabled: () => this.lastSelected.type !== 'row', childs: [
								{ text: this.$t('dataset.data.columnMenu.text'), icon: 'mdi-cursor-text', disabled: () => this.lastSelected.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.number'), icon: 'mdi-numeric-1-box-outline', disabled: () => this.lastSelected.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.date'), icon: 'mdi-calendar-month', disabled: () => this.lastSelected.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.boolean'), icon: 'mdi-toggle-switch', disabled: () => this.lastSelected.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.list'), icon: 'mdi-format-list-bulleted', disabled: () => this.lastSelected.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.recording'), icon: 'mdi-record-rec', disabled: () => this.lastSelected.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.audio'), icon: 'mdi-file-music-outline', disabled: () => this.lastSelected.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.file'), icon: 'mdi-file-outline', disabled: () => this.lastSelected.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.image'), icon: 'mdi-file-image-outline', disabled: () => this.lastSelected.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
							] },
							{},
							{ text: this.$t('dataset.data.columnMenu.clearColumn'), icon: 'mdi-close', disabled: () => this.lastSelected.type === 'row', click: (event) => this.clearColumn(this.lastSelected.columnIdx) },
							{ text: this.$t('dataset.data.columnMenu.removeColumn'), icon: 'mdi-table-column-remove', disabled: () => this.lastSelected.type === 'row', click: (event) => this.removeColumn(this.lastSelected.columnIdx) },
						],
					}
				}
			},
		}
	},
});
</script>

<style lang="scss" scoped>

	div[tabindex] {
		outline: 0;
	}

	.scrollable {
		overflow: auto;
	}
	.table {
		border-collapse: collapse;
		font-size: 0.8rem;
		user-select: none;

		::v-deep input {
			font-size: 0.8rem;
		}

		.shrink {
			width: 1px;
		}

		tr.highlighted th,
		tr.highlighted td,
		th.highlighted,
		td.highlighted {
			position: relative;
		}
		.highlight-selector {
			position: absolute;
			z-index: 1;
			top: -1px;
			left: -1px;
			width: calc(100% + 2px);
			height: calc(100% + 2px);
			pointer-events: none;

			&.top {
				border-top: rgba(142, 176, 231, 1) solid 2px;
			}
			&.right {
				border-right: rgba(142, 176, 231, 1) solid 2px;
			}
			&.bottom {
				border-bottom: rgba(142, 176, 231, 1) solid 2px;
			}
			&.left {
				border-left: rgba(142, 176, 231, 1) solid 2px;
			}
			.highlight-extender {
				position: absolute;
				bottom: -2px;
				right: -2px;
				width: 0.5rem;
				height: 0.5rem;
				background-color: rgba(142, 176, 231, 1);
				pointer-events: auto;
				cursor: crosshair;
			}
		}

		thead {

			th {
				position: relative;
				z-index: 1;
			}
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

		td.invalid {
			position: relative;
		}
		td.invalid::before {
			content: ' ';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: 0.2;
			background-color: orange;
			z-index: 0;
		}

		th {
			background-color: #eee;
		}

		tbody tr.highlighted th:nth-child(1),
		thead th.highlighted {
			cursor: grab;
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
