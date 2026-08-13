import { NextRequest, NextResponse } from 'next/server';
import { expandSearchTerms } from '@/lib/search';

export const revalidate = 900;

type LiveJob = {
  id:string; title:string; organization:string; type:'Ish'|'Stajirovka'; location:string;
  mode:'Masofaviy'|'Ofis'|'Gibrid'; category:string; experience:string; description:string;
  deadline:null; url:string; is_verified:false; source:string; source_url:string;
};

const clean=(v:string='')=>v.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const category=(title:string,cat:string)=>{const x=(title+' '+cat).toLowerCase();if(/data|machine|artificial|ai|software|developer|engineer|python|react|javascript|typescript|devops|cyber/.test(x))return 'IT';if(/marketing|sales|social|seo|content/.test(x))return 'SMM';if(/account|finance|bank|audit/.test(x))return 'Moliya';if(/design|ux|ui|figma/.test(x))return 'Dizayn';return cat||'Boshqa';};

async function remotive(q:string){
  const url=`https://remotive.com/api/remote-jobs?limit=20${q?`&search=${encodeURIComponent(q)}`:''}`;
  const res=await fetch(url,{next:{revalidate:900}}); if(!res.ok)return [];
  const data=await res.json();
  return (data.jobs??[]).map((j:any):LiveJob=>({id:`remotive-${j.id}`,title:j.title,organization:j.company_name,type:j.job_type==='internship'?'Stajirovka':'Ish',location:j.candidate_required_location||'Worldwide',mode:'Masofaviy',category:category(j.title,j.category),experience:/senior|lead|manager/i.test(j.title)?'Tajribali':'Boshlang‘ich',description:clean(j.description).slice(0,420),deadline:null,url:j.url,is_verified:false,source:'Remotive',source_url:j.url}));
}

async function arbeitnow(q:string){
  const res=await fetch('https://www.arbeitnow.com/api/job-board-api',{next:{revalidate:900}}); if(!res.ok)return [];
  const data=await res.json(); const needle=q.toLowerCase();
  return (data.data??[]).filter((j:any)=>!needle || `${j.title} ${j.description} ${j.tags?.join(' ')}`.toLowerCase().includes(needle)).slice(0,20).map((j:any):LiveJob=>({id:`arbeitnow-${j.slug||j.id}`,title:j.title,organization:j.company_name||j.company||'Kompaniya',type:'Ish',location:j.location||'Yevropa',mode:j.remote?'Masofaviy':'Ofis',category:category(j.title,j.tags?.join(' ')||''),experience:/senior|lead|manager/i.test(j.title)?'Tajribali':'Boshlang‘ich',description:clean(j.description||j.job_description).slice(0,420),deadline:null,url:j.url||j.apply_url,is_verified:false,source:'Arbeitnow',source_url:j.url||'https://www.arbeitnow.com'}));
}

async function jooble(q:string,location:string){
  const key=process.env.JOOBLE_API_KEY; if(!key)return [];
  const res=await fetch(`https://jooble.org/api/${key}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({keywords:q||'student jobs',location:location||'Uzbekistan',page:1,ResultOnPage:20,companysearch:false})});
  if(!res.ok)return [];
  const data=await res.json();
  return (data.jobs??[]).map((j:any):LiveJob=>({id:`jooble-${j.id}`,title:j.title,organization:j.company||'Kompaniya',type:'Ish',location:j.location||location||'O‘zbekiston',mode:/remote|masofaviy|work from home/i.test(j.title+' '+j.snippet)?'Masofaviy':'Ofis',category:category(j.title,j.snippet||''),experience:/senior|lead|manager/i.test(j.title)?'Tajribali':'Boshlang‘ich',description:clean(j.snippet||'').slice(0,420),deadline:null,url:j.link,is_verified:false,source:'Jooble',source_url:j.link}));
}

export async function GET(request:NextRequest){
  const p=request.nextUrl.searchParams; const raw=p.get('q')||''; const q=expandSearchTerms(raw); const location=p.get('location')||'';
  const results=await Promise.allSettled([remotive(q),arbeitnow(raw),jooble(raw,location)]);
  const jobs=results.flatMap(r=>r.status==='fulfilled'?r.value:[]);
  const unique=[...new Map(jobs.filter(j=>j.url).map(j=>[j.url,j])).values()].slice(0,50);
  return NextResponse.json({jobs:unique, sources:['Remotive','Arbeitnow',...(process.env.JOOBLE_API_KEY?['Jooble']:[])]});
}
