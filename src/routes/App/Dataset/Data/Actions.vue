<template>
    <div>

		<!-- BULK ACTION -->
		<v-menu offset-y>
			<template v-slot:activator="{ on }">
				<v-btn v-on="on" class="mt-3" text small>
					<v-icon left>mdi-tools</v-icon>
					{{$t('dataset.data.tools')}}
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
						<v-row :key="column.guid" v-for="(column, columnIdx) in dataset.columns">
							<v-col cols="5" class="d-flex align-center">
								{{ column.name }}
							</v-col>
							<v-col cols="2" class="d-flex align-center">
								<v-icon>mdi-arrow-left-right</v-icon>
							</v-col>
							<v-col cols="5">
								<v-select class="mt-0 pt-0" v-model="modalImportCSV.union[columnIdx]" :placeholder="$t('dataset.data.modal.importCSV.selectColumnPlaceholder')" :items="parsedCsvHeaders" hide-details outlined dense clearable></v-select>
							</v-col>
						</v-row>
					</div>

					<div>{{$t('dataset.data.modal.importCSV.example')}}</div>

					<div class="mt-4">
						<v-simple-table dark>
							<template v-slot:default>
								<thead>
								<tr>
									<th :key="column.guid" v-for="column in dataset.columns" v-text="column.name"></th>
								</tr>
								</thead>
								<tbody>
								<tr v-for="(row, rowIdx) in importCsvPreview.slice(0, 3)" :key="rowIdx">
									<td :key="cell.guid" v-for="cell in row" v-text="cell"></td>
								</tr>
								</tbody>
								<tfoot v-if="importCsvPreview.length === 0">
								<tr>
									<td :colspan="dataset.columns.length" class="text-center" v-text="$t('dataset.data.modal.importCSV.noPreview')"></td>
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
	</div>
</template>

<script>
    import Vue from 'vue';
	import { File, DatasetRow, DatasetCell } from "@polymind/sdk-js";
	import Papa from "papaparse";

    export default Vue.extend({

        name: 'Actions',

        props: ['dataset'],

        components: { DatasetRow, DatasetCell },

        mounted() {

        },

        destroyed() {

        },

        methods: {

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
				this.getCsvItems().forEach(importEntries => {

					if (skipDuplicate) {
						const found = this.dataset.rows.find(row => {
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

					let item = [...importEntries];
					items.push(item);
				});

                items.forEach(item => {
                    const row = new DatasetRow();
                    item.forEach(value => {
                    	row.cells.push(new DatasetCell({
                    		text: value,
                    	}));
                    });
                	this.dataset.rows.push(row);
                });

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

				let items = [];
				this.dataset.rows.forEach(row => {
					let item = {};
					this.dataset.columns.forEach((column, columnIdx) => {
						item[column.name] = row.cells[columnIdx][column.type];
					});
					item['created_on'] = row.created_on;
					items.push(item);
				});
				const csv = Papa.unparse(items);
				File.downloadAs('text/csv', this.dataset.name + '.csv', csv);
			},

			getCsvItems(limit = 1e100) {

				let items = [];
				const unionKeys = Object.keys(this.modalImportCSV.union).filter(union => this.modalImportCSV.union[union] !== undefined);
				if(unionKeys.length > 0) {
					const csvHeader = this.modalImportCSV.parsedCsv[0];
					for (let i = 1; i < this.modalImportCSV.parsedCsv.length; i++) {

						if (i > limit) { break; }

						let item = [];
						const line = this.modalImportCSV.parsedCsv[i];
						this.dataset.columns.forEach((column, columnIdx) => {
							const importHeader = this.modalImportCSV.union[columnIdx];
							const importHeaderIdx = csvHeader.indexOf(importHeader);
							let value = importHeader ? line[importHeaderIdx] : null;
							item.push(this.$options.filters.plainExcerpt(value, 100));
						});
						items.push(item);
					}
				}
				return items;
			}
		},

        computed: {

			parsedCsvHeaders() {
				return this.modalImportCSV.parsedCsv[0];
			},

			importCsvPreview() {
				return this.getCsvItems(3);
			},
		},

        data() {
            return {
				datasets: [],
				modalImportCSV: {
					visible: false,
					parsedCsv: {},
					union: {},
					skipDuplicate: true,
					showTotalImported: false,
					totalImported: 0,
				},
				bulkActions: [
					{ name: this.$t('dataset.data.bulkAction.refresh'), icon: 'mdi-refresh mdi-flip-h', callback: () => {
						this.$emit('refresh');
					}},
					{ separator: true },
					{ name: this.$t('dataset.data.bulkAction.import'), icon: 'mdi-database-import', callback: () => {
                        this.handleImportCSV();
					}},
					{ name: this.$t('dataset.data.bulkAction.export'), icon: 'mdi-database-export', callback: () => {
                        this.exportCSV();
					}},
				]
			};
        }
    });
</script>

<style lang="scss" scoped>

</style>
