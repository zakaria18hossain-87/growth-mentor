# Growth Mentor — Intelligence Layer

## Messy Inputs
- Free-text goal titles, weekly notes (variable length/quality).
- Self-reported scores (subjective 0–10).

## Auto-Structure Schema (weekly summary generation)
```json
{
  "week_start": "2025-01-13",
  "pillar_scores": {
    "health": 7.5,
    "soft_skills": 6.0,
    "development": 8.0,
    "education": 5.5
  },
  "top_insight": "Development trending up 3 weeks straight.",
  "at_risk": "Education scores declining — review goals.",
  "vision_alignment": 0.72
}
```

## Events to Track
- Scorecard submitted
- Goal created / completed / archived
- Vision created / updated

## Scoring Rules (rule-based v1)
- Pillar average = mean of entry scores for that pillar in the week.
- Overall weekly score = mean of pillar averages.
- Vision-alignment % = overall weekly score / 10 (v1 proxy).
- Trend = compare current week pillar avg to previous week.

## What Gets Ranked
- Goals by score within a pillar (lowest score → needs attention).
- Pillars by 4-week rolling average (lowest → focus area).

## v1 vs Later
- **v1:** Rule-based scoring, pillar averages, simple trend (delta vs last week).
- **Later:** AI-generated weekly summary, goal suggestions, vision-alignment narrative, anomaly detection.