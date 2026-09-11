# Growth Mentor — PRD

## Problem
Most productivity tools optimize for incremental, linear improvements—keeping users in safe 2x cycles. People need a system that forces exponential thinking by anchoring every action to a 10-year vision, then tracking weekly progress across goals, health, soft skills, development, and education.

## Target User
Two individual contributors (the builder + colleague) who want to replace an expensive personal growth coach with a self-driven, data-backed system.

## Core Objects
- **Vision** — a 10-year north-star statement; the system's primary constraint.
- **Goals** — long-term (multi-year) and short-term (weekly/quarterly), each linked to a growth pillar.
- **Pillars** — Health, Soft Skills, Development, Education (fixed set).
- **Weekly Scorecards** — the core engine: a weekly snapshot of progress per goal/pillar with a self-reported score and notes.

## MVP (v1) — Must-Haves
- [ ] Create/edit a 10-year Vision statement
- [ ] Create long-term and short-term goals, each tagged to a pillar
- [ ] Generate a weekly scorecard: score each active goal 0–10, add notes
- [ ] View scorecard history (trend per pillar)
- [ ] Dashboard showing current week summary + pillar averages
- [ ] Seed demo data so app renders without login

## Non-Goals (v1)
- No human-in-the-loop review or coaching intervention
- No login/auth (demo-first; added later)
- No AI-generated coaching recommendations (later phase)
- No multi-tenant accounts or billing

## Success Criteria
The builder opens the app, sees this week's scorecard pre-populated with last week's goals, scores each goal 0–10 with notes, submits, and immediately sees the dashboard update with updated pillar averages and a trend chart — all without signing in.