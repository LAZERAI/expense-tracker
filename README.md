# 🧾 Expense Tracker

> A modern, privacy-focused expense tracker that runs entirely in your browser. No backend, no sign-up required, your data stays with you.

🔗 **[Live Demo](https://lazerai-expense.vercel.app)** | 📱 **[Install as PWA](https://lazerai-expense.vercel.app)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PWA](https://img.shields.io/badge/PWA-enabled-brightgreen.svg)](https://web.dev/progressive-web-apps/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://lazerai-expense.vercel.app)

## ✨ Features

- 📊 **Track Income & Expenses** - Categorized transactions with notes and dates
- 💰 **Budget Management** - Set monthly budgets and track spending by category
- 🔄 **Recurring Transactions** - Automate daily, weekly, or monthly transactions
- 📈 **Visual Analytics** - Beautiful charts showing spending by category and monthly trends
- 🌍 **Multi-Language** - 6 languages (EN/ES/FR/DE/PT/HI) with 8 currency options
- 🎨 **Dark/Light Theme** - Smooth theme toggle with system preference support
- 📱 **PWA Ready** - Install on any device, works offline
- 🔒 **Privacy First** - All data stored locally in your browser (localStorage)
- ☁️ **Optional Cloud Sync** - Sign in with Google to sync across devices (via Firebase)
- 📤 **CSV Export/Import** - Take your data anywhere

## 🚀 Quick Start

### Run Locally
Simply open `index.html` in your browser. No build process needed!

### Try the Demo
Click **"Load Sample"** in the header to populate with demo data.

### Deploy to Vercel
```bash
vercel --prod
```

Or deploy to Netlify, GitHub Pages, or any static host.

## 🛠️ Tech Stack

- **Vanilla JavaScript** - Zero dependencies (except Chart.js for visualization)
- **Chart.js** - Beautiful, responsive charts
- **Firebase Auth** - Optional Google Sign-In for cloud sync
- **Service Worker** - Offline support and caching
- **CSS Variables** - Easy theme customization

## 📖 Documentation

### Data Storage
- **Local**: All data stored in browser `localStorage` (5-10MB limit)
- **Cloud**: Optional Firebase Firestore sync when signed in
- **Export**: Backup data anytime via CSV export

### Customization
- **Languages**: Edit `i18n` object in `script.js`
- **Currencies**: Modify `currencySelect` options in `index.html`
- **Styling**: Adjust CSS variables at the top of `styles.css`
- **Categories**: Add transactions to generate category suggestions

### Privacy & Legal
- [Privacy Policy](privacy.html) - How we handle your data
- [Terms of Service](terms.html) - Usage terms and disclaimers

## 📁 Project Structure

```
expense-tracker/
├── index.html           # Main app page
├── script.js            # Core application logic
├── styles.css           # All styling
├── auth.js              # Firebase authentication
├── service-worker.js    # PWA offline support
├── icons.svg            # SVG icon sprite
├── manifest.webmanifest # PWA manifest
├── privacy.html         # Privacy policy
├── terms.html           # Terms of service
└── data/                # Sample CSV files
    ├── sample-transactions.csv
    ├── sample-budgets.csv
    └── sample-recurring.csv
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs via [Issues](https://github.com/LAZERAI/expense-tracker/issues)
- Submit pull requests with improvements
- Suggest new features or translations

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 💖 Support

If you find this useful, consider:
- ⭐ Starring the repo
- 🐛 Reporting bugs
- 💡 Suggesting features
- ☕ [Buy me a coffee](https://www.buymeacoffee.com/lazerai)

---

**Built with ❤️ by [LAZERAI](https://github.com/LAZERAI)**
