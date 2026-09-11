# Growth Mentor — Architecture

## Stack
Next.js (App Router) · Supabase (Postgres + RLS) · Vercel deploy.

## Build Now vs Later
**Now:** Vision CRUD, Goal CRUD, Weekly Scorecard engine, Dashboard with trends.
**Later:** Auth + per-user RLS, AI scorecard summaries, agentic nudges, goal-suggestion engine.

## Key User Action Flow (Weekly Scorecard)
1. User opens app → dashboard loads current week's scorecard (or creates a new one).
2. Scorecard pre-fills with active goals grouped by pillar.
3. User scores each goal 0–10, adds a note per goal.
4. On submit → scorecard + entries persist to DB.
5. Dashboard re-queries → pillar averages, weekly trend, vision-alignment indicator update.

## Responsive Nav Shell
Left sidebar on desktop (sections: Dashboard, Vision, Goals, Scorecards). Collapses to hamburger menu on mobile. Current section highlighted.

## Layer Plan
1. **Data layer** — Supabase tables + `lib/data/` access functions (all DB reads/writes).
2. **App logic** — server actions for scorecard creation, scoring rules, trend calculation.
3. **Smart features** — `lib/ai/` module for AI summaries/recommendations (later).

Core runs without AI: scorecard creation, scoring, trend display are pure DB + logic.

## Repo Structure
```
app/            # routes & UI per feature
  dashboard/
  vision/
  goals/
  scorecards/
lib/
  data/         # all Supabase queries (goals.ts, scorecards.ts, vision.ts)
  ai/           # AI helpers (later)
  utils/        # scoring, trends, week helpers
tests/          # beside each feature module
components/      # shared UI
```

## Module Map
| Module | Responsibility | Owns | Build Order |
|--------|---------------|------|-------------|
| vision | Vision statement CRUD | visions table | 2 |
| goals | Long/short-term goal CRUD, pillar tagging | goals table | 2 |
| scorecards | Weekly scorecard generation, scoring, history | scorecards + scorecard_entries | 1 |
| dashboard | Summary view, pillar averages, trend charts | reads from all tables | 3 |