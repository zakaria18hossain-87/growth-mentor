import {db,checked} from './db';
import type {Goal} from './types';
export async function getGoals():Promise<Goal[]> { return checked(await db().from('goals').select('*').is('user_id',null).order('created_at').order('id')) as Goal[]; }
export type GoalInput=Pick<Goal,'title'|'pillar'|'term'|'target_date'|'status'>;
export async function saveGoalRecord(id:string|null,input:GoalInput) {const q=id?db().from('goals').update(input).eq('id',id).is('user_id',null):db().from('goals').insert(input);checked(await q.select('id').single());}
export async function changeGoalStatus(id:string,status:Goal['status']) {checked(await db().from('goals').update({status}).eq('id',id).is('user_id',null).select('id').single());}
export async function deleteGoalRecord(id:string) {checked(await db().from('goals').delete().eq('id',id).is('user_id',null).select('id').single());}
