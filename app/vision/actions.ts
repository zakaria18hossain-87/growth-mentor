"use server";
import { revalidatePath } from "next/cache";
import { saveVisionRecord, deleteVisionRecord } from "@/lib/data/vision";
import type { SaveState } from "@/app/scorecards/actions";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function saveVision(
  _: SaveState,
  form: FormData,
): Promise<SaveState> {
  const id = String(form.get("id") || "");
  const statement = String(form.get("statement") || "").trim();
  const target_year = Number(form.get("target_year"));
  if (id && !uuid.test(id))
    return { error: "Invalid vision. Refresh and try again." };
  if (!statement || statement.length > 5000)
    return { error: "Write a vision of 1–5,000 characters." };
  if (
    !Number.isInteger(target_year) ||
    target_year < 2020 ||
    target_year > 2200
  )
    return { error: "Choose a target year between 2020 and 2200." };
  try {
    await saveVisionRecord(id || null, { statement, target_year });
    revalidatePath("/", "layout");
    return { success: "Your vision is saved." };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Could not save your vision.",
    };
  }
}
export async function deleteVision(id: string): Promise<SaveState> {
  if (!uuid.test(id)) return { error: "Invalid vision." };
  try {
    await deleteVisionRecord(id);
    revalidatePath("/", "layout");
    return { success: "Vision deleted." };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Could not delete your vision.",
    };
  }
}
