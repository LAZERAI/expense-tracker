# Expense Tracker

A personal finance tracker that runs in your browser. No account needed — your data stays on your device in localStorage.

**Live app:** [et-lazerai.vercel.app](https://et-lazerai.vercel.app/)

## What it does

- Track income and expenses by category
- Set monthly budgets (total + per-category) with progress bars
- Recurring transactions (daily/weekly/monthly)
- Charts for spending breakdown and monthly trends (Chart.js)
- Filter and search transactions
- CSV import/export for everything
- Multiple local profiles
- Optional Google sign-in (Firebase Auth)
- 6 languages, 8 currencies, dark/light theme
- Works offline as a PWA

## Run it

Open `index.html` in a browser. That's it — no build step, no dependencies to install.

To deploy:

```bash
vercel --prod
```

Or drop the files on any static host (Netlify, GitHub Pages, Cloudflare Pages, etc).

## How data is stored

Everything goes into `localStorage` in your browser. There's no backend, no database, no tracking. If you sign in with Google, Firebase Auth handles authentication but your financial data still lives locally.

The 5-10MB localStorage limit is plenty for personal use. You can export to CSV anytime as a backup.

## Project structure

```text
index.html            Main app (single page)
script.js             All app logic, i18n strings, state management
styles.css            Styling + dark/light theme via CSS variables
auth.js               Firebase Auth (optional Google sign-in)
service-worker.js     PWA offline caching
manifest.webmanifest  PWA install config
privacy.html          Privacy policy
terms.html            Terms of service
data/                 Sample CSV files for demo
```

## Customization

- **Languages:** Edit the `i18n` object in `script.js`
- **Currencies:** Modify the currency `<select>` options in `index.html`
- **Theme colors:** Change CSS variables at the top of `styles.css`
- **Categories:** They auto-populate from your transaction history

## Contributing

Open an [issue](https://github.com/LAZERAI/expense-tracker/issues) or submit a PR. Bug reports, feature ideas, and translations are all welcome.

## License

MIT

---

**Built with ❤️ by [LAZERAI](https://github.com/LAZERAI)**
