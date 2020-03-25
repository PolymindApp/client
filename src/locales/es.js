const literals = {
	title: {
		help: 'Ayuda',
		login: 'Iniciar sesión',
		terms: 'Términos y condiciones',
		policies: 'Políticas de condicioanlidad',
		dashboard: 'Salpicadero',
		community: 'Comunidad',
		shop: 'Mercado de pulgas',
		contact: 'Contacto',
		add: 'Agregar',
		stats: 'Estadísticas',
		deck: 'Paquete',
		preferences: 'Preferencias',
		account: 'Cuenta',
		signOut: 'Cerrar sesión',
		notifications: 'Notificaciones',
		about: 'Acerca de',
		error404: 'Página no encontrada',
		register: 'Inscripción',
	},
	error404: {
		desc: 'Un viento de misterio se levanta sobre nosotros...'
	},
	dashboard: {
		contextual: {
			filters: 'Filtros',
			archived: 'Archivado',
			favourite: 'Destacados',
			public: 'Público',
			andMore: '+{total} otros',
		},
		filteredNoResults: 'No hay resultados...',
		filteredNoResultsDesc: 'Sus criterios de búsqueda devolvieron ningún resultados',
	},
	about: {
		general: {
			title: 'General'
		},
		privacy: {
			title: 'Políticas de privacidad'
		},
		terms: {
			title: 'Términos y condiciones'
		},
		contact: {
			title: 'Contactar'
		},
	},
	account: {
		recentActivities: 'Actividades recientes',
		publicDecks: 'Paquetes públicos',
		noPublicDecks: 'Este usuario aún no ha autorizado que un paquete sea visible públicamente.',
		timeline: 'Actividades',
		decks: 'Paquetes',
	},
	app: {
		menuGroup: {
			decks: 'Paquetes',
			shared: 'Compartidos',
			personal: 'Personal',
			others: 'Otros',
			admin: 'Administración',
		},
	},
	component: {
		page: {
			empty: 'Esta pagina todavía no existe.'
		},
		select: {
			noDataText: 'No hay datos disponibles',
		},
		calendar: {
			today: 'Hoy',
			day: 'Día',
			week: 'Semana',
			month: 'Mes',
			fourDay: '4 días',
		},
		deck: {
			public: 'Público',
			play: 'Reproducir',
			edit: 'Modificar',
			favourite: 'Agregar a los favoritos',
			enterFullScreen: 'Pantalla completa',
			exitFullScreen: 'Salir del modo de pantalla completa',
			add: 'Agregar',
		},
		deckPlayer: {
			noCard: 'No tarjetas!',
			noCardClickHere: 'Agrega unos',
			ready: 'Listo?',
			readyClickHere: 'Haz clic aquí para empezar',
		},
	},
	sidebar: {
		filterPlaceholder: 'Filtrar...',
		decksEmpty: 'No tienes paquetes por el momento.',
		searchEmpty: 'No se encontraron elementos de menú con estos términos de búsqueda.',
		hasFilter: 'Sus términos de búsqueda devolvieron los siguientes elementos del menú:',
	},
	toolbar: {
		help: 'Ayuda',
		seeAllNotif: 'Ver todas las notificaciones',
		tooltip: {
			search: 'Buscar',
			options: 'Opciones',
			menu: 'Menú',
			langs: 'Cambiar idioma',
			pinSidebar: 'Fijar la barra lateral',
			help: 'Ver el manual de ayuda',
			adddecks: 'Agregrar un paquete',
			notification: 'Notificaciones',
		},
	},
	switch: {
		activated: 'Activado',
		disabled: 'Discapacitado',
	},
	help: {
		sectionTitle: '¿Con qué podemos ayudarlo?',
	},
	error: {
		code400: 'Mala consulta',
		code401: 'No permitido',
		code403: 'Prohibido',
		code404: 'No encontrado',
		code500: 'Error interno del servidor',
	},
	general: {
		new: 'Nuevo',
		defaultErrorTitle: 'Error',
		defaultErrorDesc: 'Se produjo un error desconocido',
	},
	modal: {
		close: 'Cerrar',
		export: 'Exportar',
		apply: 'Aplicar',
		cancel: 'Cancelar',
		delete: 'Borrar',
		save: 'Guardar',
		archive: 'Archivar',
	},
	snackbar: {
		saved: '¡Guardado con éxito!',
		deleted: '¡Borrado con éxito!',
	},
	deck: {
		edit: {
			isArchivedWarning: 'Este paquete se ha archivado y solo se puede cambiar si se reactiva.',
			isArchivedReactivate: 'Reactivar',
		},
		view: {
			title: 'Lectura',
			position: '{current} de {total}',
		},
		removeModal: {
			title: 'Borrar paquete',
			desc: '¿Está seguro de que desea eliminar este paquete de tarjeta? Perderá todos los datos, la configuración y la información secundaria asociada a ella. ¿Puedes preferir archivar el paquete en su lugar? ',
		},
		details: {
			title: 'Información',
			name: 'Nombre',
			icon: 'Icono',
			defaultLangFront: 'Idioma por defecto (frente)',
			defaultLangBack: 'Idioma por defecto (atrás)',
			presentation: 'Presentación',
		},
		data: {
			title: 'Tarjetas',
			noDataText: 'No hay mapa en este momento',
			noResultText: 'Su búsqueda no arrojó ningún resultado',
			itemsPerPageAllText: 'Todos',
			itemsPerPageText: 'Artículos por página',
			order: 'Orden',
			front: 'Frente',
			back: 'Detrás',
			action: 'Acción',
			search: 'Buscar en esta lista ...',
			loading: 'Cargando ...',
			bulkActions: 'Acciones',
			bulkAction: {
				delete: 'Eliminar de la lista',
				restore: 'Restaurar',
			},
		},
		theme: {
			title: 'Tema',
			isEnabled: 'Anular el tema predeterminado',
		},
		stats: {
			title: 'Estadísticas',
		},
	},
	preferences: {
		tab: {
			general: 'General',
			theme: 'Tema',
			interface: 'Interfaz',
			shortcuts: 'Atajos',
			notifications: 'Notificaciones',
		},
		general: {
			lang: 'Idioma',
			manualLaterality: 'Lateralidad manual',
			manLatLeft: 'Zurdo',
			manLatRight: 'Diestro',
			manLatAmbi: 'Ambidextro',
			deckMode: 'Paquetes de la barra lateral',
			deckModeEdit: 'Abrir en modo edición',
			deckModeEditData: 'Abrir en modo edición de datos',
			deckModeView: 'Abrir en modo vista',
			sound: 'Efectos de sonido',
		},
		theme: {
			alertInfo: 'Este es tu tema predeterminado. Si no hay un tema definido en su paquete, se usará por defecto.',
			custom: 'Personalizado',
			dark: 'Oscuro',
			text: 'Texto:',
			shadow: 'Sombreado',
			colorFrom: 'Color de inicio:',
			colorTo: 'Color final:',
			title: 'Paleta de colores',
		},
		shortcuts: {
			currentHeader: 'Tus atajos actuales',
			addNewHeader: 'Agregar nuevo atajo',
			action: 'Acción',
			key: 'Tecla',
			alertInfo: 'Estos atajos requieren una computadora y no funcionarán con su dispositivo móvil o tableta.',
			removeKey: 'Eliminar combinación',
			addKey: 'Agregar una combinación',
			deleteShortcut: 'Eliminar atajo',
			addShortcut: 'Agregar este atajo',
			actions: {
				approve: 'Aprobar',
				faster: 'Acelerar',
				slower: 'Reduzcar la velocidad',
				delete: 'Borrar',
				add: 'Agregar',
				pause: 'Pausar',
				play: 'Reproducir',
				previous: 'Anterior',
				next: 'Siguiente',
				toggle: 'Alternar',
				repeat: 'Repetir',
				switch: 'Girar la tarjeta',
			}
		}
	},
	contact: {
		title: 'Contáctenos',
		name: 'Nombre completo',
		email: 'Dirección de correo electrónico',
		subject: 'Sujetos',
		message: 'Mensaje',
		sendCopy: 'Envíame una copia',
		send: 'Enviar',
		success: 'Gracias ! Su mensaje ha sido enviado y nos pondremos en contacto con usted a la brevedad.',
		subjects: {
			issue: 'Problema con la app',
			feature: 'Nueva funcionalidad',
			other: 'Otro',
		}
	},
	restricted: {
		forgotPasswordTitle: 'Olvidé mi contraseña',
		forgotPasswordDesc: 'Ingrese su correo electrónico para recibir un enlace de restablecimiento de contraseña por correo electrónico.',
		forgotPasswordLink: 'Olvidé mi contraseña',
		registerTitle: 'Crear mi cuenta',
		registerLink: 'Crear una nueva cuenta',
		registrationLocked: 'Acceso limitado a invitados en este momento. Disculpe las molestias.',
		acceptTermsLoginHint: 'Iniciando sesión, acepta los <a href="/terms">términos y condiciones</a> así como las <a href="/policies">políticas de privacidad</a>.',
		acceptTermsRegisterHint: 'Al registrarse, acepta los <a href="/terms">términos y condiciones</a> así como las <a href="/policies">políticas de privacidad</a>.',
		login: 'Iniciar sesión',
		email: 'Correo electrónico',
		username: 'Nombre de usuario',
		password: 'Contraseña',
		forgotPassword: 'Contraseña olvidada',
		termsLink: 'Términos y condiciones',
		policiesLink: 'Políticas de privacidad',
		googleLogin: 'Iniciar sesión con Google',
		facebookLogin: 'Iniciar sesión con Facebook',
		twitterLogin: 'Iniciar sesión con Twitter',
		linkedInLogin: 'Iniciar sesión con LinkedIn',
		resetPassword: 'Restablecer contraseña',
		backLogin: 'Volver',
		backWebsite: 'Sitio web',
		registerBtn: 'Inscribirme',
		loginBtn: 'Sign-In',
		emailPlaceholder: 'Correo electrónico',
		passwordPlaceholder: 'Contraseña',
	},
	rules: {
		required: 'Este campo es obligatorio',
		min: 'Min {amount} caracteres',
		email: 'El formato de la dirección de correo electrónico no es válido.',
	},
	role: {
		guest: 'Visitante',
		user: 'Usuario',
		admin: 'Administrador',
		dev: 'Desarrollador',
	}
};

export default literals;
