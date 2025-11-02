// Elements
const form = document.getElementById('expense-form');
const txType = document.getElementById('tx-type');
const nameInput = document.getElementById('expense-name');
const amountInput = document.getElementById('expense-amount');
const categoryInput = document.getElementById('expense-category');
const dateInput = document.getElementById('expense-date');
const notesInput = document.getElementById('expense-notes');
const resetBtn = document.getElementById('reset-btn');

const tbody = document.getElementById('tx-tbody');
const sumIncomeEl = document.getElementById('sum-income');
const sumExpensesEl = document.getElementById('sum-expenses');
const sumBalanceEl = document.getElementById('sum-balance');
const yearEl = document.getElementById('year');

const filterType = document.getElementById('filter-type');
const filterCategory = document.getElementById('filter-category');
const filterFrom = document.getElementById('filter-from');
const filterTo = document.getElementById('filter-to');
const filterSearch = document.getElementById('filter-search');
const filterClearCategoryBtn = document.getElementById('filter-clear-category');

const langSelect = document.getElementById('lang-select');
const localeSelect = document.getElementById('locale-select');
const currencySelect = document.getElementById('currency-select');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const exportBtn = document.getElementById('btn-export');
const loadSampleBtn = document.getElementById('btn-load-sample');
const importInput = document.getElementById('file-import');
const clearBtn = document.getElementById('btn-clear');
const profileBtn = document.getElementById('btn-profile');
const installBtn = document.getElementById('install-btn');

// Extras UI
const budgetExportBtn = document.getElementById('budget-export');
const budgetImportInput = document.getElementById('budget-import');
const recExportBtn = document.getElementById('rec-export');
const recImportInput = document.getElementById('rec-import');
const catColorsEl = document.getElementById('cat-colors');

// Budget elements
const budgetTotalEl = document.getElementById('budget-total');
const budgetSaveBtn = document.getElementById('budget-save');
const budgetClearBtn = document.getElementById('budget-clear');
const budgetCatNameEl = document.getElementById('budget-cat-name');
const budgetCatAmountEl = document.getElementById('budget-cat-amount');
const budgetProgressEl = document.getElementById('budget-progress');

// Recurring elements
const recName = document.getElementById('rec-name');
const recAmount = document.getElementById('rec-amount');
const recType = document.getElementById('rec-type');
const recCategory = document.getElementById('rec-category');
const recFrequency = document.getElementById('rec-frequency');
const recStart = document.getElementById('rec-start');
const recAddBtn = document.getElementById('rec-add');
const recApplyBtn = document.getElementById('rec-apply');
const recList = document.getElementById('rec-list');

// Monthly chart
const monthsBackEl = document.getElementById('months-back');
let chartMonth;

// State
let tx = []; // {id, type: 'income'|'expense', name, amount, category, date, notes}
let editId = null;
let chart;
let deferredPrompt = null; // PWA install
let catColors = {}; // category -> color

const store = {
    load() {
        try {
            tx = JSON.parse(localStorage.getItem('tx') || '[]');
            const pref = JSON.parse(localStorage.getItem('prefs') || '{}');
            if (pref.lang) langSelect.value = pref.lang;
            if (pref.locale) localeSelect.value = pref.locale;
            if (pref.currency) currencySelect.value = pref.currency;
            if (pref.theme === 'light') document.body.classList.add('light'); else document.body.classList.remove('light');
            budgets.total = pref.budgets?.total || 0;
            budgets.cats = pref.budgets?.cats || {};
            recurring = pref.recurring || [];
            catColors = pref.catColors || {};
        } catch {}
    },
    save() {
        localStorage.setItem('tx', JSON.stringify(tx));
        localStorage.setItem('prefs', JSON.stringify({
            lang: langSelect.value,
            locale: localeSelect.value,
            currency: currencySelect.value,
            theme: document.body.classList.contains('light') ? 'light' : 'dark',
            budgets,
            recurring,
            catColors,
        }));
    }
};

