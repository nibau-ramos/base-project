# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

- `base-specs/`: the ENSO base specification that every ENSO project must satisfy.
  - `Especificacao_Base_ENSO.pdf` / `.docx`: the specification in Portuguese. Both files have the same content.
  - `gherkin-base-enso/*.feature`: Gherkin acceptance criteria (`# language: pt`, so keywords are `Funcionalidade`, `Cenário`, `Dado`, `Quando`, `Então` and so on), numbered by area (01 infrastructure through 10 e-mails). Scenarios tagged `@opcional` (fingerprint login, super administrator) are nice-to-haves. These files are the source of truth for the base requirements.
- `sample-project/`: a reference implementation of the base spec, showing what a new project starts with. All sample code stays inside this folder.

## sample-project commands

Run these from `sample-project/`:

- `docker compose up --build`: full stack. App on http://localhost:8080 (`/admin` is the back-office) and Mailpit on http://localhost:8025. The first login is `admin@exemplo.pt` / `admin12345`. Use `APP_PORT`, `MAILPIT_PORT` and `APP_URL` to change the ports if they are taken.
- `rm -rf data`: reset the database. Stop the stack first, and recreate `data/db` before the next `up`, or Docker Desktop's bind mount can make Postgres initdb fail. The `.gitignore` rule for it is anchored (`/sample-project/data/`); don't loosen it to `data/`, which would also drop source folders such as `frontend/src/styleguide/data/`.
- `cd backend && npm test`: tests use `node:test`. Run a single file with `node --test test/dates.test.js`, or a single test with `node --test --test-name-pattern="reset link"`. Don't pass a directory: Node treats it as a file.
- `cd frontend && npm test && npm run build`: `build` runs `tsc --noEmit` first, and `npm run typecheck` runs only that. There is no linter configured.

## sample-project architecture

- **Backend** (`backend/src`): Express 5 with ESM, so async route errors reach the error handler in `app.js` without wrappers. There is no migration tool. `schema.sql` is idempotent and applied on every start, and `index.js` seeds the first super admin, e-mail settings and branding from environment variables only when they are missing. After that, the back-office owns those values.
- **Sessions:** a JWT in an httpOnly `session` cookie. `requireAuth` reloads the user on every request and compares `token_version`, so bumping it (on password change or reset) logs out other sessions. Login with OTP goes through a 5-minute `otp_pending` cookie before `/api/auth/otp` issues the real session.
- **Mandatory OTP:** admins can set `users.otp_required`. Such a user can't disable OTP (`/api/profile/otp/disable` returns 403). Without OTP set up, login returns `otpSetupRequired`, and enrollment happens under the pending cookie via `/api/auth/otp/setup` and `/api/auth/otp/setup/confirm` before any session exists. Turning the flag on for someone without OTP, or an admin `POST /api/users/:id/otp/reset`, bumps `token_version` so open sessions end. Enrollment logic is shared in `lib/otp.js`. New columns go in `schema.sql` as `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.
- **Roles:** `canManageRole` in `lib/auth.js` is the single rule: admins manage admins and normal users, and only super admins manage super admins. The front-end copies it as `assignableRoles` in `pages/admin/Users.tsx`.
- **Secrets:** the SMTP password and OTP secrets are AES-GCM encrypted with `APP_SECRET` (`lib/crypto.js`). The SMTP password is never returned by the API, only `hasPassword`. Reset tokens are stored as SHA-256 hashes.
- **Settings:** stored as JSON rows in the `settings` table (keys `email` and `branding`). Branding includes the style guide's four colors (`primary`, `secondary`, `neutral`, `accent`, `#rrggbb`), normalized with defaults in `lib/branding.js`; e-mail buttons use `primary`. The seven named one-click schemes live in `frontend/src/lib/colorPresets.ts` and are shown by `ui/ColorPresets.tsx` in both Settings → Branding and the style guide's configuration page. The logo is stored as a blob in `branding_logo` and served publicly at `/api/branding/logo?v=<timestamp>`, which the front-end also uses as the favicon.
- **E-mails:** every e-mail goes through `sendSystemEmail` in `lib/mailer.js`. It wraps content from a builder in `emails/templates.js` in the branded HTML layout and attaches the logo inline (`cid:brand-logo`). New e-mail types should be new builders there.
- **Dates:** `formatDate(value, 'date' | 'datetime' | 'datetime-seconds')` exists in both `backend/src/lib/dates.js` and `frontend/src/lib/dates.js`. Never use `toLocaleString` or other formatters.
- **Frontend** (`frontend/src`): React 19, TypeScript, React Router 7, Tailwind 3 and lucide-react, following the ENSO style guide (`/Users/carlosramos/code/base-style-guide`).
  - `styleguide/` is a copy of that repo's `src` (minus its store and entry files), served publicly at `/styleguide` and lazy-loaded. Its routes were prefixed with `/styleguide` and its store imports point at `src/store`. When syncing from the original, re-apply those two changes.
  - `ui/` holds the app's components (Button, form fields, Alert/Badge, Card/Modal/Tabs, PoweredBy), extracted from the style guide's demos. Build back-office screens from these instead of new styles.
  - Theme: Tailwind colors are CSS variables (`--color-*` in `index.css`) mixed with `<alpha-value>` in `tailwind.config.js`, so `bg-primary/10` works with runtime colors. `store/themeSlice.ts` (Redux) applies the branding colors and the dark mode (`.dark` on `<html>`, remembered in localStorage). `BrandingProvider` loads `/api/branding` into it and also sets the favicon and document title. Editing colors in Settings → Branding previews live and reverts on leave unless saved.
  - `AuthProvider`: `user` is `undefined` while loading and `null` when signed out. `useCurrentUser()` is for pages behind `RequireAuth`.
  - `lib/api.ts` wraps fetch, and pages show the backend's Portuguese error messages directly. `lib/dates.js` stays plain JS (with `allowJs`) so `node --test` can test it.
  - In Docker, nginx serves the build and proxies `/api` to the backend. `npm run dev` uses the Vite proxy to `localhost:4000` instead.
