# AI Usage Log — AI Interview Agent

This document records the AI-assisted development process for this project, built using Bolt.new (AI code generation) with guidance from Claude.

## Overview
The project was built iteratively using Bolt.new's AI agent, with prompts refined based on build errors, schema mismatches against the provided `candidates.json` / `curriculum.json` / `technical-spec.md`, and testing feedback.

## Key Prompts and Resulting Changes

### 1. Initial Scaffolding
- Requested a full AI Interview Agent app: landing page, candidate selection with learning-signal profiles, adaptive interview screen, and a final report screen.
- Bolt scaffolded: shared types, curriculum/candidate data files, a Supabase Edge Function for the interview engine (LLM-based with a rule-based fallback), API client, and all frontend screens.

### 2. Schema Compliance Fixes
- Provided the official `candidates.json`, `curriculum.json`, and `technical-spec.md` files from the hackathon organizers.
- Prompt: "Please verify my candidate data and curriculum data match the official schemas, and that the edge function follows the exact `/api/interview` request/response contract in technical-spec.md. Fix any mismatches."
- Bolt identified major mismatches (wrong field names, wrong candidate count, wrong API contract — server-generated sessionId instead of client-provided, candidate ID string instead of full object) and rewrote:
  - `src/data/candidates.ts` — now imports directly from `candidates.json`, using the `member`/`missions`/`signals` schema.
  - `src/data/curriculum.ts` — now imports directly from `curriculum.json`, using the `n`/`title`/`days` module schema and `day`/`title`/`type`/`tools`/`objectives` day schema.
  - The Supabase Edge Function — rewritten to accept `{sessionId, candidate}` on start and `{sessionId, message}` on each turn, returning `{reply, done}` and a final `{reply, done: true, feedback: {summary, strengths, gaps, next}}`, per spec.
  - `src/lib/api.ts` and frontend components — updated to send the full candidate object and use the new schema throughout.

### 3. Bug Fixes
- Fixed a JSX syntax error in `ReportScreen.tsx` (missing closing tag on an icon component causing a build failure).
- Fixed a "Session not found" runtime error caused by missing Supabase environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel deployment — resolved by claiming the Bolt-managed Supabase project into a personal Supabase account and adding the correct environment variables to Vercel, followed by a redeploy.

### 4. Deployment
- Connected the Bolt project to GitHub (`PayalGangwar155/ai-interview-agent`).
- Deployed to Vercel (`ai-interview-agent-teal.vercel.app`), configured with the Vite framework preset and the Supabase environment variables required for the edge function to work in production.

## Tools Used
- **Bolt.new** — primary AI code generation and iteration
- **Claude** — debugging guidance, error diagnosis, and step-by-step deployment support
- **Supabase** — database and edge function hosting
- **Vercel** — production deployment
- **GitHub** — version control and source hosting