// i18n (minimal, extendable)
const i18n = {
    en: {
        'app.title': 'Expense Tracker',
    'controls.language': 'Language',
    'controls.currency': 'Currency',
    'controls.theme': 'Theme',
    'controls.locale': 'Locale',
        'summary.income': 'Income',
        'summary.expenses': 'Expenses',
        'summary.balance': 'Balance',
        'form.title': 'Add Transaction',
        'form.type': 'Type',
        'form.type.expense': 'Expense',
        'form.type.income': 'Income',
        'form.name': 'Name',
        'form.amount': 'Amount',
        'form.category': 'Category',
        'form.date': 'Date',
        'form.notes': 'Notes',
        'form.add': 'Add',
        'form.reset': 'Reset',
        'filters.title': 'Filters',
        'filters.type': 'Type',
        'filters.type.all': 'All',
        'filters.category': 'Category',
        'filters.from': 'From',
        'filters.to': 'To',
        'filters.search': 'Search',
        'list.title': 'Transactions',
        'list.date': 'Date',
        'list.type': 'Type',
        'list.category': 'Category',
        'list.name': 'Name',
        'list.amount': 'Amount',
        'list.actions': 'Actions',
    'chart.title': 'Spending by Category',
    'chart.monthly': 'Monthly Totals',
    'chart.month.select': 'Months',
    'budget.title': 'Monthly Budget',
    'budget.total': 'Total Budget',
    'budget.category': 'Category Budget',
    'budget.amount': 'Amount',
    'budget.save': 'Save Budget',
    'budget.clear': 'Clear Budgets',
    'recurring.title': 'Recurring Transactions',
    'recurring.name': 'Name',
    'recurring.amount': 'Amount',
    'recurring.type': 'Type',
    'recurring.category': 'Category',
    'recurring.frequency': 'Frequency',
    'recurring.monthly': 'Monthly',
    'recurring.weekly': 'Weekly',
    'recurring.daily': 'Daily',
    'recurring.start': 'Start Date',
    'recurring.add': 'Add Rule',
    'recurring.apply': 'Apply Now',
        'ads.placeholder': 'Monetization placeholder (ads/affiliate/donations)'
        , 'auth.title': 'Profile'
        , 'auth.select': 'Select Profile'
        , 'auth.new': 'New Profile Name'
        , 'auth.create': 'Create'
        , 'auth.switch': 'Switch'
        , 'auth.close': 'Close'
    , 'colors.title': 'Category Colors'
    , 'auth.local.title': 'Local Profiles'
    , 'auth.local.desc': 'Manage multiple profiles on this device'
    , 'auth.local.current': 'Current Profile'
    , 'auth.local.orcreate': 'or create new'
    , 'auth.cloud.title': 'Cloud Sync'
    , 'auth.cloud.desc': 'Sign in to sync your data across devices'
    , 'auth.cloud.signin': 'Sign in with Google'
    , 'auth.cloud.signout': 'Sign out'
    , 'empty.tx': 'No transactions yet. Add one above to get started!'
    , 'empty.colors': 'Add transactions with categories to customize colors'
    , 'empty.budget': 'Set a budget above to track your spending'
    , 'empty.recurring': 'No recurring transactions yet'
    , 'toast.added': 'Transaction added!'
    , 'toast.updated': 'Transaction updated!'
    , 'toast.deleted': 'Transaction deleted'
    , 'toast.cleared': 'All data cleared'
    , 'toast.budget.saved': 'Budget saved!'
    , 'toast.profile.switched': 'Profile switched'
    , 'cta.addTx': 'Add a transaction'
    , 'csv.preview.title': 'Import Preview'
    , 'csv.preview.valid': 'valid rows'
    , 'csv.preview.invalid': 'invalid rows (skipped)'
    , 'csv.preview.confirm': 'Import'
    , 'csv.preview.cancel': 'Cancel'
    },
    es: {
        'app.title': 'Control de Gastos',
        'controls.language': 'Idioma',
    'controls.currency': 'Moneda',
    'controls.theme': 'Tema',
    'controls.locale': 'Configuración regional',
        'summary.income': 'Ingresos',
        'summary.expenses': 'Gastos',
        'summary.balance': 'Balance',
        'form.title': 'Agregar Transacción',
        'form.type': 'Tipo',
        'form.type.expense': 'Gasto',
        'form.type.income': 'Ingreso',
        'form.name': 'Nombre',
        'form.amount': 'Monto',
        'form.category': 'Categoría',
        'form.date': 'Fecha',
        'form.notes': 'Notas',
        'form.add': 'Agregar',
        'form.reset': 'Limpiar',
        'filters.title': 'Filtros',
        'filters.type': 'Tipo',
        'filters.type.all': 'Todos',
        'filters.category': 'Categoría',
        'filters.from': 'Desde',
        'filters.to': 'Hasta',
        'filters.search': 'Buscar',
        'list.title': 'Transacciones',
        'list.date': 'Fecha',
        'list.type': 'Tipo',
        'list.category': 'Categoría',
        'list.name': 'Nombre',
        'list.amount': 'Monto',
        'list.actions': 'Acciones',
    'chart.title': 'Gasto por Categoría',
    'chart.monthly': 'Totales Mensuales',
    'chart.month.select': 'Meses',
    'budget.title': 'Presupuesto Mensual',
    'budget.total': 'Presupuesto Total',
    'budget.category': 'Presupuesto por Categoría',
    'budget.amount': 'Monto',
    'budget.save': 'Guardar Presupuesto',
    'budget.clear': 'Borrar Presupuestos',
    'recurring.title': 'Transacciones Recurrentes',
    'recurring.name': 'Nombre',
    'recurring.amount': 'Monto',
    'recurring.type': 'Tipo',
    'recurring.category': 'Categoría',
    'recurring.frequency': 'Frecuencia',
    'recurring.monthly': 'Mensual',
    'recurring.weekly': 'Semanal',
    'recurring.daily': 'Diaria',
    'recurring.start': 'Fecha de Inicio',
    'recurring.add': 'Agregar Regla',
    'recurring.apply': 'Aplicar Ahora',
        'ads.placeholder': 'Espacio para monetización (anuncios/afiliados/donaciones)'
        , 'auth.title': 'Perfil'
        , 'auth.select': 'Seleccionar Perfil'
        , 'auth.new': 'Nuevo Nombre de Perfil'
        , 'auth.create': 'Crear'
        , 'auth.switch': 'Cambiar'
        , 'auth.close': 'Cerrar'
    , 'colors.title': 'Colores de Categoría'
    , 'auth.local.title': 'Perfiles locales'
    , 'auth.local.desc': 'Administra múltiples perfiles en este dispositivo'
    , 'auth.local.current': 'Perfil actual'
    , 'auth.local.orcreate': 'o crear nuevo'
    , 'auth.cloud.title': 'Sincronización en la nube'
    , 'auth.cloud.desc': 'Inicia sesión para sincronizar tus datos entre dispositivos'
    , 'auth.cloud.signin': 'Iniciar sesión con Google'
    , 'auth.cloud.signout': 'Cerrar sesión'
    , 'empty.tx': 'Aún no hay transacciones. ¡Agrega una arriba para comenzar!'
    , 'empty.colors': 'Agrega transacciones con categorías para personalizar colores'
    , 'empty.budget': 'Establece un presupuesto arriba para seguir tus gastos'
    , 'empty.recurring': 'Aún no hay transacciones recurrentes'
    , 'toast.added': '¡Transacción agregada!'
    , 'toast.updated': '¡Transacción actualizada!'
    , 'toast.deleted': 'Transacción eliminada'
    , 'toast.cleared': 'Todos los datos borrados'
    , 'toast.budget.saved': '¡Presupuesto guardado!'
    , 'toast.profile.switched': 'Perfil cambiado'
    , 'cta.addTx': 'Agregar una transacción'
    , 'csv.preview.title': 'Vista previa de importación'
    , 'csv.preview.valid': 'filas válidas'
    , 'csv.preview.invalid': 'filas inválidas (omitidas)'
    , 'csv.preview.confirm': 'Importar'
    , 'csv.preview.cancel': 'Cancelar'
    },
    fr: {
        'app.title': 'Suivi des Dépenses',
        'controls.language': 'Langue',
    'controls.currency': 'Devise',
    'controls.theme': 'Thème',
    'controls.locale': 'Paramètres régionaux',
        'summary.income': 'Revenus',
        'summary.expenses': 'Dépenses',
        'summary.balance': 'Solde',
        'form.title': 'Ajouter une Transaction',
        'form.type': 'Type',
        'form.type.expense': 'Dépense',
        'form.type.income': 'Revenu',
        'form.name': 'Nom',
        'form.amount': 'Montant',
        'form.category': 'Catégorie',
        'form.date': 'Date',
        'form.notes': 'Notes',
        'form.add': 'Ajouter',
        'form.reset': 'Réinitialiser',
        'filters.title': 'Filtres',
        'filters.type': 'Type',
        'filters.type.all': 'Tous',
        'filters.category': 'Catégorie',
        'filters.from': 'De',
        'filters.to': 'À',
        'filters.search': 'Rechercher',
        'list.title': 'Transactions',
        'list.date': 'Date',
        'list.type': 'Type',
        'list.category': 'Catégorie',
        'list.name': 'Nom',
        'list.amount': 'Montant',
        'list.actions': 'Actions',
    'chart.title': 'Dépenses par Catégorie',
    'chart.monthly': 'Totaux Mensuels',
    'chart.month.select': 'Mois',
    'budget.title': 'Budget Mensuel',
    'budget.total': 'Budget Total',
    'budget.category': 'Budget par Catégorie',
    'budget.amount': 'Montant',
    'budget.save': 'Enregistrer le Budget',
    'budget.clear': 'Effacer les Budgets',
    'recurring.title': 'Transactions Récurrentes',
    'recurring.name': 'Nom',
    'recurring.amount': 'Montant',
    'recurring.type': 'Type',
    'recurring.category': 'Catégorie',
    'recurring.frequency': 'Fréquence',
    'recurring.monthly': 'Mensuelle',
    'recurring.weekly': 'Hebdomadaire',
    'recurring.daily': 'Quotidienne',
    'recurring.start': 'Date de Début',
    'recurring.add': 'Ajouter une Règle',
    'recurring.apply': 'Appliquer Maintenant',
        'ads.placeholder': 'Espace de monétisation (annonces/affiliés/dons)'
        , 'auth.title': 'Profil'
        , 'auth.select': 'Sélectionner un profil'
        , 'auth.new': 'Nouveau nom de profil'
        , 'auth.create': 'Créer'
        , 'auth.switch': 'Changer'
        , 'auth.close': 'Fermer'
    , 'colors.title': 'Couleurs par catégorie'
    , 'auth.local.title': 'Profils locaux'
    , 'auth.local.desc': 'Gérez plusieurs profils sur cet appareil'
    , 'auth.local.current': 'Profil actuel'
    , 'auth.local.orcreate': 'ou créer un nouveau'
    , 'auth.cloud.title': 'Synchronisation cloud'
    , 'auth.cloud.desc': 'Connectez-vous pour synchroniser vos données sur vos appareils'
    , 'auth.cloud.signin': 'Se connecter avec Google'
    , 'auth.cloud.signout': 'Se déconnecter'
    , 'empty.tx': 'Aucune transaction pour le moment. Ajoutez-en une ci-dessus pour commencer !'
    , 'empty.colors': 'Ajoutez des transactions avec catégories pour personnaliser les couleurs'
    , 'empty.budget': 'Définissez un budget ci-dessus pour suivre vos dépenses'
    , 'empty.recurring': 'Aucune transaction récurrente pour le moment'
    , 'toast.added': 'Transaction ajoutée !'
    , 'toast.updated': 'Transaction mise à jour !'
    , 'toast.deleted': 'Transaction supprimée'
    , 'toast.cleared': 'Toutes les données ont été effacées'
    , 'toast.budget.saved': 'Budget enregistré !'
    , 'toast.profile.switched': 'Profil changé'
    , 'cta.addTx': 'Ajouter une transaction'
    , 'csv.preview.title': "Aperçu de l'import"
    , 'csv.preview.valid': 'lignes valides'
    , 'csv.preview.invalid': 'lignes invalides (ignorées)'
    , 'csv.preview.confirm': 'Importer'
    , 'csv.preview.cancel': 'Annuler'
    },
    de: {
        'app.title': 'Ausgaben-Tracker',
        'controls.language': 'Sprache',
        'controls.currency': 'Währung',
        'controls.theme': 'Thema',
        'controls.locale': 'Gebietsschema',
        'summary.income': 'Einnahmen',
        'summary.expenses': 'Ausgaben',
        'summary.balance': 'Saldo',
        'form.title': 'Transaktion hinzufügen',
        'form.type': 'Art',
        'form.type.expense': 'Ausgabe',
        'form.type.income': 'Einnahme',
        'form.name': 'Name',
        'form.amount': 'Betrag',
        'form.category': 'Kategorie',
        'form.date': 'Datum',
        'form.notes': 'Notizen',
        'form.add': 'Hinzufügen',
        'form.reset': 'Zurücksetzen',
        'filters.title': 'Filter',
        'filters.type': 'Art',
        'filters.type.all': 'Alle',
        'filters.category': 'Kategorie',
        'filters.from': 'Von',
        'filters.to': 'Bis',
        'filters.search': 'Suchen',
        'list.title': 'Transaktionen',
        'list.date': 'Datum',
        'list.type': 'Art',
        'list.category': 'Kategorie',
        'list.name': 'Name',
        'list.amount': 'Betrag',
        'list.actions': 'Aktionen',
        'chart.title': 'Ausgaben nach Kategorie',
        'chart.monthly': 'Monatliche Summen',
        'chart.month.select': 'Monate',
        'budget.title': 'Monatliches Budget',
        'budget.total': 'Gesamtbudget',
        'budget.category': 'Kategorienbudget',
        'budget.amount': 'Betrag',
        'budget.save': 'Budget speichern',
        'budget.clear': 'Budgets löschen',
        'recurring.title': 'Wiederkehrende Transaktionen',
        'recurring.name': 'Name',
        'recurring.amount': 'Betrag',
        'recurring.type': 'Art',
        'recurring.category': 'Kategorie',
        'recurring.frequency': 'Häufigkeit',
        'recurring.monthly': 'Monatlich',
        'recurring.weekly': 'Wöchentlich',
        'recurring.daily': 'Täglich',
        'recurring.start': 'Startdatum',
        'recurring.add': 'Regel hinzufügen',
        'recurring.apply': 'Jetzt anwenden',
        'ads.placeholder': 'Monetarisierungsbereich (Anzeigen/Affiliate/Spenden)'
        , 'auth.title': 'Profil'
        , 'auth.select': 'Profil wählen'
        , 'auth.new': 'Neuer Profilname'
        , 'auth.create': 'Erstellen'
        , 'auth.switch': 'Wechseln'
        , 'auth.close': 'Schließen'
    , 'colors.title': 'Kategorienfarben'
    , 'auth.local.title': 'Lokale Profile'
    , 'auth.local.desc': 'Verwalten Sie mehrere Profile auf diesem Gerät'
    , 'auth.local.current': 'Aktuelles Profil'
    , 'auth.local.orcreate': 'oder neues erstellen'
    , 'auth.cloud.title': 'Cloud-Synchronisierung'
    , 'auth.cloud.desc': 'Melden Sie sich an, um Ihre Daten geräteübergreifend zu synchronisieren'
    , 'auth.cloud.signin': 'Mit Google anmelden'
    , 'auth.cloud.signout': 'Abmelden'
    , 'empty.tx': 'Noch keine Transaktionen. Fügen Sie oben eine hinzu, um zu beginnen!'
    , 'empty.colors': 'Fügen Sie Transaktionen mit Kategorien hinzu, um Farben anzupassen'
    , 'empty.budget': 'Legen Sie oben ein Budget fest, um Ihre Ausgaben zu verfolgen'
    , 'empty.recurring': 'Noch keine wiederkehrenden Transaktionen'
    , 'toast.added': 'Transaktion hinzugefügt!'
    , 'toast.updated': 'Transaktion aktualisiert!'
    , 'toast.deleted': 'Transaktion gelöscht'
    , 'toast.cleared': 'Alle Daten gelöscht'
    , 'toast.budget.saved': 'Budget gespeichert!'
    , 'toast.profile.switched': 'Profil gewechselt'
    , 'cta.addTx': 'Transaktion hinzufügen'
    , 'csv.preview.title': 'Importvorschau'
    , 'csv.preview.valid': 'gültige Zeilen'
    , 'csv.preview.invalid': 'ungültige Zeilen (übersprungen)'
    , 'csv.preview.confirm': 'Importieren'
    , 'csv.preview.cancel': 'Abbrechen'
    },
    pt: {
        'app.title': 'Controle de Despesas',
        'controls.language': 'Idioma',
        'controls.currency': 'Moeda',
        'controls.theme': 'Tema',
        'controls.locale': 'Localidade',
        'summary.income': 'Receitas',
        'summary.expenses': 'Despesas',
        'summary.balance': 'Saldo',
        'form.title': 'Adicionar Transação',
        'form.type': 'Tipo',
        'form.type.expense': 'Despesa',
        'form.type.income': 'Receita',
        'form.name': 'Nome',
        'form.amount': 'Valor',
        'form.category': 'Categoria',
        'form.date': 'Data',
        'form.notes': 'Observações',
        'form.add': 'Adicionar',
        'form.reset': 'Limpar',
        'filters.title': 'Filtros',
        'filters.type': 'Tipo',
        'filters.type.all': 'Todos',
        'filters.category': 'Categoria',
        'filters.from': 'De',
        'filters.to': 'Até',
        'filters.search': 'Pesquisar',
        'list.title': 'Transações',
        'list.date': 'Data',
        'list.type': 'Tipo',
        'list.category': 'Categoria',
        'list.name': 'Nome',
        'list.amount': 'Valor',
        'list.actions': 'Ações',
        'chart.title': 'Gastos por Categoria',
        'chart.monthly': 'Totais Mensais',
        'chart.month.select': 'Meses',
        'budget.title': 'Orçamento Mensal',
        'budget.total': 'Orçamento Total',
        'budget.category': 'Orçamento por Categoria',
        'budget.amount': 'Valor',
        'budget.save': 'Salvar Orçamento',
        'budget.clear': 'Limpar Orçamentos',
        'recurring.title': 'Transações Recorrentes',
        'recurring.name': 'Nome',
        'recurring.amount': 'Valor',
        'recurring.type': 'Tipo',
        'recurring.category': 'Categoria',
        'recurring.frequency': 'Frequência',
        'recurring.monthly': 'Mensal',
        'recurring.weekly': 'Semanal',
        'recurring.daily': 'Diária',
        'recurring.start': 'Data de Início',
        'recurring.add': 'Adicionar Regra',
        'recurring.apply': 'Aplicar Agora',
        'ads.placeholder': 'Espaço para monetização (anúncios/afiliados/doações)'
        , 'auth.title': 'Perfil'
        , 'auth.select': 'Selecionar Perfil'
        , 'auth.new': 'Novo Nome de Perfil'
        , 'auth.create': 'Criar'
        , 'auth.switch': 'Trocar'
        , 'auth.close': 'Fechar'
    , 'colors.title': 'Cores por Categoria'
    , 'auth.local.title': 'Perfis locais'
    , 'auth.local.desc': 'Gerencie vários perfis neste dispositivo'
    , 'auth.local.current': 'Perfil atual'
    , 'auth.local.orcreate': 'ou criar novo'
    , 'auth.cloud.title': 'Sincronização na nuvem'
    , 'auth.cloud.desc': 'Faça login para sincronizar seus dados entre dispositivos'
    , 'auth.cloud.signin': 'Entrar com Google'
    , 'auth.cloud.signout': 'Sair'
    , 'empty.tx': 'Ainda não há transações. Adicione uma acima para começar!'
    , 'empty.colors': 'Adicione transações com categorias para personalizar as cores'
    , 'empty.budget': 'Defina um orçamento acima para acompanhar seus gastos'
    , 'empty.recurring': 'Ainda não há transações recorrentes'
    , 'toast.added': 'Transação adicionada!'
    , 'toast.updated': 'Transação atualizada!'
    , 'toast.deleted': 'Transação excluída'
    , 'toast.cleared': 'Todos os dados foram limpos'
    , 'toast.budget.saved': 'Orçamento salvo!'
    , 'toast.profile.switched': 'Perfil alterado'
    , 'cta.addTx': 'Adicionar uma transação'
    , 'csv.preview.title': 'Prévia da importação'
    , 'csv.preview.valid': 'linhas válidas'
    , 'csv.preview.invalid': 'linhas inválidas (ignoradas)'
    , 'csv.preview.confirm': 'Importar'
    , 'csv.preview.cancel': 'Cancelar'
    },
    hi: {
        'app.title': 'खर्च ट्रैकर',
        'controls.language': 'भाषा',
        'controls.currency': 'मुद्रा',
        'controls.theme': 'थीम',
        'controls.locale': 'स्थानीय सेटिंग',
        'summary.income': 'आय',
        'summary.expenses': 'खर्च',
        'summary.balance': 'शेष',
        'form.title': 'लेन-देन जोड़ें',
        'form.type': 'प्रकार',
        'form.type.expense': 'खर्च',
        'form.type.income': 'आय',
        'form.name': 'नाम',
        'form.amount': 'राशि',
        'form.category': 'श्रेणी',
        'form.date': 'तारीख',
        'form.notes': 'टिप्पणी',
        'form.add': 'जोड़ें',
        'form.reset': 'रीसेट',
        'filters.title': 'फ़िल्टर',
        'filters.type': 'प्रकार',
        'filters.type.all': 'सभी',
        'filters.category': 'श्रेणी',
        'filters.from': 'से',
        'filters.to': 'तक',
        'filters.search': 'खोजें',
        'list.title': 'लेन-देन',
        'list.date': 'तारीख',
        'list.type': 'प्रकार',
        'list.category': 'श्रेणी',
        'list.name': 'नाम',
        'list.amount': 'राशि',
        'list.actions': 'क्रियाएं',
        'chart.title': 'श्रेणी के अनुसार खर्च',
        'chart.monthly': 'मासिक कुल',
        'chart.month.select': 'महीने',
        'budget.title': 'मासिक बजट',
        'budget.total': 'कुल बजट',
        'budget.category': 'श्रेणी बजट',
        'budget.amount': 'राशि',
        'budget.save': 'बजट सहेजें',
        'budget.clear': 'बजट साफ़ करें',
        'recurring.title': 'आवर्ती लेन-देन',
        'recurring.name': 'नाम',
        'recurring.amount': 'राशि',
        'recurring.type': 'प्रकार',
        'recurring.category': 'श्रेणी',
        'recurring.frequency': 'आवृत्ति',
        'recurring.monthly': 'मासिक',
        'recurring.weekly': 'साप्ताहिक',
        'recurring.daily': 'दैनिक',
        'recurring.start': 'आरंभ तिथि',
        'recurring.add': 'नियम जोड़ें',
        'recurring.apply': 'अब लागू करें',
        'ads.placeholder': 'मॉनेटाइजेशन क्षेत्र (विज्ञापन/सहयोग/दान)'
        , 'auth.title': 'प्रोफ़ाइल'
        , 'auth.select': 'प्रोफ़ाइल चुनें'
        , 'auth.new': 'नया प्रोफ़ाइल नाम'
        , 'auth.create': 'बनाएँ'
        , 'auth.switch': 'बदलें'
        , 'auth.close': 'बंद करें'
    , 'colors.title': 'श्रेणी के रंग'
    , 'auth.local.title': 'स्थानीय प्रोफाइल'
    , 'auth.local.desc': 'इस डिवाइस पर कई प्रोफाइल प्रबंधित करें'
    , 'auth.local.current': 'वर्तमान प्रोफाइल'
    , 'auth.local.orcreate': 'या नया बनाएं'
    , 'auth.cloud.title': 'क्लाउड सिंक'
    , 'auth.cloud.desc': 'डिवाइसों में डेटा सिंक करने के लिए साइन इन करें'
    , 'auth.cloud.signin': 'Google से साइन इन करें'
    , 'auth.cloud.signout': 'साइन आउट'
    , 'empty.tx': 'अभी तक कोई लेन-देन नहीं। शुरू करने के लिए ऊपर एक जोड़ें!'
    , 'empty.colors': 'रंग अनुकूलित करने के लिए श्रेणियों के साथ लेन-देन जोड़ें'
    , 'empty.budget': 'अपने खर्च को ट्रैक करने के लिए ऊपर बजट सेट करें'
    , 'empty.recurring': 'अभी तक कोई आवर्ती लेन-देन नहीं'
    , 'toast.added': 'लेन-देन जोड़ा गया!'
    , 'toast.updated': 'लेन-देन अपडेट किया गया!'
    , 'toast.deleted': 'लेन-देन हटाया गया'
    , 'toast.cleared': 'सभी डेटा साफ़ किए गए'
    , 'toast.budget.saved': 'बजट सहेजा गया!'
    , 'toast.profile.switched': 'प्रोफ़ाइल बदली'
    , 'cta.addTx': 'एक लेन-देन जोड़ें'
    , 'csv.preview.title': 'इंपोर्ट पूर्वावलोकन'
    , 'csv.preview.valid': 'मान्य पंक्तियाँ'
    , 'csv.preview.invalid': 'अमान्य पंक्तियाँ (छोड़ी गई)'
    , 'csv.preview.confirm': 'इंपोर्ट करें'
    , 'csv.preview.cancel': 'रद्द करें'
    }
};

