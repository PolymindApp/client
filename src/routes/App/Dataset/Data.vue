<template>
	<v-card flat class="fill-height">

		<!-- MODAL: COPY ROWS -->
		<v-dialog v-model="modalCopyRows.visible" scrollable persistent max-width="500px">
			<v-card>
				<v-card-title class="headline">
					<v-icon color="primary" slot="icon" size="36" left>mdi-database-plus</v-icon>
					{{$t('dataset.data.modal.copy.title')}}
				</v-card-title>

				<v-card-text class="my-5">
					<div>{{$t('dataset.data.modal.copy.selectDb')}}</div>

					<div class="mt-8">
						<v-select v-model="modalCopyRows.selectedDb" :items="dbs" :label="$t('dataset.data.modal.copy.databaseLabel')"></v-select>
						<v-text-field class="mt-4" v-if="modalCopyRows.selectedDb === 'new'" v-model="modalCopyRows.newDb" :label="$t('dataset.data.modal.copy.newDbNameLabel')"></v-text-field>
					</div>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn color="primary" @click="copyRows()" :disabled="!modalCopyRows.selectedDb || (modalCopyRows.selectedDb === 'new' && !modalCopyRows.newDb)">
						<v-icon left>mdi-database-plus</v-icon>
						{{$t('modal.copy')}}
					</v-btn>

					<v-btn @click="modalCopyRows.visible = false">
						{{$t('modal.cancel')}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- MODAL: MOVE ROWS -->
		<v-dialog v-model="modalMoveRows.visible" scrollable persistent max-width="500px">
			<v-card>
				<v-card-title class="headline">
					<v-icon color="primary" slot="icon" size="36" left>mdi-database-export</v-icon>
					{{$t('dataset.data.modal.move.title')}}
				</v-card-title>

				<v-card-text class="my-5">
					<div>{{$t('dataset.data.modal.move.selectDb')}}</div>

					<div class="mt-8">
						<v-select v-model="modalMoveRows.selectedDb" :items="dbs" :label="$t('dataset.data.modal.move.databaseLabel')"></v-select>
						<v-text-field class="mt-4" v-if="modalMoveRows.selectedDb === 'new'" v-model="modalMoveRows.newDb" :label="$t('dataset.data.modal.move.newDbNameLabel')"></v-text-field>
					</div>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn color="primary" @click="moveRows()" :disabled="!modalMoveRows.selectedDb || (modalMoveRows.selectedDb === 'new' && !modalMoveRows.newDb)">
						<v-icon left>mdi-database-export</v-icon>
						{{$t('modal.move')}}
					</v-btn>

					<v-btn @click="modalMoveRows.visible = false">
						{{$t('modal.cancel')}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- MODAL: IMPORT CSV -->
		<v-dialog v-model="modalImportCSV.visible" scrollable persistent max-width="750px">
			<v-card>
				<v-card-title class="headline">
					<v-icon color="primary" slot="icon" size="36" left>mdi-database-import</v-icon>
					{{$t('dataset.data.modal.importCSV.title')}}
				</v-card-title>

				<v-card-text class="mt-5">
					<div>{{$t('dataset.data.modal.importCSV.desc')}}</div>

					<div class="pa-4">
						<v-row v-for="(header, index) in editableHeaders">
							<v-col cols="5" class="d-flex align-center">
								{{ header.text }}
							</v-col>
							<v-col cols="2" class="d-flex align-center">
								<v-icon>mdi-arrow-left-right</v-icon>
							</v-col>
							<v-col cols="5">
								<v-select class="mt-0 pt-0" v-model="modalImportCSV.union[index]" :placeholder="$t('dataset.data.modal.importCSV.selectColumnPlaceholder')" :items="parsedCsvHeaders" hide-details clearable></v-select>
							</v-col>
						</v-row>
					</div>

					<div>{{$t('dataset.data.modal.importCSV.example')}}</div>

					<div class="mt-4">
						<v-simple-table dark>
							<template v-slot:default>
								<thead>
									<tr>
										<th v-for="header in editableHeaders" v-text="header.text"></th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(row, rowIdx) in importCsvPreview.slice(0, 3)" :key="rowIdx">
										<td v-for="cell in row" v-text="cell"></td>
									</tr>
								</tbody>
								<tfoot v-if="importCsvPreview.length === 0">
									<tr>
										<td :colspan="editableHeaders.length" class="text-center" v-text="$t('dataset.data.modal.importCSV.noPreview')"></td>
									</tr>
								</tfoot>
							</template>
						</v-simple-table>
					</div>
				</v-card-text>

				<v-card-actions>
					<v-checkbox v-model="modalImportCSV.skipDuplicate" :label="$t('dataset.data.modal.importCSV.skipDuplicate')" color="primary" hide-details class="mt-0 pt-0 ml-2"></v-checkbox>

					<v-spacer></v-spacer>

					<v-btn color="primary" @click="importCSV()" :disabled="Object.keys(importCsvPreview).length === 0">
						<v-icon left>mdi-database-plus</v-icon>
						{{$t('modal.import')}}
					</v-btn>

					<v-btn @click="modalImportCSV.visible = false">
						{{$t('modal.cancel')}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- MODAL: MANAGE COLUMNS -->
		<v-dialog v-model="modalManageColumn.visible" scrollable persistent max-width="750px">
			<v-card>
				<v-card-title class="headline">
					<v-icon color="primary" slot="icon" size="36" left>mdi-table-settings</v-icon>
					{{$t('dataset.data.modal.manageColumn.title')}}

					<v-alert class="mt-4 w-100" type="warning" border="left" outlined>{{$t('dataset.data.modal.manageColumn.warning')}}</v-alert>
				</v-card-title>

				<v-card-text>
					<SimpleListBuilder v-model="modalManageColumn.columns" :empty-item="modalManageColumn.emptyColumn" sortable>
						<template v-slot:item="{ item }">
							<v-row>
								<v-col cols="5" class="py-0">
									<v-text-field v-model="item.name" :label="$t('dataset.data.modal.manageColumn.columnName')"></v-text-field>
								</v-col>
								<v-col cols="4" class="py-0">
									<v-select v-model="item.type" :items="modalManageColumn.types" :label="$t('dataset.data.modal.manageColumn.columnType')"></v-select>
								</v-col>
								<v-col cols="3" class="py-0">
									<v-checkbox v-model="item.is_required" color="primary" :label="$t('dataset.data.modal.manageColumn.required')"></v-checkbox>
								</v-col>
							</v-row>
						</template>
					</SimpleListBuilder>
				</v-card-text>

				<v-card-actions>

					<v-checkbox v-model="modalManageColumn.riskUnderstood" :label="$t('dataset.data.modal.manageColumn.riskUnderstood')" color="primary" hide-details class="mt-0 pt-0 ml-2"></v-checkbox>

					<v-spacer></v-spacer>

					<v-btn color="warning" @click="applyManageColumns()" :disabled="!modalManageColumn.riskUnderstood || modalManageColumn.columns.length === 0">
						<v-icon left>mdi-database-plus</v-icon>
						{{$t('modal.apply')}}
					</v-btn>

					<v-btn @click="modalManageColumn.visible = false">
						{{$t('modal.cancel')}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- MODAL: EDIT/NEW DATA -->
		<v-dialog v-model="modalEditData.visible" scrollable persistent max-width="500px">
			<v-form @submit="applyData($event, modalEditData.data)">
				<v-card>
					<v-card-title class="headline">
						<v-icon color="primary" slot="icon" size="36" left>{{modalEditData.multiple ? 'mdi-pencil' : 'mdi-plus'}}</v-icon>
						{{$t('dataset.data.modal.editData.' + (modalEditData.multiple ? 'multipleTitle' : 'addTitle'), {
							amount: selected.length
						}) }}
					</v-card-title>

					<v-card-text class="mt-5">
						<div class="mb-4">{{$t('dataset.data.modal.editData.' + (modalEditData.multiple ? 'multipleDesc' : 'desc'))}}</div>
						<v-row :key="index" v-for="(header, index) in editableHeaders">
							<v-col class="shrink py-0 d-flex align-center" v-if="modalEditData.multiple">
								<v-icon color="success" v-if="modalEditData.data[index]">mdi-checkbox-intermediate</v-icon>
								<v-icon v-else>mdi-checkbox-blank-outline</v-icon>
							</v-col>
							<v-col class="grow py-0">
								<DataType :type="header.type"  :ref="'editData_' + index" v-model="modalEditData.data[index]" :label="header.text" clearable />
							</v-col>
						</v-row>
					</v-card-text>

					<v-card-actions>
						<v-checkbox v-model="modalEditData.data[modalEditData.data.length - 1]" :label="$t('dataset.data.modal.editData.isActive')" :indeterminate="modalEditData.multiple" indeterminate-icon="mdi-checkbox-intermediate" color="primary" hide-details class="mt-0 pt-0 ml-2"></v-checkbox>

						<v-spacer></v-spacer>

						<v-btn color="primary" type="submit">
							<v-icon left>{{modalEditData.multiple ? 'mdi-content-save-edit' : 'mdi-plus'}}</v-icon>
							{{$t('modal.' + (modalEditData.multiple ? 'apply' : 'add'))}}
						</v-btn>

						<v-btn @click="modalEditData.visible = false">
							{{$t('modal.close')}}
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>

		<!-- SNACKBAR: IMPORTED DATA -->
		<v-snackbar :color="modalImportCSV.totalImported > 0 ? 'success' : 'error'" v-model="modalImportCSV.showTotalImported">
			<span v-if="modalImportCSV.totalImported > 0">
				<v-icon dark left>mdi-check</v-icon>
				<span v-text="$t('dataset.data.modal.importCSV.totalImported', { total: modalImportCSV.totalImported })"></span>
			</span>
			<span v-else>
				<v-icon dark left>mdi-alert</v-icon>
				<span v-text="$t('dataset.data.modal.importCSV.noDataImported')"></span>
			</span>
		</v-snackbar>

		<!-- SNACKBAR: EDIT/NEW DATA ADDED -->
		<v-snackbar color="success" v-model="modalEditData.hasAdded">
			<span>
				<v-icon dark left>mdi-check</v-icon>
				<span v-text="$t('dataset.data.modal.editData.hasAdded')"></span>
			</span>
		</v-snackbar>

		<!-- SNACKBAR: EDIT/NEW DATA ADDED -->
		<v-snackbar color="success" v-model="modalEditData.hasModified">
			<span>
				<v-icon dark left>mdi-check</v-icon>
				<span v-text="$t('dataset.data.modal.editData.totalModified')"></span>
			</span>
		</v-snackbar>

		<!-- SNACKBAR: EDIT/NEW DATA TOTAL MODIFIED -->
		<v-snackbar color="success" v-model="modalEditData.hasModifiedMultiple">
			<span>
				<v-icon dark left>mdi-check</v-icon>
				<span v-text="$t('dataset.data.modal.editData.totalModified', { total: modalEditData.totalModified })"></span>
			</span>
		</v-snackbar>

		<!-- DATA TABLE -->
		<v-data-table
			:headers="headers"
			:items="items"
			sort-by="created_at"
			:sort-desc="true"
			:search="filters.search"
			item-key="guid"
			v-model="selected"
			show-select hide-default-footer fixed-header
			@page-count="pageCount = $event"
			:no-results-text="$t('dataset.data.noResults')"
			:no-data-text="$t('dataset.data.noData')"
			:loading-text="$t('dataset.data.isLoading')"
			:items-per-page="itemsPerPage"
			:page.sync="page"
			:dense="dense"
			class="elevation-1 fill-height d-flex flex-column">

			<!-- ROWS DATA -->
			<template v-slot:item="props">
				<tr v-bind:class="{ deleted: dataset.deletedRows.indexOf(props.item.index) !== -1 }">
					<td class="select shrink" @click="toggleSelect(props)">
						<v-checkbox v-model="props.isSelected" color="secondary" hide-details class="ma-0 pa-0"></v-checkbox>
					</td>
					<td :style="{ width: header.type === 'text' ? ((100 / editableHeaders.length) + '%') : null }" @dblclick="editCell(headerIdx, props.item.index)" v-for="(header, headerIdx) in editableHeaders">
						<DataType :ref="'editedField_' + props.item.index + '_' + headerIdx" v-model="getItem(props.item.index, header)[valueTypes[header.type]]" :type="header.type" @keydown="handleKeyDown" @blur="editingCell = false" hide-details />
					</td>
					<td class="shrink">
						<v-switch v-model="dataset.datasetRow[props.item.index].is_active" color="success" hide-details class="ma-0 pa-0"></v-switch>
					</td>
					<td class="shrink">
						<span class="text-no-wrap">
							<template v-if="dataset.datasetRow[props.item.index].created_at">
								{{dataset.datasetRow[props.item.index].created_at | date}}
							</template>
							<v-chip v-else x-small>NULL</v-chip>
						</span>
					</td>
					<td class="actions shrink">

						<v-tooltip left>
							<template v-slot:activator="{ on }">
								<v-btn v-on="on" @click="editData(false, props.item)" icon>
									<v-icon>mdi-pencil</v-icon>
								</v-btn>
							</template>
							<span v-text="$t('dataset.data.tooltip.edit')"></span>
						</v-tooltip>

						<v-tooltip v-if="dataset.deletedRows.indexOf(props.item.index) === -1" left>
							<template v-slot:activator="{ on }">
								<v-btn v-on="on" @click="removeItems([props.item])" icon>
									<v-icon>mdi-delete</v-icon>
								</v-btn>
							</template>
							<span v-text="$t('dataset.data.tooltip.delete')"></span>
						</v-tooltip>

						<v-tooltip v-if="dataset.deletedRows.indexOf(props.item.index) !== -1" left>
							<template v-slot:activator="{ on }">
								<v-btn v-on="on" @click="restoreItems([props.item])" icon>
									<v-icon>mdi-delete-restore</v-icon>
								</v-btn>
							</template>
							<span v-text="$t('dataset.data.tooltip.restore')"></span>
						</v-tooltip>
					</td>
				</tr>
			</template>

			< !-- TABLE HEADER -->
			<template v-slot:top>
				<v-toolbar flat color="white">

					<!-- BULK ACTION -->
					<v-menu offset-y>
						<template v-slot:activator="{ on }">
							<v-btn :disabled="selected.length === 0" v-on="on" class="mr-4">
								{{ $t('dataset.data.bulkActions') }}
								<v-icon right>mdi-chevron-down</v-icon>
							</v-btn>
						</template>
						<v-list dense>
							<template v-for="(action, index) in bulkActions">
								<v-list-item v-if="!action.separator" :key="index" @click="action.callback()">
									<v-list-item-icon>
										<v-icon>{{ action.icon }}</v-icon>
									</v-list-item-icon>
									<v-list-item-title>{{ action.name }}</v-list-item-title>
								</v-list-item>
								<v-divider v-else class="my-1"></v-divider>
							</template>
						</v-list>
					</v-menu>

					<v-divider class="mx-4" inset vertical></v-divider>

					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn color="primary" @click="editData()" dark v-on="on" icon>
								<v-icon>mdi-plus</v-icon>
							</v-btn>
						</template>
						<span v-text="$t('dataset.data.tooltip.add')"></span>
					</v-tooltip>

					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn @click="manageColumns()" class="ml-4" icon v-on="on">
								<v-icon>mdi-table-settings</v-icon>
								<!--								<span v-text="$t('dataset.data.manageColumn')"></span>-->
							</v-btn>
						</template>
						<span v-text="$t('dataset.data.tooltip.manageColumn')"></span>
					</v-tooltip>

					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn v-on="on" class="ml-4" @click="handleImportCSV()" icon>
								<v-icon>mdi-import</v-icon>
							</v-btn>
						</template>
						<span v-text="$t('dataset.data.tooltip.import')"></span>
					</v-tooltip>

					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn v-on="on" class="ml-4" @click="exportCSV()" icon>
								<v-icon>mdi-export</v-icon>
							</v-btn>
						</template>
						<span v-text="$t('dataset.data.tooltip.export')"></span>
					</v-tooltip>

					<v-divider class="mx-4" inset vertical></v-divider>

					<v-text-field
						v-model="filters.search"
						prepend-inner-icon="mdi-database-search"
						:label="$t('dataset.data.searchLabel')"
						single-line
						hide-details
					></v-text-field>

					<div class="flex-grow-1"></div>

					<div class="mr-4" v-text="$t('dataset.data.pagination', {
						offset: pageOffset,
						limit: pageLimit,
						total: items.length,
					})">
					</div>

					<div class="d-flex align-center">
						<v-pagination v-model="page" :length="pageCount" total-visible></v-pagination>
						<!--						<v-text-field :value="itemsPerPage" label="Items per page" type="number" min="-1" max="5" @input="itemsPerPage = parseInt($event, 5)"></v-text-field>-->
					</div>

					<v-divider class="mx-4" inset vertical></v-divider>

					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn @click="dense = !dense" icon v-on="on">
								<v-icon v-if="!dense">mdi-view-stream</v-icon>
								<v-icon v-else>mdi-view-headline</v-icon>
							</v-btn>
						</template>
						<span v-text="$t('dataset.data.tooltip.dense')"></span>
					</v-tooltip>

				</v-toolbar>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import Vue from 'vue';
import Hash from "../../../utils/Hash";
import File from "../../../utils/File";
import DatasetRow from "../../../models/DatasetRow";
import DatasetColumn from "../../../models/DatasetColumn";
import DatasetEntry from "../../../models/DatasetEntry";
import Papa from "papaparse";
import SimpleListBuilder from "../../../components/SimpleListBuilder";
import DataType from "../../../components/DataType";

export default Vue.extend({

	props: ['dataset', 'formErrors'],

	components: { SimpleListBuilder, DataType },

	mounted() {
	    this.headers = this.getHeaders();
	    this.items = this.getItems();

	    this.$root.$on('cancel', () => {
	        this.selected = [];
		});

        this.$shortcuts.add(this.$t('shortcuts.datasetData.add.title'), this.$t('shortcuts.datasetData.add.desc'), 'datasetData', ['AltLeft', 'KeyA'], this.shortcutAdd);
	},

	destroyed() {
        this.$shortcuts.remove(this.shortcutAdd);
	},

	methods: {

        shortcutAdd() {
            this.modalEditData.visible = true;
        },

		getItem(rowIdx, currentHeader) {
            const header = this.headers.find(header => header.value === currentHeader.value);
            const cell = this.dataset.datasetRow[rowIdx].datasetEntry.find(entry => entry.dataset_column_id === header.id);

            return cell || {};
		},

        getHeaders() {
            let items = [];
            this.dataset.datasetColumn.forEach(column => {
                items.push({
                    id: column.id,
                    order: column.order,
                    text: column.name,
                    type: column.type,
                    class: column.type !== 'text' ? 'shrink' : null,
                    editable: true,
                    value: Hash.guid(),
                });
            });

            items.sort((a, b) => (a.order > b.order) ? 1 : -1);

            items.push(
                { text: this.$t('dataset.data.columnIsActive'), value: 'active', class: 'shrink', editable: false, },
                { text: this.$t('dataset.data.columnCreatedAt'), value: 'created_at', class: 'shrink', editable: false, },
                { text: '', value: 'actions', class: 'shrink', editable: false, sortable: false, },
            );
            return items;
        },

		getItems() {
			let items = [];
			this.dataset.datasetRow.forEach((row, index) => {
				let item = {
					index,
					guid: row.id || Hash.guid(),
				};
				row.datasetEntry.forEach((cell, cellIndex) => {
				    const header = this.headers.find(header => header.id === cell.dataset_column_id);
				    if (header) {

				        switch(header.type) {
							case 'relation':
                                item[header.value] = cell; // TODO: Not functioning
							default:
                                item[header.value] = cell['value_' + header.type];
						}
					}
				});
				items.push(item);
			});
			return items;
		},

	    handleImportCSV() {
            File.promptFileDialog(files => {
                this.$root.isLoading = true;
                Papa.parse(files[0], {
                    skipEmptyLines: true,
                    complete: results => {
                        this.modalImportCSV.union = {};
                        this.modalImportCSV.parsedCsv = results.data;
                        this.modalImportCSV.visible = true;
                        this.modalImportCSV.skipDuplicate = true;
                        this.$root.isLoading = false;
					}
				});
            }, '.csv');
		},

		importCSV(skipDuplicate = this.modalImportCSV.skipDuplicate) {

	        let items = [];
			this.importCsvPreview.forEach(importEntries => {

			    if (skipDuplicate) {
                    const found = this.dataset.datasetRow.find(row => {
                        for (let i = 0; i < importEntries.length; i++) {
                            if (row[i] !== importEntries[i]) {
                                return false;
                            }
                        }
                        return true;
                    });
                    if (found) {
                        return;
                    }
				}

                let item = [...importEntries, true, new Date()];
			    items.push(item);
			});

            this.dataset.datasetRow = this.dataset.datasetRow.concat(items);
            Object.assign(this.modalImportCSV, {
                showTotalImported: true,
                totalImported: items.length,
                union: {},
                parsedCsv: [],
                visible: false,
                skipDuplicate: false,
            });
		},

		async exportCSV() {

			this.$root.isLoading = true;
			let items = [];
			this.items.forEach(item => {
				let newItem = {};
				this.headers.forEach(header => {
					if (['active', 'actions'].indexOf(header.value) === -1) {
						newItem[header.text] = item[header.value];
					}
				});
				items.push(newItem);
			});
			const csv = Papa.unparse(items);
			File.downloadAs('text/csv', this.dataset.name + '.csv', csv);
			this.$root.isLoading = false;
		},

        copyRows() {
	        this.selected = [];
			this.modalCopyRows.visible = false;
		},

		moveRows() {
            this.selected = [];
            this.modalMoveRows.visible = false;
		},

		resetEditData(multiple = false) {
            this.modalEditData.data = [];
            this.editableHeaders.forEach((header, index) => {
                this.modalEditData.data[index] = null;
            });
            this.modalEditData.data.push(multiple === false ? true : null); // Active
		},

		editData(multiple = false, data) {

			this.resetEditData(multiple);
	        this.modalEditData.visible = true;
            this.modalEditData.multiple = false;
            this.modalEditData.data = data || [];

	        this.$nextTick(() => {
                this.$refs.editData_0[0].focus();
                this.modalEditData.multiple = multiple;  // To force re-rendering on re-opening
			});
		},

        applyData(event) {

	        event.preventDefault();

	        if (this.modalEditData.multiple) {
                this.modalEditData.totalModified = this.selected.length;
	            this.selected.forEach(item => {
                    this.modalEditData.data.forEach((data, index) => {
                        if (data !== '' && data !== null) {
                            this.dataset.datasetRow[item.index][index + 1] = typeof data === 'string' ? data.trim() : data;
						}
					});
				});
                this.modalEditData.hasModifiedMultiple = true;
			} else {
	            let row = new DatasetRow();
	            this.editableHeaders.forEach((header, index) => {
					let values = {
                        dataset_column_id: header.id,
					};
                    values['value_' + this.valueTypes[header.type]] = this.modalEditData.data[index];
                    row.datasetEntry.push(new DatasetEntry(values));
				});
                this.dataset.datasetRow.push(row);
                this.modalEditData.hasAdded = true;
			}

            this.resetEditData();
            this.$nextTick(() => {
                this.$refs.editData_0[0].focus();
            });

            this.$emit('update', this.dataset);

            if (this.modalEditData.multiple) {
                this.modalEditData.visible = false;
			}
		},

        editCell(headerIdx, rowIdx) {
		    this.editingCell = headerIdx + ':' + rowIdx;
		    this.$nextTick().then(() => {
		        this.$refs['editedField_' + rowIdx + '_' + headerIdx][0].edit();
			});
		},

        manageColumns() {
            this.modalManageColumn.riskUnderstood = false;
            this.modalManageColumn.columns = [...this.dataset.datasetColumn];
            this.modalManageColumn.visible = true;
		},

        applyManageColumns() {

            // Map old to new columns
            const toMove = [], toAdd = [];
            this.modalManageColumn.columns.forEach((newColumn, newIdx) => {
                const oldColumnIdx = this.dataset.datasetColumn.findIndex(oldColumn => oldColumn.guid === newColumn.guid);
                if (oldColumnIdx === -1) {
                    toAdd.push(newIdx + 1); // +1 (Skip GUID)
				} else if (oldColumnIdx !== newIdx) {
                    toMove.push([oldColumnIdx + 1, newIdx + 1]); // +1 (Skip GUID)
				}
			});

            if (toMove.length > 0 || toAdd.length > 0) {
                const originalRows = [...this.dataset.datasetRow];
                const modifiedRows = [...this.dataset.datasetRow];

                if (toAdd.length > 0) {
                    originalRows.forEach((row, currIdx) => {
						const clonedRow = [...row];
						toAdd.forEach(idx => {
							clonedRow.splice(idx, 0, null);
						});
                        modifiedRows[currIdx] = [...clonedRow];
					});
                    this.dataset.datasetRow = [...modifiedRows];
				}

                if (toMove.length > 0) {
                    this.dataset.datasetRow.forEach((row, currIdx) => {
                        const clonedRow = [...row];
                        toMove.forEach(([oldIdx, newIdx]) => {
                            const oldValue = originalRows[currIdx][oldIdx];
                            clonedRow[newIdx] = oldValue;
                        });
                        this.dataset.datasetRow[currIdx] = [...clonedRow];
                    });
                }
            }

            this.dataset.datasetColumn = [...this.modalManageColumn.columns];

            this.modalManageColumn.visible = false;
            this.$emit('update', this.dataset);
		},

        handleKeyDown(event) {
		    switch (event.code) {
				case 'Enter': this.editingCell = false; break;
				case 'Tab':
				    event.preventDefault();
				    const splittedCellVal = this.editingCell.split(':');
				    let headerIdx = parseInt(splittedCellVal[0]);
				    let rowIdx = parseInt(splittedCellVal[1]);
				    if ((!event.shiftKey && headerIdx === this.editableHeaders.length - 1)
						|| (event.shiftKey && headerIdx === 0)) {

				        headerIdx = event.shiftKey ? this.editableHeaders.length - 1 : 0;
                        if ((!event.shiftKey && rowIdx === this.items.length - 1)
                            || (event.shiftKey && rowIdx === 0)) {
                            rowIdx = event.shiftKey ? this.items.length - 1 : 0;
						} else {
				            event.shiftKey ? rowIdx-- : rowIdx++;
						}
					} else {
                        event.shiftKey ? headerIdx-- : headerIdx++;
					}

					this.editingCell = headerIdx + ':' + rowIdx;
                    this.$nextTick().then(() => {
                        this.editCell(headerIdx, rowIdx);
                    });
				    break;
			}
		},

        toggleSelect(props) {
            props.select(props.isSelected);
        },

        removeItems(items) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const selectedIndex = this.selected.indexOf(item);

                // if (selectedIndex !== -1) {
                //     this.selected.splice(selectedIndex, 1);
                //     i--;
                // }

                if (this.dataset.deletedRows.indexOf(item.index) === -1) {
                    this.dataset.deletedRows.push(item.index);
				}
            }
        },

        resetItems(items) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                this.editableHeaders.forEach((header, headerIdx) => {
                    this.$refs['editedField_' + item.index + '_' + headerIdx][0].reset();
				});
            }
        },

		restoreItems(items) {
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const selectedIndex = this.selected.indexOf(item);

				// if (selectedIndex !== -1) {
				// 	this.selected.splice(selectedIndex, 1);
				// 	i--;
				// }

				const deletedIndex = this.dataset.deletedRows.indexOf(item.index);
                if (deletedIndex !== -1) {
                    this.dataset.deletedRows.splice(deletedIndex, 1);
                }
			}
		},

		editItem (item) {
			this.editedIndex = this.dataset.datasetRow.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},

		close () {
			this.dialog = false;
			setTimeout(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			}, 300);
		},

		save () {
			if (this.editedIndex > -1) {
				Object.assign(this.dataset.datasetRow[this.editedIndex], this.editedItem);
			} else {
				this.dataset.datasetRow.push(this.editedItem);
			}
			this.close();
		},
	},

	computed: {

		pageOffset() {

            let offset = (this.page - 1) * this.itemsPerPage + 1;
		    if (offset > this.items.length) {
                return this.items.length;
			}
		    return offset;
		},

		pageLimit() {

            let limit = this.page * this.itemsPerPage;
            if (limit > this.items.length) {
                return this.items.length;
            }
            return limit;
		},

        editableHeaders() {
		    return this.headers.filter(header => header.editable === true);
		},

        parsedCsvHeaders() {
		    return this.modalImportCSV.parsedCsv[0];
		},

        importCsvPreview() {
		    let items = [];
            const unionKeys = Object.keys(this.modalImportCSV.union).filter(union => this.modalImportCSV.union[union] !== undefined);
            if(unionKeys.length > 0) {
				const csvHeader = this.modalImportCSV.parsedCsv[0];
                for (let i = 1; i < this.modalImportCSV.parsedCsv.length; i++) {
                    let item = [];
                    const line = this.modalImportCSV.parsedCsv[i];
                    this.editableHeaders.forEach((header, headerIdx) => {
                        const importHeader = this.modalImportCSV.union[headerIdx];
                        const importHeaderIdx = csvHeader.indexOf(importHeader);
                        let value = importHeader ? line[importHeaderIdx] : null;
                        item.push(value);
                    });
                    items.push(item);
                }
            }
            return items;
		},
	},

	data() {
		return {
            headers: [],
            items: [],
            valueTypes: {
                text: 'value_text',
                number: 'value_text',
                date: 'value_text',
                image: 'file',
                recording: 'file',
                audio: 'file',
			},
			filters: {
                search: '',
			},
		    dbs: [{ text: '+ ' + this.$t('dataset.data.modal.copy.newDbLabel'), value: 'new' }],
			dense: false,
            editingCell: false,
			page: 1,
			pageCount: 0,
			itemsPerPage: 100,
			selected: [],
			deleted: [],
			dialog: false,
			editedIndex: -1,
			editedItem: {},
			defaultItem: {},
            modalCopyRows: {
			    visible: false,
                selectedDb: null,
                newDb: null,
			},
            modalMoveRows: {
			    visible: false,
                selectedDb: null,
                newDb: null,
			},
            modalImportCSV: {
			    visible: false,
				parsedCsv: {},
				union: {},
                skipDuplicate: true,
				showTotalImported: false,
                totalImported: 0,
			},
            modalEditData: {
			    visible: false,
                multiple: false,
				data: [],
                hasAdded: false,
                hasModified: false,
                hasModifiedMultiple: false,
                totalModified: 0,
			},
            modalManageColumn: {
			    visible: false,
                columns: [],
                riskUnderstood: false,
				emptyColumn: { text: '', type: 'text', is_required: true },
                types: [
					{ text: this.$t('dataset.data.modal.manageColumn.types.text'), value: 'text' },
					{ text: this.$t('dataset.data.modal.manageColumn.types.number'), value: 'number' },
					{ text: this.$t('dataset.data.modal.manageColumn.types.boolean'), value: 'boolean' },
					{ text: this.$t('dataset.data.modal.manageColumn.types.date'), value: 'date' },
					{ text: this.$t('dataset.data.modal.manageColumn.types.oneChoice'), value: 'select' },
					{ text: this.$t('dataset.data.modal.manageColumn.types.multipleChoice'), value: 'multiple' },
					{ text: this.$t('dataset.data.modal.manageColumn.types.image'), value: 'image' },
					{ text: this.$t('dataset.data.modal.manageColumn.types.audio'), value: 'audio' },
					{ text: this.$t('dataset.data.modal.manageColumn.types.recording'), value: 'recording' },
					{ text: this.$t('dataset.data.modal.manageColumn.types.file'), value: 'file' },
					{ text: this.$t('dataset.data.modal.manageColumn.types.relation'), value: 'relation' },
				],
			},
			bulkActions: [
				{ name: this.$t('dataset.data.bulkAction.modifyValue'), icon: 'mdi-pencil', callback: () => {
					this.editData(true);
				}},
                { name: this.$t('dataset.data.bulkAction.reset'), icon: 'mdi-refresh mdi-flip-h', callback: () => {
                        this.resetItems(this.selected);
                    }},
                { separator: true },
				{ name: this.$t('dataset.data.bulkAction.copyTo'), icon: 'mdi-database-plus', callback: () => {
				    this.modalCopyRows.selectedDb = null;
				    this.modalCopyRows.newDb = null;
					this.modalCopyRows.visible = true;
				}},
				{ name: this.$t('dataset.data.bulkAction.moveTo'), icon: 'mdi-database-export', callback: () => {
					this.modalMoveRows.selectedDb = null;
					this.modalMoveRows.newDb = null;
					this.modalMoveRows.visible = true;
				}},
				{ separator: true },
				{ name: this.$t('dataset.data.bulkAction.delete'), icon: 'mdi-delete', callback: () => {
					this.removeItems(this.selected);
				}},
				{ name: this.$t('dataset.data.bulkAction.restore'), icon: 'mdi-delete-restore', callback: () => {
					this.restoreItems(this.selected);
				}},
			]
		}
	},

	watch: {
	    'dataset.datasetColumn'(columns) {
	        this.headers = this.getHeaders();
            this.items = this.getItems();
		},
	    'dataset.datasetRow'(rows) {
	        this.items = this.getItems();
		},
		dialog (val) {
			val || this.close();
		},
	},
});
</script>

<style lang="scss" scoped>
	.v-data-table {
		& >>> header {flex: 0;}
		& >>> .v-data-table__wrapper {flex: 1;}
		& >>> .v-data-footer {flex: 0;}

		& >>> tr.deleted td {

			&:not(.actions):not(.select) {
				text-decoration: line-through;
				color: red;
				opacity: 0.5;
				pointer-events: none;
			}
		}

		& >>> .shrink {
			width: 1%;
			white-space: nowrap;
		}

		& >>> .datatype .v-input {
			margin-top: 0;
			padding-top: 0;
		}
	}

	.import-csv-preview-container {
		background-color: gray;
	}
</style>
