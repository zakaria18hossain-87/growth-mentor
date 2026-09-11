# Growth Mentor

A working weekly reflection app that connects a ten-year vision to goals across Health, Soft Skills, Development, and Education.

## What works

- Create and edit a vision and its target year.
- Create, edit, complete, archive, reactivate, and delete goals.
- Score every active goal from 0–10 and add a weekly reflection.
- Save a scorecard atomically, reopen it, and view its history.
- See live pillar averages, an equally weighted overall score, vision alignment, and 4/8/12-week trends.
- Use the dashboard and navigation on desktop or mobile.

This is the PRD's **shared, public demo**. Changes are shared between visitors. Authentication and private accounts remain later work, as specified in the PRD.

## Development

Use Node 22+ and Bun 1.4.2.

```sh
bun install --frozen-lockfile
vercel link
vercel env pull .env.local
bun dev
```

The required environment variables are `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Keep environment files out of Git. The app does not require a service-role key or AI key.

## Database

The migration in `supabase/migrations/202609110001_growth_mentor.sql` creates the four tables, shared-demo RLS, sample data, and the `submit_scorecard` transaction. It has been applied to the existing Growth Mentor project.

For a new environment:

```sh
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

All application queries live in `lib/data/`. Entry snapshots retain the title and pillar from submission time. Completing or archiving a goal retains history; explicitly deleting a goal removes its scores, with a warning in the UI.

Weeks start Monday in UTC. Missing weeks remain blank. Overall score averages the available pillar averages, so a pillar with more goals does not have greater weight. Alignment is overall score divided by 10.

## Checks

```sh
bun test:database
bun run test
bun run lint
bun run typecheck
bun run build
```

`bun run test:live` verifies a real anonymous transaction using the reserved week `2020-01-06`, then removes its temporary scorecard. It refuses to run if that week already contains data.

## Deployment

Deploy by pushing commits to `main`; do not use local-file Vercel deployments. Git author identity is pinned in this checkout. Vercel must be connected to `zakaria18hossain-87/growth-mentor` for pushes to trigger production builds.

See `docs/IMPLEMENTATION_STATUS.md` for completed checks and deployment status.
