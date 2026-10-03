# Design & More storefront

React/Vite frontend in `Front/`. Backend: https://design-more.onrender.com.

## About the website

Design & More is a bilingual storefront for decorative metalwork, laser-cut
panels, and custom fabrication projects. Visitors can browse products, view
product details, and submit enquiries for custom work.

The website includes:

- English and Arabic interfaces, including right-to-left layouts.
- Product categories, search, product details, and customer reviews.
- Shopping cart, checkout, and order confirmation pages.
- Registration, sign-in, email verification, and customer account pages.
- Custom-order enquiries with reference image uploads.
- A contact form connected to `POST /api/contact`, plus direct contact links.

Product data, authentication, orders, and contact processing use the separate
Render backend. Contact email delivery depends on the backend's SMTP and
recipient configuration.

## Technology and project structure

Built with React 18, Vite 5, React Router 6, Axios, and Lucide icons.

| Location | Purpose |
| --- | --- |
| `Front/src/pages/` | Website pages |
| `Front/src/components/` | Shared interface components |
| `Front/src/api/` | Backend API requests |
| `Front/src/context/` | Authentication, cart, wishlist, and language state |
| `Front/src/config/` | Backend URL and business contact information |
| `Front/src/utils/bilingual.js` | Shared English and Arabic text |
| `Front/src/styles/` | Website styling |
| `Front/public/logo/` | Public logo assets |
| `.github/workflows/deploy.yml` | GitHub Pages build and deployment |

Update business phone numbers, email addresses, social links, and locations in
`Front/src/config/contactInfo.js`. Review these details before launching.
Internal Markdown guides are excluded from Git; this root README is retained.

## Local development

Use Node.js 22. From the repository root:

```sh
cd Front
npm ci
npm run dev
```

Copy `Front/.env.example` to `Front/.env` if needed. Production builds use
`Front/.env.production`; the backend URL is public configuration.
Never put SMTP passwords, tokens, or other secrets in `VITE_` variables: these
are included in the browser bundle. SMTP and the contact recipient setting
belong only on the Render backend.

## Publish on GitHub Pages

1. Create a GitHub repository and upload this entire project, including `.github/`
   at the repository root. Do not upload `node_modules/`, `dist/`, or local `.env` files.
2. Use the `main` branch. In repository **Settings > Pages**, set **Source** to
   **GitHub Actions**.
3. Push to `main` or run **Deploy website to GitHub Pages** from the Actions tab.
4. The workflow displays the website URL when deployment completes.

The workflow builds `Front/` and automatically uses the repository's Pages base
path. Pages builds use hash routes, such as `/repository/#/contact`, so refreshing
an inner page works without server rewrite support. Local/default builds keep
normal browser routes. Logos use the configured base path.

Allow the final frontend origin in the Render backend's CORS configuration
(for example `https://YOUR-USERNAME.github.io`, without the repository path).
Allow the API's required methods and the `Content-Type` and `Authorization`
request headers. The backend configuration is not in this repository.

After deployment, check products, images, login, and contact submission in a
browser. A successful frontend build does not verify backend connectivity or
email delivery. Configure the backend's contact recipient environment variable
alongside its SMTP settings; its exact variable name must come from the backend.

## Build locally

```sh
cd Front
npm run build
npm run preview
```

Build output: `Front/dist/`. Other static hosts need a rewrite from application
routes to `/index.html` when using the default browser router.

Deployment reference: https://vite.dev/guide/static-deploy.html#github-pages
