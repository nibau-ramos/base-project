# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

There is no application code yet. The repository holds only the ENSO base specification that every ENSO project must satisfy:

- `base-specs/Especificacao_Base_ENSO.pdf` / `.docx`: the base specification (Portuguese). The PDF and DOCX have the same content.
- `base-specs/gherkin-base-enso/*.feature`: Gherkin acceptance criteria (`# language: pt`, so keywords are `Funcionalidade`, `Cenário`, `Dado`, `Quando`, `Então` and so on). They are numbered by area (01 infrastructure through 10 e-mails). Scenarios tagged `@opcional` (fingerprint login, super administrator profile) are nice-to-haves, not hard requirements.

Treat the `.feature` files as the source of truth for the base requirements. Project-specific requirements will be added on top of them. When the code is scaffolded, add build, run and test commands to this file, including how to run a single test or feature.

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
