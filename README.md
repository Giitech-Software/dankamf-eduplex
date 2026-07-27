# Dankamf Eduplex

Enterprise school website and administration platform for Dankamf Educational Complex.

Live site: [dankamf-eduplex.web.app](https://dankamf-eduplex.web.app)

## Platform overview

- React single-page public website with responsive blue-and-white enterprise styling
- Firebase Authentication for administrator access
- Firestore-backed content management for news, events, admissions, downloads, alerts, leadership, alumni, fees, FAQs, services, projects and testimonials
- Admin dashboard with role-based access (`admin` and `superadmin`)
- Online admissions, interview booking, tour requests, application status checking and contact forms
- Search across public pages and dynamic content
- Gallery, calendar, download center, social links and SEO metadata
- Firebase Hosting with SPA rewrites, sitemap and robots file

## Requirements

- Node.js 18 or newer
- npm
- Firebase CLI for deployment
- Access to the `dankamf-eduplex` Firebase project for protected features and deployment

## Local development

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

The frontend Firebase configuration is in `src/firebase/config.js`. Firebase web configuration values are intended for client use; never commit service-account credentials or private API secrets.

## Optional email service

The `email-server` directory contains the Node/Express service used for protected admission-status and email workflows.

```bash
cd email-server
npm install
copy .env.example .env
npm start
```

Set `REACT_APP_EMAIL_SERVER_URL` in the frontend environment when the email service is running outside the local default configuration. Keep `.env` files and service-account keys private.

## Production build

```bash
$env:GENERATE_SOURCEMAP='false'; npm run build
```

The optimized application is generated in `build/`.

## Firebase deployment

The repository is pinned to the correct Firebase project through `.firebaserc`.

```bash
firebase login
firebase use dankamf-eduplex
firebase deploy --only hosting
```

Deploy Firestore and Storage rules only after reviewing their security impact:

```bash
firebase deploy --only firestore:rules,storage
```

## Project structure

```text
src/components/     Shared public, admin and layout components
src/pages/          Public pages and admin management screens
src/context/        Authentication and theme state
src/firebase/       Firebase client initialization and auth helpers
public/              Static assets, sitemap and robots.txt
email-server/        Optional backend email/status service
scripts/             Build and sitemap utilities
firestore.rules      Firestore access-control rules
storage.rules        Storage access-control rules
firebase.json        Firebase Hosting configuration
```

## Administration

Visit `/login` to access the administrator portal. A user must exist in Firebase Authentication and have a matching document in the Firestore `users` collection with an approved role. Use `superadmin` as the canonical elevated role name.

Admin routes are protected in the application and should also be protected by Firestore and Storage rules. Do not expose credentials, `.env` files, service-account JSON files or Firebase tokens in Git.

## Quality checks

Before deploying, run:

```bash
npm run build
git status
```

The build may report existing non-blocking ESLint warnings; deployment should proceed only when the production build completes successfully.

## License and ownership

This project is maintained for Dankamf Educational Complex. Branding, content and administrative data belong to the school and its authorized operators.
