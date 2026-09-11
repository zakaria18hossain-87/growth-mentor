import "server-only";
import { createClient } from "@supabase/supabase-js";
export function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Database configuration is missing.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
export function checked<T>({
  data,
  error,
}: {
  data: T;
  error: { message: string } | null;
}): NonNullable<T> {
  if (error) {
    console.error("Database request failed:", error.message);
    throw new Error("We could not save or load your data. Please try again.");
  }
  return data!;
}
