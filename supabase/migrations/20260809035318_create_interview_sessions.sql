/*
# Create interview_sessions table (single-tenant, no auth)

1. New Tables
- `interview_sessions`
- `session_id` (text, primary key) — client-provided session identifier
- `candidate` (jsonb, not null) — full candidate object (member, missions, signals)
- `state` (jsonb, not null) — full interview state (messages, questionsAsked, daysCovered, currentDay, evaluations, status)
- `created_at` (timestamptz, default now)
- `updated_at` (timestamptz, default now)

2. Security
- Enable RLS on `interview_sessions`.
- Allow anon + authenticated CRUD because this is a single-tenant app with no sign-in.
- All data is intentionally public/shared.
*/

CREATE TABLE IF NOT EXISTS interview_sessions (
  session_id text PRIMARY KEY,
  candidate jsonb NOT NULL,
  state jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_sessions" ON interview_sessions;
CREATE POLICY "anon_select_sessions" ON interview_sessions FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_sessions" ON interview_sessions;
CREATE POLICY "anon_insert_sessions" ON interview_sessions FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_sessions" ON interview_sessions;
CREATE POLICY "anon_update_sessions" ON interview_sessions FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_sessions" ON interview_sessions;
CREATE POLICY "anon_delete_sessions" ON interview_sessions FOR DELETE
TO anon, authenticated USING (true);
