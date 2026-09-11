# Growth Mentor — Test Plan

## v1 Success Scenario (manual)
1. Open app without login → dashboard/scorecard page loads with seed data.
2. Navigate to Scorecards → current week scorecard shows active goals grouped by pillar.
3. Score each goal 0–10, add a note.
4. Click Submit → page confirms submission.
5. Navigate to Scorecard History → new entry appears with correct scores.
6. Verify pillar averages calculated correctly (manual check).

## Empty State
1. Delete all goals (or fresh DB) → scorecard page shows "No active goals — create goals first" with link to Goals page.
2. No scorecards yet → history page shows "No scorecards submitted yet."

## Error State
1. Submit scorecard with a goal left unscored → validation error: "Please score all goals."
2. Supabase unreachable → scorecard form shows "Could not load goals. Retry" button.

## Loading State
1. Scorecard page fetching goals → skeleton loader on goal rows.
2. Submit in progress → button shows "Submitting…" and disables.

## Auth Lock-down (Sprint 4)
1. Logged-out user redirected to login.
2. User A's goals invisible to User B (check Supabase query returns 0 rows cross-user).
3. New user sees empty state (no goals, no scorecards).