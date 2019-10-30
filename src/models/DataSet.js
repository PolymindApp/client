import Hash from "../utils/Hash";

export default class DataSet {

	constructor() {

		Object.assign(this, {
			name: '',
			description: '<p></p>',
			is_private: true,
			is_remote: false,
			remote_uri: 'https://jsonplaceholder.typicode.com/users',
			is_applying_mapper: false,
			mapper: `/**
 * Transform the response variable into a valid Polymind dataset
 * structure.
 */
return {
    headers: ['Name', 'Email', 'Phone'],
    rows: response.map(entry => {
        return [entry.name, entry.email, entry.phone];
    })
};`,
			icon: '',
			datasetColumn: [
				{ id: Hash.guid(), name: 'Front', type: 'text', required: true, },
				{ id: Hash.guid(), name: 'Back', type: 'text', required: true, },
			],
			datasetRow: [
				// [Hash.guid(), 'To talk', 'Parler', true, new Date()],
				// [Hash.guid(), 'To think', 'Penser', true, new Date()],
				// [Hash.guid(), 'To do', 'Faire', true, new Date()],
			],
			deletedColumns: [],
			deletedRows: [],
		});
	}
}
