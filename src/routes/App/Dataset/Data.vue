<template>
	<div @keydown="handleKeyDown" tabindex="0" class="fill-height">

		<v-menu v-model="menu.visible" :position-x="menu.x" :position-y="menu.y" absolute offset-y>
			<v-list dense>
				<template v-for="(item, index) in menuGroups[menu.group].items">
					<v-list-item v-if="item.text" :disabled="item.disabled()" :key="index" v-on="item.click ? { click: item.click } : {}">
						<v-list-item-icon class="mr-2">
							<v-icon v-if="typeof item.icon === 'function'" v-text="item.icon()" small></v-icon>
							<v-icon v-else v-text="item.icon" small></v-icon>
						</v-list-item-icon>
						<v-list-item-title>{{ item.text }}</v-list-item-title>
						<v-list-item-action v-if="item.childs" class="ml-2">
							<v-icon small>mdi-chevron-right</v-icon>
						</v-list-item-action>
					</v-list-item>
					<v-divider class="my-2" v-else :key="index"></v-divider>
				</template>
			</v-list>
		</v-menu>

		<div class="table-container" ref="container">
			<div class="move-handler" ref="moveHandler" v-if="dragState.enabled"></div>

			<table class="table w-100 white">
				<thead :ref="'thead_' + (index === 0 ? 'fixed' : 'main')" :class="{
					'fixed': index === 0,
					'd-none': index === 0 && headOffset.y === 0,
				}" :style="{
					top: headOffset.top + 'px',
					width: headOffset.width + 'px',
				}" v-for="(n, index) in 2">
				<tr>
					<th class="shrink text-no-wrap default"></th>
					<th class="shrink text-no-wrap default">
						<v-icon x-small left>mdi-state-machine</v-icon>
						<span @mousedown.stop="sort($event, 'status')" @mouseup.stop class="name" v-text="$t('dataset.data.status')"></span>
						<v-icon v-if="sorting.status === 'desc'" class="ml-2" small>mdi-sort-descending</v-icon>
						<v-icon v-else-if="sorting.status === 'asc'" class="ml-2" small>mdi-sort-ascending</v-icon>
					</th>
					<th :ref="'column_' + columnIdx" @keydown="handleColumnKeyDown($event, columnIdx)" @keyup="handleColumnKeyUp($event, columnIdx)" tabindex="0" @contextmenu.stop.prevent="openMenu($event, 'column', 'column', null, columnIdx)" @mousedown="handleMouseDown($event, 'column', undefined, columnIdx)" @mouseenter="handleMouseEnter($event, 'column', firstSelected.rowIdx, columnIdx)" @mouseup="handleMouseUp($event, 'column', firstSelected.rowIdx, columnIdx)" :class="{ 'grow': true, highlighted: selectedColumns.indexOf(columnIdx) !== -1 }" :style="{ width: (100 / dataset.columns.length) + '%' }" v-for="(column, columnIdx) in dataset.columns">

						<div v-if="highlightedColumns[columnIdx]" :class="{
							'highlight-selector top': true,
							'left': highlightedColumns[columnIdx].left,
							'right': highlightedColumns[columnIdx].right,
						}"></div>

						<span @mousedown.stop="sort($event, columnIdx)" @mouseup.stop class="name" v-text="column.name"></span>
						<span v-if="column.is_required" class="error--text"> *</span>

						<v-icon v-if="sorting[columnIdx] === 'desc'" class="ml-2" small>mdi-sort-descending</v-icon>
						<v-icon v-else-if="sorting[columnIdx] === 'asc'" class="ml-2" small>mdi-sort-ascending</v-icon>

						<v-btn @click.stop="openMenu($event, 'column', 'column', null, columnIdx)" class="float-right ml-2 column-menu" icon x-small>
							<v-icon>mdi-chevron-down</v-icon>
						</v-btn>
					</th>
					<th class="shrink text-no-wrap default">
						<v-icon x-small left>mdi-account</v-icon>
						<span @mousedown.stop="sort($event, 'created_by')" @mouseup.stop class="name" v-text="$t('dataset.data.created_by')"></span>
						<v-icon v-if="sorting.created_by === 'desc'" class="ml-2" small>mdi-sort-descending</v-icon>
						<v-icon v-else-if="sorting.created_by === 'asc'" class="ml-2" small>mdi-sort-ascending</v-icon>
					</th>
					<th class="shrink text-no-wrap default">
						<v-icon x-small left>mdi-calendar-month</v-icon>
						<span @mousedown.stop="sort($event, 'created_on')" @mouseup.stop class="name" v-text="$t('dataset.data.created_on')"></span>
						<v-icon v-if="sorting.created_on === 'desc'" class="ml-2" small>mdi-sort-descending</v-icon>
						<v-icon v-else-if="sorting.created_on === 'asc'" class="ml-2" small>mdi-sort-ascending</v-icon>
					</th>
				</tr>
				</thead>
				<tbody ref="tbody">
				<tr :ref="'row_' + rowIdx" :class="{ highlighted: selectedRows.indexOf(rowIdx) !== -1 }" v-for="(row, rowIdx) in dataset.rows">
					<th @keydown="handleRowKeyDown($event, rowIdx)" @keyup="handleRowKeyUp($event, rowIdx)" tabindex="0" @contextmenu.stop.prevent="openMenu($event, 'row', 'row', rowIdx, null)" @mousedown="handleMouseDown($event, 'row', rowIdx)" @mouseenter="handleMouseEnter($event, 'row', rowIdx, firstSelected.columnIdx)" @mouseup="handleMouseUp($event, 'row', rowIdx, firstSelected.columnIdx)" class="default shrink text-center">
						<div v-if="highlightedRows[rowIdx]" :class="{
							'highlight-selector left': true,
							'top': highlightedRows[rowIdx].top,
							'bottom': highlightedRows[rowIdx].bottom,
						}"></div>
						<span v-if="!isRowValid(rowIdx)">
							<v-icon color="warning" small>mdi-alert</v-icon>
						</span>
						<span v-else-if="row.id" v-text="rowIdx + 1"></span>
						<span v-else>
							<v-icon color="primary" small>mdi-plus-circle</v-icon>
						</span>
					</th>
					<td @keydown="handleRowKeyDown($event, rowIdx)" @keyup="handleRowKeyUp($event, rowIdx)" tabindex="0" @contextmenu.stop.prevent="openMenu($event, 'row', 'row', rowIdx, null)" class="shrink default" @mousedown="handleMouseDown($event, 'row', rowIdx)" @mouseenter="handleMouseEnter($event, 'row', rowIdx)" @mouseup="handleMouseUp($event, 'row', rowIdx)">
						<div v-if="highlightedRows[rowIdx]" :class="{
							'highlight-selector': true,
							'top': highlightedRows[rowIdx].top,
							'bottom': highlightedRows[rowIdx].bottom,
						}"></div>
						<DataType type="list" :items="statuses" v-model="row.status" @input="$emit('update:dataset', dataset)" />
					</td>
					<td @keydown="handleCellKeyDown($event, rowIdx, columnIdx)" @keyup="handleCellKeyUp($event, rowIdx, columnIdx)" tabindex="0" @contextmenu.stop.prevent="openMenu($event, 'cell', 'cell', rowIdx, columnIdx)" @dblclick.stop="editCell(rowIdx, columnIdx)" @mousedown="handleMouseDown($event, 'cell', rowIdx, columnIdx)" @mouseenter="handleMouseEnter($event, 'cell', rowIdx, columnIdx)" @mouseup="handleMouseUp($event, 'cell', rowIdx, columnIdx)" :class="{ 'grow': true, 'last-highlighted': (lastSelected.rowIdx === rowIdx && lastSelected.columnIdx === columnIdx && selectedCells.length > 1), invalid: !isCellValid(rowIdx, columnIdx), highlighted: selectedCells.indexOf(rowIdx + '_' + columnIdx) !== -1 || selectedColumns.indexOf(columnIdx) !== -1 }" :style="{ width: (100 / dataset.columns.length) + '%' }" v-for="(column, columnIdx) in dataset.columns">
						<div v-if="highlightedCells[rowIdx + '_' + columnIdx]" :class="{
							'highlight-selector': true,
							'top': highlightedCells[rowIdx + '_' + columnIdx].top,
							'right': highlightedCells[rowIdx + '_' + columnIdx].right,
							'bottom': highlightedCells[rowIdx + '_' + columnIdx].bottom,
							'left': highlightedCells[rowIdx + '_' + columnIdx].left,
						}">
							<div class="highlight-extender" @mousedown.stop="handleMouseDown($event, 'cell', rowIdx, columnIdx, true)" v-if="lastSelected.rowIdx === rowIdx && lastSelected.columnIdx === columnIdx"></div>
						</div>
						<DataType :ref="'cell_' + rowIdx + '_' + columnIdx " :type="column.type" v-model="row.cells[columnIdx][column.type]" :options="true" :id="row.cells[columnIdx].id" collection="dataset_cell" @input="$emit('update:dataset', dataset)" @tab="tabCell" />
					</td>
					<td @keydown="handleRowKeyDown($event, rowIdx)" @keyup="handleRowKeyUp($event, rowIdx)" tabindex="0" @contextmenu.stop.prevent="openMenu($event, 'row', 'row', rowIdx, null)" class="default shrink text-no-wrap" @mousedown="handleMouseDown($event, 'row', rowIdx)" @mouseenter="handleMouseEnter($event, 'row', rowIdx)" @mouseup="handleMouseUp($event, 'row', rowIdx)">
						<div v-if="highlightedRows[rowIdx]" :class="{
							'highlight-selector': true,
							'top': highlightedRows[rowIdx].top,
							'bottom': highlightedRows[rowIdx].bottom,
						}"></div>
						<div class="d-flex align-center">
							<UserAvatar :user="row.created_by" :size="24" />
							<div class="text-truncate ml-1" v-text="$options.filters.userScreenName(row.created_by)"></div>
						</div>
					</td>
					<td @keydown="handleRowKeyDown($event, rowIdx)" @keyup="handleRowKeyUp($event, rowIdx)" tabindex="0" @contextmenu.stop.prevent="openMenu($event, 'row', 'row', rowIdx, null)" class="default shrink text-no-wrap" @mousedown="handleMouseDown($event, 'row', rowIdx)" @mouseenter="handleMouseEnter($event, 'row', rowIdx)" @mouseup="handleMouseUp($event, 'row', rowIdx)">
						<div v-if="highlightedRows[rowIdx]" :class="{
							'highlight-selector right': true,
							'top': highlightedRows[rowIdx].top,
							'bottom': highlightedRows[rowIdx].bottom,
						}">
							<div class="highlight-extender" @mousedown.stop="handleMouseDown($event, 'row', rowIdx, undefined, true)" v-if="selected.row.last === rowIdx"></div>
						</div>
						<DataType type="date" v-model="row.created_on" @input="$emit('update:dataset', dataset)" />
					</td>
				</tr>
				</tbody>
			</table>
		</div>

		<v-row no-gutters>
			<v-col>
				First selected
				<pre>{{firstSelected}}</pre>
				<br>
				Last selected
				<pre>{{lastSelected}}</pre>
			</v-col>
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

