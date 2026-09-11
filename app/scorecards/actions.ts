"use server";
import { getGoals } from "@/lib/data/goals";
import { submitScorecard } from "@/lib/data/scorecards";
import { validWeek } from "@/lib/utils/scoring";
import { revalidatePath } from "next/cache";
export type SaveState = { error?: string; success?: string };
export async function saveScorecard(
  _: SaveState,
  form: FormData,
): Promise<SaveState> {
  const week = String(form.get("week") || "");
  if (!validWeek(week))
    return { error: "Choose a week starting on Monday, today or earlier." };
  try {
    const goals = (await getGoals()).filter((g) => g.status === "active");
    if (!goals.length)
      return { error: "No active goals — create goals first." };
    const entries = [];
    for (const goal of goals) {
      const raw = form.get("score-" + goal.id);
      const score = Number(raw);
      const note = String(form.get("note-" + goal.id) || "").trim();
      if (
        raw === null ||
        String(raw).trim() === "" ||
        !Number.isFinite(score) ||
        score < 0 ||
        score > 10
      )
        return { error: "Please score all goals from 0 to 10." };
      if (note.length > 4000)
        return { error: "Keep each reflection under 4,000 characters." };
      entries.push({ goal_id: goal.id, score, note });
    }
    await submitScorecard(week, entries);
    revalidatePath("/", "layout");
    return {
      success: "Scorecard saved. Your history and dashboard are up to date.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not submit your scorecard. Please try again.",
    };
  }
}
