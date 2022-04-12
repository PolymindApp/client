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
    socialLinks: [
        { icon: 'mdi-facebook', tooltip: 'Facebook', href: 'https://www.facebook.com/polymindapp' },
        { icon: 'mdi-twitter', tooltip: 'Twitter', href: 'https://twitter.com/polymindapp' },
        { icon: 'mdi-youtube', tooltip: 'Youtube', href: 'https://www.youtube.com/channel/UCX8r3RbWCk9VSWp7EO9zqcA' },
        { icon: 'mdi-github', tooltip: 'Github', href: 'https://github.com/PolymindApp' },
    ],
}
