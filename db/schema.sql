-- Study Companion database, schema v3 (v2 added position columns, v3 the tutor chat).
-- Built for many families from day one: every row hangs off a family,
-- and a person sees a child's data only through a membership.
-- Apply with: wrangler d1 execute studycompanion-db --remote --file=db/schema.sql

CREATE TABLE IF NOT EXISTS schema_version (
  version    INTEGER NOT NULL,
  applied_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS families (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Anyone who signs in: parents, students, tutors. The email is the sign-in identity.
CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE COLLATE NOCASE,
  display_name TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen_at TEXT
);

-- Children. Initials only on the site; no full names stored.
CREATE TABLE IF NOT EXISTS students (
  id           TEXT PRIMARY KEY,
  family_id    TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  legacy_code  TEXT,            -- 'a' / 'b' in the old static data files
  year_group   TEXT,
  curriculum   TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_students_family ON students(family_id);

-- Who can see what. Parent rows have no student_id (they see every child in the family);
-- student and tutor rows name the one child they belong to.
CREATE TABLE IF NOT EXISTS memberships (
  id         TEXT PRIMARY KEY,
  family_id  TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('parent', 'student', 'tutor')),
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK ((role = 'parent' AND student_id IS NULL) OR (role <> 'parent' AND student_id IS NOT NULL))
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_membership ON memberships(family_id, user_id, role, IFNULL(student_id, ''));
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);

-- One row per marked paper (or per tutor summary of a paper).
CREATE TABLE IF NOT EXISTS papers (
  id           TEXT PRIMARY KEY,   -- student_id || ':' || code
  student_id   TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  code         TEXT NOT NULL,      -- short id used on the site, e.g. ph24
  subject      TEXT,
  unit         TEXT,
  label        TEXT,
  paper_ref    TEXT,               -- Pearson paper reference, e.g. P78391RA
  sat_note     TEXT,
  score_text   TEXT,               -- as shown, e.g. "37 / 80" or "tutor's grade A"
  marks_scored REAL,
  marks_total  REAL,
  source       TEXT NOT NULL DEFAULT 'manual',  -- manual | legacy-import | claude
  position     INTEGER NOT NULL DEFAULT 0,      -- display order of papers
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (student_id, code)
);

-- Question-by-question results: her answer, the right answer, the mistake and the fix.
CREATE TABLE IF NOT EXISTS question_results (
  id           TEXT PRIMARY KEY,   -- paper_id || '#' || question label, e.g. ...:ph24#Q3(a)
  paper_id     TEXT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  seq          INTEGER NOT NULL,
  question     TEXT NOT NULL,
  section      TEXT,
  topic        TEXT,
  also_topics  TEXT,               -- JSON array
  marks_scored REAL,
  marks_max    REAL,
  why          TEXT,               -- JSON array of mistake tags
  prompt       TEXT,
  answer       TEXT,
  correct      TEXT,
  mistake      TEXT,
  fix          TEXT,
  extra        TEXT,               -- JSON for any other fields
  position     INTEGER NOT NULL DEFAULT 0,  -- display order across the question log
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_qr_paper ON question_results(paper_id, seq);

-- What the child does on the site: card boxes, topic ratings, redo ticks, checklists.
-- One JSON blob per kind, the same shapes the site keeps in the browser today.
CREATE TABLE IF NOT EXISTS progress (
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL,
  value      TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (student_id, kind)
);

-- Every change, who made it and how (a person, Claude on a parent's behalf, or the system).
CREATE TABLE IF NOT EXISTS audit_log (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  at            TEXT NOT NULL DEFAULT (datetime('now')),
  family_id     TEXT,
  actor_user_id TEXT,
  actor_kind    TEXT NOT NULL DEFAULT 'user' CHECK (actor_kind IN ('user', 'claude', 'system')),
  action        TEXT NOT NULL,
  entity        TEXT,
  entity_id     TEXT,
  detail        TEXT
);
CREATE INDEX IF NOT EXISTS idx_audit_family ON audit_log(family_id, at);

-- Per-child settings a parent controls. Off until a parent turns it on.
CREATE TABLE IF NOT EXISTS chat_settings (
  student_id        TEXT PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  enabled           INTEGER NOT NULL DEFAULT 0,
  daily_limit       INTEGER NOT NULL DEFAULT 100,     -- messages a day
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
