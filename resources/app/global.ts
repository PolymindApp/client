export default {
    inputFocused: false,
    orientation: (window.orientation === 90 || window.orientation === -90) ? 'landscape' : 'portrait',
	error: {
        title: null,
        body: null,
        line: null,
        trace: [],
    },
    user: {
        name: 'Anonymous',
    },
    decks: [],
	snack: {
		visible: false,
		icon: 'mdi-check',
		color: 'success',
		body: '',
	},
	modal: {
		visible: false,
		disabled: false,
		title: 'Undefined',
		body: '',
		buttons: [],
		attrs: {},
	},
}
