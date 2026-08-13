import { expandSearchTerms } from './search';

type Profile={location:string;category:string;experience:string;mode:string;type:string};
type Opportunity={title?:string;organization?:string;location:string;category:string;experience:string;mode:string;type:string;description?:string};
const norm=(v:string='')=>v.toLowerCase().replace(/[^a-z0-9\u0400-\u04ff]+/gi,' ').trim();
export function scoreOpportunity(profile:Profile,o:Opportunity){
  let score=0; const text=norm([o.title,o.organization,o.category,o.description].join(' '));
  const terms=expandSearchTerms(profile.category).toLowerCase().split(/\s+/).filter(Boolean);
  if(terms.some(t=>text.includes(norm(t))))score+=45;
  if(profile.location && o.location.toLowerCase().includes(profile.location.toLowerCase()))score+=20;
  if(profile.mode && profile.mode!=='Farqi yo‘q' && o.mode===profile.mode)score+=15;
  if(profile.type && profile.type!=='Barchasi' && o.type===profile.type)score+=10;
  if(profile.experience && o.experience===profile.experience)score+=10;
  return Math.min(score,100);
}
export function rankOpportunities<T extends Opportunity>(profile:Profile,items:T[]){return items.map(item=>({...item,_matchScore:scoreOpportunity(profile,item)})).sort((a,b)=>b._matchScore-a._matchScore);}
