import { pillars, type Entry, type Pillar } from "@/lib/data/types";
export function averages(entries: Pick<Entry, "score" | "pillar">[]) {
  return Object.fromEntries(
    pillars.map((p) => {
      const values = entries
        .filter((e) => e.pillar === p)
        .map((e) => Number(e.score));
      return [
        p,
        values.length
          ? values.reduce((a, b) => a + b, 0) / values.length
          : null,
      ];
    }),
  ) as Record<Pillar, number | null>;
}
export function overall(
  entries: Pick<Entry, "score" | "pillar">[],
): number | null {
  const values = Object.values(averages(entries)).filter(
    (x): x is number => x !== null,
  );
  return values.length
    ? values.reduce((a, b) => a + b, 0) / values.length
    : null;
}
export function monday(date = new Date()) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}
export function shiftWeek(week: string, amount: number) {
  const d = new Date(week + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + 7 * amount);
  return d.toISOString().slice(0, 10);
}
export function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date + "T12:00:00Z"));
}
export function validWeek(week: string) {
  const d = new Date(week + "T12:00:00Z");
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(week) &&
    !Number.isNaN(+d) &&
    d.toISOString().slice(0, 10) === week &&
    d.getUTCDay() === 1 &&
    week <= monday()
  );
}
