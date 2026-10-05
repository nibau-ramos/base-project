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

-- Added after the first release; these statements keep existing databases working without a migration tool.
-- mfa_required: set by an admin. The user must keep at least one second factor (TOTP or a WebAuthn
-- credential) and, if they have none, must set one up during login. Earlier versions called it otp_required.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'otp_required') THEN
    ALTER TABLE users RENAME COLUMN otp_required TO mfa_required;
  END IF;
END $$;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_required BOOLEAN NOT NULL DEFAULT FALSE;

-- WebAuthn credentials ("impressão digital": Touch ID, Windows Hello…), a second factor alongside TOTP.
CREATE TABLE IF NOT EXISTS webauthn_credentials (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  credential_id TEXT NOT NULL UNIQUE,      -- base64url, as sent by the browser
  public_key    BYTEA NOT NULL,
  counter       BIGINT NOT NULL DEFAULT 0,
  transports    TEXT[] NOT NULL DEFAULT '{}',
  name          TEXT NOT NULL,
  device_type   TEXT,                      -- 'singleDevice' or 'multiDevice' (synced passkey)
  backed_up     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at  TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS webauthn_credentials_user_id ON webauthn_credentials (user_id);

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
