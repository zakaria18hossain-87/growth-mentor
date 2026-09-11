"use client";
import { useActionState } from "react";
import { saveVision } from "@/app/vision/actions";
import type { Vision } from "@/lib/data/types";
export default function VisionForm({ vision }: { vision?: Vision }) {
  const [state, action, pending] = useActionState(saveVision, {});
  return (
    <form action={action} className="edit-form">
      <input type="hidden" name="id" value={vision?.id || ""} />
      <label>
        Your north-star statement
        <textarea
          name="statement"
          defaultValue={vision?.statement || ""}
          required
          rows={6}
          maxLength={5000}
          placeholder="Ten years from now, what does a meaningful life look like to you?"
        />
      </label>
      <label className="year-field">
        Target year
        <input
          type="number"
          name="target_year"
          min="2020"
          max="2200"
          step="1"
          defaultValue={vision?.target_year || new Date().getFullYear() + 10}
          required
        />
      </label>
      {state.error && (
        <p role="alert" className="notice error">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="notice success">
          {state.success}
        </p>
      )}
      <button className="button primary" disabled={pending}>
        {pending ? "Saving…" : "Save vision"}
      </button>
    </form>
  );
}
