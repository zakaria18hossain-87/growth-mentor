# Growth Mentor — Agentic Layer

## Draftable Actions (low risk — auto)
- Generate weekly summary text for a submitted scorecard → stored as draft in `scorecards.summary`.
- Tag goals with suggested pillar if user left it blank.
- Score trend alerts (e.g., "Education declining 2 weeks").

## Executable After Approval (medium risk)
- Create a new short-term goal based on a low-scoring pillar suggestion.
- Update goal status to `completed` when consistently scored ≥8 for 3 weeks.

## Human-Only Actions (critical)
- Delete a vision or goal.
- Archive a scorecard.

## Named Tools
- `generate_weekly_summary(scorecard_id)` → low risk, auto.
- `suggest_goal(pillar, week_trend)` → medium risk, drafts a goal for approval.
- `complete_goal(goal_id)` → medium risk, requires approval.

## Audit Log Fields
- `id`, `action`, `tool_name`, `target_id`, `actor` (user/agent), `risk_level`, `approved_by`, `created_at`.

## v1 vs Later
- **v1:** No agentic actions; rule-based scoring only.
- **Later:** `generate_weekly_summary` auto; `suggest_goal` + `complete_goal` with approval flow.