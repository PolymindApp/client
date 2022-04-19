export default {
    lockFocus: false,
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
        { icon: 'mdi-facebook', tooltip: 'Facebook', href: process.env.FACEBOOK_URL },
        { icon: 'mdi-twitter', tooltip: 'Twitter', href: process.env.TWITTER_URL },
        { icon: 'mdi-youtube', tooltip: 'Youtube', href: process.env.YOUTUBE_URL },
        { icon: 'mdi-github', tooltip: 'Github', href: process.env.GITHUB_URL },
    ],
}
