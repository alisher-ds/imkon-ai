import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const aliases: Record<string,string[]> = {
  ml:['machine learning','ml','ai','artificial intelligence','data science','deep learning','tensorflow','pytorch'],
  ai:['artificial intelligence','ai','machine learning','ml','deep learning','data science'],
  'data science':['data science','data analyst','machine learning','ml','python','ai'],
  python:['python','django','fastapi','data science','machine learning'],
  frontend:['frontend','front-end','react','next.js','javascript','typescript','web developer'],
  backend:['backend','back-end','node.js','python','java','api','server'],
  design:['design','ui','ux','figma','graphic design'],
  marketing:['marketing','smm','digital marketing','content'],
  accounting:['accounting','buxgalter','finance','audit']
};

function termsFor(q:string|null){
  if(!q) return [];
  const n=q.trim().toLowerCase();
  return [...new Set([n,...(aliases[n]??[])])];
}

export async function GET(request:NextRequest){
  const p=request.nextUrl.searchParams;
  const q=p.get('q'); const terms=termsFor(q);
  const type=p.get('type'); const mode=p.get('mode'); const category=p.get('category'); const location=p.get('location');
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL; const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key) return NextResponse.json({opportunities:[],meta:{query:q,expandedTerms:terms,count:0}});
  const supabase=createClient(url,key);
  let query=supabase.from('opportunities').select('*').eq('is_active',true).eq('is_verified',true);
  if(type&&type!=='Barchasi') query=query.eq('type',type);
  if(mode) query=query.eq('mode',mode);
  if(category) query=query.ilike('category',`%${category}%`);
  if(location) query=query.ilike('location',`%${location}%`);
  if(terms.length){
    const filters=terms.flatMap(t=>[
      `title.ilike.%${t}%`,`organization.ilike.%${t}%`,`category.ilike.%${t}%`,`description.ilike.%${t}%`
    ]).join(',');
    query=query.or(filters);
  }
  const {data,error}=await query.order('deadline',{ascending:true,nullsFirst:false});
  if(error) return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({opportunities:data??[],meta:{query:q,expandedTerms:terms,count:(data??[]).length}});
}
