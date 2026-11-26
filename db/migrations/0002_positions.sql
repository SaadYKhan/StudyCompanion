-- v1 -> v2 (applied to production 2026-11-26): display order for papers and questions.
ALTER TABLE papers ADD COLUMN position INTEGER NOT NULL DEFAULT 0;
ALTER TABLE question_results ADD COLUMN position INTEGER NOT NULL DEFAULT 0;
INSERT INTO schema_version (version) VALUES (2);
