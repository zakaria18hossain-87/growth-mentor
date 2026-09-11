# Growth Mentor — Tasks

## Sprint 1 — Core Engine: Weekly Scorecard (v1 functional milestone)
**Goal:** Scorecard creation + scoring works end-to-end against DB, viewable without login.
- [ ] Create Supabase tables (visions, goals, scorecards, scorecard_entries) + seed data
- [ ] Build `lib/data/` access layer for all four tables
- [ ] Scorecard page: fetch active goals, render scoring form (0–10 per goal + note)
- [ ] Submit scorecard → persist entries to DB
- [ ] Scorecard history page: list past scorecards with scores
- [ ] Scoring utils: pillar averages, weekly overall score
- **DoD:** Open app → score current week's goals → submit → see entries persisted in history. No login required.

## Sprint 2 — Vision & Goals CRUD
**Goal:** Full goal and vision management.
- [ ] Vision page: create/edit 10-year vision statement
- [ ] Goals page: create long/short-term goals with pillar tag + target date
- [ ] Edit/archive/complete goals
- [ ] Goals feed into scorecard generation automatically
- **DoD:** Create a vision, add 3 goals across pillars, next scorecard includes them.

## Sprint 3 — Dashboard & Trends
**Goal:** Visual summary of progress.
- [ ] Dashboard: current week pillar averages + overall score
- [ ] Trend chart: pillar scores over weeks
- [ ] Vision-alignment indicator
- [ ] Responsive sidebar nav (Dashboard, Vision, Goals, Scorecards)
- **DoD:** Dashboard shows live data from submitted scorecards; nav works on mobile + desktop.

## Sprint 4 — Lock It Down (Auth + RLS)
**Goal:** Per-user data isolation.
- [ ] Add Supabase auth (email/password)
- [ ] Replace permissive RLS with owner-scoped policies (`auth.uid() = user_id`)
- [ ] Seed data assignable to demo user
- [ ] Login/signup pages
- **DoD:** Two users see only their own goals/scorecards; no cross-user leakage.

## Sprint 5 — Intelligence Layer (Later)
**Goal:** AI weekly summary + goal suggestions.
- [ ] `lib/ai/` module: generate_weekly_summary
- [ ] Scorecard summary auto-draft after submit
- [ ] suggest_goal for low-scoring pillars (approval flow)
- **DoD:** Submitting a scorecard produces an AI summary; low pillar triggers a goal draft for approval.

## Gantt
```
Sprint 1: Week 1  | DB + Scorecard engine
Sprint 2: Week 2  | Vision + Goals CRUD
Sprint 3: Week 3  | Dashboard + Trends + Nav
Sprint 4: Week 4  | Auth + RLS Lock-down
Sprint 5: Week 5+ | AI summaries + suggestions
```