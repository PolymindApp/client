const literals = {
	title: {
		help: 'Aide',
		login: 'Connexion',
		terms: 'Termes & Conditions',
		policies: 'Politiques de Condidentialités',
		dashboard: 'Tableau de bord',
		community: 'Communauté',
		shop: 'Marché au puces',
		contact: 'Contact',
		add: 'Ajouter',
		deck: 'Paquet',
		preferences: 'Préférences',
		account: 'Compte',
		stats: 'Statistiques',
		signOut: 'Déconnexion',
		notifications: 'Notifications',
		about: 'À propos',
		error404: 'Page non trouvé',
		register: 'Inscription',
		activate: 'Activation',
		forgotPassword: 'Oublie de mot de passe',
		resetPassword: 'Réinitialisation de mot de passe',
		strategy: 'Stratégie',
		component: 'Composante',
		dataset: 'Base de données',
	},
	error404: {
		desc: 'Un vent de mystère se lève sur nous...'
	},
	dashboard: {
		contextual: {
			filters: 'Filtres',
			archived: 'Archivé',
			favourite: 'Favoris',
			public: 'Publique',
			andMore: '+{total} autres',
		},
		filteredNoResults: 'Aucun résultat...',
		filteredNoResultsDesc: 'Vos critères de recherches n\'ont retournés aucun résultat',
	},
	about: {
		general: {
			title: 'Générale'
		},
		privacy: {
			title: 'Politiques de confidentialité'
		},
		terms: {
			title: 'Termes & Conditions'
		},
		contact: {
			title: 'Contact'
		},
	},
	account: {
		messages: 'Derniers messages',
		recentActivities: 'Récentes activités',
		changeWallpaper: 'Changer le fond d\'écran',
		wall: {
			title: 'Activités'
		},
		information: {
			title: 'Information',
			generalTitle: 'Général',
			screenNameLabel: 'Nom à afficher',
			firstNameLabel: 'Prénom',
			lastNameLabel: 'Nom de famille',
			languagesLabel: 'Langue(s)',
			biographyLabel: 'Biographie',
			genderLabel: 'Sexe',
			quoteLabel: 'Citation',
			applyChanges: 'Appliquer les changements',
		}
	},
	app: {
		menuGroup: {
			decks: 'Paquets',
			shared: 'Partagés',
			personal: 'Personnel',
			strategies: 'Stratégies',
			components: 'Composantes',
			dataset: 'Base de données',
			others: 'Autres',
			admin: 'Administration',
		},
	},
	strategy: {
		settings: {
			title: 'Réglages',
		},
		interface: {
			title: 'Interfaces',
		},
		components: {
			title: 'Composantes',
		},
		workflow: {
			title: 'Flux de travail',
		},
	},
	component: {

		newTitle: 'Nouveau',

		settings: {
			title: 'Réglages',
			isPrivateLabel: 'Privé',
			isInvisibleLabel: 'Sans aspect visuel',
			namePlaceholder: 'Nom de la composante',
			descPlaceholder: 'Description',
			iconPlaceholder: 'Icône',
			explanations: 'Une composante est un élément visuel ou un groupe de méthode avec paramètres et évènements programmable, héritable et réutilisable que vous pouvez personnaliser et imbriquer dans des stratégies afin de conceptualiser des stratégies d\'apprentissage sur-mesure.',
			readDoc: 'Explorer la documentation',
		},
		source: {
			title: 'Source',
			viewTooltip: 'Basculer le mode de vue',
			consoleTooltip: 'Afficher la console',
		},
		params: {
			title: 'Paramètres',
		},
		events: {
			title: 'Événements',
		},

		page: {
			empty: 'Cette page n\'existe pas encore.'
		},
		select: {
			noDataText: 'Aucune donnée disponible',
		},
		calendar: {
			today: 'Aujourd\'hui',
			day: 'Jour',
			week: 'Semaine',
			month: 'Mois',
			fourDay: '4 jours',
		},
		simpleListBuilder: {
			add: 'Ajouter',
			empty: 'Il n\'y a aucun élément pour le moment',
			remove: 'Supprimer cet élément',
		}
	},
	dataset: {

		newTitle: 'Nouveau',

		settings: {
			title: 'Réglages',
			isPrivateLabel: 'Privé',
			isRemoteLabel: 'Récupérer les données depuis un serveur distant',
			namePlaceholder: 'Nom de la base de données',
			descPlaceholder: 'Description',
			iconPlaceholder: 'Icône',
			remoteURIPlaceholder: 'URI du serveur distant',
			explanations: 'Emmagasiner ou récupérer l\'information nécessaire à vos stratégies d\'apprentissage depuis une base de données qui pourra par la suite être utilisé par vos composantes ou filtré par un curateur.',
			readDoc: 'Explorer la documentation',
			testRemoteURI: 'Tester',
			applyMapper: 'Appliquer un mappeur',
		},
		data: {
			title: 'Données',
			pagination: '{offset} - {limit} de {total} éléments',
			columnIsActive: 'Actif',
			columnCreatedAt: 'Ajouté le',
			searchLabel: 'Rechercher/Filtrer...',
			bulkActions: 'Action en vrac',
			bulkAction: {
				delete: 'Effacer',
				restore: 'Restaurer',
				modifyValue: 'Modifier',
				moveTo: 'Déplacer vers...',
				copyTo: 'Copier vers...',
				activate: 'Désactiver',
				deactivate: 'Activer',
			},
			tooltip: {
				add: 'Ajouter une donnée',
				import: 'Importer un CSV',
				export: 'Exporter vers CSV',
				dense: 'Basculer la densité',
				manageColumn: 'Gérer les colonnes',
			},
			modal: {
				copy: {
					title: 'Copier vers...',
					selectDb: 'Sélectionner une base de donnée vers laquelle copier les lignes sélectionnées :',
					databaseLabel: 'Base de donnée',
					newDbLabel: 'Nouvelle base de donnée',
					newDbNameLabel: 'Nom de la base de donnée',
				},
				move: {
					title: 'Déplacer vers...',
					selectDb: 'Sélectionner une base de donnée vers laquelle déplacer les lignes sélectionnées :',
					databaseLabel: 'Base de donnée',
					newDbLabel: 'Nouvelle base de donnée',
					newDbNameLabel: 'Nom de la base de donnée',
				},
				importCSV: {
					title: 'Importer un CSV',
					desc: 'Liez les colonnes de la base de donnée avec celles du CSV :',
					example: 'Voici un échantillon des données qui seront importées :',
					noPreview: 'Aucune donnée disponible',
					skipDuplicate: 'Ignorer les données similaires',
					totalImported: '{total} données ont été importés',
					noDataImported: 'Aucune donnée importé',
					selectColumnPlaceholder: 'Sélectionnez une colonne',
					applyNoColumn: '- Aucune -',
				},
				editData: {
					addTitle: 'Ajouter une donnée',
					multipleTitle: 'Modifier les données en vrac ({amount})',
					desc: 'Complétez les champs ci-dessous :',
					multipleDesc: 'Seuls les champs avec de l\'information seront mis à jour :',
					hasAdded: 'Une donnée a été ajouté',
					hasModified: 'Une donnée a été modifié',
					totalModified: '{total} données ont été modifiés',
					isActive: 'Active',
				},
				manageColumn: {
					title: 'Gérer les colonnes',
					warning: 'Attention, les colonnes supprimés perderont l\'intégrités de leurs données associés !',
					riskUnderstood: 'Je comprends le risque',
					columnName: 'Nom de la colonne',
					columnType: 'Type de donnée',
					required: 'Requis',
					types: {
						text: 'Texte',
						number: 'Numéro',
						boolean: 'Oui/Non',
						date: 'Date',
						oneChoice: 'Sélection',
						multipleChoice: 'Sélection multiple',
						image: 'Image',
						audio: 'Audio',
						file: 'Fichier',
						relation: 'Relation',
					}
				},
			}
		},
	},
	sidebar: {
		myAccount: 'Voir mon profile',
		filterPlaceholder: 'Filtrer...',
		decksEmpty: 'Vous n\'avez aucun paquet pour le moment.',
		strategiesEmpty: 'Vous n\'avez aucune stratégie pour le moment.',
		componentsEmpty: 'Vous n\'avez aucune composantes pour le moment.',
		datasetEmpty: 'Vous n\'avez aucune base de donnée pour le moment.',
		searchEmpty: 'Aucun élément de menu n\'a été trouvé avec ces termes de recherche.',
		hasFilter: 'Vos termes de recherche ont retourné les éléments de menu ci-dessus.',
	},
	toolbar: {
		help: 'Aide',
		seeAllNotif: 'Voir toutes les notifications',
		tooltip: {
			search: 'Rechercher',
			options: 'Options',
			menu: 'Menu',
			langs: 'Changer de langue',
			adddecks: 'Ajouter un paquet',
			pinSidebar: 'Fixer la barre latérale',
			help: 'Voir le manuel d\'aide',
			notification: 'Notifications',
			addstrategies: 'Ajouter une stratégie',
			addcomponents: 'Ajouter une composante',
			adddataset: 'Ajouter une base de données',
		},
	},
	switch: {
		activated: 'Activé',
		disabled: 'Désactivé',
	},
	help: {
		sectionTitle: 'Questions pertinantes :',
	},
	diff: {
		quote: 'A changé sa citation pour <strong>{value}</strong>',
		screen_name: 'A changé son surnom pour <strong>{value}</strong>',
	},
	error: {

		goBack: 'Revenir en arrière',

		code400: 'Mauvaise Requête',
		code401: 'Non autorisé',
		code403: 'Interdit',
		code404: 'Introuvable',
		code500: 'Erreur serveur interne',

		fatal: {
			title: 'Erreur fatale',
			desc: 'Une erreur fatale est survenu.',
		},
		bad_credentials: {
			title: 'Mauvais identifiant',
			desc: 'Vérifiez vos informations et soumettez le formulaire de nouveau.',
		},
		not_confirmed: {
			title: 'Courriel non confirmé',
			desc: 'Votre compte est existant, mais vous n\'avez toujours pas confirmer votre adresse courriel. Avez-vous vérifié vos courrier indésirales ? Toujours vide ? Désirez-vous que l\'on vous fasse parvenir une autre clé d\'activation par courriel ?',
		},
		token_expired: {
			title: 'Jeton expiré',
			desc: 'Votre jeton de réinitialisation a expiré. Vous devez en générer un nouveau.',
		},
		user_password_request_token_expired: {
			title: 'Jeton expiré',
			desc: 'Votre jeton de réinitialisation a expiré. Vous devez en générer un nouveau.',
		},
		bad_token: {
			title: 'Mauvais jeton',
			desc: 'Le jeton utilisé est invalide.',
		},
		user_already_activated: {
			title: 'Compte déjà activé',
			desc: 'Ce compte a déjà été activé. Vous pouvez dès maintenant vous connectez.',
		},
		user_activation_request_not_found: {
			title: 'Clé d\'activation erronée',
			desc: 'Le compte associé à cette clé d\'utilisation est inexistant.',
		},
		user_not_found: {
			title: 'Compte inexistant',
			desc: 'Nous ne parvenons pas à trouvé le compte demandé. Est-ce que vos informations sont correctes ?',
		},
		user_blocked: {
			title: 'Compte bloqué',
			desc: 'Votre compte a été bloqué par un de nos administrateurs. N\'hésitez pas à nous contacter afin d\'obtenir de plus amples informations.',
		},
		unauthorized: {
			title: 'Accès restraint',
			desc: 'Vous n\'êtes pas authorisé à effectuer cette action.',
		},
		isowner: {
			title: 'Accès restraint',
			desc: 'Vous n\'êtes pas le propriétaire de cette entité.',
		},
		handler_not_found: {
			title: 'Échec d\'appel',
			desc: 'Le point d\'accès de l\'appel API effectué est introuvable.',
		},
	},
	general: {
		new: 'Nouveau',
		defaultError: {
			title: 'Erreur',
			desc: 'Une erreur inconnue est survenue',
		},
	},
	modal: {
		add: 'Ajouter',
		close: 'Fermer',
		export: 'Exporter',
		apply: 'Appliquer',
		cancel: 'Annuler',
		delete: 'Effacer',
		save: 'Enregistrer',
		archive: 'Archiver',
		copy: 'Copier',
		move: 'Déplacer',
		import: 'Importer',
	},
	modalDelete: {
		title: 'Effacer cette entité',
		desc: 'Êtes-vous certain de vouloir procéder ?',
	},
	snackbar: {
		saved: 'Sauvegardé avec succès !',
		deleted: 'Effacé avec succès !',
	},
	deck: {
		edit: {
			isArchivedWarning: 'Ce paquet a été archivé et ne peut être modifié que si réactivé.',
			isArchivedReactivate: 'Réactiver',
		},
		view: {
			title: 'Lecture',
			position: '{current} de {total}',
		},
		removeModal: {
			title: 'Effacer le paquet',
			desc: 'Êtes-vous certain de vouloir effacer ce paquet de carte ? Vous perdrez toutes les données, paramètres et informations secondaires y étant associés. Peux-être préfériez-vous archivez le paquet à la place ?',
		},
		details: {
			title: 'Informations',
			name: 'Nom',
			icon: 'Icône',
			defaultLangFront: 'Langue par défaut (front)',
			defaultLangBack: 'Langue par défaut (derrière)',
			presentation: 'Présentation',
		},
		data: {
			title: 'Cartes',
			noDataText: 'Il n\'y a aucune carte pour le moment.',
			noResultText: 'Votre recherche n\'a retourné aucun résultat.',
			itemsPerPageAllText: 'Tous',
			itemsPerPageText: 'Éléments par page',
			order: 'Ordre',
			front: 'Devant',
			back: 'Derrière',
			action: 'Action',
			search: 'Rechercher dans cette liste...',
			loading: 'Chargement en cours...',
			bulkActions: 'Actions',
			bulkAction: {
				delete: 'Enlever de la liste',
				restore: 'Restaurer',
			},
		},
		theme: {
			title: 'Thème',
			isEnabled: 'Outrepasser le thème par défaut',
		},
		stats: {
			title: 'Statistiques',
		},
	},
	preferences: {
		tab: {
			general: 'Générale',
			theme: 'Thème',
			interface: 'Interface',
			shortcuts: 'Raccourcis',
			notifications: 'Notifications',
		},
		general: {
			lang: 'Langue',
			manualLaterality: 'Latéralité manuelle',
			manLatLeft: 'Gaucher',
			manLatRight: 'Droitier',
			manLatAmbi: 'Ambidextre',
			deckMode: 'Paquets de la barre latérale',
			deckModeEdit: 'Ouvrir en mode édition',
			deckModeEditData: 'Ouvrir en mode édition de données',
			deckModeView: 'Ouvrir en mode vue',
			sound: 'Effets sonores',
		},
		theme: {
			alertInfo: 'Il s\'agit de votre thème par défaut. Si aucun thème n\'est défini dans votre paquet, celui-ci sera utilisé par défaut.',
			custom: 'Personnalisé',
			dark: 'Foncé',
			text: 'Texte :',
			shadow: 'Ombragé',
			colorFrom: 'Couleur de début :',
			colorTo: 'Couleur de fin :',
			title: 'Palette de couleurs',
		},
		shortcuts: {
			currentHeader: 'Vos raccourcis actuels',
			addNewHeader: 'Ajouter un nouveau raccourci',
			action: 'Action',
			key: 'Touche',
			alertInfo: 'Ces raccourcis nécéssite un ordinateur de bureau et ne fonctionneront pas avec votre mobile ou tablette.',
			removeKey: 'Enlever la combinaison',
			addKey: 'Ajouter une combinaison',
			deleteShortcut: 'Effacer le raccourci',
			addShortcut: 'Ajouter ce raccourci',
			actions: {
				approve: 'Approuver',
				faster: 'Accélérer',
				slower: 'Ralentir',
				delete: 'Effacer',
				add: 'Ajouter',
				pause: 'Pause',
				play: 'Jouer',
				previous: 'Précédent',
				next: 'Suivant',
				toggle: 'Basculer',
				repeat: 'Répéter',
				switch: 'Tourner la carte',
			}
		}
	},
	contact: {
		title: 'Nous contacter',
		name: 'Nom complet',
		email: 'Adresse courriel',
		subject: 'Sujet',
		message: 'Message',
		sendCopy: 'Envoyez-moi une copie',
		send: 'Envoyez',
		success: 'Merci ! Votre message a été envoyé et nous vous répondrons sous peu.',
		subjects: {
			issue: 'Problème avec l\'application',
			feature: 'Nouvelle fonctionnalitée',
			other: 'Autre',
		}
	},
	restricted: {
		forgotPasswordTitle: 'Oublie de mot de passe',
		forgotPasswordDesc: 'Entrez votre vos de passe ci-dessous afin de recevoir un courriel de réinitialisation.',
		forgotPasswordLink: 'J\'ai oublié mon mot de passe',
		registerTitle: 'Créer mon compte',
		registerLink: 'Créer un nouveau compte',
		acceptTermsLoginHint: 'En vous connectant, vous acceptez les <a href="/terms">termes et conditions</a> ainsi que les <a href="/policies">politiques de confidentialité</a>.',
		acceptTermsRegisterHint: 'En vous inscrivant, vous acceptez les <a href="/terms">termes et conditions</a> ainsi que les <a href="/policies">politiques de confidentialité</a>.',
		login: 'Connexion',
		email: 'Adresse courriel',
		username: 'Nom d\'utilisateur',
		password: 'Mot de passe',
		forgotPassword: 'Mot de passe oublié',
		termsLink: 'Terms & conditions',
		policiesLink: 'Politiques de confidentialités',
		googleLogin: 'Connexion avec Google',
		facebookLogin: 'Connexion avec Facebook',
		twitterLogin: 'Connexion avec Twitter',
		linkedInLogin: 'Connexion avec LinkedIn',
		resetPassword: 'Réinitialiser mot de passe',
		backLogin: 'Retour',
		registerBtn: 'M\'inscrire',
		loginBtn: 'Connexion',
		emailPlaceholder: 'Adresse courriel',
		actualPassPlaceholder: 'Mot de passe actuel',
		newPassPlaceholder: 'Nouveau mot de passe',
		newConfirmationPlaceholder: 'Confirmer le nouveau mot de passe',
		passwordPlaceholder: 'Mot de passe',
		resetPasswordExpired: 'Votre clé de réinitialisation de mot de passe a expiré.',
		resetPasswordAnotherOne: 'Générez une autre',
		resetPasswordTitle: 'Réinitisalisation de mot de passe',
		resetPasswordDesc: 'Fournissez et confirmer un nouveau mot de passe ci-dessous.',
		resetPasswordBtn: 'Réinitialiser',
		confirmationPlaceholder: 'Confirmer le mot de passe',
		backToLogin: 'Retour à la connexion',
		resetPasswordResetted: 'Mot de passe réinitialisé !',
		forgotPasswordSent: 'Clé de réinitialisation envoyé !',
		forgotPasswordSentDesc: 'Vérifiez votre boite courriel afin de réinitialiser votre mot de passe.',
		accountActivatedTitle: 'Merci ! Votre compte a été activé !',
		accountActivatedDesc: 'Vous êtes déjà connecté. Cliquez sur le bouton ci-dessous pour accéder à votre dossier.',
		registerSent: 'Activer votre compte !',
		registerSentDesc: 'Vérifier votre boite courriel afin d\'activer votre compte.',
		resendActivation: 'Renvoyez-moi un autre jeton',
		accountActivationResentTitle: 'Clé renvoyé !',
		accountActivationResentDesc: 'Vérifiez votre boite courriel afin d\'activer votre compte. Si vous éprouvez toujours des difficultés, <a href="/contact">contactez notre équipe</a>.',
		accessMyAccount: 'Accédez à mon compte',
	},
	rules: {
		required: 'Ce champ est requis',
		min: 'Min {amount} caractères',
		email: 'Le format de l\'adresse courriel est invalide',
		passwordConfirm: 'Les mots de passe ne sont pas identique',
	},
	form: {
		validation: {
			length: 'La taille du champs est invalide',
			required: 'Ce champs est requis',
			uniqueness: 'Cette valeur est déjà utilisée par quelqu\'un d\'autre',
			identical: 'Ces valeurs ne sont pas identique',
		}
	},
	role: {
		guest: 'Visiteur',
		user: 'Utilisateur',
		admin: 'Administrateur',
		dev: 'Développeur',
	}
};


export default literals;
