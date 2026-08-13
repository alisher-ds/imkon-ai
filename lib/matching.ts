import type { UserProfile } from './profile';

type Opportunity={location:string;category:string;experience:string;mode:string;type:string;deadline?:string|null};

export function matchScore(profile:UserProfile,o:Opportunity){let score=0;if(profile.category&&o.category===profile.category)score+=35;if(profile.location&&o.location.toLowerCase().includes(profile.location.toLowerCase()))score+=20;if(profile.mode&&o.mode===profile.mode)score+=20;if(profile.type&&o.type===profile.type)score+=15;if(profile.experience&&o.experience===profile.experience)score+=10;return score;}
export function rankMatches<T extends Opportunity>(profile:UserProfile,items:T[]){return [...items].map(item=>({...item,_matchScore:matchScore(profile,item)})).sort((a,b)=>b._matchScore-a._matchScore);}
