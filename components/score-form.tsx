'use client';
import {useActionState,useState} from 'react';
import Link from 'next/link';
import {saveScorecard} from '@/app/scorecards/actions';
import {pillars,pillarLabels,type Goal,type Entry} from '@/lib/data/types';
export default function ScoreForm({goals,entries,week}:{goals:Goal[];entries:Entry[];week:string}) {
  const [state,action,pending]=useActionState(saveScorecard,{});
  const [scores,setScores]=useState<Record<string,string>>(()=>Object.fromEntries(goals.map(g=>{const e=entries.find(e=>e.goal_id===g.id);return [g.id,e?String(e.score):''];})));
  const complete=goals.filter(g=>scores[g.id]!=='').length;
  return <form action={action} className="score-form"><input type="hidden" name="week" value={week}/>
    <div className="form-progress"><span>{complete} of {goals.length} goals scored</span><progress max={goals.length} value={complete}/><span>0 = no progress · 10 = excellent</span></div>
    {pillars.map(p=>{const group=goals.filter(g=>g.pillar===p);return group.length>0&&<section className="panel pillar-section" key={p}><div className="section-heading"><h2><span className={'pillar-mark '+p}/>{pillarLabels[p]}</h2><span className="muted">{group.length} {group.length===1?'goal':'goals'}</span></div>{group.map(g=><div className="goal-score" key={g.id}><div className="score-heading"><div><span className="eyebrow">{g.term==='long'?'Long-term direction':'Short-term action'}</span><h3>{g.title}</h3></div><label className="score-input">Score<input name={'score-'+g.id} aria-label={'Score: '+g.title} type="number" min="0" max="10" step="0.1" required value={scores[g.id]} onChange={e=>setScores({...scores,[g.id]:e.target.value})} placeholder="—"/><span>/ 10</span></label></div><label className="reflection">Weekly reflection <span className="muted">(optional)</span><textarea name={'note-'+g.id} aria-label={'Reflection: '+g.title} defaultValue={entries.find(e=>e.goal_id===g.id)?.note||''} maxLength={4000} rows={2} placeholder="What moved forward? What will you change next week?"/></label></div>)}</section>})}
    <div className="submit-panel">{state.error&&<p role="alert" className="notice error">{state.error}</p>}{state.success&&<p role="status" className="notice success">{state.success} <Link href="/scorecards/history">View history</Link></p>}<div className="split"><p className="muted">{entries.length?'Saving replaces this week’s scores.':'A little reflection. A clearer next week.'}</p><button className="button primary" disabled={pending}>{pending?'Submitting…':entries.length?'Update scorecard':'Submit scorecard'} <span aria-hidden>↗</span></button></div></div>
  </form>;
}