- **UI language:** user-facing text is Portuguese (pt-PT). Screens address the user as "tu", like the style guide. Backend error messages are also Portuguese.

## Mandated stack and infrastructure

- Back-end: Node. Front-end: React. A base UI component repository will be provided later, and new UI should follow it.
- Database: chosen per project. Postgres is the default. Use TimescaleDB for time series, SQLite for small projects, and NoSQL only when it is justified. Never use Microsoft databases such as SQL Server.
- Run everything with Docker Compose, with one service per component (front-end, back-end, database, plus any extras). `docker compose up` must bring up the whole app.
- Persistent data uses bind mounts to `./data/<service-name>`. Don't use named volumes unless there is a documented technical reason.

## Cross-cutting requirements (easy to miss)

- **Zones:** the public front-end needs no authentication. The back-office lives under `/admin` and requires authentication; unauthenticated users are redirected to login. Settings are open to admin and super admin, but not to normal users.
- **Auth:** users log in with e-mail and password, and there is never a username field. OTP (TOTP with QR setup, activated only after a valid code is confirmed) must always be available. Fingerprint/WebAuthn login is optional. Password reset must exist, and requests for unknown e-mails get the same generic response. Every user can change their own password from their profile.
- **Settings:** the e-mail section has host, protocol (default SMTP), SSL, ignore-certificates, user and password. The password is never shown in clear, and a test-e-mail action is included. The branding section has a logo, client name and project title. Branding values must be available to both the front-end and the back-end, and the logo is also the favicon.
- **E-mails:** every e-mail (welcome, password reset, notices, test) is HTML and uses the current branding. The admin can send a welcome e-mail and choose whether it includes a reset link. If e-mail settings are missing, show a message saying they need to be configured.
- **UI:** use the Inter font everywhere. Every zone must be responsive, including login, reset, OTP and profile, with no horizontal scroll on mobile.
- **Dates:** always `YYYY/MM/DD`, `YYYY/MM/DD hh:mm` or `YYYY/MM/DD hh:mm:ss` (seconds only when needed), in both the UI and e-mails. No other format is allowed, and that includes locale formats.
- **ENSO mark:** the login page and the back-office show "Powered by" on one line with the ENSO logo (from enso-origins.com) on the line below.

## Git Workflow
- After every code change, commit it to the current branch
- Use descriptive commit messages that explain what was changed and why
- Never switch branches or create new branches unless explicitly asked
- Run any relevant checks before committing if applicable

## Behavior
- Before starting any non-trivial task, ask clarifying questions to better
  understand the requirements, edge cases, and expected outcome
- If a request is ambiguous, always ask rather than assume
- Confirm your understanding of the task before writing any code

## Communication
- Be concise in explanations unless asked for detail
- When something is unclear, ask don't assume
- Flag potential issues or risks even if not asked