function applyI18n() {
    const dict = i18n[langSelect.value] || i18n.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });
    document.title = dict['app.title'] || 'Expense Tracker';
}

// Currency formatter
function format(amount) {
    try {
        const loc = localeSelect?.value === 'auto' || !localeSelect ? undefined : localeSelect.value;
        return new Intl.NumberFormat(loc, { style: 'currency', currency: currencySelect.value }).format(amount);
    } catch {
        return `${currencySelect.value} ${amount.toFixed(2)}`;
    }
}

// Helpers
function uid() { return Math.random().toString(36).slice(2, 9); }
function today() { return new Date().toISOString().slice(0,10); }

// Category suggestions from existing tx
function refreshCategorySuggestions() {
    const dl = document.getElementById('category-suggestions');
    let cats = [...new Set(tx.map(t => (t.category || '').trim()).filter(Boolean))].sort();
    // Seed with defaults when empty to help first-run UX
    if (cats.length === 0) {
        cats = ['Food','Transport','Utilities','Entertainment','Healthcare','Shopping','Education','Travel','Rent','Salary','Freelance','Savings','Other'];
    }
    dl.innerHTML = cats.map(c => `<option value="${c}"></option>`).join('');
}

// CRUD
function addTx(data) {
    tx.push({ id: uid(), ...data });
    store.save();
    render();
}

