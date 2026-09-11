import ts from "typescript";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
const transpile = (p) =>
  ts.transpileModule(readFileSync(p, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
const typesURL =
  "data:text/javascript;base64," +
  Buffer.from(transpile("lib/data/types.ts")).toString("base64");
const code = transpile("lib/utils/scoring.ts").replace(
  "@/lib/data/types",
  typesURL,
);
const { averages, overall, monday, shiftWeek, validWeek } = await import(
  "data:text/javascript;base64," + Buffer.from(code).toString("base64")
);
assert.equal(overall([]), null);
assert.equal(averages([{ pillar: "health", score: 0 }]).health, 0);
assert.equal(
  overall([
    { pillar: "health", score: 0 },
    { pillar: "health", score: 10 },
    { pillar: "education", score: 10 },
  ]),
  7.5,
  "Each pillar has equal weight, regardless of goal count",
);
assert.equal(monday(new Date("2026-09-13T22:00:00Z")), "2026-09-07");
assert.equal(shiftWeek("2026-01-05", -1), "2025-12-29");
assert.equal(validWeek("2020-01-06"), true);
assert.equal(validWeek("2020-01-07"), false);
assert.equal(validWeek("2020-02-31"), false);
console.log(
  "PASS: zero scores, empty scores, equal pillar weighting, week boundaries, and date validation.",
);
