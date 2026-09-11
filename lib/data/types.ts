export const pillars = ['health', 'soft_skills', 'development', 'education'] as const;
export type Pillar = typeof pillars[number];
export const pillarLabels: Record<Pillar, string> = { health: 'Health', soft_skills: 'Soft skills', development: 'Development', education: 'Education' };
export const pillarColors: Record<Pillar,string> = {health:'#127f73',soft_skills:'#a86710',development:'#5263c5',education:'#b54f71'};
export type Goal = { id: string; title: string; pillar: Pillar; term: 'short'|'long'; target_date: string|null; status:'active'|'completed'|'archived'; created_at: string };
export type Vision = { id:string; statement:string; target_year:number; created_at:string };
export type Entry = {id:string; goal_id:string; score:number; note:string; goal_title:string; pillar:Pillar};
export type Scorecard = {id:string; week_start:string; summary:string|null; scorecard_entries:Entry[]};
