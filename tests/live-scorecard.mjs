import {createClient} from '@supabase/supabase-js';
import assert from 'node:assert/strict';
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{auth:{persistSession:false}});
const week='2020-01-06';
const {data:existing,error:readError}=await db.from('scorecards').select('id').eq('week_start',week);
assert.equal(readError,null);assert.equal(existing.length,0,'Reserved verification week already exists; refusing to change it');
const {data:goals,error}=await db.from('goals').select('id').eq('status','active');assert.equal(error,null);assert.ok(goals.length);
let cardId;
try {
 const entries=goals.map((g,i)=>({goal_id:g.id,score:i%2?10:0,note:'Temporary automated persistence verification'}));
 const saved=await db.rpc('submit_scorecard',{p_week:week,p_entries:entries});assert.equal(saved.error,null);cardId=saved.data;
 const result=await db.from('scorecard_entries').select('*').eq('scorecard_id',cardId);assert.equal(result.error,null);assert.equal(result.data.length,goals.length);assert.ok(result.data.every(e=>e.pillar&&e.goal_title));
 const invalid=await db.rpc('submit_scorecard',{p_week:week,p_entries:entries.slice(1)});assert.ok(invalid.error);
 const after=await db.from('scorecard_entries').select('*').eq('scorecard_id',cardId);assert.equal(after.data.length,goals.length);
 const update=await db.rpc('submit_scorecard',{p_week:week,p_entries:entries.map(e=>({...e,score:7}))});assert.equal(update.error,null);assert.equal(update.data,cardId);
 const persisted=await db.from('scorecard_entries').select('score,note').eq('scorecard_id',cardId);assert.ok(persisted.data.every(e=>e.score===7));
 console.log('PASS: live anonymous read, atomic submission, historical snapshots, validation, repeat submission, persistence.');
}finally{if(cardId){const cleanup=await db.from('scorecards').delete().eq('id',cardId);assert.equal(cleanup.error,null);console.log('Temporary verification scorecard removed.');}}
