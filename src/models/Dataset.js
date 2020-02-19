import DatasetCell from "./DatasetCell";

export default class Dataset {

	constructor(props) {

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

		Object.assign(this, {
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

		this.prebuild();
	}

	/**
	 * Make sure all cells are existing
	 */
	prebuild() {

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
