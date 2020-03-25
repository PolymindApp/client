const literals = {
	title: {
		help: 'Help',
		login: 'Login',
		terms: 'Terms & Conditions',
		policies: 'Privacy Policies',
		dashboard: 'Dashboard',
		community: 'Community',
		shop: 'Flea Market',
		contact: 'Contact',
		add: 'Add',
		deck: 'Deck',
		preferences: 'Preferences',
		account: 'Account',
		stats: 'Statistics',
		signOut: 'Sign-out',
		notifications: 'Notifications',
		about: 'About',
		error404: 'Page not found',
		register: 'Register',
	},
	error404: {
		desc: 'A wind of mystery rise upon us...'
	},
	dashboard: {
		contextual: {
			filters: 'Filters',
			archived: 'Archived',
			favourite: 'Favourite',
			public: 'Public',
			andMore: '+{total} others',
		},
		filteredNoResults: 'No result...',
		filteredNoResultsDesc: 'Your search criterias did not return any results',
	},
	about: {
		general: {
			title: 'General'
		},
		privacy: {
			title: 'Privacy Policy'
		},
		terms: {
			title: 'Terms & Conditions'
		},
		contact: {
			title: 'Get In Touch'
		},
	},
	account: {
		recentActivities: 'Recent activities',
		publicDecks: 'Public decks',
		noPublicDecks: 'This user hasn\'t authorized a deck to be public yet...',
		timeline: 'Activities',
		decks: 'Decks',
	},
	app: {
		menuGroup: {
			decks: 'Decks',
			shared: 'Shared',
			personal: 'Personal',
			others: 'Others',
			admin: 'Administration',
		},
		activities: {
			filterEvents: 'Filter events',
			calendar: 'Calendar',
			map: 'Map',
			selectEventType: 'Select event type',
			eventType: 'Event type',
			addCustomers: 'Add customers',
			customer: 'Clients',
			dragTiles: 'Drag tiles to calendar',
			exportCSV: 'Export to Excel',
			removeSelected: 'Delete selection',
			modalCSVTitle: 'Export to Excel',
			modalCSVDesc: 'Are you sure you want to export all your events ?',
			deleteSelectedTitle: 'Delete selected events',
			deleteSelectedDesc: 'Are you sure you want to delete the selected events ({amount}) ?',
		},
	},
	component: {
		page: {
			empty: 'This page doesn\'t exists.'
		},
		select: {
			noDataText: 'No data available yet',
		},
		calendar: {
			today: 'Today',
			day: 'Day',
			week: 'Week',
			month: 'Month',
			fourDay: '4 Days',
		},
		deck: {
			public: 'Public',
			play: 'Playing',
			edit: 'Edit',
			favourite: 'Add to favourite',
			enterFullScreen: 'Full screen',
			exitFullScreen: 'Exit full screen mode',
			add: 'Add',
		},
		deckPlayer: {
			noCard: 'No card yet!',
			noCardClickHere: 'Add some',
			ready: 'Are you ready?',
			readyClickHere: 'Click here to start',
		},
	},
	sidebar: {
		filterPlaceholder: 'Filter...',
		decksEmpty: 'You do not have any deck yet.',
		searchEmpty: 'No menu items were found with these search terms.',
		hasFilter: 'Your search terms returned the menu items above.',
	},
	toolbar: {
		help: 'Help',
		seeAllNotif: 'See all notifications',
		tooltip: {
			search: 'Search',
			options: 'Options',
			menu: 'Menu',
			langs: 'Switch language',
			pinSidebar: 'Fix sidebar',
			help: 'See the help manual',
			adddecks: 'Add a new desk',
			notification: 'Notifications',
		},
	},
	switch: {
		activated: 'Activated',
		disabled: 'Disabled',
	},
	help: {
		sectionTitle: 'Help manual:',
	},
	error: {
		code400: 'Bad Request',
		code401: 'Unauthorized',
		code403: 'Forbidden',
		code404: 'Not Found',
		code500: 'Internal Server Error',
	},
	general: {
		new: 'New',
		defaultErrorTitle: 'Error',
		defaultErrorDesc: 'An unknown error occured',
	},
	modal: {
		close: 'Close',
		export: 'Export',
		apply: 'Apply',
		cancel: 'Cancel',
		delete: 'Delete',
		save: 'Save',
		archive: 'Archive',
	},
	snackbar: {
		saved: 'Saved with success!',
		deleted: 'Delete with success!',
	},
	deck: {
		edit: {
			isArchivedWarning: 'This deck has been archived and can only be modified if reactivated.',
			isArchivedReactivate: 'Reactivate',
		},
		view: {
			title: 'Reading',
			position: '{current} of {total}',
		},
		removeModal: {
			title: 'Clear package',
			desc: 'Are you sure you want to delete this card package? You will lose all data, settings, and secondary information associated with it. Can you prefer archiving the package instead? ',
		},
		details: {
			title: 'Information',
			name: 'Name',
			icon: 'Icon',
			defaultLangFront: 'Default language (front)',
			defaultLangBack: 'Default language (back)',
			presentation: 'Presentation',
		},
		data: {
			title: 'Cards',
			noDataText: 'There is no map at the moment.',
			noResultText: 'Your search did not return any results.',
			itemsPerPageAllText: 'All',
			itemsPerPageText: 'Items per page',
			order: 'Order',
			front: 'Front',
			back: 'Behind',
			action: 'Action',
			search: 'Search this list ...',
			loading: 'Loading ...',
			bulkActions: 'Actions',
			bulkAction: {
				delete: 'Remove from list',
				restore: 'Restore',
			}
		},
		theme: {
			title: 'Theme',
			isEnabled: 'Override default theme',
		},
		stats: {
			title: 'Statistics',
		},
	},
	preferences: {
		tab: {
			general: 'General',
			theme: 'Theme',
			interface: 'Interface',
			shortcuts: 'Shortcuts',
			notifications: 'Notifications',
		},
		general: {
			lang: 'Language',
			manualLaterality: 'Manual laterality',
			manLatLeft: 'Left-Handed',
			manLatRight: 'Right-Handed',
			manLatAmbi: 'Ambidextrous',
			deckMode: 'Sidebar decks',
			deckModeEdit: 'Open in edition mode',
			deckModeEditData: 'Open in data edition mode',
			deckModeView: 'Open in view mode',
			sound: 'Sound effects',
		},
		theme: {
			alertInfo: 'This is your default theme. If no theme is defined in your package, it will be used by default.',
			custom: 'Customize',
			dark: 'Dark',
			text: 'Text :',
			shadow: 'Shadow',
			colorFrom: 'Color from :',
			colorTo: 'Color to :',
			title: 'Color palette',
		},
		shortcuts: {
			currentHeader: 'Your actual shortcuts',
			addNewHeader: 'Add a new shortcut',
			action: 'Action',
			key: 'Key',
			alertInfo: 'These shortcuts only works with a desktop computer and won\'t work under tablet or mobile.',
			removeKey: 'Remove key combination',
			addKey: 'Add a key combination',
			deleteShortcut: 'Remove shortcut',
			addShortcut: 'Add this shortcut',
			actions: {
				approve: 'Approve',
				faster: 'Speed Up',
				slower: 'Slow Down',
				delete: 'Erase',
				add: 'Add',
				pause: 'Pause',
				play: 'Play',
				previous: 'Previous',
				next: 'Next',
				toggle: 'Toggler',
				repeat: 'Repeat',
				switch: 'Switch card',
			}
		}
	},
	contact: {
		title: 'Get in touch',
		name: 'Complete name',
		email: 'Email address',
		subject: 'Subject',
		message: 'Message',
		sendCopy: 'Send me a copy',
		send: 'Send',
		success: 'Thank you! Your message has been received and we will get back to you as soon as possible.',
		subjects: {
			issue: 'Issue with the app',
			feature: 'New feature',
			other: 'Other',
		}
	},
	restricted: {
		forgotPasswordTitle: 'Forgot Password',
		forgotPasswordDesc: 'Enter your email below in order to receive a reset password link by email.',
		forgotPasswordLink: 'I forgot my password',
		registerTitle: 'Create my account',
		registerLink: 'Create a new account',
		registrationLocked: 'Access limited to guests at this time. We apologize for the inconvenience.',
		acceptTermsLoginHint: 'By logging in, you accept the <a href="/terms">terms and conditions</a> as well as the <a href="/policies">privacy policies</a>.',
		acceptTermsRegisterHint: 'By registering, you accept the <a href="/terms">terms and conditions</a> as well as the <a href="/policies">privacy policies</a>.',
		login: 'Sign In',
		email: 'Email address',
		username: 'Username',
		password: 'Password',
		forgotPassword: 'Forgot password',
		termsLink: 'Terms & Conditions',
		policiesLink: 'Privacy Policies',
		googleLogin: 'Connect with Google',
		facebookLogin: 'Connect with Facebook',
		twitterLogin: 'Connect with Twitter',
		linkedInLogin: 'Connect with LinkedIn',
		resetPassword: 'Reset password',
		backLogin: 'Back',
		backWebsite: 'Website',
		registerBtn: 'Register',
		loginBtn: 'Sign-In',
		emailPlaceholder: 'Email address',
		passwordPlaceholder: 'Password',
	},
	rules: {
		required: 'This field is required',
		min: 'Min {amount} characters',
		email: 'The email format is invalid',
	},
	role: {
		guest: 'Visitor',
		user: 'User',
		admin: 'Administrator',
		dev: 'Developer',
	}
};

export default literals;