function updateTx(id, patch) {
    const i = tx.findIndex(t => t.id === id);
    if (i !== -1) {
        tx[i] = { ...tx[i], ...patch };
        store.save();
        render();
    }
}

function removeTx(id) {
    tx = tx.filter(t => t.id !== id);
    store.save();
    render();
}

// Filters
function applyFilters(list) {
    const type = filterType.value;
    const cat = (filterCategory.value || '').toLowerCase();
    const from = filterFrom.value ? new Date(filterFrom.value) : null;
    const to = filterTo.value ? new Date(filterTo.value) : null;
    const q = (filterSearch.value || '').toLowerCase();
    return list.filter(t => {
        if (type !== 'all' && t.type !== type) return false;
        if (cat && !(t.category || '').toLowerCase().includes(cat)) return false;
        const d = t.date ? new Date(t.date) : null;
        if (from && d && d < from) return false;
        if (to && d && d > to) return false;
        if (q && !(`${t.name} ${t.notes || ''}`.toLowerCase().includes(q))) return false;
        return true;
    });
}

// Render table and summaries
function render() {
    refreshCategorySuggestions();
    const list = applyFilters(tx).sort((a,b) => (b.date||'').localeCompare(a.date||''));
    tbody.innerHTML = '';
    let income = 0, expenses = 0;
    
    if (list.length === 0) {
        const dict = getDict();
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:48px 20px;"><div class="empty-state"><div class="empty-state-icon"><svg class="icon icon-xl"><use xlink:href="#icon-wallet"/></svg></div><div class="empty-state-text">${escapeHtml(dict['empty.tx']||'No transactions yet. Add one above to get started!')}</div><div style="margin-top:12px;"><button id="empty-add" class="btn primary">${escapeHtml(dict['cta.addTx']||'Add a transaction')}</button></div></div></td></tr>`;
        setTimeout(()=>{ document.getElementById('empty-add')?.addEventListener('click', ()=>{ document.getElementById('add-title')?.scrollIntoView({behavior:'smooth', block:'start'}); nameInput?.focus({preventScroll:true}); }); },0);
    } else {
        list.forEach(t => {
            if (t.type === 'income') income += t.amount; else expenses += t.amount;
            const tr = document.createElement('tr');
            const catColor = (t.category && catColors[t.category]) || '';
            tr.innerHTML = `
                <td>${t.date || ''}</td>
                <td><span class="badge ${t.type}">${t.type}</span></td>
                <td>${t.category ? `<span style="display:inline-block;width:.75em;height:.75em;border-radius:50%;background:${catColor};margin-right:.35em;vertical-align:middle"></span>` : ''}${t.category || ''}</td>
                <td>${escapeHtml(t.name)}${t.notes ? `<div class="sub">${escapeHtml(t.notes)}</div>` : ''}</td>
                <td class="num">${format(t.type === 'expense' ? -t.amount : t.amount)}</td>
                <td>
                    <div class="row-actions">
                        <button class="icon-btn" data-action="edit" data-id="${t.id}"><svg class="icon icon-sm"><use xlink:href="#icon-edit"/></svg> Edit</button>
                        <button class="icon-btn danger" data-action="del" data-id="${t.id}"><svg class="icon icon-sm"><use xlink:href="#icon-trash"/></svg> Delete</button>
                    </div>
                </td>`;
            tbody.appendChild(tr);
        });
    }
    sumIncomeEl.textContent = format(income);
    sumExpensesEl.textContent = format(-expenses);
    sumBalanceEl.textContent = format(income - expenses);
    try { if (window.Chart) { drawChart(); } } catch (e) { console.warn('drawChart failed', e); }
    try { if (typeof drawMonthlyChart === 'function') { drawMonthlyChart(); } } catch (e) { console.warn('drawMonthlyChart failed', e); }
    try { renderBudgets?.(); } catch (e) { console.warn('renderBudgets failed', e); }
    try { renderCategoryColors?.(); } catch (e) { console.warn('renderCategoryColors failed', e); }
}

