import DatasetColumn from "./DatasetColumn";
import DatasetRow from "./DatasetRow";
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
			columns: [
				new DatasetColumn({ name: 'Front' }),
				new DatasetColumn({ name: 'Back' }),
			],
			rows: [
				new DatasetRow({
					cells: [
						new DatasetCell({ text: 'Hablar' }),
						new DatasetCell({ text: 'To speak' }),
					]
				}),
				new DatasetRow({
					cells: [
						new DatasetCell({ text: 'Tocar' }),
						new DatasetCell({ text: 'To touch' }),
					]
				}),
				new DatasetRow({
					cells: [
						new DatasetCell({ text: 'Conocer' }),
						new DatasetCell({ text: 'To know' }),
					]
				}),
			],
		}, props);
	}
}
