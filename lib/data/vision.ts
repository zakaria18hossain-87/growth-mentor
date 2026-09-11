import {db,checked} from './db';
import type {Vision} from './types';
export async function getVisions():Promise<Vision[]> {return checked(await db().from('visions').select('*').is('user_id',null).order('created_at',{ascending:false})) as Vision[];}
