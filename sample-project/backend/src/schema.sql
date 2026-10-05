CREATE TABLE IF NOT EXISTS users (
  id                 SERIAL PRIMARY KEY,
  email              TEXT NOT NULL UNIQUE,
  name               TEXT NOT NULL DEFAULT '',
  role               TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'normal')),
  password_hash      TEXT NOT NULL,
  active             BOOLEAN NOT NULL DEFAULT TRUE,
  otp_enabled        BOOLEAN NOT NULL DEFAULT FALSE,
  otp_secret         TEXT,
  otp_pending_secret TEXT,
  -- Bumped on password change/reset so existing sessions stop being valid.
  token_version      INTEGER NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at      TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Key/value settings: 'email' and 'branding'.
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Single-row table holding the branding logo.
CREATE TABLE IF NOT EXISTS branding_logo (
  id         INTEGER PRIMARY KEY CHECK (id = 1),
  data       BYTEA NOT NULL,
  mime       TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
