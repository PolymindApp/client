<template>
	<div @keydown="handleKeyDown" @keyup="handleKeyUp" tabindex="0" class="fill-height">

		<ContextualMenu :items="menuGroups[menu.group].items" :visible.sync="menu.visible" :position-x="menu.x" :position-y="menu.y" absolute offset-y />

		<input ref="pasteInput" type="text" class="paste-input" @paste="handlePaste" />
<!--		<div ref="dynamicStyle"></div>-->

<!--		<div v-if="false" class="optimisationDebug">-->
<!--			<div class="row":style="{-->
<!--			width: `calc(${dataset.rows[0].cells.length} * 5rem)`,-->
<!--			height: `calc(2rem)`,-->
<!--		}" :key="rowIdx" v-for="(row, rowIdx) in dataset.rows">-->
<!--				<div class="cell" :key="columnIdx" v-for="(column, columnIdx) in dataset.columns" :style="{-->
<!--				top: `calc(${rowIdx} * 2rem)`,-->
<!--				left: `calc(${columnIdx} * 5rem)`,-->
<!--			 }" :class="{-->
<!--				cell: true,-->
<!--				grow: true,-->
<!--			}" @contextmenu.stop.prevent="openMenu($event, 'cell', 'cell', rowIdx, columnIdx)" @dblclick.stop="editCell(rowIdx, columnIdx)" @mousedown="handleMouseDown($event, 'cell', rowIdx, columnIdx)" @mouseenter="handleMouseEnter($event, 'cell', rowIdx, columnIdx)" @mouseup="handleMouseUp($event, 'cell', rowIdx, columnIdx)" :ref="'td_' + rowIdx + '_' + columnIdx">-->
<!--					test-->
<!--					&lt;!&ndash;				<DataType :ref="'cell_' + rowIdx + '_' + columnIdx " :type="column.type" :items="dataset.columns[columnIdx].list_items" :value="row.cells[columnIdx][column.type]" :id="row.cells[columnIdx].id" collection="dataset_cell" @update="handleDataUpdate($event, (value) => { row.cells[columnIdx][column.type] = value })" @blur="handleBlurDataType" @tab="tabCell" />&ndash;&gt;-->
<!--				</div>-->
<!--			</div>-->
<!--		</div>-->


		<!-- ALL SELECTED -->
		<v-snackbar v-model="isAllSelectedSnack">
			<v-icon class="white--text" left>mdi-check</v-icon>
			{{$t('snackbar.allSelected')}}
			<v-btn text @click="isAllSelectedSnack = false">
				{{$t('modal.close')}}
			</v-btn>
		</v-snackbar>

		<div v-if="true" class="table-container" ref="container">
			<div class="move-handler" ref="moveHandler" v-show="dragState.enabled"></div>

			<table ref="table" :class="{
				'table w-100 white': true,
				'dragging': dragState.enabled,
				'animate': animate.swap || animate.move
			}">
				<thead ref="thead" :style="{
					top: headOffset.top + 'px',
					width: headOffset.width + 'px',
				}">
				<tr>
					<th style="width: 2rem" class="shrink text-no-wrap default text-center">
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-btn @click="selectAll()" v-on="on" :disabled="isAllSelected" icon x-small>
									<v-icon x-small>mdi-network-strength-4</v-icon>
								</v-btn>
							</template>
							<span v-text="$t('dataset.data.tooltip.selectAll')"></span>
						</v-tooltip>
					</th>
					<th style="width: 6rem" class="shrink text-no-wrap default">
						<v-icon x-small left>mdi-state-machine</v-icon>
						<span @mousedown.stop="sort($event, 'status')" @mouseup.stop class="name" v-text="$t('dataset.data.status')"></span>
						<v-icon v-if="sorting.status === 'desc'" class="mx-2" small>mdi-sort-descending</v-icon>
						<v-icon v-else-if="sorting.status === 'asc'" class="mx-2" small>mdi-sort-ascending</v-icon>
						<v-icon v-else class="mx-2" small>mdi-blank</v-icon>
					</th>
					<th :ref="'column_' + columnIdx" @dblclick="editColumn(columnIdx)" @contextmenu.stop.prevent="openMenu($event, 'column', 'column', null, columnIdx)" @mousedown="handleMouseDown($event, 'column', undefined, columnIdx)" @mouseenter="handleMouseEnter($event, 'column', firstSelected.rowIdx, columnIdx)" @mouseup="handleMouseUp($event, 'column', firstSelected.rowIdx, columnIdx)" :class="{
						grow: true,
						highlighted: selectedColumns.indexOf(columnIdx) !== -1,
						'last-highlighted': lastSelected.type === 'column' && lastSelected.columnIdx === columnIdx && selectedColumns.length !== 1,
						'has-cell': selectedCellsColumns.indexOf(columnIdx) !== -1,
						droppable: dragState.dropIndex === columnIdx && dragState.type === 'column',
					}" :style="{
						width: 'calc(28rem - ' + (100 / dataset.columns.length) + '%)',
					}" :key="columnIdx" v-for="(column, columnIdx) in dataset.columns">

						<div v-if="highlightedColumns[columnIdx]" :class="{
							'highlight-selector top': true,
							left: highlightedColumns[columnIdx].left,
							right: highlightedColumns[columnIdx].right,
						}"></div>

						<div class="d-flex align-center">
							<div class="d-flex align-center" style="flex: 1">
								<DataType :class="{ 'w-100': editingColumnName === columnIdx }" :ref="'column_input_' + columnIdx" type="text" :value="column.name" @blur="handleBlurDataType" @tab="tabColumn" @update="handleDataUpdate($event, (value) => { column.name = value; })">
									<template slot="read">
										<span @dblclick.stop @mousedown.stop="sort($event, columnIdx)" @mouseup.stop class="name" v-text="column.name"></span>
									</template>
								</DataType>
								<span v-if="editingColumnName !== columnIdx && column.is_required" class="error--text mx-2">*</span>
							</div>
							<div>
								<v-icon v-if="sorting[columnIdx] === 'desc'" class="mx-2" small>mdi-sort-descending</v-icon>
								<v-icon v-else-if="sorting[columnIdx] === 'asc'" class="mx-2" small>mdi-sort-ascending</v-icon>
								<v-icon v-else-if="!sorting[columnIdx] && editingColumnName !== columnIdx" class="mx-2" small>mdi-blank</v-icon>
							</div>

							<v-btn @mousedown.stop @mouseup.stop @click.stop="openMenu($event, 'column', 'column', null, columnIdx)" tabIndex="-1" class="ml-2 column-menu" icon x-small>
								<v-icon>mdi-chevron-down</v-icon>
							</v-btn>
						</div>
					</th>
					<th style="width: 10rem" class="shrink text-no-wrap default">
						<v-icon x-small left>mdi-account</v-icon>
						<span @mousedown.stop="sort($event, 'created_by', (vm, created_by) => {
							return vm.$options.filters.userScreenName(created_by);
						})" @mouseup.stop class="name" v-text="$t('dataset.data.created_by')"></span>
						<v-icon v-if="sorting.created_by === 'desc'" class="mx-2" small>mdi-sort-descending</v-icon>
						<v-icon v-else-if="sorting.created_by === 'asc'" class="mx-2" small>mdi-sort-ascending</v-icon>
						<v-icon v-else class="mx-2" small>mdi-blank</v-icon>
					</th>
					<th style="width: 10rem" class="shrink text-no-wrap default">
						<v-icon x-small left>mdi-calendar-month</v-icon>
						<span @mousedown.stop="sort($event, 'created_on')" @mouseup.stop class="name" v-text="$t('dataset.data.created_on')"></span>
						<v-icon v-if="sorting.created_on === 'desc'" class="mx-2" small>mdi-sort-descending</v-icon>
						<v-icon v-else-if="sorting.created_on === 'asc'" class="mx-2" small>mdi-sort-ascending</v-icon>
						<v-icon v-else class="mx-2" small>mdi-blank</v-icon>
					</th>
				</tr>
				</thead>
				<tbody ref="tbody">
				<tr :ref="'row_' + rowIdx" :class="{
					highlighted: selectedRows.indexOf(rowIdx) !== -1,
					'last-highlighted': lastSelected.type === 'row' && lastSelected.rowIdx === rowIdx && selectedRows.length !== 1,
					droppable: dragState.dropIndex === rowIdx && dragState.type === 'row',
				}" :key="rowIdx" v-for="(row, rowIdx) in dataset.rows">
					<th @contextmenu.stop.prevent="openMenu($event, 'row', 'row', rowIdx, null)" @mousedown="handleMouseDown($event, 'row', rowIdx)" @mouseenter="handleMouseEnter($event, 'row', rowIdx, firstSelected.columnIdx)" @mouseup="handleMouseUp($event, 'row', rowIdx, firstSelected.columnIdx)" :class="{
						'default shrink text-center': true,
						'has-cell': selectedCellsRows.indexOf(rowIdx) !== -1,
					}">
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
					<td @contextmenu.stop.prevent="openMenu($event, 'row', 'row', rowIdx, null)" class="shrink default" @dblclick.stop="editStatus(rowIdx)" @mousedown="handleMouseDown($event, 'row', rowIdx)" @mouseenter="handleMouseEnter($event, 'row', rowIdx)" @mouseup="handleMouseUp($event, 'row', rowIdx)">
						<div v-if="highlightedRows[rowIdx]" :class="{
							'highlight-selector': true,
							'top': highlightedRows[rowIdx].top,
							'bottom': highlightedRows[rowIdx].bottom,
						}"></div>
						<DataType :ref="'row_status_' + rowIdx" type="list" :items="statuses" :value="row.status" @update="row.status = $event" />
					</td>
					<td @contextmenu.stop.prevent="openMenu($event, 'cell', 'cell', rowIdx, columnIdx)" @dblclick.stop="editCell(rowIdx, columnIdx)" @mousedown="handleMouseDown($event, 'cell', rowIdx, columnIdx)" @mouseenter="handleMouseEnter($event, 'cell', rowIdx, columnIdx)" @mouseup="handleMouseUp($event, 'cell', rowIdx, columnIdx)" :ref="'td_' + rowIdx + '_' + columnIdx" :class="{
						grow: true,
						droppable: dragState.dropIndex === columnIdx && dragState.type === 'column',
						'last-highlighted': lastSelected.type === 'cell' && (lastSelected.rowIdx === rowIdx && lastSelected.columnIdx === columnIdx && selectedCells.length !== 1),
						invalid: !isCellValid(rowIdx, columnIdx),
						highlighted: selectedCells.indexOf(rowIdx + '_' + columnIdx) !== -1 || selectedColumns.indexOf(columnIdx) !== -1
					}" :key="columnIdx" v-for="(column, columnIdx) in dataset.columns">
						<div v-if="highlightedCells[rowIdx + '_' + columnIdx]" :class="{
							'highlight-selector': true,
							'top': highlightedCells[rowIdx + '_' + columnIdx].top,
							'right': highlightedCells[rowIdx + '_' + columnIdx].right,
							'bottom': highlightedCells[rowIdx + '_' + columnIdx].bottom,
							'left': highlightedCells[rowIdx + '_' + columnIdx].left,
						}">
							<div class="highlight-extender" @mousedown.stop="handleMouseDown($event, 'cell', rowIdx, columnIdx, true)" v-if="lastSelected.rowIdx === rowIdx && lastSelected.columnIdx === columnIdx"></div>
						</div>
						<DataType :ref="'cell_' + rowIdx + '_' + columnIdx " :type="column.type" :items="dataset.columns[columnIdx].list_items" :value="row.cells[columnIdx][column.type]" :id="row.cells[columnIdx].id" collection="dataset_cell" @update="handleDataUpdate($event, (value) => { row.cells[columnIdx][column.type] = value })" @blur="handleBlurDataType" @tab="tabCell" />
					</td>
					<td @contextmenu.stop.prevent="openMenu($event, 'row', 'row', rowIdx, null)" class="default shrink text-no-wrap" @mousedown="handleMouseDown($event, 'row', rowIdx)" @mouseenter="handleMouseEnter($event, 'row', rowIdx)" @mouseup="handleMouseUp($event, 'row', rowIdx)">
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
					<td @contextmenu.stop.prevent="openMenu($event, 'row', 'row', rowIdx, null)" class="default shrink text-no-wrap" @mousedown="handleMouseDown($event, 'row', rowIdx)" @mouseenter="handleMouseEnter($event, 'row', rowIdx)" @mouseup="handleMouseUp($event, 'row', rowIdx)">
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

		<div v-if="false" class="pa-2">
			<v-row no-gutters>
				<v-col cols="3">
					<strong>Bugs:</strong>
					<ul>
						<li>(!!) very slow</li>
						<li>while editing, stop moving between cells (keydown)</li>
						<li>ctrl+move row/column</li>
					</ul>
					<br>
					<strong>Nice to have:</strong>
					<ul>
						<li>boolean reordering animation glitch fix</li>
					</ul>
				</v-col>
				<v-col cols="3">
					<strong>To develop:</strong>
					<ul>
						<li>ESC => close comment panel</li>
						<li>search</li>
						<li>import/export file</li>
						<li>multiselect typing</li>
						<li>copy-paste</li>
						<li>handler replicator</li>
						<li>multiple drag & drop</li>
						<li>resize</li>
						<li>undo/redo</li>
						<li>fixed header</li>
						<li>move down from column -> select cell, move up from cell -> edit column (same behavior with rows)</li>
					</ul>
				</v-col>
				<v-col cols="3">
					<strong>To test:</strong>
					<ul>
						<li>transaction save/load</li>
						<li>selectedCells must highlight column/row</li>
						<li>row status => dblclick cell select field</li>
						<li>mousehover row</li>
						<li>on tab cell/column, select cell/column</li>
						<li>move column sort index (other items)</li>
						<li>close type nested menu</li>
					</ul>
					<br>
					<strong>Projects:</strong>
					<ul>
						<li>Spread Sheet</li>
						<li>Workflow Manager</li>
						<li>Form Manager</li>
						<li>Layout Manager</li>
					</ul>
				</v-col>
				<v-col cols="3">
					<strong>Debug:</strong>
					<ul>
						<li v-if="dataset.rows[0]">
							<strong>Cells:</strong>
							{{ dataset.rows.length * (dataset.rows[0].cells.length + 3) }} total
							/ {{ dataset.rows.length * (dataset.rows[0].cells.length) }} editables
							/ {{ selectedCells.length }} selected
						</li>
						<li>
							<strong>First selected:</strong>
							{{ firstSelected }}
						</li>
						<li>
							<strong>Last selected:</strong>
							{{ lastSelected }}
						</li>
					</ul>
