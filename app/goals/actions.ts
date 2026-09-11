"use server";
import { revalidatePath } from "next/cache";
import {
  saveGoalRecord,
  changeGoalStatus,
  deleteGoalRecord,
} from "@/lib/data/goals";
import { pillars, type Pillar, type Goal } from "@/lib/data/types";
import type { SaveState } from "@/app/scorecards/actions";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function saveGoal(
  _: SaveState,
  form: FormData,
): Promise<SaveState> {
  const id = String(form.get("id") || "");
  const title = String(form.get("title") || "").trim();
  const pillar = String(form.get("pillar") || "");
  const term = String(form.get("term") || "");
  const status = String(form.get("status") || "active");
  const target = String(form.get("target_date") || "");
  if (id && !uuid.test(id))
    return {
      error: "This goal could not be identified. Refresh and try again.",
    };
  if (!title || title.length > 240)
    return { error: "Give your goal a title of 1–240 characters." };
  if (
    !pillars.includes(pillar as Pillar) ||
    !["short", "long"].includes(term) ||
    !["active", "completed", "archived"].includes(status)
  )
    return { error: "Choose a valid pillar, timeframe, and status." };
  if (
    target &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(target) ||
      Number.isNaN(Date.parse(target)) ||
      new Date(target).toISOString().slice(0, 10) !== target)
  )
    return { error: "Choose a valid target date." };
  try {
    await saveGoalRecord(id || null, {
      title,
      pillar: pillar as Pillar,
      term: term as Goal["term"],
      status: status as Goal["status"],
      target_date: target || null,
    });
    revalidatePath("/", "layout");
    return {
      success: id
        ? "Goal updated."
        : "Goal created. It is ready for your weekly scorecard.",
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Could not save your goal.",
    };
  }
}
export async function updateGoalStatus(
  id: string,
  status: Goal["status"],
): Promise<SaveState> {
  if (!uuid.test(id) || !["active", "completed", "archived"].includes(status))
    return { error: "Invalid goal or status." };
  try {
    await changeGoalStatus(id, status);
    revalidatePath("/", "layout");
    return {
      success: "Goal " + (status === "active" ? "reactivated" : status) + ".",
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Could not update your goal.",
    };
  }
}
export async function deleteGoal(id: string): Promise<SaveState> {
  if (!uuid.test(id)) return { error: "Invalid goal." };
  try {
    await deleteGoalRecord(id);
    revalidatePath("/", "layout");
    return { success: "Goal deleted." };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Could not delete your goal.",
    };
  }
}