const dragState = {};

export default Vue.extend({

	props: ['dataset', 'formErrors', 'transactions', 'scrollingRef'],

	components: { DataType, UserAvatar },

	mounted() {

		if (this.scrollingRef) {
			this.scrollingRef.$el.addEventListener('scroll', this.listenToScrolling);
		}

		window.addEventListener('resize', this.listenToResize);
		this.listenToResize();

		// FOR DEBUG PURPOSES..
		setTimeout(() => {
			if (this.dataset.columns.length < 5) {
				this.insertColumn(0);
				this.insertColumn(0);
				this.insertColumn(0);
				this.insertRow(0);
				this.insertRow(0);
				this.insertRow(0);
				this.insertRow(0);
				this.insertRow(0);
				this.insertRow(0);
				this.insertRow(0);
				this.insertRow(0);
				this.insertRow(0);
				this.insertRow(0);
				this.insertRow(0);
			}
		}, 3000);
	},

	destroyed() {
		window.removeEventListener('resize', this.listenToResize);
	},

	methods: {

		handleDragStart(event, type, rowIdx, columnIdx) {

			const element = type === 'column'
					? this.$refs['column_' + columnIdx][this.headOffset.y > 0 ? 0 : 1]
					: this.$refs['row_' + rowIdx][0];
			const thead = this.$refs['thead_' + (this.headOffset.y > 0 ? 'fixed' : 'main')][0];

			Object.assign(dragState, {
				type, rowIdx, columnIdx, enabled: true,
				originalTop: type === 'column' ? element.offsetTop + element.offsetHeight : element.offsetTop,
				top: type === 'column' ? element.offsetTop + element.offsetHeight : element.offsetTop,
				originalLeft: element.offsetLeft,
				left: element.offsetLeft,
				width: type === 'column' ? element.offsetWidth : this.$refs.container.offsetWidth,
				height: type === 'column' ? this.$refs.container.offsetHeight - thead.offsetHeight : element.offsetHeight,
			});
			Object.assign(this.dragState, { enabled: true });

			document.addEventListener('mousemove', this.handleDragMove);
			document.addEventListener('mouseup', this.handleDrop);

			setTimeout(() => {

				Object.assign(this.$refs.moveHandler.style, {
					top: dragState.top + 'px',
					left: dragState.left + 'px',
				});
				this.applyDragState(event);
			});
			this.$forceUpdate();
		},

		handleDragMove(event) {
			this.applyDragState(event);
		},

		handleDrop(event) {

			Object.assign(this.dragState, { enabled: false });
			this.applyDragState(event);

			document.removeEventListener('mousemove', this.handleDragMove);
			document.removeEventListener('mouseup', this.handleDrop);

			this.$forceUpdate();
		},

		applyDragState(event) {

			let top = dragState.type === 'row' ? event.movementY + dragState.top : 0;
			let left = dragState.type === 'column' ? event.movementX + dragState.left : 0;

			const thead = this.$refs['thead_' + (this.headOffset.y > 0 ? 'fixed' : 'main')][0];
			const firstColumn = this.$refs['column_0'][this.headOffset.y > 0 ? 0 : 1];
			const lastColumn = this.$refs['column_' + (this.dataset.columns.length - 1)][this.headOffset.y > 0 ? 0 : 1];
			const minLeft = dragState.type === 'column' ? firstColumn.offsetLeft : 0;
			const minTop = thead.offsetHeight;
			const maxTop = this.$refs.container.offsetTop + this.$refs.container.offsetHeight - dragState.height;
			const maxLeft = dragState.type === 'column' ? lastColumn.offsetLeft + lastColumn.offsetWidth - dragState.width : this.$refs.container.offsetLeft + this.$refs.container.offsetWidth;

			top = top < minTop ? minTop : top > maxTop ? maxTop : top;
			left = left < minLeft ? minLeft : left > maxLeft ? maxLeft : left;

			switch (dragState.type) {
				case 'row': this.$refs.moveHandler.style.top = top + 'px'; break;
				case 'column': this.$refs.moveHandler.style.left = left + 'px'; break;
			}

			Object.assign(this.$refs.moveHandler.style, {
				width: dragState.width + 'px',
				height: dragState.height + 'px',
			});

			Object.assign(dragState, { top, left });
		},

		handleMouseDown(event, type, rowIdx, columnIdx, extend = false) {

			if (event.buttons !== 1 || (event.ctrlKey && this.firstSelected.type !== type)) {
				return;
			}

			if (type === 'column' && this.selectedColumns.indexOf(columnIdx) !== -1) {
				this.handleDragStart(event, type, rowIdx, columnIdx);
			} else if (type === 'row' && this.selectedRows.indexOf(rowIdx) !== -1) {
				this.handleDragStart(event, type, rowIdx, columnIdx);
			} else {

				event.stopImmediatePropagation();

				if (!event.shiftKey && !extend) {
					Object.assign(this.firstSelected, {
						type, rowIdx, columnIdx,
					});
					// this.syncSelection(event, this.firstSelected);
				}
				if ((event.shiftKey && this.firstSelected.type === type) || extend || !event.shiftKey) {
					Object.assign(this.lastSelected, {
						type, rowIdx, columnIdx,
					});
					this.syncSelection(event, this.lastSelected);
				}
			}
		},

		handleMouseEnter(event, type, rowIdx, columnIdx) {

			if (event.buttons !== 1 || this.dragState.enabled || (event.ctrlKey && this.firstSelected.type !== type)) {
				return;
			}

			if (this.firstSelected.type === type) {
				Object.assign(this.lastSelected, {
					type, rowIdx, columnIdx,
				});

				this.syncSelection(event, this.lastSelected);
			}
		},

		handleMouseUp(event, type, rowIdx, columnIdx) {

			if (event.button === 2 || (event.ctrlKey && this.firstSelected.type !== type) || dragState.enabled) { // Contextual button.. not handled
				return;
			}

			if (!this.dragState.enabled) {
				event.stopImmediatePropagation();
			}

			if (this.firstSelected.type === type) {
					Object.assign(this.lastSelected, {
						type, rowIdx, columnIdx,
					});

					this.syncSelection(event, this.lastSelected);
				}
		},

		handleKeyDown(event) {

			const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
			if (keys.indexOf(event.code) !== -1) {

				event.preventDefault();

				const maxRow = this.dataset.rows.length - 1;
				const maxColumn = this.dataset.columns.length - 1;
				const clonedFirstSelected = Object.assign({}, this.firstSelected);
				const clonedLastSelected = Object.assign({}, this.lastSelected);

				if (!event.shiftKey && !event.ctrlKey) {

					const values = [];
					switch (this.firstSelected.type) {
						case 'row':
							for (let i = 0; i < this.selectedRows.length; i++) {
								let rowIdx = this.selectedRows[i];

								switch (event.code) {
									case 'ArrowUp': rowIdx--; if (i === 0) { clonedFirstSelected.rowIdx--; clonedLastSelected.rowIdx--;} break;
									case 'ArrowDown': rowIdx++; if (i === 0) { clonedFirstSelected.rowIdx++; clonedLastSelected.rowIdx++;} break;
									// case 'ArrowLeft': columnIdx--; if (i === 0) { clonedFirstSelected.columnIdx--; clonedLastSelected.columnIdx--;} break;
									// case 'ArrowRight': columnIdx++; if (i === 0) { clonedFirstSelected.columnIdx++; clonedLastSelected.columnIdx++;} break;
								}

								if (rowIdx < 0 || rowIdx > maxRow) {
									return false;
								}

								values.push(rowIdx);
							}

							this.selectedRows.splice(0, this.selectedRows.length, ...values);
							break;
						case 'column':
							for (let i = 0; i < this.selectedColumns.length; i++) {
								let columnIdx = this.selectedColumns[i];

								switch (event.code) {
									// case 'ArrowUp': rowIdx--; if (i === 0) { clonedFirstSelected.rowIdx--; clonedLastSelected.rowIdx--;} break;
									// case 'ArrowDown': rowIdx++; if (i === 0) { clonedFirstSelected.rowIdx++; clonedLastSelected.rowIdx++;} break;
									case 'ArrowLeft': columnIdx--; if (i === 0) { clonedFirstSelected.columnIdx--; clonedLastSelected.columnIdx--;} break;
									case 'ArrowRight': columnIdx++; if (i === 0) { clonedFirstSelected.columnIdx++; clonedLastSelected.columnIdx++;} break;
								}

								if (columnIdx < 0 || columnIdx > maxColumn) {
									return false;
								}

								values.push(columnIdx);
							}

							this.selectedColumns.splice(0, this.selectedColumns.length, ...values);
							break;
						case 'cell':

							for (let i = 0; i < this.selectedCells.length; i++) {
								const cell = this.selectedCells[i];
								const splitted = cell.split('_');
								let rowIdx = parseInt(splitted[0]);
								let columnIdx = parseInt(splitted[1]);

								switch (event.code) {
									case 'ArrowUp': rowIdx--; if (i === 0) { clonedFirstSelected.rowIdx--; clonedLastSelected.rowIdx--;} break;
									case 'ArrowDown': rowIdx++; if (i === 0) { clonedFirstSelected.rowIdx++; clonedLastSelected.rowIdx++;} break;
									case 'ArrowLeft': columnIdx--; if (i === 0) { clonedFirstSelected.columnIdx--; clonedLastSelected.columnIdx--;} break;
									case 'ArrowRight': columnIdx++; if (i === 0) { clonedFirstSelected.columnIdx++; clonedLastSelected.columnIdx++;} break;
								}

								if (rowIdx < 0 || rowIdx > maxRow || columnIdx < 0 || columnIdx > maxColumn) {
									return false;
								}

								const cellIdx = rowIdx + '_' + columnIdx;
								values.push(cellIdx);
							}

							this.selectedCells.splice(0, this.selectedCells.length, ...values);
							break;
					}

					Object.assign(this.firstSelected, clonedFirstSelected);
					Object.assign(this.lastSelected, clonedLastSelected);

				} else if(event.ctrlKey) {

					switch (this.firstSelected.type) {
						case 'row':
							break;
						case 'column':
							break;
						case 'cell':

							switch (event.code) {
								case 'ArrowUp': clonedLastSelected.rowIdx--; break;
								case 'ArrowDown': clonedLastSelected.rowIdx++; break;
								case 'ArrowLeft': clonedLastSelected.columnIdx--; break;
								case 'ArrowRight': clonedLastSelected.columnIdx++; break;
							}

							if (clonedLastSelected.rowIdx < 0 || clonedLastSelected.rowIdx > maxRow || clonedLastSelected.columnIdx < 0 || clonedLastSelected.columnIdx > maxColumn) {
								return false;
							}

							Object.assign(this.lastSelected, clonedLastSelected);

							const cellIdx = this.lastSelected.rowIdx + '_' + this.lastSelected.columnIdx;
							let pos = this.selectedCells.indexOf(cellIdx);
							if (pos === -1) {
								this.selectedCells.push(cellIdx);
							} else {
								this.selectedCells.splice(pos, 1);
							}

							break;
					}

				} else if (event.shiftKey) {

					const clonedSelected = Object.assign({}, this.lastSelected);
					switch (event.code) {
						case 'ArrowUp': clonedSelected.rowIdx--; break;
						case 'ArrowDown': clonedSelected.rowIdx++; break;
						case 'ArrowLeft': clonedSelected.columnIdx--; break;
						case 'ArrowRight': clonedSelected.columnIdx++; break;
					}
					if (clonedSelected.rowIdx < 0 || clonedSelected.rowIdx > maxRow || clonedSelected.columnIdx < 0 || clonedSelected.columnIdx > maxColumn) {
						return;
					}

					Object.assign(this.lastSelected, clonedSelected);

					if (this.firstSelected.type === this.lastSelected.type) {
						this.syncSelection(event, clonedSelected);
					}
				}

			} else if (event.code === 'Escape') {
				this.resetSelection();
			}
		},

		handleRowKeyDown(event, rowIdx) {
			if (event.code === 'Delete' || event.code === 'Backspace') {
				this.runOnSelectedCells((cell, rowIdx, columnIdx) => {
					this.clearCell(rowIdx, columnIdx);
				});
				this.$forceUpdate();
			}
		},

		handleRowKeyUp(event, rowIdx) {

		},

		handleColumnKeyDown(event, columnIdx) {
			if (event.code === 'Delete' || event.code === 'Backspace') {
				this.runOnSelectedCells((cell, rowIdx, columnIdx) => {
					this.clearCell(rowIdx, columnIdx);
				});
				this.$forceUpdate();
			}
		},

		handleColumnKeyUp(event, columnIdx) {

		},

		handleCellKeyDown(event, rowIdx, columnIdx) {

			if (event.key.length === 1) {

				if (this.selectedCells.length === 1 && !this.isEditingCell(rowIdx, columnIdx)) {
					this.editCell(rowIdx, columnIdx);
				} else if (this.selectedCells.length > 1) {

				}

			} else if (event.code === 'Delete' || event.code === 'Backspace') {
				this.runOnSelectedCells((cell, rowIdx, columnIdx) => {
					this.clearCell(rowIdx, columnIdx);
				});
				this.$forceUpdate();
			}
		},

		handleCellKeyUp(event, rowIdx, columnIdx) {

			if (event.code === 'Enter' && !this.isEditingCell(rowIdx, columnIdx)) {
				this.editCell(rowIdx, columnIdx);
			}
		},

		toggleRows(firstIdx, secondIdx, forceValue = null) {

			const ordered = [firstIdx, secondIdx].sort((a, b) => a -b);
			const first = ordered[0];
			const last = ordered[1];

			for (let i = first; i <= last; i++) {
				this.toggleRow(i, forceValue);
			}
		},

		toggleColumns(firstIdx, secondIdx, forceValue = null) {

			const ordered = [firstIdx, secondIdx].sort((a, b) => a -b);
			const first = ordered[0];
			const last = ordered[1];

			for (let i = first; i <= last; i++) {
				this.toggleColumn(i, forceValue);
			}
		},

		toggleCells(firstRowIdx, secondRowIdx, firstColumnIdx, secondColumnIdx, forceValue = null) {

			const orderedRows = [firstRowIdx, secondRowIdx].sort((a, b) => a -b);
			const firstRow = orderedRows[0];
			const lastRow = orderedRows[1];

			const orderedColumns = [firstColumnIdx, secondColumnIdx].sort((a, b) => a -b);
			const firstColumn = orderedColumns[0];
			const lastColumn = orderedColumns[1];

			for (let rowIdx = firstRow; rowIdx <= lastRow; rowIdx++) {
				for (let columnIdx = firstColumn; columnIdx <= lastColumn; columnIdx++) {
					this.toggleCell(rowIdx, columnIdx, forceValue);
				}
			}
		},

		toggle(type, rowIdx, columnIdx, forceValue = null) {

			switch (type) {
				case 'row': return this.toggleRow(rowIdx, forceValue); break;
				case 'column': return this.toggleColumn(columnIdx, forceValue); break;
				case 'cell': return this.toggleCell(rowIdx, columnIdx, forceValue); break;
			}
		},

		toggleRow(rowIdx, forceValue = null) {

			const pos = this.selectedRows.indexOf(rowIdx);
			if (pos === -1 && forceValue !== false) {
				this.selectedRows.push(rowIdx);
			} else if (pos !== -1 && forceValue !== true) {
				this.selectedRows.splice(pos, 1);
			}
		},

		toggleColumn(columnIdx, forceValue = null) {

			const pos = this.selectedColumns.indexOf(columnIdx);
			if (pos === -1 && forceValue !== false) {
				this.selectedColumns.push(columnIdx);
			} else if (pos !== -1 && forceValue !== true) {
				this.selectedColumns.splice(pos, 1);
			}
		},

		toggleCell(rowIdx, columnIdx, forceValue = null) {

			const cellIdx = rowIdx + '_' + columnIdx;
			const pos = this.selectedCells.indexOf(cellIdx);
			if (pos === -1 && forceValue !== false) {
				this.selectedCells.push(cellIdx);
			} else if (pos !== -1 && forceValue !== true) {
				this.selectedCells.splice(pos, 1);
			}
		},

		isSelected(type, rowIdx, columnIdx) {

			switch (type) {
				case 'row': return this.selectedRows.indexOf(rowIdx) !== -1; break;
				case 'column': return this.selectedColumns.indexOf(columnIdx) !== -1; break;
				case 'cell': return this.selectedCells.indexOf(rowIdx + '_' + columnIdx) !== -1; break;
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

		resetColumnsSelection(resetState = false) {

			this.selectedColumns = [];
			if (resetState) {
				Object.assign(this.lastSelected, {
					// originalColumnIdx: null,
					columnIdx: null,
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

		syncSelection(event, currentSelected) {

			if (!event.shiftKey && !event.ctrlKey) {
				this.resetRowsSelection();
				this.resetColumnsSelection();
				this.resetCellsSelection();
			}
			else if (this.firstSelected.type !== this.lastSelected.type) {
				switch (currentSelected.type) {
					case 'row':
						this.resetColumnsSelection();
						this.resetCellsSelection();
						break;
					case 'column':
						this.resetRowsSelection();
						this.resetCellsSelection();
						break;
					case 'cell':
						this.resetRowsSelection();
						this.resetColumnsSelection();
						break;
				}
			}

			const toggleCandidate = event.ctrlKey && event.type !== 'mousedown';
			if (event.ctrlKey && event.type !== 'mouseup') {
				// Negative isSelected so it'll determine if the current function enabled it or not
				this.firstSelected.rowIdx = currentSelected.rowIdx;
				this.firstSelected.columnIdx = currentSelected.columnIdx;
				this.firstSelected.wasSelected = !this.isSelected(currentSelected.type, currentSelected.rowIdx, currentSelected.columnIdx);
			}

			switch (currentSelected.type) {
				case 'row':
					if (!event.ctrlKey) {
						this.selectedRows = [];
					}
					this.toggleRows(
						this.firstSelected.rowIdx,
						currentSelected.rowIdx,
						toggleCandidate ? this.firstSelected.wasSelected : null,
					);
					break;
				case 'column':
					if (!event.ctrlKey) {
						this.selectedColumns = [];
					}
					this.toggleColumns(
						this.firstSelected.columnIdx,
						currentSelected.columnIdx,
						toggleCandidate ? this.firstSelected.wasSelected : null,
					);
					break;
				case 'cell':
					if (!event.ctrlKey) {
						this.selectedCells = [];
					}
					this.toggleCells(
							this.firstSelected.rowIdx, currentSelected.rowIdx,
							this.firstSelected.columnIdx, currentSelected.columnIdx,
							toggleCandidate
									? this.firstSelected.wasSelected
									: null,
					);
					break;
			}
		},

		syncHighlighter() {

			this.highlightedCells = {};
			this.selectedCells.forEach(cell => {
				const splitted = cell.split('_');
				const rowIdx = parseInt(splitted[0]);
				const columnIdx = parseInt(splitted[1]);
				this.highlightedCells[cell] = {
					top: this.selectedCells.indexOf((rowIdx - 1) + '_' + columnIdx) === -1,
					right: this.selectedCells.indexOf(rowIdx + '_' + (columnIdx + 1)) === -1,
					bottom: this.selectedCells.indexOf((rowIdx + 1) + '_' + columnIdx) === -1,
					left: this.selectedCells.indexOf(rowIdx + '_' + (columnIdx - 1)) === -1,
				};
			});

			this.highlightedColumns = {};
			this.selectedColumns.forEach(columnIdx => {
				this.highlightedColumns[columnIdx] = {
					left: this.selectedColumns.indexOf(columnIdx - 1) === -1,
					right: this.selectedColumns.indexOf(columnIdx + 1) === -1,
				};

				// Highlight all cells for that particular column
				this.dataset.rows.forEach((row, rowIdx) => {
					this.highlightedCells[rowIdx + '_' + columnIdx] = {
						top: false,
						right: this.selectedColumns.indexOf(columnIdx + 1) === -1,
						bottom: rowIdx === this.dataset.rows.length - 1,
						left: this.selectedColumns.indexOf(columnIdx - 1) === -1,
					};
				});
			});

			this.highlightedRows = {};
			this.selectedRows.forEach(rowIdx => {
				this.highlightedRows[rowIdx] = {
					top: this.selectedRows.indexOf(rowIdx - 1) === -1,
					bottom: this.selectedRows.indexOf(rowIdx + 1) === -1,
				};

				// Highlight all cells for that particular row
				this.dataset.columns.forEach((column, columnIdx) => {
					this.highlightedCells[rowIdx + '_' + columnIdx] = {
						top: this.selectedRows.indexOf(rowIdx - 1) === -1,
						right: false,
						bottom: this.selectedRows.indexOf(rowIdx + 1) === -1,
						left: false,
					};
				});
			});
		},

		runOnSelectedCells(callback) {
			this.selectedColumns.forEach((columnIdx, idx) => {
				this.dataset.rows.forEach((row, rowIdx) => {
					callback(row.cells[columnIdx], rowIdx, columnIdx);
				});
			});
			this.selectedRows.forEach((rowIdx, idx) => {
				this.dataset.columns.forEach((column, columnIdx) => {
					callback(this.dataset.rows[rowIdx].cells[columnIdx], rowIdx, columnIdx);
				});
			});
			this.selectedCells.forEach((cellIdx, index) => {
				const splitted = cellIdx.split('_');
				const rowIdx = splitted[0];
				const columnIdx = splitted[1];
				callback(this.dataset.rows[rowIdx].cells[columnIdx], rowIdx, columnIdx);
			});
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

		listenToResize(event) {

			setTimeout(() => {
				const mainThead = this.$refs.thead_main[0];
				const fixedThead = this.$refs.thead_fixed[0];
				if (mainThead) {
					const bb = mainThead.getBoundingClientRect();
					this.headOffset.top = bb.top + this.headOffset.y;
					this.headOffset.width = bb.width + 1;

					mainThead.querySelectorAll('th').forEach((head, index) => {
						this.headOffset.columns[index] = head.offsetWidth;
					});
					fixedThead.querySelectorAll('th').forEach((head, index) => {
						head.style.width = this.headOffset.columns[index] + 'px';
					});
				}
			});
		},

		sort(event, columnName) {

			if (!event.ctrlKey && (Object.keys(this.sorting).length > 1 || !this.sorting[columnName])) {
				this.sorting = {};
			}

			switch (this.sorting[columnName]) {
				case 'asc': this.sorting[columnName] = 'desc'; break;
				case 'desc': delete this.sorting[columnName]; break;
				default: this.sorting[columnName] = 'asc'; break;
			}

			// Apply multi-sorting..
			const sortingKeys = Object.keys(this.sorting);
			this.dataset.rows.sort((a, b) => {

				for (let i = 0; i < sortingKeys.length; i++) {

					const columnKey = sortingKeys[i];
					const sorting = this.sorting[columnKey];
					let val1 = a[columnKey];
					let val2 = b[columnKey];

					if (!isNaN(columnKey)) {
						const columnType = this.dataset.columns[columnKey].type;
						val1 = a.cells[columnKey][columnType];
						val2 = b.cells[columnKey][columnType];
					}

					const result = sorting === 'desc' ? (val1 || '').localeCompare(val2 || '') : (val2 || '').localeCompare(val1 || '');
					if (result === 0) {
						continue;
					}
					return result;
				}
			});
		},

		openMenu(event, group, type, rowIdx, columnIdx) {
			event.preventDefault();

			let x = event.clientX;
			let y = event.clientY;

			if (group === 'column' && event.currentTarget.classList.contains('column-menu')) {
				const targetBoundingBox = event.currentTarget.getBoundingClientRect();
				x = targetBoundingBox.left;
				y = targetBoundingBox.top;
			}

			if (!this.isSelected(type, rowIdx, columnIdx)) {
				this.resetSelection();
				this.toggle(type, rowIdx, columnIdx, true);
			}

			Object.assign(this.menu, {x, y, group, type});
			Object.assign(this.lastSelected, {type, rowIdx, columnIdx});

			this.$nextTick(() => {
				setTimeout(() => { // Hack to fix reopening (open immediately from another location)
					this.menu.visible = true;
				});
			});
		},

		insertColumn(columnIdx, column = null) {
			let newColumn = column ? column : new DatasetColumn({
				dataset: this.dataset.id,
				created_by: this.$root.user,
			});

			this.dataset.columns.splice(columnIdx, 0, newColumn);

			this.addTransaction('insert', 'dataset_column', new Model(newColumn));

			this.dataset.rows.forEach((row, rowIdx) => {
				this.insertCell(rowIdx, columnIdx);
			});
		},

		removeSelectedColumns() {

			this.selectedColumns.sort((a, b) => a -b).reverse(); // Reverse order so removing from array doesn't corrupt..
			this.selectedColumns.forEach(columnIdx => {
				this.removeColumn(columnIdx);
			});
			this.selectedColumns.splice(0, this.selectedColumns.length);

			// Update selection if necessary
			// const maxColumnIdx = this.dataset.columns.length - 1;
			// if (columnIdx > maxColumnIdx) {
			// 	const selectedColumnPos = this.selectedColumns.indexOf(columnIdx);
			// 	this.selectedColumns.splice(selectedColumnPos, 1);
			// 	this.selectedColumns.push(maxColumnIdx);
			// }
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

		clearSelectedColumns() {
			this.selectedColumns.forEach(columnIdx => {
				this.clearColumn(columnIdx);
			});
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

			this.addTransaction('insert', 'dataset_row', new Model(newRow));

			this.dataset.columns.forEach((column, columnIdx) => {
				this.insertCell(rowIdx, columnIdx);
			});
		},

		removeSelectedRows() {

			this.selectedRows.sort((a, b) => a -b).reverse(); // Reverse order so removing from array doesn't corrupt..
			this.selectedRows.forEach(rowIdx => {
				this.removeRow(rowIdx);
			});
			this.selectedRows.splice(0, this.selectedRows.length);

			// Update selection if necessary
			// const maxRowIdx = this.dataset.rows.length - 1;
			// if (rowIdx > maxRowIdx) {
			// 	const selectedRowPos = this.selectedRows.indexOf(rowIdx);
			// 	this.selectedRows.splice(selectedRowPos, 1);
			// 	this.selectedRows.push(maxRowIdx);
			// }
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

			let newCell = cell ? cell : new DatasetCell(cellProps);
			this.dataset.rows[rowIdx].cells.splice(columnIdx, 0, newCell);

			this.addTransaction('insert', 'dataset_cell', new Model(newCell), relation);
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

		clearSelectedCells() {
			this.selectedCells.forEach(cellIdx => {
				this.clearCell(...cellIdx.split('_'));
			});
		},

		clearCell(rowIdx, columnIdx) {
			this.dataset.rows[rowIdx].cells[columnIdx] = new DatasetCell();
		},

		editCell(rowIdx, columnIdx) {
			this.lastEditCell = { rowIdx, columnIdx };
			const cellRef = this.$refs['cell_' + rowIdx + '_' + columnIdx][0];
			cellRef.edit();
		},

		isEditingCell(rowIdx, columnIdx) {
			return this.lastEditCell.rowIdx === rowIdx && this.lastEditCell.columnIdx === columnIdx;
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

		addTransaction(action, collection, model, relation = {}) {

			const props = {};
			Object.assign(props, {
				action,
				collection,
				guid: model.guid,
				data: model.flat(false),
			});
			if (Object.keys(relation).length > 0) {
				Object.assign(props, {
					relation
				});
			}

			this.transactions.push(new Transaction(props));

			this.listenToResize();
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

			this.listenToResize();
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

			this.listenToResize();
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
		},

		getEntityId(type, rowIdx, columnIdx) {
			let id = null;
			switch (type) {
				case 'row': id = this.dataset.rows[rowIdx].id; break;
				case 'column': id = this.dataset.columns[columnIdx].id; break;
				case 'cell': id = this.dataset.rows[rowIdx].cells[columnIdx].id; break;
			}
			return id;
		},

		comment(type, rowIdx, columnIdx) {
			const id = this.getEntityId(type, rowIdx, columnIdx);
			this.$comments.open(id, 'dataset_' + type)
		},

		canComment(type, rowIdx, columnIdx) {
			switch (type) {
				case 'row': return this.selectedRows.length === 1 && this.getEntityId(type, rowIdx, columnIdx) > 0; break;
				case 'column': return this.selectedColumns.length === 1 && this.getEntityId(type, rowIdx, columnIdx) > 0; break;
				case 'cell': return this.selectedCells.length === 1 && this.getEntityId(type, rowIdx, columnIdx) > 0; break;
			}
		},
	},

	computed: {

		selected() {
			const rows = [this.firstSelected.rowIdx, this.lastSelected.rowIdx].sort((a, b) => a -b);
			const columns = [this.firstSelected.columnIdx, this.lastSelected.columnIdx].sort((a, b) => a -b);
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
		},

		menuGroups() {
			return {
				row: {
					items: !this.menu.visible ? [] : [
						{ text: this.$t('dataset.data.rowMenu.insertRowAbove'), icon: 'mdi-table-row-plus-before', disabled: () => this.menu.type === 'column', click: (event) => this.insertRow(this.lastSelected.rowIdx) },
						{ text: this.$t('dataset.data.rowMenu.insertRowBelow'), icon: 'mdi-table-row-plus-after', disabled: () => this.menu.type === 'column', click: (event) => this.insertRow(this.lastSelected.rowIdx + 1) },
						{},
						{ text: this.$t('dataset.data.rowMenu.removeRow' + (this.selectedRows.length > 1 ? 's' : ''), { total: this.selectedRows.length }), icon: 'mdi-table-row-remove', disabled: () => this.menu.type === 'column', click: (event) => this.removeSelectedRows() },
						{},
						{ text: this.$t('dataset.data.rowMenu.comment'), icon: 'mdi-comment-plus-outline', disabled: () => !this.canComment('row', this.lastSelected.rowIdx, this.lastSelected.columnIdx), click: (event) => this.comment('row', this.lastSelected.rowIdx, this.lastSelected.columnIdx) },
					],
				},
				column: {
					items: !this.menu.visible ? [] : [
						{ text: this.$t('dataset.data.columnMenu.isRequired' + (this.selectedColumns.length > 1 ? 'Plural' : ''), { total: this.selectedColumns.length }), icon: () => this.dataset.columns[this.firstSelected.columnIdx].is_required ? 'mdi-check' : 'mdi-blank', disabled: () => this.lastSelected.type === 'row', click: (event) => {
							const wasSelected = this.dataset.columns[this.firstSelected.columnIdx].is_required;
							this.selectedColumns.forEach(columnIdx => {
								this.dataset.columns[columnIdx].is_required = !wasSelected;
							});
						} },
						{ text: this.$t('dataset.data.columnMenu.type'), icon: 'mdi-widgets', disabled: () => this.menu.type !== 'row', childs: [
								{ text: this.$t('dataset.data.columnMenu.text'), icon: 'mdi-cursor-text', disabled: () => this.menu.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.number'), icon: 'mdi-numeric-1-box-outline', disabled: () => this.menu.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.date'), icon: 'mdi-calendar-month', disabled: () => this.menu.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.boolean'), icon: 'mdi-toggle-switch', disabled: () => this.menu.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.list'), icon: 'mdi-format-list-bulleted', disabled: () => this.menu.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.recording'), icon: 'mdi-record-rec', disabled: () => this.menu.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.audio'), icon: 'mdi-file-music-outline', disabled: () => this.menu.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.file'), icon: 'mdi-file-outline', disabled: () => this.menu.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
								{ text: this.$t('dataset.data.columnMenu.types.image'), icon: 'mdi-file-image-outline', disabled: () => this.menu.type === 'column', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
							] },
						{},
						{ text: this.$t('dataset.data.columnMenu.insertColumnLeft'), icon: 'mdi-table-column-plus-before', disabled: () => this.menu.type === 'row', click: (event) => this.insertColumn(this.lastSelected.columnIdx) },
						{ text: this.$t('dataset.data.columnMenu.insertColumnRight'), icon: 'mdi-table-column-plus-after', disabled: () => this.menu.type === 'row', click: (event) => this.insertColumn(this.lastSelected.columnIdx + 1) },
						{},
						{ text: this.$t('dataset.data.columnMenu.clearColumn' + (this.selectedColumns.length > 1 ? 's' : ''), { total: this.selectedColumns.length }), icon: 'mdi-close', disabled: () => this.menu.type === 'row', click: (event) => this.clearSelectedColumns() },
						{ text: this.$t('dataset.data.columnMenu.removeColumn' + (this.selectedColumns.length > 1 ? 's' : ''), { total: this.selectedColumns.length }), icon: 'mdi-table-column-remove', disabled: () => this.menu.type === 'row', click: (event) => this.removeSelectedColumns() },
						{},
						{ text: this.$t('dataset.data.columnMenu.comment'), icon: 'mdi-comment-plus-outline', disabled: () => !this.canComment('column', this.lastSelected.rowIdx, this.lastSelected.columnIdx), click: (event) => this.comment('column', this.lastSelected.rowIdx, this.lastSelected.columnIdx) },
					],
				},
				cell: {
					items: !this.menu.visible ? [] : [
						{ text: this.$t('dataset.data.cellMenu.clearCell' + (this.selectedCells.length > 1 ? 's' : ''), { total: this.selectedCells.length }), icon: 'mdi-close', disabled: () => this.menu.type === 'row', click: (event) => this.clearSelectedCells() },
						{},
						{ text: this.$t('dataset.data.cellMenu.comment'), icon: 'mdi-comment-plus-outline', disabled: () => !this.canComment('cell', this.lastSelected.rowIdx, this.lastSelected.columnIdx), click: (event) => this.comment('cell', this.lastSelected.rowIdx, this.lastSelected.columnIdx) },
					],
				},
			};
		},
	},

	data() {
		return {
			sorting: {
				created_on: 'desc',
			},
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
			headOffset: { y: 0, x: 0, top: 0, width: 0, columns: [], },
			statuses: [
				{ text: this.$t('dataset.data.statuses.draft'), value: 'draft' },
				{ text: this.$t('dataset.data.statuses.published'), value: 'published' },
				{ text: this.$t('dataset.data.statuses.deleted'), value: 'deleted' },
			],
			selectedColumns: [],
			selectedRows: [],
			selectedCells: [],
			highlightedRows: {},
			highlightedColumns: {},
			highlightedCells: {},
			dragState: {
				enabled: false,
			},
			menu: {
				visible: false,
				x: 0, y: 0,
				type: null,
				group: 'column',
			}
		}
	},

	watch: {

		selectedRows: function() {
			this.syncHighlighter();
		},

		selectedColumns: function() {
			this.syncHighlighter();
		},

		selectedCells: function() {
			this.syncHighlighter();
		},
	}
});
</script>

<style lang="scss" scoped>

	[tabindex] {
		outline: 0;
	}

	.scrollable {
		overflow: auto;
	}

	.table-container {
		position: relative;

		.move-handler {
			position: absolute;
			pointer-events: none;
			background-color: rgba(0, 0, 0, 0.1);
			z-index: 1;
		}
	}

	.table {
		border-collapse: collapse;
		font-size: 0.8rem;
		user-select: none;

		::v-deep input {
			font-size: 0.8rem;
		}

		thead.fixed {
			position: fixed;
			z-index: 5;
			background-color: white;
		}

		thead {

			th span.name:hover {
				text-decoration: underline;
				cursor: pointer;
			}
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

		td.last-highlighted {
			position: relative;

			&::after {
				content: "";
				pointer-events: none;
				position: absolute;
				outline: rgba(0, 0, 0, 0.5) dotted 3px;
				outline-offset: -2px;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				z-index: 2;
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

		tbody tr td {
			cursor: cell;
		}

		tr.highlighted th,
		tr > th.highlighted {
			background-color: rgba(142, 176, 231, 0.66);
		}
		tr.highlighted td,
		tr > td.highlighted {
			background-color: rgba(142, 176, 231, 0.2);
		}
	}
</style>
