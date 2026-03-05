-- =============================================================================
-- NBT Onboarding — Database Schema
-- PostgreSQL
-- =============================================================================


-- ---------------------------------------------------------------------------
-- onboarding_sessions
-- Scratch space for in-progress onboarding. One row per user attempt,
-- upserted on each step. Kept after completion for funnel analytics.
-- ---------------------------------------------------------------------------
CREATE TABLE onboarding_sessions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        NOT NULL UNIQUE,
  current_step  INT         NOT NULL DEFAULT 1,
  status        TEXT        NOT NULL DEFAULT 'in_progress'
                            CHECK (status IN ('in_progress', 'completed')),

  -- Step 1 — Profile
  first_name    TEXT,
  last_name     TEXT,

  -- Step 2 — Preferences
  role          TEXT,
  interests     TEXT[]      NOT NULL DEFAULT '{}',

  -- Step 3 — Identity
  screen_name   TEXT,
  avatar_id     TEXT,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_onboarding_sessions_email  ON onboarding_sessions (email);
CREATE INDEX idx_onboarding_sessions_status ON onboarding_sessions (status);


-- ---------------------------------------------------------------------------
-- users
-- Created atomically on final submit. Promoted from onboarding_sessions.
-- ---------------------------------------------------------------------------
CREATE TABLE users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    TEXT        NOT NULL,
  last_name     TEXT        NOT NULL,
  email         TEXT        NOT NULL UNIQUE,
  screen_name   TEXT        NOT NULL UNIQUE,
  avatar_id     TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email       ON users (email);
CREATE INDEX idx_users_screen_name ON users (screen_name);


-- ---------------------------------------------------------------------------
-- user_preferences
-- Split from users — role and interests are logically separate from identity.
-- ---------------------------------------------------------------------------
CREATE TABLE user_preferences (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        TEXT        NOT NULL,
  interests   TEXT[]      NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences (user_id);


-- ---------------------------------------------------------------------------
-- screen_names
-- Dedicated lookup table for fast uniqueness checks during the identity step.
-- Avoids a full-table scan on users for every keystroke check.
-- Linked to user_id only after account creation.
-- ---------------------------------------------------------------------------
CREATE TABLE screen_names (
  screen_name   TEXT        PRIMARY KEY,
  user_id       UUID        REFERENCES users(id) ON DELETE CASCADE,
  reserved_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ---------------------------------------------------------------------------
-- sessions
-- Auth tokens issued on account creation and login.
-- ---------------------------------------------------------------------------
CREATE TABLE sessions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash    TEXT        NOT NULL UNIQUE,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at  TIMESTAMPTZ,
  user_agent    TEXT,
  ip_address    INET
);

CREATE INDEX idx_sessions_user_id    ON sessions (user_id);
CREATE INDEX idx_sessions_token_hash ON sessions (token_hash);
