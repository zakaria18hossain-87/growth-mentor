"use client";
import { useState } from "react";
import {
  pillars,
  pillarLabels,
  pillarColors,
  type Pillar,
  type Scorecard,
} from "@/lib/data/types";
import { averages, shiftWeek, dateLabel } from "@/lib/utils/scoring";
export default function TrendChart({
  cards,
  week,
}: {
  cards: Scorecard[];
  week: string;
}) {
  const [window, setWindow] = useState(4);
  const [hidden, setHidden] = useState<Pillar[]>([]);
  const weeks = Array.from({ length: window }, (_, i) =>
    shiftWeek(week, i - window + 1),
  );
  const rows = weeks.map((w) => ({
    week: w,
    scores: averages(
      cards.find((c) => c.week_start === w)?.scorecard_entries || [],
    ),
  }));
  const x = (i: number) => 48 + i * (650 / (window - 1));
  const y = (v: number) => 210 - v * 17;
  return (
    <section className="panel trend-panel">
      <div className="split">
        <div>
          <span className="eyebrow">CONSISTENCY OVER PERFECTION</span>
          <h2>Your weekly rhythm</h2>
        </div>
        <label className="chart-range">
          Show
          <select
            aria-label="Trend range"
            value={window}
            onChange={(e) => setWindow(Number(e.target.value))}
          >
            <option value={4}>Last 4 weeks</option>
            <option value={8}>Last 8 weeks</option>
            <option value={12}>Last 12 weeks</option>
          </select>
        </label>
      </div>
      <div className="chart-legend">
        {pillars.map((p) => (
          <button
            key={p}
            aria-pressed={!hidden.includes(p)}
            className={hidden.includes(p) ? "hidden-series" : ""}
            onClick={() =>
              setHidden(
                hidden.includes(p)
                  ? hidden.filter((x) => x !== p)
                  : [...hidden, p],
              )
            }
          >
            <span className={"pillar-mark " + p} />
            {pillarLabels[p]}
          </button>
        ))}
      </div>
      {rows.some((r) => Object.values(r.scores).some((v) => v !== null)) ? (
        <div className="chart-scroll">
          <svg
            viewBox="0 0 735 260"
            role="img"
            aria-label="Weekly pillar averages from zero to ten. Exact scores are available in the table below."
          >
            {[0, 2, 4, 6, 8, 10].map((v) => (
              <g key={v}>
                <line
                  x1="48"
                  x2="698"
                  y1={y(v)}
                  y2={y(v)}
                  stroke="#e5ebe2"
                  strokeDasharray={v ? "3 5" : undefined}
                />
                <text
                  x="24"
                  y={y(v) + 4}
                  textAnchor="middle"
                  fill="#718079"
                  fontSize="12"
                >
                  {v}
                </text>
              </g>
            ))}
            {weeks.map((w, i) => (
              <text
                key={w}
                x={x(i)}
                y="241"
                textAnchor="middle"
                fill="#718079"
                fontSize="12"
              >
                {w.slice(5).replace("-", "/")}
              </text>
            ))}
            {pillars
              .filter((p) => !hidden.includes(p))
              .map((p) => (
                <g key={p}>
                  {rows.map((r, i) => {
                    const v = r.scores[p];
                    const prev = i ? rows[i - 1].scores[p] : null;
                    return (
                      v !== null && (
                        <g key={r.week}>
                          {i > 0 && prev !== null && (
                            <line
                              x1={x(i - 1)}
                              y1={y(prev)}
                              x2={x(i)}
                              y2={y(v)}
                              stroke={pillarColors[p]}
                              strokeWidth="2.5"
                            />
                          )}
                          <circle
                            cx={x(i)}
                            cy={y(v)}
                            r="4.5"
                            fill="white"
                            stroke={pillarColors[p]}
                            strokeWidth="2.5"
                          >
                            <title>
                              {[
                                pillarLabels[p],
                                dateLabel(r.week),
                                v.toFixed(1) + "/10",
                              ].join(" · ")}
                            </title>
                          </circle>
                        </g>
                      )
                    );
                  })}
                </g>
              ))}
          </svg>
        </div>
      ) : (
        <div className="chart-empty">
          Submit a scorecard to start seeing your weekly rhythm.
        </div>
      )}
      <div className="chart-footnote">
        Weekly averages · Missing weeks stay blank
      </div>
      <details className="chart-data">
        <summary>View exact scores</summary>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">Weekly pillar averages</caption>
            <thead>
              <tr>
                <th>Week of</th>
                {pillars.map((p) => (
                  <th key={p}>{pillarLabels[p]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.week}>
                  <th>{dateLabel(r.week)}</th>
                  {pillars.map((p) => (
                    <td key={p}>{r.scores[p]?.toFixed(1) ?? "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