function escapeHtml(str) {
    return (str || '').replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Chart
function drawChart() {
    const ctx = document.getElementById('chart');
    if (!ctx) return;
    const byCat = {};
    tx.forEach(t => { if (t.type === 'expense') { byCat[t.category || 'Other'] = (byCat[t.category || 'Other']||0)+t.amount; }});
    const labels = Object.keys(byCat);
    const data = Object.values(byCat);
    if (labels.length === 0) {
        // Clear canvas and return early if no data
        const g = ctx.getContext('2d');
        g && g.clearRect(0,0,ctx.width,ctx.height);
        if (chart) { chart.destroy(); chart = null; }
        return;
    }
    const bg = labels.map((label, i) => {
        const c = catColors[label];
        if (c) {
            // convert hex to rgba with alpha .6
            try {
                const hex = c.replace('#','');
                const r = parseInt(hex.substring(0,2),16);
                const g = parseInt(hex.substring(2,4),16);
                const b = parseInt(hex.substring(4,6),16);
                return `rgba(${r},${g},${b},0.6)`;
            } catch { /* fall through */ }
        }
        return `hsl(${(i*57)%360} 80% 60% / 0.6)`;
    });
    const border = labels.map((label, i) => catColors[label] || `hsl(${(i*57)%360} 80% 60% / 1)`);
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: bg, borderColor: border, borderWidth: 1 }] },
        options: { plugins: { legend: { labels: { color: getComputedStyle(document.body).getPropertyValue('--text').trim() } } } }
    });
}

