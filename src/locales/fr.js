const literals = {
	title: {
		help: 'Aide',
		login: 'Connexion',
		locked: 'Compte vérouillé',
		terms: 'Termes & Conditions',
		policies: 'Politiques de Condidentialités',
		dashboard: 'Tableau de bord',
		news: 'Nouvelles',
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
		dataset: 'Bases de données',
		accountMessaging: 'Messagerie',
	},
	dashboard: {

		objectives: {
			title: 'Votre cheminement',
			label1: 'Russe',
			label2: 'Français',
			label3: 'Anglais',
			label4: 'Espagnol',
			label5: 'Hindi',
			label6: 'Prononciation',
			label7: 'Conjugaison',
			label8: 'Grammaire',
			label9: 'Autre',
			label10: 'Vocabulaire',
		},

		strategies: 'Strategies ({total})',
		components: 'Composantes ({total})',
		documents: 'Documents ({total})',
		datasets: 'Bases de données ({total})',

		strategiesEmpty: 'Aucune stratégie pour le moment',
		componentsEmpty: 'Aucune composante pour le moment',
		documentsEmpty: 'Aucun document pour le moment',
		datasetsEmpty: 'Aucune base de donnée pour le moment',

		news: {
			title: 'Dernières actualités',
			seeMore: 'En savoir plus',
			types: {
				general: 'Générale',
				issue: 'Problème',
			}
		},

		contextual: {
			filters: 'Filtres',
			archived: 'Archivé',
			favourite: 'Favoris',
			public: 'Publique',
			andMore: '+{total} autres',
		},
		new: {
			dataset: 'Base de donnée',
			document: 'Document',
			component: 'Composante',
			strategy: 'Stratégie',
		},
		filteredNoResults: 'Aucun résultat...',
		filteredNoResultsDesc: 'Vos critères de recherches n\'ont retournés aucun résultat',
	},
	news: {
		writtenBy: 'Rédigé par <strong>{screenName}</strong>',
	},
	notification: {
		types: {
			NEW_COMMENT_component: 'A commenté votre composante <strong>{name}</strong>',
		}
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
	revision: {
		btnTitle: 'Révision',
	},
	comment: {
		title: 'Commentaires',
		btnTitle: 'Commentaires',
		newMessagePlaceholder: 'Écrivez votre commentaire ici...',
		totalTitle: '{amount} commentaire(s)',
		sortBy: 'Ordonner par',
		viewCompleteMsg: 'Lire plus...',
		unviewCompleteMsg: 'Réduire...',
		emptyTitle: 'Aucun commentaire',
		emptyDesc: 'Soyez le premier à commenter en utilisant le champs ci-dessous',
		thumbUpTooltip: 'J\'aime',
		thumbDownTooltip: 'Je n\'aime pas',
		deleteTooltip: 'Effacer',
		editTooltip: 'Modifier',
		replyBtn: 'Répondre',
		deleteTitle: 'Effacer un commentaire',
		deleteDesc: 'Êtes-vous certain de vouloir effacer ce commentaire ?',
		commentDeleted: 'Commentaire effacé par l\'utilisateur',
	},
	commitGraph: {
		noContribution: '<strong>Aucune contribution</strong> le {date}',
		contributions: '<strong>{total} contributions</strong> le {date}',
		noCommitsThisDay: '<strong>Aucune contribution</strong> le {date}',
		contributionsDay: 'Les <strong>{total} contributions</strong> du {date} :',
		view: 'Voir',
	},
	activity: {
		comment: {
			dataset: {
				title: 'A commenté la base de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_column: {
				title: 'A commenté la colonne de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_row: {
				title: 'A commenté la ligne de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_cell: {
				title: 'A commenté la donnée <strong>{name}</strong>',
				desc: '',
			},
			component: {
				title: 'A commenté la composante <strong>{name}</strong>',
				desc: 'A écrit : <em>{comment}</em>',
			},
		},
		create: {
			dataset: {
				title: 'A créé une nouvelle base de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_column: {
				title: 'A créé une nouvelle colonne de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_row: {
				title: 'A créé une nouvelle ligne de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_cell: {
				title: 'A créé une nouvelle donnée <strong>{name}</strong>',
				desc: '',
			},
			component: {
				title: 'A créé une nouvelle composante <strong>{name}</strong>',
				desc: '',
			},
		},
		delete: {
			dataset: {
				title: 'A effacé la base de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_column: {
				title: 'A effacé la colonne de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_row: {
				title: 'A effacé la ligne de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_cell: {
				title: 'A effacé la donnée <strong>{name}</strong>',
				desc: '',
			},
			component: {
				title: 'A effacé la composante <strong>{name}</strong>',
				desc: '',
			},
		},
		'soft-delete': {
			dataset: {
				title: 'A effacé la base de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_column: {
				title: 'A effacé la colonne de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_row: {
				title: 'A effacé la ligne de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_cell: {
				title: 'A effacé la donnée <strong>{name}</strong>',
				desc: '',
			},
			component: {
				title: 'A effacé la composante <strong>{name}</strong>',
				desc: '',
			},
		},
		update: {
			dataset: {
				title: 'A mis à jour la base de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_column: {
				title: 'A mis à jour la colonne de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_row: {
				title: 'A mis à jour la ligne de donnée <strong>{name}</strong>',
				desc: '',
			},
			dataset_cell: {
				title: 'A mis à jour la donnée <strong>{name}</strong>',
				desc: '',
			},
			component: {
				title: 'A mis à jour la composante <strong>{name}</strong>',
				desc: '',
			},
		},
	},
	mediaBrowser: {
		filterPlaceholder: 'Filtrer les étiquettes...',
		types: {
			all: 'Tous les fichiers',
			images: 'Images',
			audios: 'Audios',
			others: 'Autres',
			tags: 'Étiquettes',
		},
	},
	sortBy: {
		mostRecent: 'Plus récent',
		oldest: 'Plus ancien',
		thumbsUp: 'Plus de j\'aime',
		thumbsDown: 'Plus de j\'aime pas',
	},
	account: {
		contributionLastYear: '{total} contributions depuis un an',
		messages: 'Derniers messages',
		recentActivities: 'Récentes activités',
		header: {
			writeMsg: 'Écrire un message',
			follow: 'Suivre',
			unfollow: 'Ne plus suivre',
			followers: 'Abonnées',
			following: 'Abonnements',
			newMsg: 'Nouveau message',
			msgSent: 'Message envoyé !',
			followingModalTitle: 'Abonnement(s)',
			followersModalTitle: 'Abonné(es)',
			noFollowings: 'Aucun abonnement pour le moment',
			noFollowers: 'Aucun abonné pour le moment',
		},
		activities: {
			messagesEmpty: 'Aucun message pour le moment',
			historyEmpty: 'Aucune historique pour le moment',
			history: {
				createPage: 'A écrit une nouvelle page <strong>{title}</strong>',
				createComponent: 'A développé une nouvelle composante <strong>{name}</strong>',
				createDocumentation: 'A documenté une nouvelle section <strong>{title}</strong>',
			},
			view: 'Voir',
			publicItems: 'Éléments publiques',
			publicItemsEmpty: 'Aucun élément n\'a été publié par cet utilisateur.',
			postOnWallPlaceholder: 'À quoi songez-vous ?',
		},
		changeWallpaper: 'Changer le fond d\'écran',
		elements: {
			title: 'Éléments',
		},
		wall: {
			title: 'Activités',
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
			applyChanges: 'Appliquer',
		},
		messaging: {
			title: 'Messagerie',
			newMessagePlaceholder: 'Écrivez votre message...',
			empty: 'Aucun message',
			selectUserFirst: 'Veuillez sélectionner un fil de discussion',
			emptyTitle: 'Aucun message',
			emptyDesc: 'Si quelqu\'un vous écrit, vous verrez son message ici',
		},
		notifications: {
			title: 'Notifications',
			emptyTitle: 'Aucune notification pour le moment',
			emptyDesc: 'Vous êtes à jour !',
			myTitle: 'Mes notifications ({total})',
			followingTitle: 'Mes abonnements ({total})',
			emptyFollowing: 'Aucun abonnement pour le moment',
		},
		settings: {
			title: 'Paramètres',
			language: 'Langue',
			generalSectionTitle: 'Générale',
			notificationSectionTitle: 'Notifications',
			newNotificationSoundLabel: 'Son de nouvelle notification',
			newMessageSoundLabel: 'Son de nouveau message',
			ideSectionTitle: 'Développement',
			theme: {
				title: 'Thème',
				dark: 'Foncé',
				light: 'Clair',
			},
			fontSize: 'Taille de police',
			tabSize: 'Taille de la tabulation',
			showLines: 'Afficher les lignes',
			externalMsg: 'Messagerie',
			externalMsgPublic: 'Publique',
			externalMsgFriends: 'Ami(e)s',
			externalMsgNobody: 'Désactivé',
			yes: 'Oui',
			no: 'Non',
		},
	},
	app: {
		menuGroup: {
			decks: 'Paquets',
			shared: 'Partagés',
			personal: 'Personnel',
			strategies: 'Stratégies',
			components: 'Composantes',
			document: 'Documents',
			dataset: 'Bases de données',
			others: 'Autres',
			admin: 'Administration',
		},
	},
	strategy: {

		newTitle: 'Nouvelle',
		isDeleted: 'Cette stratégie a été effacé. C\'est votre dernière chance de la récupérer.',
		restore: 'Restaurer',

		publishModal: {
			title: 'Publier',
		},
		forkModal: {
			title: 'Bifurquer',
			forkDesc: 'Cette action créera une copie de la révision de la stratégie en cours. Êtes-vous certain de vouloir continuer ?',
		},

		settings: {
			title: 'Réglages',
			namePlaceholder: 'Nom de la stratégie',
			isPrivateLabel: 'Privé',
			isInvisibleLabel: 'Sans aspect visuel',
			descPlaceholder: 'Description',
			instructionsPlaceholder: 'Instructions',
			iconPlaceholder: 'Icône',
			categoryPlaceholder: 'Catégorie',
		},
		interface: {
			title: 'Interfaces',
			stencils: 'Pochoirs',
			components: 'Composantes',
			hierarchy: 'Hiérarchie',
			addLayer: 'Ajouter',
			orientation: 'Orientation',
			orientations: {
				_16_9: 'Mode paysage (16/9)',
				_9_16: 'Mode portrait (9/16)',
				_4_3: 'Mode paysage (4/3)',
				_3_4: 'Mode portrait (3/4)',
			},
			tooltips: {
				orientation: 'Orientation',
				undo: 'Annuler',
				redo: 'Refaire',
				pointer: 'Déplacer',
				select: 'Sélectionner',
				draw: 'Dessiner',
				rotate: 'Tourner',
				layers: 'Couches',
				fullscreenOn: 'Aller en mode plein écran',
				fullscreenOff: 'Sortir du mode plein écran',
				zoomIn: 'Agrandir',
				zoomOut: 'Rétrécir',
				horizontalAlign: 'Alignement horizontale',
				verticalAlign: 'Alignement verticale',
			},
		},
		workflow: {
			title: 'Flux de travail',
			components: 'Composantes',
			datasets: 'Bases de données',
			documents: 'Documents',
		},
	},
	media: {
		title: 'Galerie de médias',
	},
	components: {
		console: {
			runCommand: 'Exécuter une commande',
			clear: 'Nettoyer',
			emptyTitle: 'Aucun événement',
			emptyDesc: 'Vous verrez les événements de console s\'afficher ici',
			wasCleared: 'La console a été nettoyé',
			total: {
				log: '{total} événement(s)',
				error: '{total} erreur(s)',
				warning: '{total} avertissement(s)',
				info: '{total} information(s)',
			},
		},
	},
	component: {

		newTitle: 'Nouveau',
		isDeleted: 'Cette composante a été effacé. C\'est votre dernière chance de la récupérer.',
		restore: 'Restaurer',

		settings: {
			title: 'Réglages',
			isPrivateLabel: 'Privé',
			isInvisibleLabel: 'Sans aspect visuel',
			namePlaceholder: 'Nom de la composante',
			descPlaceholder: 'Description',
			instructionsPlaceholder: 'Instructions',
			iconPlaceholder: 'Icône',
			categoryPlaceholder: 'Catégorie',
			colorPlaceholder: 'Couleur',
			explanations: 'Une composante est un élément visuel ou un groupe de méthode avec paramètres et évènements programmable, héritable et réutilisable que vous pouvez personnaliser et imbriquer dans des stratégies afin de conceptualiser des stratégies d\'apprentissage sur-mesure.',
			readDoc: 'Explorer la documentation',
		},
		source: {
			title: 'Source',
			viewTooltip: 'Basculer le mode de vue',
			settingsTooltip: 'Paramétrage',
			consoleTooltip: 'Basculer l\'affichage de la console',
			previewTooltip: 'Basculer l\'affichage de la prévisualisation',
			codeTooltip: 'Basculer l\'affichage du code',
			propertiesTooltip: 'Basculer l\'affichage des propriétés',
			executeTooltip: 'Exécuter',
			autoUpdate: 'MAJ Auto.',
			fullscreenOn: 'Aller en mode plein écran',
			fullscreenOff: 'Sortir du mode plein écran',
			codeIssue: 'Il y a un problème avec votre code',
			publishModal: {
				title: 'Publier',
			},
			forkModal: {
				title: 'Bifurquer',
				forkDesc: 'Cette action créera une copie de la révision de la composante en cours. Êtes-vous certain de vouloir continuer ?',
			},
			settingsModal: {
				title: 'Paramètres',
			},
			injectorDelete: {
				hookTitle: 'Effacer un crochet',
				hookDesc: 'Cet crochet est peut-être relié à votre code interne ou utilisé par une composante externe. Désirez-vous vraiment l\'effacer ?',
				parameterTitle: 'Effacer un paramètre',
				parameterDesc: 'Cet paramètre est peut-être relié à votre code interne ou utilisé par une composante externe. Désirez-vous vraiment l\'effacer ?',
				functionTitle: 'Effacer une fonction',
				functionDesc: 'Cette fonction est peut-être relié à votre code interne ou utilisé par une composante externe. Désirez-vous vraiment l\'effacer ?',
				testTitle: 'Effacer un test',
				testDesc: 'Êtes-vous certain de vouloir effacer ce test ?',
			},
			injectorModal: {
				hookTitle: 'Modifier un crochet',
				hookNewTitle: 'Ajouter un crochet',
				parameterTitle: 'Modifier un paramètre',
				parameterNewTitle: 'Ajouter un paramètre',
				functionTitle: 'Modifier une fonction',
				functionNewTitle: 'Ajouter une fonction',
				testTitle: 'Modifier un test',
				testNewTitle: 'Ajouter un test',

				labels: {
					name: 'Nom',
				}
			},
			zoomIn: 'Agrandir',
			zoomOut: 'Rétrécir',
			hooks: {
				title: 'Crochets',
				empty: 'Aucun crochet pour le moment',
				add: 'Ajouter un crochet',
			},
			parameters: {
				title: 'Paramètres',
				empty: 'Aucun paramètre pour le moment',
				add: 'Ajouter un paramètre',
			},
			functions: {
				title: 'Fonctions',
				empty: 'Aucune fonction pour le moment',
				add: 'Ajouter une fonction',
			},
			tests: {
				title: 'Tests',
				empty: 'Aucun test pour le moment',
				add: 'Ajouter un test',
			},
			injection: {
				run: 'Exécuter',
				edit: 'Modifier',
				remove: 'Effacer',
			},
		},
		params: {
			title: 'Paramètres',
		},
		events: {
			title: 'Événements',
		},

		iconListField: {
			clear: 'Nettoyer',
			selectIcon: 'Sélectionner une icône',
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
		},

		categories: {
			undefined: 'Non-défini',
			general: 'Général',
			language: 'Langue',
			functions: 'Fonctions',
		}
	},
	dataset: {

		newTitle: 'Nouveau',

		publishModal: {
			title: 'Publier',
		},
		forkModal: {
			title: 'Bifurquer',
			forkDesc: 'Cette action créera une copie de la révision de la base de donnée en cours. Êtes-vous certain de vouloir continuer ?',
		},

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
			columnIsActive: 'Active',
			columnCreatedAt: 'Ajouté le',
			searchLabel: 'Rechercher/Filtrer...',
			noResults: 'Aucun résultat ne correspond à vos critères de recherches...',
			noData: 'Aucune donnée disponible',
			isLoading: 'Chargement en cours...',
			bulkActions: 'Action en vrac',
			bulkAction: {
				delete: 'Effacer',
				restore: 'Restaurer',
				reset: 'Réinitialiser',
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
				delete: 'Effacer la donnée',
				restore: 'Restorer la donnée',
				edit: 'Modifier la donnée',
				selectAll: 'Tout sélectionner',
			},
			status: 'Statut',
			created_by: 'Créé par',
			created_on: 'Créé le',
			statuses: {
				published: 'Publié',
				draft: 'Brouillon',
				deleted: 'Effacé',
			},
			rowMenu: {
				insertRowAbove: 'Insérer une ligne au dessus',
				insertRowBelow: 'Insérer une ligne en dessous',
				removeRow: 'Enlever la ligne',
				removeRows: 'Enlever les lignes ({total})',
				comment: 'Commenter',
			},
			columnMenu: {
				insertColumnLeft: 'Insérer une colonne à gauche',
				insertColumnRight: 'Insérer une colonne à droite',
				removeColumn: 'Enlever la colonne',
				removeColumns: 'Enlever les colonnes ({total})',
				comment: 'Commenter',
				isRequired: 'Champs requis',
				isRequiredPlural: 'Champs requis ({total})',
				type: 'Type',
				types: {
					text: 'Texte',
					number: 'Numéro',
					date: 'Date',
					boolean: 'Vrai/Faux',
					list: 'Liste',
					recording: 'Enregistrement',
					audio: 'Audio',
					file: 'Fichier',
					image: 'Image',
					wysiwyg: 'WYSIWYG',
				},
				clearColumn: 'Nettoyer la colonne',
				clearColumns: 'Nettoyer les colonnes ({total})',
			},
			cellMenu: {
				comment: 'Commenter',
				clearCell: 'Nettoyer la cellule',
				clearCells: 'Nettoyer les cellules ({total})',
				copy: 'Copier',
				cut: 'Couper',
				paste: 'Coller',
			},
			modal: {
				copy: {
					title: 'Copier vers...',
					selectDb: 'Sélectionner une base de donnée vers laquelle copier les lignes sélectionnées :',
					databaseLabel: 'Base de donnée',
					newDbLabel: 'Nouvelle base de donnée',
					newDbNameLabel: 'Nom de la base de donnée',
				},
				comment: {
					title: 'Commenter une donnée',
					commentLabel: 'Commentaire',
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
						recording: 'Enregistrement',
						file: 'Fichier',
						relation: 'Relation',
					}
				},
			},
		},
		view: {
			title: 'Vues',
		},
	},
	sidebar: {
		myAccount: 'Voir mon profile',
		filterPlaceholder: 'Filtrer...',
		decksEmpty: 'Vous n\'avez aucun paquet pour le moment.',
		strategiesEmpty: 'Vous n\'avez aucune stratégie pour le moment.',
		componentsEmpty: 'Vous n\'avez aucune composantes pour le moment.',
		documentEmpty: 'Vous n\'avez aucun document pour le moment.',
		datasetEmpty: 'Vous n\'avez aucune base de donnée pour le moment.',
		searchEmpty: 'Aucun élément de menu n\'a été trouvé avec ces termes de recherche.',
		hasFilter: 'Vos termes de recherche ont retourné les éléments de menu ci-dessus.',
	},
	toolbar: {
		help: 'Aide',
		seeAllNotif: 'Voir toutes les notifications',
		seeAllMessages: 'Voir tous les messages',
		searchPlaceholder: 'Entrez vos termes de recherche...',
		search: {
			users: 'Utilisateurs',
			pages: 'Pages',
			components: 'Composantes',
			datasets: 'Bases de données',
			strategies: 'Stratégies',
			noResults: 'Aucun résultat trouvé',
			latestTerms: 'Dernières requêtes :',
		},
		newNotification: 'Vous avez reçu une notification',
		newMessage: 'Vous a envoyé un nouveau message',
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
			adddocument: 'Ajouter un document',
			adddataset: 'Ajouter une base de données',
			shortcuts: 'Raccourcis',
			collapse: 'Rabaisser',
			expand: 'Étendre',
			messaging: 'Messagerie',
		},
	},
	switch: {
		activated: 'Activé',
		disabled: 'Désactivé',
	},
	help: {
		title: 'Manuel d\'aide',
		close: 'Fermer',
		noSelectTitle: 'Manuel d\'aide',
		noSelectDesc: 'Veuillez sélectionner un élément du menu contextuel',
		filterPlaceholder: 'Filtrer/rechercher...',
		noItems: 'Aucun élément d\'aide n\'a été ajouté pour le moment.',
	},
	diff: {
		quote: 'A changé sa citation pour <strong>{value}</strong>',
		screen_name: 'A changé son surnom pour <strong>{value}</strong>',
		first_name: 'A changé son prénom pour <strong>{value}</strong>',
		last_name: 'A changé son nom de famille pour <strong>{value}</strong>',
		gender: 'A changé son sexe pour <strong>{value}</strong>',
		biography: 'A changé sa biographie',
		settings: 'A changé ses paramètres',
		avatar: 'A changé sa photo de profil',
		wallpaper: 'A changé son fond d\'écran',
		title: 'A changé sa position',
	},
	error: {

		defaultTitle: 'Erreur',
		goBack: 'Revenir en arrière',

		codeX: 'Erreur {code}',
		code400: 'Mauvaise Requête',
		code401: 'Non autorisé',
		code403: 'Interdit',
		code404: 'Introuvable',
		code500: 'Erreur serveur interne',

		actions: {
			goBack: 'Retourner',
			goHome: 'Page d\'accueil',
			search: 'Rechercher',
		},

		404: {
			title: 'Oups ! Cette page ne semble pas exister.',
			desc: 'Le lien que vous avez suivi peut être incorrect ou la page peut avoir été supprimée. Utilisez les boutons de navigation ci-dessous afin de retrouver votre chemin.',
		},

		default: {
			title: 'Une erreur est survenue.',
			desc: 'Une alerte a été envoyé aux administrateurs afin que ce problème soit résolue.',
		},

		ws: {
			title: 'Erreur de connexion',
			desc: 'Impossible d\'établir une connexion avec le serveur de communication en temps réel.',
		},

		api: {
			title: 'Erreur de connexion',
			desc: 'Impossible d\'établir une connexion avec le serveur d\'interface de communication.',
		},

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
	modalGallery: {
		title: 'Galerie d\'images',
		download: 'Télécharger',
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
		post: 'Poster',
		send: 'Envoyer',
		publish: 'Publier',
		fork: 'Bifurquer',
	},
	modalDelete: {
		title: 'Effacer cette entité',
		desc: 'Êtes-vous certain de vouloir procéder ?',
	},
	snackbar: {
		copiedToClipboard: 'Copier dans le presse-papier !',
		saved: 'Sauvegardé avec succès !',
		deleted: 'Effacé avec succès !',
		forked: 'Bifurqué avec succès !',
		allSelected: 'Tout sélectioné !',
	},
	deck: {
		view: 'Voir',
		edit: 'Modifier',
		createdBy: 'Créé par {name}',
		createdByYou: 'Créé par vous',
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
		subjectOther: 'Autre sujet',
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
		registrationLocked: 'Accès limité aux invités pour le moment. Nous nous excusons pour l\'inconvénient.',
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
		githubLogin: 'Connexion avec GitHub',
		resetPassword: 'Réinitialiser mot de passe',
		tempLocked: 'Votre compte a été vérouillé temporairement en votre absence. Revalider votre mot de passe pour retourner à vos activités.',
		lockedOtherAccount: 'Utiliser un autre compte',
		backLogin: 'Retour',
		backWebsite: 'Site web',
		registerBtn: 'M\'inscrire',
		loginBtn: 'Connexion',
		unlockBtn: 'Dévérouiller',
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
		member: 'Utilisateur',
		admin: 'Administrateur',
		administrator: 'Administrateur',
		dev: 'Développeur',
	},
	dataType: {
		optionsTooltip: 'Options',
		commentsTooltip: 'Commentaires',
		options: {
			edit: 'Modifier',
			comment: 'Commenter',
			clean: 'Nettoyer',
			reset: 'Reinitialiser',
		},
		playAudioTooltip: 'Reproduire',
		stopAudioTooltip: 'Intérrompre',
		playRecordingTooltip: 'Enregistrer',
		stopRecordingTooltip: 'Intérrompre',
	},
	shortcuts: {
		main: {
			escape: {
				title: 'Sortir',
				desc: 'Sort d\'un context (fenêtre, couverture, etc)',
			},
			help: {
				title: 'Aide',
				desc: 'Bascule la fenêtre du manuel d\'aide',
			},
			search: {
				title: 'Rechercher',
				desc: 'Ouvre le menu de recherche globale',
			},
			sidebar: {
				title: 'Barre latérale',
				desc: 'Ouvre la barre de menu latérale et met le focus dans le champs de recherche',
			},
		},
		navigation: {
			dashboard: {
				title: 'Tableau de bord',
				desc: 'Retourne au tableau de bord',
			},
			profile: {
				title: 'Profil',
				desc: 'Va au profil utilisateur',
			},
		},
		dataset: {
			save: {
				title: 'Sauvegarder',
				desc: 'Enregistre les données sur le serveur',
			},
		},
		datasetData: {
			add: {
				title: 'Ajouter une donnée',
				desc: 'Ouvre le panneau d\'ajout de donnée',
			},
		},
		component: {
			save: {
				title: 'Sauvegarder',
				desc: 'Enregistrer les modifications',
			},
		},
		componentSource: {
			zoomReset: {
				title: 'Réinitialiser le zoom',
				desc: 'Réinitialiser le zoom de la fenêtre de prévisualisation',
			},
			zoomIn: {
				title: 'Agrandir',
				desc: 'Agrandir la fenêtre de prévisualisation',
			},
			zoomOut: {
				title: 'Rétrécir',
				desc: 'Rétrécir la fenêtre de prévisualisation',
			},
			fullscreen: {
				title: 'Basculer plein écran',
				desc: 'Basculer l\'écran de prévisualisation en mode normal ou plein écran',
			},
			switchHtml: {
				title: 'Basculer HTML',
				desc: 'Basculer vers l\'onglet HTML',
			},
			switchJs: {
				title: 'Basculer JavaScript',
				desc: 'Basculer vers l\'onglet JavaScript',
			},
			switchCss: {
				title: 'Basculer CSS',
				desc: 'Basculer vers l\'onglet CSS',
			},
			applyChanges: {
				title: 'Appliquer les changements',
				desc: 'Appliquer les changements afin de les prévisualiser',
			},
			clearConsole: {
				title: 'Nettoyer la console',
				desc: 'Vide le journal des événements de toutes les entrés existantes',
			},
		},
		strategyInterface: {
			undo: {
				title: 'Annuler',
				desc: 'Annuler le dernier changement',
			},
			redo: {
				title: 'Refaire',
				desc: 'Refaire le dernier changement',
			},
			zoomReset: {
				title: 'Réinitialiser le zoom',
				desc: 'Réinitialiser le zoom de la fenêtre de prévisualisation',
			},
			zoomIn: {
				title: 'Agrandir',
				desc: 'Agrandir la fenêtre de prévisualisation',
			},
			zoomOut: {
				title: 'Rétrécir',
				desc: 'Rétrécir la fenêtre de prévisualisation',
			},
			fullscreen: {
				title: 'Basculer plein écran',
				desc: 'Basculer l\'écran de prévisualisation en mode normal ou plein écran',
			},
		},
		groupTitles: {
			main: 'Généraux',
			navigation: 'Navigation rapide',
			dataset: 'Bases de données',
			datasetData: 'Bases de données > Données',
			component: 'Composante',
			componentSource: 'Composante > Source',
		},
	}
};


export default literals;
