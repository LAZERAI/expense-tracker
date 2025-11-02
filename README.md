# Expense Tracker

A polished, free, client‑side expense tracker with:
- Modern UI (dark/light), responsive, mobile‑friendly
- Income and expenses, categories, notes, dates
- Filters (type, category, date range, text)
- Summaries and Chart (spending by category)
- Multi‑language (EN/ES/FR) and currency formatting
- Persistence with localStorage
- Zero backend; deploy to Vercel, Netlify, or GitHub Pages

## Run locally
Open `index.html` in your browser.

## Deploy (Vercel)
If you have Vercel CLI installed and are logged in:

```powershell
cd C:\Users\Lazerai\Documents\expense-tracker
vercel --prod
```

## Customize
- Translations: edit `script.js` i18n dictionaries.
- Default currency/language: set selects in `index.html`.
- Styling: tweak `styles.css` tokens at the top (CSS variables).

## Monetization
Add your snippets into the `#ad-placeholder` in `index.html` (AdSense, BuyMeACoffee, affiliate banners).

## Privacy
All data is stored locally in your browser via localStorage. No servers involved.

## Demo data

- Click the "Load Sample" button in the header to populate realistic transactions across months, plus budgets and recurring rules.
- You can also import manually from CSVs in `data/`:
	- `data/sample-transactions.csv`
	- `data/sample-budgets.csv`
	- `data/sample-recurring.csv`

## Publish to GitHub

Use these commands in Windows PowerShell from the `expense-tracker` folder to initialize and push to a new GitHub repo:

```powershell
git init
git add .
git commit -m "Initial commit: expense tracker with demo data"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO>.git
git push -u origin main
```

Replace `<YOUR-USERNAME>` and `<YOUR-REPO>` accordingly. If the repo already exists, skip `git init` and `git branch -M main`.