// Category Colors UI
function renderCategoryColors() {
    if (!catColorsEl) return;
    // unique categories from transactions plus any saved ones
    const cats = new Set(Object.keys(catColors));
    tx.forEach(t => { if ((t.category||'').trim()) cats.add(t.category.trim()); });
    const items = Array.from(cats).sort();
    if (items.length === 0) { 
        catColorsEl.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><svg class="icon icon-xl"><use xlink:href="#icon-palette"/></svg></div><div class="empty-state-text">Add transactions with categories to customize colors</div></div>'; 
        return; 
    }
    catColorsEl.innerHTML = items.map(c => `
        <div>
            <label style="cursor:pointer;">
                <span style="font-weight:500;">${escapeHtml(c)}</span>
                <input type="color" data-catcolor="${escapeHtml(c)}" value="${catColors[c] || '#66ccff'}" />
            </label>
        </div>
    `).join('');
}

catColorsEl?.addEventListener('input', (e) => {
    const input = e.target.closest('input[type="color"][data-catcolor]');
    if (!input) return;
    const cat = input.getAttribute('data-catcolor');
    const val = input.value;
    if (cat) {
        catColors[cat] = val;
        store.save();
        drawChart();
        render();
    }
});

// Events
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        type: txType.value,
        name: nameInput.value.trim(),
        amount: Math.abs(parseFloat(amountInput.value || '0')) || 0,
        category: categoryInput.value.trim(),
        date: dateInput.value || today(),
        notes: notesInput.value.trim(),
    };
    if (!data.name || !data.amount) return;
    if (editId) { 
        updateTx(editId, data); 
        editId = null; 
    document.getElementById('submit-btn').textContent = getDict()['form.add']; 
    showToast(getDict()['toast.updated']||'Transaction updated!');
    }
    else { 
    addTx(data); 
    showToast(getDict()['toast.added']||'Transaction added!');
    }
    form.reset();
});

resetBtn.addEventListener('click', () => { form.reset(); editId = null; document.getElementById('submit-btn').textContent = getDict()['form.add']; });

tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const act = btn.getAttribute('data-action');
    if (act === 'del') { 
    removeTx(id); 
    showToast(getDict()['toast.deleted']||'Transaction deleted', 'error');
    }
    if (act === 'edit') {
        const t = tx.find(x => x.id === id);
        if (!t) return;
        editId = id;
        txType.value = t.type;
        nameInput.value = t.name;
        amountInput.value = t.amount;
        categoryInput.value = t.category || '';
        dateInput.value = t.date || '';
        notesInput.value = t.notes || '';
        document.getElementById('submit-btn').textContent = getDict()['form.add'].replace('Add','Update');
        nameInput.focus();
    }
});

[filterType, filterCategory, filterFrom, filterTo, filterSearch].forEach(el => el.addEventListener('input', render));
filterClearCategoryBtn?.addEventListener('click', () => { filterCategory.value = ''; render(); });

langSelect.addEventListener('change', () => { applyI18n(); store.save(); });
localeSelect?.addEventListener('change', () => { render(); store.save(); });
currencySelect.addEventListener('change', () => { render(); store.save(); });
themeToggleBtn?.addEventListener('click', () => {
    document.body.classList.toggle('light');
    drawChart();
    drawMonthlyChart?.();
    store.save();
});

// Load sample data from CSV files in /data
loadSampleBtn?.addEventListener('click', async () => {
    try {
        const [txRes, budRes, recRes] = await Promise.all([
            fetch('./data/sample-transactions.csv'),
            fetch('./data/sample-budgets.csv'),
            fetch('./data/sample-recurring.csv')
        ]);
        const [txCsv, budCsv, recCsv] = await Promise.all([txRes.text(), budRes.text(), recRes.text()]);

        // Parse transactions
        const txLines = txCsv.split(/\r?\n/).filter(Boolean);
        const txHeader = txLines.shift().split(',').map(s => s.trim().replace(/^"|"$/g,''));
        const txIdx = Object.fromEntries(txHeader.map((h,i)=>[h,i]));
        const parsedTx = txLines.map(line => {
            const cols = parseCsvLine(line);
            return {
                type: (cols[txIdx.type]||'expense').trim(),
                name: (cols[txIdx.name]||'').trim(),
                amount: Math.abs(parseFloat(cols[txIdx.amount]||'0')) || 0,
                category: (cols[txIdx.category]||'').trim(),
                date: (cols[txIdx.date]||'').trim(),
                notes: (cols[txIdx.notes]||'').trim(),
            };
        }).filter(r => r.name && r.amount);

        // Parse budgets
        const budLines = budCsv.split(/\r?\n/).filter(Boolean);
        const budHeader = (budLines.shift()||'').split(',').map(s => s.trim().replace(/^"|"$/g,''));
        const budIdx = Object.fromEntries(budHeader.map((h,i)=>[h,i]));
        let bTotal = 0; const bCats = {};
        budLines.forEach(line => {
            const cols = parseCsvLine(line);
            const type = (cols[budIdx.type]||'').trim();
            const category = (cols[budIdx.category]||'').trim();
            const amount = Math.abs(parseFloat(cols[budIdx.amount]||'0'))||0;
            if (type === 'total') bTotal = amount;
            if (type === 'category' && category) bCats[category] = amount;
        });

        // Parse recurring
        const recLines = recCsv.split(/\r?\n/).filter(Boolean);
        const recHeader = (recLines.shift()||'').split(',').map(s => s.trim().replace(/^"|"$/g,''));
        const recIdx = Object.fromEntries(recHeader.map((h,i)=>[h,i]));
        const recRules = recLines.map(line => {
            const cols = parseCsvLine(line);
            return {
                id: cols[recIdx.id] || uid(),
                name: (cols[recIdx.name]||'').trim(),
                amount: Math.abs(parseFloat(cols[recIdx.amount]||'0'))||0,
                type: (cols[recIdx.type]||'expense').trim(),
                category: (cols[recIdx.category]||'').trim(),
                frequency: (cols[recIdx.frequency]||'monthly').trim(),
                start: (cols[recIdx.start]||'').trim(),
            };
        }).filter(r => r.name && r.amount);

        // Apply to state
        tx = parsedTx.map(d => ({ id: uid(), ...d }));
        budgets = { total: bTotal, cats: bCats };
        recurring = recRules;
        // Seed some default category colors for demo
        catColors = {
            Food: '#ff9f1c',
            Transport: '#2ec4b6',
            Utilities: '#7c3aed',
            Entertainment: '#ef4444',
            Healthcare: '#10b981',
            Shopping: '#f97316',
            Education: '#3b82f6',
            Travel: '#eab308',
            Rent: '#8b5cf6',
            Savings: '#22c55e',
        };
        store.save();
        applyI18n();
    renderRecurring();
    render();
    drawChart();
    drawMonthlyChart?.();
        showToast('Sample data loaded');
    } catch (e) {
        console.warn('Failed to load sample data', e);
        showToast('Failed to load sample data', 'error');
    }
});

