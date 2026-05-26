-- PostgreSQL: authentication schema (credentials only)
-- Hibernate ddl-auto=update also creates this in dev; use this for production migrations.

CREATE TABLE IF NOT EXISTS auth_accounts (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_accounts_email ON auth_accounts (email);

COMMENT ON TABLE auth_accounts IS 'Login credentials; profile data is in MongoDB users collection';
