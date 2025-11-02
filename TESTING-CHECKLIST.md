# 🧪 Testing Checklist - Expense Tracker

## Pre-Launch Testing (Complete before deploying)

### ✅ UI/UX Testing

#### Header & Controls
- [ ] All icons display correctly (wallet logo, theme sun/moon, control buttons)
- [ ] Theme toggle works smoothly (click button, icons swap, colors change)
- [ ] Locale/Language/Currency dropdowns work
- [ ] Controls wrap nicely on mobile (< 768px width)
- [ ] All buttons have proper spacing and tap targets (44x44px minimum on mobile)

#### Profile Dialog
- [ ] Profile button opens dialog
- [ ] Auth status shows clearly:
  - Signed out: "○ Not signed in (local storage only)" with gray dot
  - Signed in: "✓ Signed in as [Name]" with green pulsing dot
- [ ] Profile sections are visually separated
- [ ] All icons display (users, user, repeat, google icons)
- [ ] Dialog scrolls if content overflows (max-height: 90vh)

#### Forms & Inputs
- [ ] Add transaction form works (all fields)
- [ ] Date picker doesn't disappear in light theme
- [ ] Category autocomplete shows suggestions
- [ ] All inputs have 44px height on mobile (prevents iOS zoom)
- [ ] Reset button clears form

#### Transactions Table
- [ ] Transactions display with correct formatting
- [ ] Edit button works (populates form)
- [ ] Delete button works (with confirmation)
- [ ] Category color dots show correctly
- [ ] Table scrolls horizontally on mobile
- [ ] Empty state shows wallet icon + message

#### Charts
- [ ] Category doughnut chart renders
- [ ] Custom category colors apply to chart
- [ ] Monthly bar chart renders
- [ ] Charts update when theme changes
- [ ] Charts responsive on mobile

#### Budgets
- [ ] Budget progress bars show correctly
- [ ] 4-tier colors work (green → yellow → orange → red)
- [ ] Percentage displays accurately
- [ ] Shimmer animation on progress bars
- [ ] Empty state shows target icon + message

#### Recurring Transactions
- [ ] Add recurring rule works
- [ ] Apply now generates transactions
- [ ] Frequency badges display (daily/weekly/monthly)
- [ ] Remove button works
- [ ] Empty state shows repeat icon + message

#### Category Colors
- [ ] Color pickers work
- [ ] Colors save to localStorage
- [ ] Colors apply to chart and table dots
- [ ] Empty state shows palette icon + message

#### Footer
- [ ] GitHub icon displays
- [ ] Links work (GitHub, Privacy, Terms)
- [ ] Copyright year shows current year

#### Floating Coffee Button
- [ ] Yellow/orange gradient displays
- [ ] Coffee icon shows (not empty box)
- [ ] Links to BuyMeACoffee correctly
- [ ] Hover effect works

---

### ✅ Functionality Testing

#### Local Storage
- [ ] Transactions persist after page reload
- [ ] Preferences persist (locale, language, currency, theme)
- [ ] Budgets persist
- [ ] Recurring rules persist
- [ ] Category colors persist

#### Profiles
- [ ] Create new profile works
- [ ] Switch between profiles works
- [ ] Each profile has isolated data
- [ ] Profile dropdown updates after creating new profile

#### CSV Import/Export
- [ ] Export transactions CSV works
- [ ] Import transactions CSV works
- [ ] Export budgets CSV works
- [ ] Import budgets CSV works
- [ ] Export recurring CSV works
- [ ] Import recurring CSV works

#### Filters
- [ ] Filter by type (All/Expense/Income) works
- [ ] Filter by category works
- [ ] Filter by date range (From/To) works
- [ ] Search by name/notes works
- [ ] Filters combine correctly (AND logic)

#### Calculations
- [ ] Sum income calculates correctly
- [ ] Sum expenses calculates correctly
- [ ] Balance = Income - Expenses
- [ ] Budget progress percentage accurate
- [ ] Category totals in chart accurate
- [ ] Monthly totals accurate

#### i18n (Internationalization)
- [ ] English translations work
- [ ] Spanish translations work
- [ ] French translations work
- [ ] German translations work
- [ ] Portuguese translations work
- [ ] Hindi translations work
- [ ] Numbers format correctly per locale
- [ ] Currencies format correctly

---

### ✅ Authentication Testing

#### Google Sign-In
- [ ] "Sign in with Google" button works
- [ ] Google popup opens
- [ ] After sign-in, status shows "✓ Signed in as [Name]"
- [ ] Profile switches to user.uid
- [ ] Data loads under new profile namespace
- [ ] Sign-out button appears and works
- [ ] After sign-out, status shows "○ Not signed in"

#### Error Handling
- [ ] Closing Google popup doesn't break app
- [ ] Network errors show gracefully
- [ ] Auth state persists across page reloads

---

### ✅ PWA Testing

#### Installation
- [ ] "Install App" button appears on supported browsers
- [ ] Install prompt works
- [ ] App installs successfully
- [ ] Installed app opens in standalone window
- [ ] App icon displays correctly

#### Service Worker
- [ ] Service worker registers successfully
- [ ] Assets cache on first load
- [ ] App works offline (after first visit)
- [ ] Updates apply on next visit

