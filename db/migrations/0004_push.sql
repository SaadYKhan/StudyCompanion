-- v3 -> v4: reminders on devices (Web Push).
CREATE TABLE IF NOT EXISTS push_subs (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint   TEXT NOT NULL UNIQUE,          -- the browser's push service address for this device
  p256dh     TEXT NOT NULL,                 -- the device's public key (messages are encrypted to it)
  auth       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_ok_at TEXT,
  fails      INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_push_user ON push_subs(user_id);
-- Keys the Worker makes for itself (the VAPID key pair for push), so none are handled by hand.
CREATE TABLE IF NOT EXISTS app_keys (
  name       TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO schema_version (version) SELECT 4 WHERE NOT EXISTS (SELECT 1 FROM schema_version WHERE version = 4);
