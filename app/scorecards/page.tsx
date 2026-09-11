import Link from 'next/link';
import {getGoals} from '@/lib/data/goals';
import {getScorecards} from '@/lib/data/scorecards';
import {monday,validWeek,dateLabel} from '@/lib/utils/scoring';
import ScoreForm from '@/components/score-form';
export const dynamic='force-dynamic';
export default async function Scorecards({searchParams}:{searchParams:Promise<{week?:string}>}){
 const params=await searchParams;const week=params.week&&validWeek(params.week)?params.week:monday();
 const [allGoals,cards]=await Promise.all([getGoals(),getScorecards()]);const goals=allGoals.filter(g=>g.status==='active');const card=cards.find(c=>c.week_start===week);
 return <><div className="topline"><span>YOUR WEEKLY PRACTICE</span><span>{dateLabel(monday())}</span></div><header className="page-heading"><div><h1>Pause. Reflect. Grow.</h1><p>Turn this week’s effort into next week’s direction.</p></div><Link href="/scorecards/history" className="button secondary">View history ↗</Link></header><div className="week-bar"><div><span className="eyebrow">WEEK OF</span><strong>{dateLabel(week)}</strong></div><span className={'badge '+(card?'saved':'')}>{card?'Submitted · editable':'Ready for your reflection'}</span><form><label className="sr-only" htmlFor="week-select">Choose week</label><input id="week-select" type="date" name="week" defaultValue={week} max={monday()} min="2020-01-06" step={7}/><button className="button secondary">Open week</button></form></div>{goals.length?<ScoreForm key={week+':'+goals.map(g=>g.id).join(',')} goals={goals} week={week} entries={card?.scorecard_entries||[]}/>:<div className="panel empty"><h2>No active goals — create goals first</h2><p>Your active goals will appear here automatically.</p><Link href="/goals" className="button primary">Create goals</Link></div>}</>;
}