#### Manifest
- [ ] Manifest.json loads correctly
- [ ] Theme color applies (dark: #0b1020)
- [ ] App name shows in installed app
- [ ] Icons show in app switcher

---

### ✅ Performance Testing

#### Load Time
- [ ] First load < 3 seconds
- [ ] Subsequent loads < 1 second (service worker cache)
- [ ] No console errors on load

#### Lighthouse Scores (Target)
- [ ] Performance: > 90
- [ ] Accessibility: > 95
- [ ] Best Practices: > 90
- [ ] SEO: > 90
- [ ] PWA: ✓ Installable

#### Memory Usage
- [ ] App doesn't leak memory over time
- [ ] Large transaction lists (1000+) perform well
- [ ] Charts render smoothly with many categories

---

### ✅ Browser Compatibility

#### Desktop
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Mobile
- [ ] Chrome Android
- [ ] Safari iOS
- [ ] Samsung Internet
- [ ] Firefox Mobile

#### Features
- [ ] All icons display on all browsers
- [ ] Animations smooth on all browsers
- [ ] Date pickers work on all browsers
- [ ] Service worker works on all browsers

---

### ✅ Responsive Design

#### Breakpoints
- [ ] Desktop (1920x1080): Full layout, all controls visible
- [ ] Laptop (1366x768): Comfortable layout
- [ ] Tablet (768x1024): Controls wrap, grid adjusts
- [ ] Mobile (375x667): Single column, touch-friendly

#### Specific Checks
- [ ] Header doesn't overflow on small screens
- [ ] Buttons are tappable (min 44x44px)
- [ ] Text is readable (min 16px on mobile)
- [ ] No horizontal scroll (unless intentional for table)
- [ ] Profile dialog fits on screen (90% width on mobile)

---

### ✅ Accessibility Testing

#### Keyboard Navigation
- [ ] Tab through all controls
- [ ] Enter/Space activate buttons
- [ ] Escape closes dialogs
- [ ] Focus visible on all interactive elements

#### Screen Reader
- [ ] Page title announced
- [ ] Form labels associated correctly
- [ ] Button purposes clear
- [ ] Error messages announced
- [ ] Live region for toasts works

#### ARIA
- [ ] All images have alt text or aria-label
- [ ] Dialogs have aria-label
- [ ] Buttons have aria-label where needed
- [ ] Form inputs have proper labels

#### Color Contrast
- [ ] Text meets WCAG AA (4.5:1 for body, 3:1 for large)
- [ ] Both dark and light themes pass contrast checks
- [ ] Links distinguishable without color alone

---

### ✅ Security Testing

#### Data Privacy
- [ ] No sensitive data in console logs
- [ ] No sensitive data in network requests
- [ ] localStorage not accessible from other domains
- [ ] Firebase Auth uses HTTPS only

#### XSS Prevention
- [ ] User input sanitized before display
- [ ] No eval() or innerHTML with user data
- [ ] Category names with special chars render safely

#### HTTPS
- [ ] Site served over HTTPS (Vercel default)
- [ ] Mixed content warnings none
- [ ] All external resources (CDNs) use HTTPS

---

### ✅ Edge Cases

#### Data Limits
- [ ] 0 transactions: Empty states show
- [ ] 1000+ transactions: App performs well
- [ ] Very long transaction names: Truncate or wrap
- [ ] Very large amounts (1,000,000+): Format correctly
- [ ] Negative amounts: Handle gracefully

#### Date Edge Cases
- [ ] Future dates accepted
- [ ] Very old dates (1900) work
- [ ] Leap year dates work
- [ ] Timezone changes don't break dates

#### Input Validation
- [ ] Empty required fields prevent submit
- [ ] Negative amounts in "Amount" field rejected
- [ ] Invalid dates rejected
- [ ] Very long text in notes field accepted

#### Browser Edge Cases
- [ ] Private/Incognito mode works
- [ ] localStorage full: Handle gracefully
- [ ] Cookies disabled: App still works (auth may fail)

---

## 🐛 Known Issues (Document here)

### Critical
- [ ] None currently

### Medium
- [ ] None currently

### Low
- [ ] None currently

---

## 📱 Mobile-Specific Testing

### iOS Safari
- [ ] PWA installs via "Add to Home Screen"
- [ ] Standalone mode works (no browser UI)
- [ ] Swipe gestures don't conflict with browser
- [ ] Input focus doesn't zoom page (font-size: 16px)
- [ ] Date picker works (iOS native)

### Android Chrome
- [ ] PWA install prompt appears
- [ ] Installed app opens correctly
- [ ] Share sheet integration works
- [ ] Back button works correctly in dialogs

---

## 🚀 Pre-Deploy Checklist

- [ ] All critical bugs fixed
- [ ] All features tested on 3+ browsers
- [ ] Mobile tested on real devices (not just emulator)
- [ ] Performance acceptable (Lighthouse > 90)
- [ ] Privacy Policy and Terms pages exist
- [ ] AdSense code correct (pub-3043513870332414)
- [ ] Firebase config correct (no test credentials)
- [ ] Analytics code added (if using)
- [ ] Version number updated in manifest.json
- [ ] Git commit with clear message
- [ ] Deploy to Vercel
- [ ] Test production URL
- [ ] Check all external links work (GitHub, BMC)

---

## 🎯 Post-Deploy Testing

### Production Environment
- [ ] App loads at production URL
- [ ] HTTPS certificate valid
- [ ] Service worker registers
- [ ] Firebase Auth works
- [ ] AdSense ads show (may take 24-48 hours)
- [ ] All CDN resources load (Chart.js, Firebase)

### Real User Testing
- [ ] Ask 3-5 friends to test
- [ ] Gather feedback on UX
- [ ] Check analytics for errors
- [ ] Monitor Firebase usage (auth, if using Firestore)

---

## 📊 Success Metrics

### Week 1
- [ ] 10+ users sign up
- [ ] 100+ transactions added
- [ ] 0 critical bugs reported
- [ ] < 5% bounce rate

### Month 1
- [ ] 100+ total users
- [ ] 10+ daily active users
- [ ] 4.0+ average rating (if collecting)
- [ ] First AdSense earnings ($0.50+)

---

**Testing completed by**: _______________
**Date**: _______________
**Version**: _______________
