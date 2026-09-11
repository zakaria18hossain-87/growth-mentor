import Link from "next/link";
import { getGoals } from "@/lib/data/goals";
import { pillarLabels, type Goal } from "@/lib/data/types";
import { dateLabel } from "@/lib/utils/scoring";
import GoalForm from "@/components/goal-form";
import ActionButton from "@/components/action-button";
import { updateGoalStatus, deleteGoal } from "./actions";
export const dynamic = "force-dynamic";
export default async function Goals({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const filter = ["active", "completed", "archived"].includes(
    params.status || "",
  )
    ? (params.status as Goal["status"])
    : "active";
  const goals = await getGoals();
  const shown = goals.filter((g) => g.status === filter);
  return (
    <>
      <div className="topline">SMALL ACTIONS. LONG HORIZONS.</div>
      <header className="page-heading">
        <div>
          <h1>Give your vision legs.</h1>
          <p>Choose the goals you want to show up for each week.</p>
        </div>
        <a href="#new-goal" className="button primary">
          ＋ Add a goal
        </a>
      </header>
      <div className="goal-layout">
        <section>
          <nav className="filter-tabs" aria-label="Goal status">
            {(["active", "completed", "archived"] as const).map((s) => (
              <Link
                key={s}
                href={"/goals?status=" + s}
                className={filter === s ? "selected" : ""}
                aria-current={filter === s ? "page" : undefined}
              >
                {s[0].toUpperCase() + s.slice(1)}{" "}
                <span>{goals.filter((g) => g.status === s).length}</span>
              </Link>
            ))}
          </nav>
          {shown.length ? (
            shown.map((g) => (
              <article className="panel goal-card" key={g.id}>
                <div className="split">
                  <span className="pillar-label">
                    <span className={"pillar-mark " + g.pillar} />
                    {pillarLabels[g.pillar]}
                  </span>
                  <span className="badge">
                    {g.term === "short" ? "Short term" : "Long term"}
                  </span>
                </div>
                <h2>{g.title}</h2>
                <p className="muted">
                  {g.target_date
                    ? "Target: " + dateLabel(g.target_date)
                    : "No target date set"}
                </p>
                <div className="goal-actions">
                  {g.status === "active" ? (
                    <>
                      <ActionButton
                        action={updateGoalStatus.bind(null, g.id, "completed")}
                        label="Mark complete"
                      />
                      <ActionButton
                        action={updateGoalStatus.bind(null, g.id, "archived")}
                        label="Archive"
                      />
                    </>
                  ) : (
                    <ActionButton
                      action={updateGoalStatus.bind(null, g.id, "active")}
                      label="Reactivate"
                    />
                  )}
                </div>
                <details className="edit-details">
                  <summary>Edit goal</summary>
                  <GoalForm goal={g} />
                  <div className="delete-area">
                    <ActionButton
                      action={deleteGoal.bind(null, g.id)}
                      label="Delete goal"
                      confirm="This permanently deletes this goal and its past scores. Archive it instead to keep its history."
                    />
                  </div>
                </details>
              </article>
            ))
          ) : (
            <div className="panel empty">
              <h2>No {filter} goals yet.</h2>
              <p>
                {filter === "active"
                  ? "Add a goal to start your weekly practice."
                  : "Goals you " +
                    (filter === "completed" ? "complete" : "archive") +
                    " will appear here."}
              </p>
            </div>
          )}
        </section>
        <aside className="panel new-goal-panel" id="new-goal">
          <span className="eyebrow">MAKE IT CONCRETE</span>
          <h2>A new step forward</h2>
          <p className="muted">
            Active goals are included in your weekly scorecard automatically.
          </p>
          <GoalForm />
        </aside>
      </div>
    </>
  );
}
