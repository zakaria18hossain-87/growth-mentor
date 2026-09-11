import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
const db = new PGlite();
await db.exec("create role anon; create role authenticated;");
await db.exec(
  readFileSync("supabase/migrations/202609110001_growth_mentor.sql", "utf8"),
);
const { rows: goals } = await db.query("select id from goals order by id");
const entries = goals.map((g, i) => ({
  goal_id: g.id,
  score: [0, 6, 8, 10][i],
  note: "Test reflection",
}));
const submit = (data) =>
  db.query(
    "select submit_scorecard(date_trunc('week',current_date)::date, $1::jsonb) id",
    [JSON.stringify(data)],
  );
await db.exec("set role anon");
const first = await submit(entries);
const second = await submit(entries.map((e) => ({ ...e, score: 9 })));
assert.equal(first.rows[0].id, second.rows[0].id);
for (const bad of [
  entries.slice(1),
  entries.map((e) => ({ ...e, score: 11 })),
  entries.map((e) => ({ ...e, score: null })),
  [entries[0], entries[0], entries[2], entries[3]],
])
  await assert.rejects(() => submit(bad));
const {
  rows: [count],
} = await db.query(
  "select count(*)::int n, avg(score)::float a from scorecard_entries where scorecard_id=$1",
  [first.rows[0].id],
);
assert.deepEqual(count, { n: 4, a: 9 });
console.log(
  "PASS: migration, anonymous submission, zero score, idempotent updates, bounds, missing scores, duplicates, atomic rollback.",
);
await db.exec("delete from public.goals");
await assert.rejects(() => submit([]), /No active goals/);
console.log("PASS: empty-workspace validation.");
await db.close();