// CSV export/import buttons
exportBtn?.addEventListener('click', () => {
    const rows = [['date','type','category','name','amount','notes']].concat(tx.map(t => [t.date||'', t.type, t.category||'', t.name.replace(/"/g,'""'), t.amount, (t.notes||'').replace(/"/g,'""')]));
    const csv = rows.map(r => r.map(x => /[,"\n]/.test(String(x)) ? '"'+String(x)+'"' : String(x)).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transactions.csv';
    a.click();
});

importInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const header = lines.shift().split(',').map(s => s.trim().replace(/^"|"$/g,''));
    const idx = Object.fromEntries(header.map((h,i)=>[h,i]));
    const parsed = lines.map(line => {
        const cols = parseCsvLine(line);
        return {
            type: (cols[idx.type]||'expense').trim(),
            name: (cols[idx.name]||'').trim(),
            amount: Math.abs(parseFloat(cols[idx.amount]||'0')) || 0,
            category: (cols[idx.category]||'').trim(),
            date: (cols[idx.date]||'').trim(),
            notes: (cols[idx.notes]||'').trim(),
        };
    }).filter(r => r.name && r.amount);
    tx = tx.concat(parsed.map(d => ({ id: uid(), ...d })));
    store.save();
    render();
    e.target.value = '';
});

function parseCsvLine(line) {
    const out = [];
    let cur = '', inQ = false;
    for (let i=0;i<line.length;i++) {
        const ch = line[i];
        if (inQ) {
            if (ch === '"' && line[i+1] === '"') { cur += '"'; i++; }
            else if (ch === '"') { inQ = false; }
            else cur += ch;
        } else {
            if (ch === '"') inQ = true; else if (ch === ',') { out.push(cur); cur=''; } else cur += ch;
        }
    }
    out.push(cur);
    return out;
}

clearBtn?.addEventListener('click', () => {
    if (confirm('Clear all data?')) {
        tx = [];
        budgets = { total: 0, cats: {} };
        recurring = [];
        store.save();
        render();
        showToast('All data cleared', 'error');
    }
});

// Budgets state and UI
let budgets = { total: 0, cats: {} };

function renderBudgets() {
    if (!budgetProgressEl) return;
    const month = new Date().toISOString().slice(0,7);
    const monthTx = tx.filter(t => (t.date||'').startsWith(month) && t.type==='expense');
    const spentTotal = monthTx.reduce((s,t)=>s+t.amount,0);
    const byCat = {};
    monthTx.forEach(t => { byCat[t.category||'Other']=(byCat[t.category||'Other']||0)+t.amount; });
    const items = [];
    if (budgets.total > 0) items.push(progressItem('Total', spentTotal, budgets.total));
    Object.entries(budgets.cats).forEach(([cat, lim]) => items.push(progressItem(cat, byCat[cat]||0, lim)));
    if (items.length === 0) {
        budgetProgressEl.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><svg class="icon icon-xl"><use xlink:href="#icon-target"/></svg></div><div class="empty-state-text">Set a budget above to track your spending</div></div>';
    } else {
        budgetProgressEl.innerHTML = items.join('');
    }
}

function progressItem(label, value, max) {
    const pct = max>0 ? (value/max)*100 : 0;
    const displayPct = Math.min(100, pct);
    const color = pct>=100 ? 'var(--danger)' : pct>=80 ? '#f59e0b' : pct>=60 ? '#fbbf24' : 'var(--ok)';
    return `<div class="progress">
      <div class="progress-top"><strong>${escapeHtml(label)}</strong> <span>${format(value)} / ${format(max)} <small style="opacity:0.7">(${displayPct.toFixed(0)}%)</small></span></div>
      <div class="progress-bar"><span style="width:${displayPct}%; background:${color}"></span></div>
    </div>`;
}

budgetSaveBtn?.addEventListener('click', () => {
    const total = parseFloat(budgetTotalEl.value || '0') || 0;
    if (total >= 0) budgets.total = total;
    const c = budgetCatNameEl.value.trim();
    const a = Math.abs(parseFloat(budgetCatAmountEl.value || '0')) || 0;
    if (c) budgets.cats[c] = a;
    budgetCatNameEl.value = '';
    budgetCatAmountEl.value = '';
    store.save();
    renderBudgets();
    showToast('Budget saved!');
});

budgetClearBtn?.addEventListener('click', () => {
    budgets = { total: 0, cats: {} };
    store.save();
    renderBudgets();
});

// Recurring rules
let recurring = [];

function renderRecurring() {
    if (!recList) return;
    if (recurring.length === 0) {
        recList.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><svg class="icon icon-xl"><use xlink:href="#icon-repeat"/></svg></div><div class="empty-state-text">No recurring transactions yet</div></div>';
        return;
    }
    recList.innerHTML = recurring.map(r => `
        <li>
            <span><strong>${escapeHtml(r.name)}</strong> • ${escapeHtml(r.frequency)} • ${format(r.amount)} • <span class="badge ${r.type}">${r.type}</span></span>
            <button class="icon-btn danger" data-remove="${r.id}"><svg class="icon icon-sm"><use xlink:href="#icon-trash"/></svg> Remove</button>
        </li>
    `).join('');
}

recAddBtn?.addEventListener('click', () => {
    const rule = {
        id: uid(),
        name: recName.value.trim(),
        amount: Math.abs(parseFloat(recAmount.value||'0'))||0,
        type: recType.value,
        category: recCategory.value.trim(),
        frequency: recFrequency.value,
        start: recStart.value || today(),
    };
    if (!rule.name || !rule.amount) return;
    recurring.push(rule);
    store.save();
    renderRecurring();
    recName.value = recAmount.value = recCategory.value = recStart.value = '';
});

recApplyBtn?.addEventListener('click', () => {
    // Generate occurrences from rule.start up to today
    const todayDate = new Date();
    const todayStr = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()).toISOString().slice(0,10);
    let added = 0;
    recurring.forEach(r => {
        if (!r.start) r.start = todayStr;
        let d = new Date(r.start);
        // normalize to start of day
        d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        while (d <= todayDate) {
            const dateStr = d.toISOString().slice(0,10);
            // avoid duplicates
            const exists = tx.some(t => t.date === dateStr && t.name === r.name && t.amount === r.amount && t.type === r.type && (t.category||'') === (r.category||'') && (t.notes||'') === 'Recurring');
            if (!exists) {
                addTx({ type: r.type, name: r.name, amount: r.amount, category: r.category, date: dateStr, notes: 'Recurring' });
                added++;
            }
            // advance
            if (r.frequency === 'daily') {
                d.setDate(d.getDate() + 1);
            } else if (r.frequency === 'weekly') {
                d.setDate(d.getDate() + 7);
            } else { // monthly default
                d.setMonth(d.getMonth() + 1);
            }
        }
    });
    if (added === 0) {
        // no-op
    }
});

recList?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-remove]');
    if (!btn) return;
    const id = btn.getAttribute('data-remove');
    recurring = recurring.filter(r => r.id !== id);
    store.save();
    renderRecurring();
});

// Monthly chart renderer
function drawMonthlyChart() {
    const ctx = document.getElementById('chart-month');
    if (!ctx) return;
    const months = Number(monthsBackEl?.value) || 12;
    const now = new Date();
    const buckets = [];
    for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        buckets.push({ key, label: key, income: 0, expense: 0 });
    }
    const index = Object.fromEntries(buckets.map((b, i) => [b.key, i]));
    tx.forEach(t => {
        if (!t.date) return;
        const d = new Date(t.date);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        if (index[key] == null) return;
        if (t.type === 'income') buckets[index[key]].income += t.amount; else buckets[index[key]].expense += t.amount;
    });
    const labels = buckets.map(b => b.label);
    const income = buckets.map(b => b.income);
    const expense = buckets.map(b => b.expense);
    if (chartMonth) chartMonth.destroy();
    chartMonth = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [
            { label: 'Income', data: income, backgroundColor: 'rgba(34,197,94,.6)' },
            { label: 'Expense', data: expense, backgroundColor: 'rgba(226,91,91,.6)' }
        ]},
        options: {
            responsive: true,
            scales: { x: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--text').trim() } }, y: { ticks: { color: getComputedStyle(document.body).getPropertyValue('--text').trim() } } },
            plugins: { legend: { labels: { color: getComputedStyle(document.body).getPropertyValue('--text').trim() } } }
        }
    });
}

