import { db, checked } from "./db";
import type { Vision } from "./types";
export async function getVisions(): Promise<Vision[]> {
  return checked(
    await db()
      .from("visions")
      .select("*")
      .is("user_id", null)
      .order("created_at", { ascending: false }),
  ) as Vision[];
}
export async function saveVisionRecord(
  id: string | null,
  input: Pick<Vision, "statement" | "target_year">,
) {
  const q = id
    ? db().from("visions").update(input).eq("id", id).is("user_id", null)
    : db().from("visions").insert(input);
  checked(await q.select("id").single());
}
export async function deleteVisionRecord(id: string) {
  checked(
    await db()
      .from("visions")
      .delete()
      .eq("id", id)
      .is("user_id", null)
      .select("id")
      .single(),
  );
}
