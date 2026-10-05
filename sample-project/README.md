# Sample project

Reference implementation of the ENSO base specification (`../base-specs`). It shows what a new ENSO project starts with: a public front-end, a `/admin` back-office, e-mail + password login with OTP, password recovery, user management, e-mail and branding settings, and branded HTML e-mails.

## Running

```bash
docker compose up --build
```

| URL | What |
| --- | --- |
| http://localhost:8080 | Public front-end |
| http://localhost:8080/styleguide | ENSO style guide (public, for reference) |
| http://localhost:8080/admin | Back-office (redirects to login) |
| http://localhost:8025 | Mailpit, catches every e-mail the app sends |

First login: `admin@exemplo.pt` / `admin12345` (super administrator). Change it with `ADMIN_EMAIL` / `ADMIN_PASSWORD` before the first start, see `.env.example`.

If 8080 or 8025 are taken, run with `APP_PORT=8090 MAILPIT_PORT=8035 APP_URL=http://localhost:8090 docker compose up --build`.

Data lives in `./data/db` (bind mount, no named volumes). Delete `./data` to start from scratch.

## Developing without rebuilding images

```bash
docker compose up -d db mailpit
# expose Postgres to the host for this mode, e.g. add `ports: ["5432:5432"]` to db
cd backend && npm install && SMTP_HOST=localhost SMTP_PORT=1025 SMTP_FROM=no-reply@base-project.local APP_URL=http://localhost:5173 npm run dev
cd frontend && npm install && npm run dev   # http://localhost:5173, proxies /api to :4000
```

## Tests

```bash
cd backend && npm test     # dates, encryption, e-mail templates
cd frontend && npm test    # date formatting
cd frontend && npm run build   # typecheck (tsc) + Vite build
```

## What's where

- `backend/`: Node 22 + Express 5 + Postgres (`pg`). Schema in `src/schema.sql` (applied on start), first-run seed in `src/index.js`.
- `frontend/`: React 19 + TypeScript + Vite + React Router + Tailwind, with the look of the ENSO style guide. Inter and JetBrains Mono are self-hosted via Fontsource. Served by nginx in Docker, which also proxies `/api` to the backend.
  - `src/styleguide/`: copy of the ENSO style guide (`base-style-guide`), served at `/styleguide`.
  - `src/ui/`: the components the back-office is built from, taken from the style guide.
  - Light/dark mode toggle everywhere; the four theme colors come from Settings → Branding.
- `frontend/public/enso/`: official ENSO ORIGINS logos (from the style guide), used for "Powered by ENSO".

Fingerprint (WebAuthn) login is marked optional in the spec and is not implemented.
