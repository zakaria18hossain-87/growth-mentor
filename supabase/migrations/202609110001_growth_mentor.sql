-- Public, shared demo workspace as required by the v1 PRD.
-- Replace these policies with owner-scoped access before storing private data.
begin;

create table if not exists public.visions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  statement text not null check (length(trim(statement)) between 1 and 5000),
  target_year integer not null check (target_year between 2020 and 2200),
  created_at timestamptz not null default now()
);
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null check (length(trim(title)) between 1 and 240),
  pillar text not null check (pillar in ('health','soft_skills','development','education')),
  term text not null check (term in ('long','short')),
  target_date date,
  status text not null default 'active' check (status in ('active','completed','archived')),
  created_at timestamptz not null default now()
);
create table if not exists public.scorecards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  week_start date not null unique check (extract(isodow from week_start) = 1),
  summary text,
  created_at timestamptz not null default now()
);
create table if not exists public.scorecard_entries (
  id uuid primary key default gen_random_uuid(),
  scorecard_id uuid not null references public.scorecards(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  score numeric not null check (score between 0 and 10),
  note text not null default '' check (length(note) <= 4000),
  created_at timestamptz not null default now(),
  unique(scorecard_id, goal_id)
);
-- Historical snapshots keep trends stable when a goal changes pillar or title.
alter table public.scorecard_entries add column if not exists goal_title text;
alter table public.scorecard_entries add column if not exists pillar text;
update public.scorecard_entries e set goal_title = g.title, pillar = g.pillar
from public.goals g where e.goal_id = g.id and e.pillar is null;

alter table public.visions enable row level security;
alter table public.goals enable row level security;
alter table public.scorecards enable row level security;
alter table public.scorecard_entries enable row level security;
create policy demo_access on public.visions for all to anon, authenticated using (user_id is null) with check (user_id is null);
create policy demo_access on public.goals for all to anon, authenticated using (user_id is null) with check (user_id is null);
create policy demo_access on public.scorecards for all to anon, authenticated using (user_id is null) with check (user_id is null);
create policy demo_access on public.scorecard_entries for all to anon, authenticated
using (exists(select 1 from public.scorecards s where s.id = scorecard_id and s.user_id is null))
with check (exists(select 1 from public.scorecards s where s.id = scorecard_id and s.user_id is null));
grant select, insert, update, delete on public.visions, public.goals, public.scorecards, public.scorecard_entries to anon, authenticated;

-- One transaction: a failed entry never leaves a partially submitted scorecard.
create or replace function public.submit_scorecard(p_week date, p_entries jsonb)
returns uuid language plpgsql security invoker set search_path = public as $$
declare card_id uuid; active_count integer;
begin
  if p_week is null or extract(isodow from p_week) <> 1 or p_week > current_date then
    raise exception 'Choose a valid week starting on Monday.';
  end if;
  if jsonb_typeof(p_entries) is distinct from 'array' then
    raise exception 'Please score all goals.';
  end if;
  perform pg_advisory_xact_lock(hashtext('growth-mentor:' || p_week::text));
  select count(*) into active_count from public.goals where status = 'active' and user_id is null;
  if active_count = 0 then raise exception 'No active goals — create goals first.'; end if;
  if jsonb_array_length(p_entries) <> active_count or
     (select count(distinct e->>'goal_id') from jsonb_array_elements(p_entries) e) <> active_count or
     exists(select 1 from jsonb_array_elements(p_entries) e
       where not exists(select 1 from public.goals g where g.id::text = e->>'goal_id' and g.status = 'active' and g.user_id is null)
       or jsonb_typeof(e->'score') is distinct from 'number'
       or (e->>'score')::numeric not between 0 and 10
       or length(coalesce(e->>'note','')) > 4000) then
    raise exception 'Please score all current active goals from 0 to 10. Refresh if your goals changed.';
  end if;
  insert into public.scorecards(week_start) values(p_week)
    on conflict(week_start) do update set week_start = excluded.week_start
    returning id into card_id;
  delete from public.scorecard_entries where scorecard_id = card_id;
  insert into public.scorecard_entries(scorecard_id, goal_id, score, note, goal_title, pillar)
    select card_id, g.id, (e->>'score')::numeric, coalesce(e->>'note',''), g.title, g.pillar
    from jsonb_array_elements(p_entries) e join public.goals g on g.id::text = e->>'goal_id';
  return card_id;
end;
$$;
revoke all on function public.submit_scorecard(date,jsonb) from public;
grant execute on function public.submit_scorecard(date,jsonb) to anon, authenticated;

insert into public.visions(id,statement,target_year) values
('10000000-0000-4000-8000-000000000001','Build a healthy, curious life with the skills and confidence to create work that matters.',extract(year from current_date)::int + 10)
on conflict(id) do nothing;
insert into public.goals(id,title,pillar,term,target_date) values
('20000000-0000-4000-8000-000000000001','Move for 30 minutes, five days a week','health','short',current_date + 90),
('20000000-0000-4000-8000-000000000002','Practice one thoughtful conversation each day','soft_skills','short',current_date + 90),
('20000000-0000-4000-8000-000000000003','Ship a useful product people love','development','long',current_date + 365),
('20000000-0000-4000-8000-000000000004','Read and apply one new idea every week','education','short',current_date + 90)
on conflict(id) do nothing;
insert into public.scorecards(id,week_start) values
('30000000-0000-4000-8000-000000000001',date_trunc('week',current_date)::date - 7)
on conflict do nothing;
insert into public.scorecard_entries(scorecard_id,goal_id,score,note,goal_title,pillar)
select s.id,g.id,case g.pillar when 'health' then 6 when 'soft_skills' then 7 when 'development' then 8 else 5 end,
'Demo reflection — edit this example by submitting a scorecard for this week.',g.title,g.pillar
from public.goals g cross join public.scorecards s
where s.id = '30000000-0000-4000-8000-000000000001'
and g.id in ('20000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000004')
on conflict(scorecard_id,goal_id) do nothing;
commit;
