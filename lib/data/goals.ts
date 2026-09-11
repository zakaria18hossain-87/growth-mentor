import {db,checked} from './db';
import type {Goal} from './types';
export async function getGoals():Promise<Goal[]> { return checked(await db().from('goals').select('*').is('user_id',null).order('created_at')) as Goal[]; }