<!--					<br>-->
<!--					<strong>Transactions ({{ calculateTransactions().length }}):</strong>-->
<!--					<pre>{{ calculateTransactions() }}</pre>-->
				</v-col>
			</v-row>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import DataType from "../../../components/DataType";
	import UserAvatar from "../../../components/UserAvatar";
	import Dataset from "../../../models/Dataset";
	import DatasetColumn from "../../../models/DatasetColumn";
	import DatasetRow from "../../../models/DatasetRow";
	import DatasetCell from "../../../models/DatasetCell";
	import Transaction from "../../../models/Transaction";
	import Model from "../../../models/Model";
	import ContextualMenu from "../../../components/ContextualMenu";

	const dragState = {};

	export default Vue.extend({

		props: {
			dataset: {
				type: Object,
				default: new Dataset(),
			},
			originalDataset: {
				type: Object,
				default: new Dataset(),
			},
			formErrors: {
				type: Array,
				default: (() => []),
			},
			scrollingRef: {

			},
		},

		components: { DataType, UserAvatar, ContextualMenu },

		mounted() {

			if (this.scrollingRef) {
				this.scrollingRef.$el.addEventListener('scroll', this.listenToScrolling);
			}

			window.addEventListener('resize', this.listenToResize);
			this.listenToResize();

			// FOR DEBUGGING PURPOSES..
			// setTimeout(() => {
			// 	if (this.dataset.columns.length < 5) {
			// 		for (let i = 0; i < (30 - 3); i++) {
			// 			this.insertColumn(0);
			// 		}
			// 		for (let i = 0; i < (50 - 2); i++) {
			// 			this.insertRow(0);
			// 		}
			// 	}
			// }, 3000);
		},

		destroyed() {
			window.removeEventListener('resize', this.listenToResize);
			this.scrollingRef.$el.removeEventListener('scroll', this.listenToScrolling);
		},

		methods: {

			handleDataUpdate(event, callback = () => {}) {
				callback(event);
				this.updateDataset();
			},

			handleCopy(event) {

				if (this.this.selectedCells.length === 0) {
					return;
				}

				let minRowIdx = null;
				let minColumnIdx = null;
				let maxRowIdx = null;
				let maxColumnIdx = null;
				this.selectedCells.forEach(cell => {
					const [ rowIdx, columnIdx ] = cell.split('_');
					minRowIdx = (rowIdx < minRowIdx || minRowIdx === null) ? rowIdx : minRowIdx;
					minColumnIdx = (columnIdx < minColumnIdx || minColumnIdx === null) ? columnIdx : minColumnIdx;
					maxRowIdx = (rowIdx > maxRowIdx || maxRowIdx === null) ? rowIdx : maxRowIdx;
					maxColumnIdx = (columnIdx > maxColumnIdx || maxColumnIdx === null) ? columnIdx : maxColumnIdx;
				});

				let lines = [];
				for (let x = minRowIdx; x < maxRowIdx; x++) {
					if (!lines[x]) {
						lines[x] = [];
					}
					for (let y = minColumnIdx; y < maxColumnIdx; y++) {
						const column = this.dataset.columns[y];
						const cell = this.dataset.rows[x].cells[y];
						lines[x].push(cell ? cell[column.type] : '');
					}
					lines[x] = lines[x].join("\t");
				}

				event.clipboardData.setData('text/plain', lines.join("\r\n"));
				event.preventDefault();
			},

			handlePaste(event) {
				const text = event.clipboardData.getData('text/plain');
				const lines = text.split("\r\n");
				let data = [];
				lines.forEach(line => {
					if (!line) {
						return;
					}
					const cells = line.split("\t");
					data = data.concat(cells);
				});
				if (data.length === this.selectedCells.length) {
					this.selectedCells.forEach((selectedCell, index) => {
						const [ rowIdx, columnIdx ] = selectedCell.split('_');
						const column = this.dataset.columns[columnIdx];
						const cell = this.dataset.rows[rowIdx].cells[columnIdx];
						cell[column.type] = data[index];
					});
				} else {
					// this.firstSelected.columnIdx
				}
			},

			handleBlurDataType(event, callback = () => {}) {
				this.editingColumnName = null;
				callback();
			},

			handleDragStart(event, type, rowIdx, columnIdx) {

				const element = type === 'column'
						? this.$refs['column_' + columnIdx][this.headOffset.headIdx]
						: this.$refs['row_' + rowIdx][0];
				const thead = this.$refs.thead;

				Object.assign(dragState, {
					originalTop: type === 'column' ? element.offsetTop + element.offsetHeight : element.offsetTop,
					top: type === 'column' ? element.offsetTop + element.offsetHeight : element.offsetTop,
					originalLeft: element.offsetLeft,
					originalClientY: event.clientY,
					originalClientX: event.clientX,
					left: element.offsetLeft,
					width: type === 'column' ? element.offsetWidth : this.$refs.container.offsetWidth,
					height: type === 'column' ? this.$refs.container.offsetHeight - thead.offsetHeight : element.offsetHeight,
				});
				Object.assign(this.dragState, {
					enabled: true, dropIndex: null,
					type, rowIdx, columnIdx,
				});

				document.addEventListener('mousemove', this.handleDragMove);
				document.addEventListener('mouseup', this.handleDrop);

				if (this.dragState.type === 'row') {
					dragState.rowsSize = [];
					this.dataset.rows.forEach((row, rowIdx) => {
						const el = this.$refs['row_' + rowIdx][0];
						const bb = el.getBoundingClientRect();
						dragState.rowsSize.push([
							bb.top,
							bb.top + (bb.height / 2),
							bb.top + bb.height,
						]);
					});
				} else if (this.dragState.type === 'column') {
					dragState.columnsSize = [];
					this.dataset.columns.forEach((column, columnIdx) => {
						const el = this.$refs['column_' + columnIdx][this.headOffset.headIdx];
						const bb = el.getBoundingClientRect();
						dragState.columnsSize.push([
							bb.left,
							bb.left + (bb.width / 2),
							bb.left + bb.width,
						]);
					});
				}

				Object.assign(this.$refs.moveHandler.style, {
					top: dragState.top + 'px',
					left: dragState.left + 'px',
				});
				this.applyDragState(event);
			},

			handleDragMove(event) {

				if(this.dragState.lastAnimationFrame) {
					cancelAnimationFrame(this.dragState.lastAnimationFrame);
				}

				this.dragState.lastAnimationFrame = window.requestAnimationFrame(() => {
					this.applyDragState(event);
				});
			},

			handleDrop(event) {

				if (this.dragState.dropIndex !== null) {
					const dropIdx = this.dragState.dropIndex;
					if (this.dragState.type === 'row' && dropIdx !== this.dragState.rowIdx) {
						const rowIdx = this.dragState.rowIdx;
						this.moveRow(rowIdx, dropIdx, true, () => {
							const pos = this.selectedRows.indexOf(rowIdx);
							if (pos !== -1) {
								this.selectedRows.splice(pos, 1, dropIdx);
							}
						});
					} else if (this.dragState.type === 'column' && dropIdx !== this.dragState.columnIdx) {
						const columnIdx = this.dragState.columnIdx;
						this.moveColumn(columnIdx, dropIdx, true, () => {
							const pos = this.selectedColumns.indexOf(columnIdx);
							if (pos !== -1) {
								this.selectedColumns.splice(pos, 1, dropIdx);
							}
						});
					}
				}

				Object.assign(this.dragState, {
					enabled: false, dropIndex: null, type: null,
					rowIdx: null, columnIdx: null, lastAnimationFrame: null,
				});
				this.applyDragState(event);

				document.removeEventListener('mousemove', this.handleDragMove);
				document.removeEventListener('mouseup', this.handleDrop);

				this.$forceUpdate();
			},

			applyDragState(event) {

				let top = this.dragState.type === 'row' ? (event.clientY - dragState.originalClientY) + dragState.originalTop : 0;
				let left = this.dragState.type === 'column' ? (event.clientX - dragState.originalClientX) + dragState.originalLeft : 0;

				const thead = this.$refs.thead;
				const firstColumn = this.$refs['column_0'][this.headOffset.headIdx];
				const lastColumn = this.$refs['column_' + (this.dataset.columns.length - 1)][this.headOffset.headIdx];
				const minLeft = this.dragState.type === 'column' ? firstColumn.offsetLeft : 0;
				const minTop = thead.offsetHeight;
				const maxTop = this.$refs.container.offsetTop + this.$refs.container.offsetHeight - dragState.height;
				const maxLeft = this.dragState.type === 'column' ? lastColumn.offsetLeft + lastColumn.offsetWidth - dragState.width : this.$refs.container.offsetLeft + this.$refs.container.offsetWidth;

				top = top < minTop ? minTop : top > maxTop ? maxTop : top;
				left = left < minLeft ? minLeft : left > maxLeft ? maxLeft : left;

				switch (this.dragState.type) {
					case 'row': this.$refs.moveHandler.style.top = top + 'px'; break;
					case 'column': this.$refs.moveHandler.style.left = left + 'px'; break;
				}

				if (this.dragState.type === 'row') {
					for (let i = 0; i < dragState.rowsSize.length; i++) {
						const size = dragState.rowsSize[i];
						if (event.clientY >= size[0] && event.clientY < size[1] && this.dragState.dropIndex !== i) {
							this.dragState.dropIndex = i;
							break;
						} else if (event.clientY >= size[1] && event.clientY <= size[2] && this.dragState.dropIndex !== i) {
							this.dragState.dropIndex = i;
							break;
						}
					}
				} else if (this.dragState.type === 'column') {
					for (let i = 0; i < dragState.columnsSize.length; i++) {
						const size = dragState.columnsSize[i];
						if (event.clientX >= size[0] && event.clientX < size[1] && this.dragState.dropIndex !== i) {
							this.dragState.dropIndex = i;
							break;
						} else if (event.clientX >= size[1] && event.clientX <= size[2] && this.dragState.dropIndex !== i) {
							this.dragState.dropIndex = i;
							break;
						}
					}
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

					if(this.dragState.lastAnimationFrame) {
						cancelAnimationFrame(this.dragState.lastAnimationFrame);
					}

					this.dragState.lastAnimationFrame = window.requestAnimationFrame(() => {
						Object.assign(this.lastSelected, {
							type, rowIdx, columnIdx,
						});

						this.syncSelection(event, this.lastSelected);
					});
				}
			},

			handleMouseUp(event, type, rowIdx, columnIdx) {

				if (event.button === 2 || (event.ctrlKey && this.firstSelected.type !== type) || this.dragState.enabled) { // Contextual button.. not handled
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

				this.focusOn(this.lastSelected.type, this.lastSelected.rowIdx, this.lastSelected.columnIdx);
			},

			handleKeyDown(event) {

				switch (this.lastSelected.type) {
					case 'row': this.handleRowKeyDown(event, this.lastSelected.rowIdx); break;
					case 'column': this.handleColumnKeyDown(event, this.lastSelected.columnIdx); break;
					case 'cell': this.handleCellKeyDown(event, this.lastSelected.rowIdx, this.lastSelected.columnIdx); break;
				}

				const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
				if (keys.indexOf(event.code) !== -1) {

					event.preventDefault();

					const maxRow = this.dataset.rows.length - 1;
					const maxColumn = this.dataset.columns.length - 1;
					const clonedFirstSelected = Object.assign({}, this.firstSelected);
					const clonedLastSelected = Object.assign({}, this.lastSelected);

					if (!event.shiftKey && !event.ctrlKey) {

						this.wasEnablingSelection = null;

						const values = [];
						switch (this.firstSelected.type) {
							case 'row':
								for (let i = 0; i < this.selectedRows.length; i++) {
									let rowIdx = this.selectedRows[i];

									switch (event.code) {
										case 'ArrowUp': rowIdx--; if (i === 0) { clonedFirstSelected.rowIdx--; clonedLastSelected.rowIdx--;} break;
										case 'ArrowDown': rowIdx++; if (i === 0) { clonedFirstSelected.rowIdx++; clonedLastSelected.rowIdx++;} break;
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

						let pos;

						switch (this.firstSelected.type) {
							case 'row':

								switch (event.code) {
									case 'ArrowUp': clonedLastSelected.rowIdx--; break;
									case 'ArrowDown': clonedLastSelected.rowIdx++; break;
								}

								if (clonedLastSelected.rowIdx < 0 || clonedLastSelected.rowIdx > maxRow) {
									return false;
								}

								Object.assign(this.lastSelected, clonedLastSelected);

								pos = this.selectedRows.indexOf(this.lastSelected.rowIdx);

								this.wasEnablingSelection = (this.wasEnablingSelection === null && pos === -1) ? true : false;

								if (pos === -1) {
									this.selectedRows.push(this.lastSelected.rowIdx);
								} else {
									this.selectedRows.splice(pos, 1);
								}

								break;
							case 'column':

								switch (event.code) {
									case 'ArrowLeft': clonedLastSelected.columnIdx--; break;
									case 'ArrowRight': clonedLastSelected.columnIdx++; break;
								}

								if (clonedLastSelected.columnIdx < 0 || clonedLastSelected.columnIdx > maxColumn) {
									return false;
								}

								Object.assign(this.lastSelected, clonedLastSelected);

								pos = this.selectedColumns.indexOf(this.lastSelected.columnIdx);

								this.wasEnablingSelection = (this.wasEnablingSelection === null && pos === -1) ? true : false;

								if (pos === -1) {
									this.selectedColumns.push(this.lastSelected.columnIdx);
								} else {
									this.selectedColumns.splice(pos, 1);
								}

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
								pos = this.selectedCells.indexOf(cellIdx);

								this.wasEnablingSelection = this.wasEnablingSelection === null ? pos === -1 : this.wasEnablingSelection;

								if (this.wasEnablingSelection && pos === -1) {
									this.selectedCells.push(cellIdx);
								} else if (!this.wasEnablingSelection && pos !== -1) {
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

					this.focusOn(this.lastSelected.type, this.lastSelected.rowIdx, this.lastSelected.columnIdx);

				} else if (event.code === 'Escape') {
					this.resetSelection();
				}
			},

			handleKeyUp(event) {

				switch (this.lastSelected.type) {
					case 'row': this.handleRowKeyUp(event, this.lastSelected.rowIdx); break;
					case 'column': this.handleColumnKeyUp(event, this.lastSelected.columnIdx); break;
					case 'cell': this.handleCellKeyUp(event, this.lastSelected.rowIdx, this.lastSelected.columnIdx); break;
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
						this.$refs.pasteInput.focus();
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

			focusOn(type, rowIdx, columnIdx) {
				switch (type) {
					case 'row': this.$refs['row_' + rowIdx][0].focus();break;
					case 'column': this.$refs['column_' + columnIdx][0].focus();break;
					case 'cell': this.$refs['td_' + rowIdx + '_' + columnIdx][0].focus(); break;
				}
			},

			selectAll() {
				this.selectedRows = [];
				this.selectedColumns = [];
				this.selectedCells = [];
				this.dataset.rows.forEach((row, rowIdx) => {
					this.dataset.columns.forEach((column, columnIdx) => {
						this.selectedCells.push(rowIdx + '_' + columnIdx);
					});
				});
				this.isAllSelectedSnack = true;
			},

			toggleRows(firstIdx, secondIdx, forceValue = null) {

				const ordered = [firstIdx, secondIdx].sort((a, b) => a - b);
				const first = ordered[0];
				const last = ordered[1];

				for (let i = first; i <= last; i++) {
					this.toggleRow(i, forceValue);
				}
			},

			toggleColumns(firstIdx, secondIdx, forceValue = null) {

				const ordered = [firstIdx, secondIdx].sort((a, b) => a - b);
				const first = ordered[0];
				const last = ordered[1];

				for (let i = first; i <= last; i++) {
					this.toggleColumn(i, forceValue);
				}
			},

			toggleCells(firstRowIdx, secondRowIdx, firstColumnIdx, secondColumnIdx, forceValue = null) {

				const orderedRows = [firstRowIdx, secondRowIdx].sort((a, b) => a - b);
				const firstRow = orderedRows[0];
				const lastRow = orderedRows[1];

				const orderedColumns = [firstColumnIdx, secondColumnIdx].sort((a, b) => a - b);
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

				const rowIndexes = this.selectedCells.map(selectedCell => { return parseInt(selectedCell.split('_')[0]); });
				this.selectedCellsRows = rowIndexes.filter((rowIdx, index) => { return rowIndexes.indexOf(rowIdx) == index; });

				const columnIndexes = this.selectedCells.map(selectedCell => { return parseInt(selectedCell.split('_')[1]); });
				this.selectedCellsColumns = columnIndexes.filter((columnIdx, index) => { return columnIndexes.indexOf(columnIdx) == index; });
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
// const thead = this.$refs.thead;
// const bb = thead.getBoundingClientRect();
// this.headOffset.top = bb.top + this.headOffset.y;

					// const mainThead = this.$refs.thead_main[0];
					// const fixedThead = this.$refs.thead_fixed[0];
					// if (mainThead) {
					// 	const bb = mainThead.getBoundingClientRect();
					// 	this.headOffset.top = bb.top + this.headOffset.y;
					// 	this.headOffset.width = bb.width + 1;
					//
					// 	mainThead.querySelectorAll('th').forEach((head, index) => {
					// 		this.headOffset.columns[index] = head.offsetWidth;
					// 	});
					// 	fixedThead.querySelectorAll('th').forEach((head, index) => {
					// 		head.style.width = this.headOffset.columns[index] + 'px';
					// 	});
					// }
				});
			},

			animateSwap(fromItems, toItems, callback = () => {}) {

				this.animate.swap = true;
				const fromBbs = [];
				const toBbs = [];

				fromItems.forEach((fromItem, index) => {
					const toItem = toItems[index];
					fromBbs.push(fromItem.getBoundingClientRect());
					toBbs.push(toItem.getBoundingClientRect());
				});

				setTimeout(() => {
					fromItems.forEach((fromItem, index) => {
						const toItem = toItems[index];
						fromItem.style.transform = 'translateX(' + (toBbs[index].left - fromBbs[index].left) + 'px) translateY(' + (toBbs[index].top - fromBbs[index].top) + 'px)';
						// fromItem.style.width = toBbs[index].width;
						// fromItem.style.height = toBbs[index].height;
						toItem.style.transform = 'translateX(' + (fromBbs[index].left - toBbs[index].left) + 'px) translateY(' + (fromBbs[index].top - toBbs[index].top) + 'px)';
						// toItem.style.width = fromBbs[index].width;
						// toItem.style.height = fromBbs[index].height;

						if (index === fromItems.length - 1) {
							setTimeout(() => {
								this.animate.swap = false;
								setTimeout(() => {
									fromItems.forEach((fromItem, index) => {
										const toItem = toItems[index];
										fromItem.style.transform = null;
										// fromItem.style.width = null;
										// fromItem.style.height = null;
										toItem.style.transform = null;
										// toItem.style.width = null;
										// toItem.style.height = null;
									});
									callback();
								});
							}, 300);
						}
					});
				});
			},

			animateMoveTo(fromItems, toItems, otherItems, callback = () => {}) {

				this.animate.move = true;
				const fromBbs = [];
				const toBbs = [];

				fromItems.forEach((fromItem, index) => {
					const toItem = toItems[index];
					fromBbs.push(fromItem.getBoundingClientRect());
					toBbs.push(toItem.getBoundingClientRect());
				});

				setTimeout(() => {
					fromItems.forEach((fromItem, index) => {
						const toItem = toItems[index];
						fromItem.style.transform = 'translateX(' + (toBbs[index].left - fromBbs[index].left) + 'px) translateY(' + (toBbs[index].top - fromBbs[index].top) + 'px)';

						if (toBbs[index].top === fromBbs[index].top) {
							const originWidth = fromItem.cellIndex > toItem.cellIndex ? fromBbs[index].width : -fromBbs[index].width;
							toItem.style.transform = 'translateX(' + originWidth + 'px)';
							otherItems.forEach(otherItem => {
								otherItem[index].style.transform = 'translateX(' + originWidth + 'px)';
							});
						} else {
							const originHeight = fromItem.parentElement.rowIndex > toItem.parentElement.rowIndex ? fromBbs[index].height : -fromBbs[index].height;
							toItem.style.transform = 'translateY(' + originHeight + 'px)';
							otherItems.forEach(otherItem => {
								otherItem[index].style.transform = 'translateY(' + originHeight + 'px)';
							});
						}

						if (index === fromItems.length - 1) {
							setTimeout(() => {
								this.animate.move = false;
								setTimeout(() => {
									fromItems.forEach((fromItem, index) => {
										const toItem = toItems[index];
										fromItem.style.transform = null;
										toItem.style.transform = null;
										otherItems.forEach(otherItem => {
											otherItem[index].style.transform = null;
										});
									});
									callback();
								});
							}, 300);
						}
					});
				});
			},

			sort(event, columnName, renderer = null) {

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

						const firstValue = ((renderer instanceof Function ? renderer(this, val1) : val1) + '');
						const secondValue = ((renderer instanceof Function ? renderer(this, val2) : val2) + '');

						const result = sorting === 'desc' ? firstValue.localeCompare(secondValue) : secondValue.localeCompare(firstValue);
						if (result === 0) {
							continue;
						}
						return result;
					}
				});
			},

			openMenu(event, group, type, rowIdx, columnIdx) {
				event.preventDefault();

				let x = event.clientX - 5;
				let y = event.clientY - 5;

				if (group === 'column' && event.currentTarget.classList.contains('column-menu')) {
					const targetBoundingBox = event.currentTarget.getBoundingClientRect();
					x = targetBoundingBox.left;
					y = targetBoundingBox.top;
				}

				if (!this.isSelected(type, rowIdx, columnIdx)) {
					this.resetSelection();
					this.toggle(type, rowIdx, columnIdx, true);
					Object.assign(this.firstSelected, {type, rowIdx, columnIdx});
				}

				Object.assign(this.menu, {x, y, group, type});
				Object.assign(this.lastSelected, {type, rowIdx, columnIdx});

				this.$nextTick(() => {
					setTimeout(() => { // Hack to fix reopening (open immediately from another location)
						this.menu.visible = true;
					});
				});
			},

			moveRow(fromIdx, toIdx, animate = false, callback = () => {}) {

				const onComplete = () => {
					this.dataset.rows.splice(toIdx, 0, this.dataset.rows.splice(fromIdx, 1)[0]);
					this.updateRowSort();
					callback();
					this.updateDataset();
				};

				if (animate) {
					const fromItems = this.$refs['row_' + fromIdx][0].querySelectorAll('th, td');
					const toItems = this.$refs['row_' + toIdx][0].querySelectorAll('th, td');
					const otherItems = [];
					const indexesInBetween = this.getIndexesInBetween(fromIdx, toIdx);
					indexesInBetween.forEach(index => {
						otherItems[index] = this.$refs['row_' + index][0].querySelectorAll('th, td');
					});
					this.animateMoveTo(fromItems, toItems, otherItems, onComplete);
				} else {
					onComplete();
				}
			},

			insertColumn(columnIdx, column = null) {
				let newColumn = column ? column : new DatasetColumn({
					dataset: this.dataset.id,
					created_by: this.$root.user,
				});

				this.dataset.columns.splice(columnIdx, 0, newColumn);

				this.dataset.rows.forEach((row, rowIdx) => {
					this.insertCell(rowIdx, columnIdx);
				});

				this.updateDataset();
			},

			removeSelectedColumns() {

				this.selectedColumns.sort((a, b) => a - b).reverse(); // Reverse order so removing from array doesn't corrupt..
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

				this.dataset.columns.splice(columnIdx, 1);

				this.dataset.rows.forEach((row, rowIdx) => {
					this.removeCell(rowIdx, columnIdx);
				});

				if (this.dataset.columns.length === 0) {
					this.insertColumn(0);
				}

				this.updateDataset();
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

				this.updateDataset();
			},

			moveColumn(fromIdx, toIdx, animate = false, callback = () => {}) {

				const onComplete = () => {
					const oldSorting = Object.assign({}, this.sorting);
					const oldSortingKeys = Object.keys(oldSorting);
					this.sorting = {};
					oldSortingKeys.forEach(key => {
						const keyInt = parseInt(key);
						const newKey = keyInt === fromIdx
								? toIdx
								: keyInt === toIdx
										? fromIdx
										: (fromIdx > toIdx) ? keyInt + 1 : keyInt - 1;

						this.sorting[newKey] = oldSorting[keyInt];
					});
					this.dataset.columns.splice(toIdx, 0, this.dataset.columns.splice(fromIdx, 1)[0]);
					this.updateColumnSort();
					this.dataset.rows.forEach(row => {
						this.moveCell(row, fromIdx, toIdx);
					});
					callback();
					this.updateDataset();
				};

				if (animate) {
					const firstColumn = this.$refs['column_' + fromIdx][this.headOffset.headIdx];
					const secondColumn = this.$refs['column_' + toIdx][this.headOffset.headIdx];
					const fromItems = [firstColumn];
					const toItems = [secondColumn];

					this.$refs.tbody.querySelectorAll('tr').forEach(tr => {
						fromItems.push(tr.childNodes[firstColumn.cellIndex]);
						toItems.push(tr.childNodes[secondColumn.cellIndex]);
					});

					const otherItems = [];
					const indexesInBetween = this.getIndexesInBetween(fromIdx, toIdx);
					const indexesInBetweenCellIndex = this.getIndexesInBetween(firstColumn.cellIndex, secondColumn.cellIndex);
					indexesInBetween.forEach((index, idx) => {
						const cellIndex = indexesInBetweenCellIndex[idx];
						const items = [this.$refs['column_' + index][this.headOffset.headIdx]];
						this.$refs.tbody.querySelectorAll('tr').forEach(tr => {
							items.push(tr.childNodes[cellIndex]);
						});
						otherItems[cellIndex] = items;
					});

					this.animateMoveTo(fromItems, toItems, otherItems, onComplete);
				} else {
					onComplete()
				}
			},

			insertRow(rowIdx, row = null) {
				let newRow = row ? row : new DatasetRow({
					dataset: this.dataset.id,
					created_by: this.$root.user,
				});

				this.dataset.rows.splice(rowIdx, 0, newRow);

				this.dataset.columns.forEach((column, columnIdx) => {
					this.insertCell(rowIdx, columnIdx);
				});

				this.updateDataset();
			},

			removeSelectedRows() {

				this.selectedRows.sort((a, b) => a - b).reverse(); // Reverse order so removing from array doesn't corrupt..
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

				for (let columnIdx = this.dataset.columns.length - 1; columnIdx >= 0 ; columnIdx--) {
					this.removeCell(rowIdx, columnIdx);
				}

				this.dataset.rows.splice(rowIdx, 1);

				if (this.dataset.rows.length === 0) {
					this.insertRow(0);
				}

				this.updateDataset();
			},

			updateRowSort() {
				this.dataset.rows.forEach((row, index) => {
					row.sort = index;
				});
			},

			editStatus(rowIdx) {
				this.$refs['row_status_' + rowIdx][0].edit();
			},

			updateColumnSort() {
				this.dataset.columns.forEach((column, index) => {
					column.sort = index;
				});
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

				this.updateDataset();
			},

			removeCell(rowIdx, columnIdx) {
				this.dataset.rows[rowIdx].cells.splice(columnIdx, 1);

				this.updateDataset();
			},

			clearSelectedCells() {
				this.selectedCells.forEach(cellIdx => {
					this.clearCell(...cellIdx.split('_'));
				});
			},

			clearCell(rowIdx, columnIdx) {

				const column = this.dataset.columns[columnIdx];
				this.dataset.rows[rowIdx].cells[columnIdx][column.type] = null;

				this.updateDataset();
			},

			moveCell(row, fromIdx, toIdx) {

				row.cells.splice(toIdx, 0, row.cells.splice(fromIdx, 1)[0]);

				this.updateDataset();
			},

			editCell(rowIdx, columnIdx) {
				this.lastEditCell = { rowIdx, columnIdx };
				const cellRef = this.$refs['cell_' + rowIdx + '_' + columnIdx][0];
				cellRef.edit();

				this.selectedCells = [rowIdx + '_' + columnIdx];
			},

			setColumnType(columnIdx, type = 'text') {
				this.dataset.columns[columnIdx].type = type;

				this.updateDataset();
			},

			columnIsType(columnIdx, type = 'text') {
				return this.dataset.columns[columnIdx].type === type;
			},

			editColumn(columnIdx) {
				this.editingColumnName = columnIdx;
				let ref = this.$refs['column_input_' + columnIdx];
				if (!ref) {
					return;
				}

				ref = ref[this.headOffset.headIdx];

				ref.edit();

				this.selectedColumns = [columnIdx];
			},

			isEditingCell(rowIdx, columnIdx) {
				return this.$refs['cell_' + rowIdx + '_' + columnIdx][0].isEditing();
			},

			tabCell(event) {

				event.preventDefault();

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

				setTimeout(() => { // Let blur event complete..
					this.editCell(rowIdx, columnIdx);
				});
			},

			tabColumn(event) {

				event.preventDefault();

				let columnIdx = this.editingColumnName;
				let maxColumn = this.dataset.columns.length - 1;

				event.shiftKey ? columnIdx-- : columnIdx++;

				if (columnIdx > maxColumn) {
					columnIdx = 0;
				} else if (columnIdx < 0) {
					columnIdx = maxColumn;
				}

				this.editColumn(columnIdx);
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

			getIndexesInBetween(fromIdx, toIdx, includeOriginal = false) {

				const result = [];
				const ordered = [fromIdx, toIdx].sort((a, b) => a - b);
				for (let i = ordered[0] + (includeOriginal ? 0 : 1); i < ordered[1] + (includeOriginal ? 1 : 0); i++) {
					result.push(i);
				}
				return result;
			},

			doIsAllSelected() {

				this.isAllSelected = (this.dataset.rows.length === this.selectedRows.length)
						|| (this.dataset.columns.length === this.selectedColumns.length)
						|| (this.isAllSelected = (this.dataset.rows[0].cells.length * this.dataset.rows.length) === this.selectedCells.length);
			},

			copy() {
				// var successful = document.execCommand('copy');
				this.$root.copiedToClipboard = true;
			},

			cut() {

			},

			paste() {

				this.updateDataset();
			},

			applyDynamicStyling() {

				let dynamicStyleRef = this.$refs.dynamicStyle;

				const style = document.createElement('style');
				const selectors = [];
				this.selectedCells.forEach(selectedCell => {
					let [ rowIdx, cellIdx ] = selectedCell.split('_');
					rowIdx = parseInt(rowIdx) + 1;
					cellIdx = parseInt(cellIdx) + 3;
					selectors.push(`tr:nth-child(0n + ${rowIdx}) td:nth-child(0n + ${cellIdx})`);
				});
				style.innerText += `
				${selectors.join(',')} {
					border-top: rgba(142, 176, 231, 1) solid 2px;
					border-right: rgba(142, 176, 231, 1) solid 2px;
					border-bottom: rgba(142, 176, 231, 1) solid 2px;
					border-left: rgba(142, 176, 231, 1) solid 2px;
				}
			`;

				dynamicStyleRef.innerHTML = '';
				dynamicStyleRef.appendChild(style);
			},

			updateDataset() {

				clearTimeout(this.updateDatasetTimeout);
				this.updateDatasetTimeout = setTimeout(() => {
					this.$emit('update:dataset', this.dataset);
				}, 250);
			}
		},

		computed: {

			selected() {
				const rows = [this.firstSelected.rowIdx, this.lastSelected.rowIdx].sort((a, b) => a - b);
				const columns = [this.firstSelected.columnIdx, this.lastSelected.columnIdx].sort((a, b) => a - b);
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
							{ text: this.$t('dataset.data.columnMenu.type'), icon: 'mdi-widgets', disabled: () => this.menu.type !== 'column', childs: [
									{ text: this.$t('dataset.data.columnMenu.types.text'), icon: 'mdi-cursor-text', isActive: () => this.columnIsType(this.lastSelected.columnIdx, 'text'), disabled: () => this.menu.type !== 'column', click: (event) => this.setColumnType(this.lastSelected.columnIdx, 'text') },
									{ text: this.$t('dataset.data.columnMenu.types.number'), icon: 'mdi-numeric-1-box-outline', isActive: () => this.columnIsType(this.lastSelected.columnIdx, 'number'), disabled: () => this.menu.type !== 'column', click: (event) => this.setColumnType(this.lastSelected.columnIdx, 'number') },
									{ text: this.$t('dataset.data.columnMenu.types.date'), icon: 'mdi-calendar-month', isActive: () => this.columnIsType(this.lastSelected.columnIdx, 'date'), disabled: () => this.menu.type !== 'column', click: (event) => this.setColumnType(this.lastSelected.columnIdx, 'date') },
									{ text: this.$t('dataset.data.columnMenu.types.boolean'), icon: 'mdi-toggle-switch', isActive: () => this.columnIsType(this.lastSelected.columnIdx, 'boolean'), disabled: () => this.menu.type !== 'column', click: (event) => this.setColumnType(this.lastSelected.columnIdx, 'boolean') },
									/*{ text: this.$t('dataset.data.columnMenu.types.list'), icon: 'mdi-format-list-bulleted', isActive: () => this.columnIsType(this.lastSelected.columnIdx, 'list'), disabled: () => this.menu.type !== 'column', click: (event) => this.setColumnType(this.lastSelected.columnIdx, 'list') },
									{ text: this.$t('dataset.data.columnMenu.types.audio'), icon: 'mdi-file-music-outline', isActive: () => this.columnIsType(this.lastSelected.columnIdx, 'audio'), disabled: () => this.menu.type !== 'column', click: (event) => this.setColumnType(this.lastSelected.columnIdx, 'audio') },
									{ text: this.$t('dataset.data.columnMenu.types.file'), icon: 'mdi-file-outline', isActive: () => this.columnIsType(this.lastSelected.columnIdx, 'file'), disabled: () => this.menu.type !== 'column', click: (event) => this.setColumnType(this.lastSelected.columnIdx, 'file') },
									{ text: this.$t('dataset.data.columnMenu.types.image'), icon: 'mdi-file-image-outline', isActive: () => this.columnIsType(this.lastSelected.columnIdx, 'image'), disabled: () => this.menu.type !== 'column', click: (event) => this.setColumnType(this.lastSelected.columnIdx, 'image') },
									{ text: this.$t('dataset.data.columnMenu.types.wysiwyg'), icon: 'mdi-format-textbox', isActive: () => this.columnIsType(this.lastSelected.columnIdx, 'wysiwyg'), disabled: () => this.menu.type !== 'column', click: (event) => this.setColumnType(this.lastSelected.columnIdx, 'wysiwyg') },*/
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
							{ text: this.$t('dataset.data.cellMenu.copy'), icon: 'mdi-content-copy', disabled: () => this.menu.type !== 'cell', click: (event) => this.copy() },
							{ text: this.$t('dataset.data.cellMenu.cut'), icon: 'mdi-content-cut', disabled: () => this.menu.type !== 'cell', click: (event) => this.cut() },
							{ text: this.$t('dataset.data.cellMenu.paste'), icon: 'mdi-content-paste', disabled: () => this.menu.type !== 'cell', click: (event) => this.paste() },
							{},
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
				updateDatasetTimeout: null,
				wasEnablingSelection: null,
				isAllSelected: false,
				isAllSelectedSnack: false,
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
				headOffset: { y: 0, x: 0, top: 0, width: 0, columns: [], headIdx: 0, },
				editingColumnName: null,
				statuses: [
					{ text: this.$t('dataset.data.statuses.draft'), value: 'draft' },
					{ text: this.$t('dataset.data.statuses.published'), value: 'published' },
					// { text: this.$t('dataset.data.statuses.deleted'), value: 'deleted' },
				],
				selectedColumns: [],
				selectedRows: [],
				selectedCells: [],
				selectedCellsRows: [],
				selectedCellsColumns: [],
				highlightedRows: {},
				highlightedColumns: {},
				highlightedCells: {},
				dragState: {
					enabled: false,
					dropIndex: null,
					type: null,
					rowIdx: null,
					columnIdx: null,
					lastAnimationFrame: null,
				},
				menu: {
					visible: false,
					x: 0, y: 0,
					type: null,
					group: 'column',
				},
				animate: { swap: false, move: false, },
			}
		},

		watch: {

			'dataset.rows': function(rows) {
				this.doIsAllSelected();
				this.updateRowSort();

				if (rows.length === 0) {
					this.insertRow(0);
				}
			},

			'dataset.columns': function(columns) {
				this.doIsAllSelected();
				this.updateColumnSort();

				if (columns.length === 0) {
					this.insertColumn(0);
				}
			},

			selectedRows: function(value) {
				this.syncHighlighter();
				this.doIsAllSelected();
			},

			selectedColumns: function(value) {
				this.syncHighlighter();
				this.doIsAllSelected();
			},

			selectedCells: function(value) {
				this.syncHighlighter();
				this.doIsAllSelected();
				// this.applyDynamicStyling();
			},
		}
	});
</script>

<style lang="scss" scoped>

	[tabindex] {
		outline: 0;
	}

	.optimisationDebug {
		.row {
			display: flex;
		}
	}

	.paste-input {
		position: fixed;
		top: -100vh;
		left: -100vw;
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
		table-layout: fixed;
		border-collapse: collapse;
		font-size: 0.8rem;
		user-select: none;

		&.animate {
			tr, td, th {
				transition: transform 300ms ease, width 300ms ease, height 300ms ease;
			}
		}

		&.dragging {
			th, td {
				cursor: grab;
			}
			td > * {
				pointer-events: none;
			}
		}

		::v-deep input,
		::v-deep .v-select__selection {
			font-size: 0.8rem;
			padding: 0 !important;
			margin: 0 !important;
		}
		::v-deep .v-file-input .v-text-field__slot,
		::v-deep .v-file-input__text,
		::v-deep .v-input__icon,
		::v-deep .v-input__icon .v-icon {
			min-height: 0.8rem;
			height: 0.8rem;
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

		tr.droppable th,
		tr.droppable td,
		th.droppable,
		td.droppable {
			position: relative;

			&::after {
				content: "";
				position: absolute;
				background-color: rgba(0, 0, 0, 0.1);
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
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
			z-index: 2;
		}
		.highlight-selector {
			position: absolute;
			z-index: 2;
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
				cursor: nwse-resize;
			}
		}

		thead {

			th {
				position: relative;
				z-index: 1;
			}
		}

		thead th.last-highlighted,
		tbody tr.last-highlighted th,
		td.last-highlighted {
			position: relative;

			&::after {
				content: "";
				pointer-events: none;
				position: absolute;
				outline: rgba(0, 0, 0, 0.5) dotted 3px;
				outline-offset: -2px;
				width: 100%;
				height: 100% !important;
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
			td.has-cell,
			th.has-cell {
				background-color: #ccc;
			}
		}

		thead {
			th.has-cell:before {
				content: "";
				width: calc(100% + 2px);
				position: absolute;
				bottom: -1px;
				left: -1px;
				height: 3px;
				background: rgba(142, 176, 231, 1);
				z-index: 1;
			}
			th {
				border-color: #aaa !important;
			}
		}

		tbody {
			th.has-cell {
				position: relative;
			}
			th.has-cell:after {
				content: "";
				height: calc(100% + 2px);
				position: absolute;
				right: -1px;
				top: -1px;
				width: 3px;
				background: rgba(142, 176, 231, 1);
				z-index: 1;
			}
			th {
				border-color: #aaa !important;
			}

			tr:not(.highlighted) th:hover {
				background-color: #ccc;
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

		tbody tr.highlighted th,
		tbody tr.highlighted td.default,
		thead th.highlighted {
			cursor: grab;
		}

		tbody tr td {
			cursor: cell;
		}

		tr.highlighted th,
		tr > th.highlighted {
			background-color: rgba(181, 203, 239, 1);
		}
		tr.highlighted td,
		tr > td.highlighted {
			background-color: rgba(232, 239, 250, 1);
		}
	}
</style>
