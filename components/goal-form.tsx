"use client";
import { useActionState } from "react";
import { saveGoal } from "@/app/goals/actions";
import { pillars, pillarLabels, type Goal } from "@/lib/data/types";
export default function GoalForm({ goal }: { goal?: Goal }) {
  const [state, action, pending] = useActionState(saveGoal, {});
  return (
    <form action={action} className="edit-form">
      <input type="hidden" name="id" value={goal?.id || ""} />
      <label>
        Goal title
        <input
          name="title"
          defaultValue={goal?.title || ""}
          required
          maxLength={240}
          placeholder="What do you want to move toward?"
        />
      </label>
      <div className="field-grid">
        <label>
          Growth pillar
          <select name="pillar" defaultValue={goal?.pillar || "health"}>
            {pillars.map((p) => (
              <option key={p} value={p}>
                {pillarLabels[p]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Timeframe
          <select name="term" defaultValue={goal?.term || "short"}>
            <option value="short">Short-term action</option>
            <option value="long">Long-term direction</option>
          </select>
        </label>
        <label>
          Target date <span className="muted">(optional)</span>
          <input
            name="target_date"
            type="date"
            defaultValue={goal?.target_date || ""}
          />
        </label>
        <label>
          Status
          <select name="status" defaultValue={goal?.status || "active"}>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </div>
      {state.error && (
        <p className="notice error" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="notice success" role="status">
          {state.success}
        </p>
      )}
      <button className="button primary" disabled={pending}>
        {pending ? "Saving…" : goal ? "Save changes" : "Create goal"}
      </button>
    </form>
  );
}