monthsBackEl?.addEventListener('input', () => { drawMonthlyChart(); });

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;
    if (e.key.toLowerCase() === 'n') { nameInput.focus(); }
    if (e.key.toLowerCase() === 'e') { exportBtn?.click(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Backspace') { clearBtn?.click(); }
});

function getDict() { return i18n[langSelect.value] || i18n.en; }

// Profiles (local sign-in simulation)
const authDialog = document.getElementById('auth-dialog');
const profileSelect = document.getElementById('profile-select');
const profileNew = document.getElementById('profile-new');
const profileCreate = document.getElementById('profile-create');
const profileSwitch = document.getElementById('profile-switch');
const profileClose = document.getElementById('profile-close');
let currentProfile = localStorage.getItem('profile') || 'default';

function listProfiles() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('tx:')).map(k => k.split(':')[1]);
    const set = new Set(['default', ...keys]);
    profileSelect.innerHTML = Array.from(set).map(n => `<option value="${n}">${n}</option>`).join('');
    profileSelect.value = currentProfile;
}

function loadProfile(name) {
    currentProfile = name;
    localStorage.setItem('profile', currentProfile);
    tx = JSON.parse(localStorage.getItem(`tx:${currentProfile}`) || '[]');
    const prefs = JSON.parse(localStorage.getItem(`prefs:${currentProfile}`) || '{}');
    if (prefs.lang) langSelect.value = prefs.lang;
    if (prefs.locale) localeSelect.value = prefs.locale;
    if (prefs.currency) currencySelect.value = prefs.currency;
    if (prefs.theme === 'light') document.body.classList.add('light'); else document.body.classList.remove('light');
    budgets = prefs.budgets || { total: 0, cats: {} };
    recurring = prefs.recurring || [];
    catColors = prefs.catColors || {};
    applyI18n();
    renderRecurring();
    render();
}
// expose for auth.js
window.loadProfile = loadProfile;

function saveProfile() {
    localStorage.setItem(`tx:${currentProfile}`, JSON.stringify(tx));
    localStorage.setItem(`prefs:${currentProfile}`, JSON.stringify({
        lang: langSelect.value,
        locale: localeSelect.value,
        currency: currencySelect.value,
        theme: document.body.classList.contains('light') ? 'light' : 'dark',
        budgets,
        recurring,
        catColors,
    }));
}

// Override store.save to also save per-profile
const _origSave = store.save.bind(store);
store.save = function() { _origSave(); saveProfile(); };

profileBtn?.addEventListener('click', () => { 
    listProfiles(); 
    authDialog?.showModal?.(); 
    document.body.style.overflow = 'hidden'; // Prevent body scroll
});

profileCreate?.addEventListener('click', (e) => { e.preventDefault(); const n = profileNew.value.trim(); if (!n) return; currentProfile = n; saveProfile(); listProfiles(); profileNew.value=''; });
profileSwitch?.addEventListener('click', (e) => { e.preventDefault(); loadProfile(profileSelect.value); authDialog?.close?.(); document.body.style.overflow = ''; });
profileClose?.addEventListener('click', (e) => { e.preventDefault(); authDialog?.close?.(); document.body.style.overflow = ''; });

// Auto-switch profile when selecting a different option
profileSelect?.addEventListener('change', (e) => {
    const next = profileSelect.value;
    if (next && next !== currentProfile) {
        loadProfile(next);
        authDialog?.close?.();
        document.body.style.overflow = '';
        toast('Profile switched');
    }
});

// Close dialog when clicking backdrop
authDialog?.addEventListener('click', (e) => {
    const rect = authDialog.getBoundingClientRect();
    if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
    ) {
        authDialog.close();
        document.body.style.overflow = '';
    }
});

// Ensure body scroll is restored on ESC or programmatic close
authDialog?.addEventListener('cancel', () => {
    document.body.style.overflow = '';
});
authDialog?.addEventListener('close', () => {
    document.body.style.overflow = '';
});

// Budgets CSV export/import
budgetExportBtn?.addEventListener('click', () => {
    const rows = [
        ['type','category','amount'],
        ['total','', budgets.total]
    ];
    Object.entries(budgets.cats || {}).forEach(([cat, amt]) => rows.push(['category', cat, amt]));
    const csv = rows.map(r => r.map(x => /[,"\n]/.test(String(x)) ? '"'+String(x)+'"' : String(x)).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'budgets.csv';
    a.click();
});

budgetImportInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const header = (lines.shift() || '').split(',').map(s => s.trim().replace(/^"|"$/g,''));
    const idx = Object.fromEntries(header.map((h,i)=>[h,i]));
    let total = 0; const cats = {};
    lines.forEach(line => {
        const cols = parseCsvLine(line);
        const type = (cols[idx.type]||'').trim();
        const category = (cols[idx.category]||'').trim();
        const amount = Math.abs(parseFloat(cols[idx.amount]||'0'))||0;
        if (type === 'total') total = amount;
        if (type === 'category' && category) cats[category] = amount;
    });
    budgets = { total, cats };
    store.save();
    renderBudgets();
    e.target.value = '';
});

// Recurring CSV export/import
recExportBtn?.addEventListener('click', () => {
    const rows = [['id','name','amount','type','category','frequency','start']]
        .concat(recurring.map(r => [r.id, r.name, r.amount, r.type, r.category||'', r.frequency, r.start||'']));
    const csv = rows.map(r => r.map(x => /[,"\n]/.test(String(x)) ? '"'+String(x)+'"' : String(x)).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'recurring.csv';
    a.click();
});

recImportInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const header = (lines.shift() || '').split(',').map(s => s.trim().replace(/^"|"$/g,''));
    const idx = Object.fromEntries(header.map((h,i)=>[h,i]));
    const imported = lines.map(line => {
        const cols = parseCsvLine(line);
        return {
            id: cols[idx.id] || uid(),
            name: (cols[idx.name]||'').trim(),
            amount: Math.abs(parseFloat(cols[idx.amount]||'0'))||0,
            type: (cols[idx.type]||'expense').trim(),
            category: (cols[idx.category]||'').trim(),
            frequency: (cols[idx.frequency]||'monthly').trim(),
            start: (cols[idx.start]||'').trim(),
        };
    }).filter(r => r.name && r.amount);
    // merge by id (replace existing)
    const map = Object.fromEntries(recurring.map(r => [r.id, r]));
    imported.forEach(r => { map[r.id] = r; });
    recurring = Object.values(map);
    store.save();
    renderRecurring();
    e.target.value = '';
});

// PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = '';
});

installBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try { await deferredPrompt.userChoice; } catch {}
    deferredPrompt = null;
    installBtn.style.display = 'none';
});

// Init
yearEl.textContent = new Date().getFullYear();
store.load();
applyI18n();
render();
renderRecurring?.();