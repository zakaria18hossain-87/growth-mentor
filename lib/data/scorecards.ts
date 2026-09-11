import {db,checked} from './db';
import type {Scorecard} from './types';
export async function getScorecards():Promise<Scorecard[]> {return checked(await db().from('scorecards').select('id,week_start,summary,scorecard_entries(id,goal_id,score,note,goal_title,pillar)').is('user_id',null).order('week_start',{ascending:false})) as Scorecard[];}
export async function submitScorecard(week:string,entries:{goal_id:string;score:number;note:string}[]):Promise<string> {
  const {data,error}=await db().rpc('submit_scorecard',{p_week:week,p_entries:entries});
  if(error) {console.error('Scorecard submission:',error.message);throw new Error('Could not submit your scorecard. Your goals may have changed; refresh and try again.');}
  return data as string;
}
