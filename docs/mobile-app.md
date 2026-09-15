# Panama Peptides mobile app

The current website now supports two mobile delivery paths from the same Next.js codebase:

1. **Installable web app (PWA).** Mobile customers can install the website from the browser. It opens in a standalone window, has a home-screen icon, and shows a safe offline page when inventory cannot be refreshed.
2. **Android APK shell.** Capacitor packages the deployed website in a native Android project. The shell points to `https://panamapeptides.com` because this application depends on Next.js server routes, Supabase, checkout, and other server-side features. A static export would break those features.

## What this version includes

- The existing bilingual catalog, account, checkout, COA, theme, and admin system
- Android and iOS home-screen installation metadata
- An accessible install prompt on mobile browsers
- Offline handling without caching account, checkout, admin, or API responses
- Android packaging configuration under `capacitor.config.json`
- Push-notification event handling in the service worker; subscription storage and message scheduling still need a server-side notification provider

This is the mobile packaging foundation for the existing commerce site. It does not yet implement the separate dose tracker described in the proposals.

## Feature plan from the proposals

Build the tracker in releases so safety, privacy, and daily usability can be tested before adding complexity:

### Release 1: daily record keeping

- User-entered schedules and reminders
- Mixing and measurement calculators with clear units
- One-tap event logs, editable history, countdown, export, and Spanish support
- On-device or user-owned encrypted records
- Research-use and record-keeping language throughout; no prescribed doses

### Release 2: peptide and vial organization

- Catalog-linked compound records
- User-created schedules, cycling, vial tracking, site rotation, lot/batch records, and expiry reminders
- Structure-only templates that never supply a recommended dose

### Release 3: store connection

- Optional reorder prompts and purchase-to-vial setup
- COA lookup by lot, progress journal, and cost-per-event calculations
- Business reporting limited to aggregate totals; individual event records stay private

Features such as simulated blood levels, interaction advice, AI medical chat, bloodwork interpretation, and supplier-authored dose recommendations should remain outside the product until separate clinical, legal, and privacy review is complete.

## Local web development

Use Node.js 22 or newer:

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. Service workers register only in production builds so development changes are never hidden by a stale cache.

## Android setup and APK

Install Android Studio with its Android SDK and a supported JDK, then run:

```powershell
npm install @capacitor/core @capacitor/android
npm install --save-dev @capacitor/cli
npx cap add android
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

The debug APK is generated at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Before a public store release, replace the debug signing key, test on physical Android devices, prepare the privacy policy and Data safety form, and decide whether the live-site shell meets the target store's current policy. The PWA remains fully usable without store review.

## Production checks

- Serve the website and service worker over HTTPS.
- Keep `capacitor.config.json` pointed at the live canonical domain.
- Verify the Spanish and English flows on narrow screens.
- Test login, checkout return URLs, WhatsApp links, downloads, camera/file inputs, and external payment pages inside the Android WebView.
- Add notification permission only in response to a clear user action and only after a notification backend exists.
