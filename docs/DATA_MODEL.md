# Growth Mentor — Data Model

## visions
| Field | Type |
|-------|------|
| id | uuid pk |
| user_id | uuid nullable |
| statement | text |
| target_year | int |
| created_at | timestamptz |

## goals
| Field | Type |
|-------|------|
| id | uuid pk |
| user_id | uuid nullable |
| title | text |
| pillar | text (health / soft_skills / development / education) |
| term | text (long / short) |
| target_date | date |
| status | text (active / completed / archived) |
| created_at | timestamptz |

## scorecards
| Field | Type |
|-------|------|
| id | uuid pk |
| user_id | uuid nullable |
| week_start | date |
| summary | text (AI: value + source + confidence + review_status) |
| created_at | timestamptz |

## scorecard_entries
| Field | Type |
|-------|------|
| id | uuid pk |
| scorecard_id | uuid fk → scorecards |
| goal_id | uuid fk → goals |
| score | numeric (0–10) |
| note | text |
| created_at | timestamptz |

## Relationships
- A scorecard has many scorecard_entries (one per active goal).
- Each entry links to one goal.
- Goals link to pillars; scorecards aggregate per pillar.

## RLS / Permissions
- v1: permissive read/write (demo-first, no login).
- Later: owner-scoped (`auth.uid() = user_id`) on all tables.

## AI Fields
- `scorecards.summary` stores AI-generated weekly summary with `source`, `confidence`, `review_status` columns (added later; nullable for v1).