import Link from "next/link";
import { getGoals } from "@/lib/data/goals";
import { getVisions } from "@/lib/data/vision";
import { getScorecards } from "@/lib/data/scorecards";
import { pillars, pillarLabels } from "@/lib/data/types";
import {
  averages,
  overall,
  monday,
  shiftWeek,
  dateLabel,
} from "@/lib/utils/scoring";
import TrendChart from "@/components/trend-chart";
export const dynamic = "force-dynamic";
export default async function Dashboard() {
  const [goals, visions, cards] = await Promise.all([
    getGoals(),
    getVisions(),
    getScorecards(),
  ]);
  const week = monday();
  const current = cards.find((c) => c.week_start === week);
  const previous = cards.find((c) => c.week_start === shiftWeek(week, -1));
  const entries = current?.scorecard_entries || [];
  const avg = averages(entries);
  const prev = averages(previous?.scorecard_entries || []);
  const score = overall(entries);
  const previousScore = overall(previous?.scorecard_entries || []);
  const delta =
    score !== null && previousScore !== null ? score - previousScore : null;
  const active = goals.filter((g) => g.status === "active");
  const vision = visions[0];
  const alignment = vision && score !== null ? Math.round(score * 10) : null;
  const recent = cards.filter(
    (c) => c.week_start >= shiftWeek(week, -3) && c.week_start <= week,
  );
  const focus = pillars
    .map((p) => {
      const values = recent
        .map((c) => averages(c.scorecard_entries)[p])
        .filter((n): n is number => n !== null);
      return {
        pillar: p,
        score: values.length
          ? values.reduce((a, b) => a + b, 0) / values.length
          : null,
      };
    })
    .filter(
      (p): p is { pillar: (typeof pillars)[number]; score: number } =>
        p.score !== null,
    )
    .sort((a, b) => a.score - b.score)[0];
  const needsAttention = entries
    .filter(
      (e) =>
        active.some((g) => g.id === e.goal_id) &&
        (!focus || e.pillar === focus.pillar),
    )
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);
  return (
    <>
      <div className="topline">
        <span>THE BIG PICTURE</span>
        <span>Week of {dateLabel(week)}</span>
      </div>
      <header className="page-heading">
        <div>
          <h1>Your growth, in focus.</h1>
          <p>Keep your long-term vision close. Make this week count.</p>
        </div>
        <Link href="/scorecards" className="button primary">
          {current ? "Review this week" : "Score this week"} ↗
        </Link>
      </header>
      <section className="north-star">
        <div>
          <span className="eyebrow">
            YOUR {vision?.target_year || new Date().getFullYear() + 10} VISION
          </span>
          <h2>
            {vision
              ? vision.statement
              : "What life do you want to build over the next ten years?"}
          </h2>
          <Link href="/vision">
            {vision ? "Revisit your vision" : "Write your vision"} ↗
          </Link>
        </div>
        <span className="horizon" aria-hidden>
          {vision?.target_year || new Date().getFullYear() + 10}
        </span>
      </section>
      <div className="metrics-grid">
        <section className="panel overall-card">
          <div className="split">
            <h2>This week’s score</h2>
            <span className="metric-symbol" aria-hidden>
              ◴
            </span>
          </div>
          <div className="big-number">
            {score?.toFixed(1) ?? "—"}
            <small>/ 10</small>
          </div>
          <p className="metric-detail">
            {delta !== null ? (
              <>
                <span className={delta >= 0 ? "positive" : "negative"}>
                  {delta > 0 ? "+" : ""}
                  {delta.toFixed(1)}
                </span>{" "}
                vs last week
              </>
            ) : score !== null ? (
              "First score — your starting point"
            ) : (
              "Your next reflection starts here"
            )}
          </p>
        </section>
        <section className="panel alignment-card">
          <div>
            <h2>Vision alignment</h2>
            <div className="big-number">
              {alignment ?? "—"}
              <small>%</small>
            </div>
            <p className="metric-detail">
              {vision
                ? "Weekly score as a share of 10"
                : "Add a vision to anchor your progress"}
            </p>
          </div>
          <svg viewBox="0 0 80 80" aria-hidden>
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#e7eedf"
              strokeWidth="7"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#739963"
              strokeWidth="7"
              strokeDasharray={`${(alignment || 0) * 2.01} 201`}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
            <text
              x="40"
              y="46"
              textAnchor="middle"
              fill="#507845"
              fontSize="23"
            >
              ↗
            </text>
          </svg>
        </section>
        <section className="panel">
          <div className="split">
            <h2>Active goals</h2>
            <span className="metric-symbol" aria-hidden>
              ◇
            </span>
          </div>
          <div className="big-number">
            {active.length}
            <small>
              across {new Set(active.map((g) => g.pillar)).size} pillars
            </small>
          </div>
          <Link className="metric-detail text-link" href="/goals">
            Keep your goals intentional ↗
          </Link>
        </section>
      </div>
      <div className="section-heading dashboard-section">
        <h2>Four pillars. One direction.</h2>
        <span className="muted">This week</span>
      </div>
      <div className="pillars-grid">
        {pillars.map((p) => {
          const change =
            avg[p] !== null && prev[p] !== null ? avg[p]! - prev[p]! : null;
          return (
            <section className="panel pillar-card" key={p}>
              <div className="split">
                <h3>
                  <span className={"pillar-mark " + p} />
                  {pillarLabels[p]}
                </h3>
                <span className="muted">
                  {entries.filter((e) => e.pillar === p).length} scored
                </span>
              </div>
              <div className="pillar-number">
                {avg[p]?.toFixed(1) ?? "—"}
                <small>/ 10</small>
              </div>
              <div className="pillar-track">
                <div
                  className={p}
                  style={{ width: `${(avg[p] || 0) * 10}%` }}
                />
              </div>
              <p className="metric-detail">
                {change === null ? (
                  "No comparison yet"
                ) : (
                  <>
                    <span className={change >= 0 ? "positive" : "negative"}>
                      {change > 0 ? "+" : ""}
                      {change.toFixed(1)}
                    </span>{" "}
                    vs last week
                  </>
                )}
              </p>
            </section>
          );
        })}
      </div>
      <div className="dashboard-bottom">
        <TrendChart cards={cards} week={week} />
        <section className="panel focus-panel">
          <span className="eyebrow">A LITTLE MORE ATTENTION</span>
          <h2>{focus ? pillarLabels[focus.pillar] : "Your next small step"}</h2>
          <p className="muted">
            {focus
              ? `Your lowest pillar average over the last four weeks is ${focus.score.toFixed(1)}/10. Make room for one manageable action.`
              : "Start with a goal that matters to you, then reflect on it each week."}
          </p>
          {needsAttention.length > 0 ? (
            <div className="attention-list">
              {needsAttention.map((e) => (
                <div key={e.id}>
                  <span>{e.goal_title}</span>
                  <strong>
                    {Number(e.score).toFixed(1)}
                    <small>/10</small>
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">
              Your scored goals will help you decide where to focus.
            </p>
          )}
          <Link href="/goals" className="button secondary">
            Review your goals ↗
          </Link>
          <p className="fine-print">
            Alignment = your overall weekly score ÷ 10.
          </p>
        </section>
      </div>
    </>
  );
}
