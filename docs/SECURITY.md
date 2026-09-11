# Growth Mentor — Security

## Secret Handling
- Supabase URL + anon key: public-safe (env var, exposed to client).
- Supabase service role key: server-only (never in frontend code, never in client bundle).
- All env vars via Vercel dashboard — no `.env` committed.

## Permission Model
- **v1 (demo-first):** Permissive RLS policies — all tables readable/writable without login. Seed data visible to anonymous visitors.
- **Lock-down sprint:** Replace permissive policies with owner-scoped: `auth.uid() = user_id` on every table. No cross-user data access.

## Approved-Tools Rule
- AI/agent may only call named, explicitly approved functions (`generate_weekly_summary`, `suggest_goal`, `complete_goal`).
- No raw `run_any` / `send_any` / arbitrary SQL execution.

## Audit Principle
- Every agentic action logged with: action, tool, target, actor, risk level, approval status, timestamp.
- Human-only actions (delete, archive) cannot be triggered by an agent.

## Data Access
- All DB reads/writes go through `lib/data/` — never inline in UI components.
- Server actions enforce logic; client only displays server-derived truth.