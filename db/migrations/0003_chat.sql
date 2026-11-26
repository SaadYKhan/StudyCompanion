-- v2 -> v3 (applied to production 2026-11-26): tutor chat.
-- Per-child settings a parent controls. Off until a parent turns it on.
CREATE TABLE IF NOT EXISTS chat_settings (
  student_id        TEXT PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  enabled           INTEGER NOT NULL DEFAULT 0,
  daily_limit       INTEGER NOT NULL DEFAULT 30,      -- messages a day
  quiet_from        TEXT NOT NULL DEFAULT '22:00',    -- Dubai time; no chat between these
  quiet_to          TEXT NOT NULL DEFAULT '06:00',
  monthly_cap_cents INTEGER NOT NULL DEFAULT 500,     -- spend cap per calendar month
  updated_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by        TEXT REFERENCES users(id) ON DELETE SET NULL
);
-- One conversation, usually about one marked question.
CREATE TABLE IF NOT EXISTS chat_threads (
  id           TEXT PRIMARY KEY,
  student_id   TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  started_by   TEXT REFERENCES users(id) ON DELETE SET NULL,
  context_kind TEXT NOT NULL DEFAULT 'question',
  context_ref  TEXT,                                  -- question_results.id
  title        TEXT,
  flagged      INTEGER NOT NULL DEFAULT 0,            -- a safety message was shown
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_threads_student ON chat_threads(student_id, updated_at);
CREATE TABLE IF NOT EXISTS chat_messages (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  thread_id      TEXT NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  role           TEXT NOT NULL CHECK (role IN ('student', 'tutor', 'notice')),
  author_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  content        TEXT NOT NULL,
  flag           TEXT,          -- off_topic | safety | reply_blocked
  withheld       TEXT,          -- a tutor reply that failed the check (parents can see it)
  input_tokens   INTEGER,
  output_tokens  INTEGER,
  cost_micros    INTEGER,       -- millionths of a dollar
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_msgs_thread ON chat_messages(thread_id, id);
CREATE TABLE IF NOT EXISTS chat_usage (
  student_id  TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  day         TEXT NOT NULL,    -- Dubai date
  messages    INTEGER NOT NULL DEFAULT 0,
  cost_micros INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (student_id, day)
);
INSERT INTO schema_version (version) SELECT 3 WHERE NOT EXISTS (SELECT 1 FROM schema_version WHERE version = 3);
