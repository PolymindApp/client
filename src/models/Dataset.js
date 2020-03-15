import DatasetColumn from "./DatasetColumn";
import DatasetRow from "./DatasetRow";
import DatasetCell from "./DatasetCell";
import Model from "./Model";

export default class Dataset extends Model {

	constructor(props) {

		super({});

		const mapper = `/**
 * Transform the response variable into a valid Polymind dataset
 * structure.
 */
return {
    headers: ['Name', 'Email', 'Phone'],
    rows: response.map(entry => {
        return [entry.name, entry.email, entry.phone];
    })
};`;

		this.setDefaultValues({
			id: null,
			name: '',
			description: '<p></p>',
			is_private: true,
			is_remote: false,
			remote_uri: 'https://jsonplaceholder.typicode.com/users',
			is_applying_mapper: false,
			mapper: mapper,
			icon: '',
			columns: [],
			rows: [],
		}, props);

		this.columns = this.columns.map(column => new DatasetColumn(column));
		this.rows = this.rows.map(row => new DatasetRow(row));

		this.validate();
	}

	/**
	 * Make sure all cells are existing
	 */
	validate() {

		this.rows.forEach(row => {
			const columnDiff = this.columns.length - row.cells.length;
			if (columnDiff !== 0) {
				for (let i = 0; i < columnDiff; i++) {
					row.cells.push(new DatasetCell());
				}
			}
		});
	}
}
