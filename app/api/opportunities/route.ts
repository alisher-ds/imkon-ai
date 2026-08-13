import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type Opportunity = { id:string; title:string; organization:string; type:'Ish'|'Stajirovka'|'Grant'|'Kurs'; location:string; mode:'Masofaviy'|'Ofis'|'Gibrid'; category:string; experience:string; description:string; deadline:string|null; url:string; is_verified:boolean; is_active:boolean; source?:string; source_url?:string };

const curated: Opportunity[] = [
 {id:'aileaders-uz',title:'Five Million Artificial Intelligence Leaders',organization:'O‘zbekiston Raqamli texnologiyalar vazirligi',type:'Kurs',location:'O‘zbekiston',mode:'Masofaviy',category:'AI',experience:'Boshlang‘ich',description:'AI bo‘yicha bepul onlayn ta’lim va rivojlanish imkoniyatlari. Rasmiy milliy AI Leaders platformasi orqali kurslardan foydalanish mumkin.',deadline:null,url:'https://aileaders.uz',is_verified:true,is_active:true,source:'Raqamli texnologiyalar vazirligi',source_url:'https://gov.uz/en/digital/news/view/148576'},
 {id:'itpark-internship',title:'IT Park Uzbekistan — Internship Application',organization:'IT Park Uzbekistan',type:'Stajirovka',location:'Toshkent',mode:'Ofis',category:'IT',experience:'Boshlang‘ich',description:'IT Parkdagi stajirovka uchun rasmiy ariza. Nomzod o‘z yo‘nalishi va stajirovka maqsadini ko‘rsatadi.',deadline:null,url:'https://www.it-park.uz/en/itpark/about/intern-form',is_verified:true,is_active:true,source:'IT Park Uzbekistan',source_url:'https://www.it-park.uz/en/itpark/about/intern-form'},
 {id:'itpark-career',title:'IT Park Uzbekistan — Career',organization:'IT Park Uzbekistan',type:'Ish',location:'Toshkent',mode:'Ofis',category:'IT',experience:'Boshlang‘ich',description:'IT Parkning rasmiy karyera sahifasi orqali ish yoki trainee imkoniyatlariga murojaat qilish mumkin.',deadline:null,url:'https://www.it-park.uz/en/itpark/about/hr',is_verified:true,is_active:true,source:'IT Park Uzbekistan',source_url:'https://www.it-park.uz/en/itpark/about/hr'},
 {id:'it-certificate-reimbursement',title:'Xalqaro IT sertifikati xarajatlarini qoplash',organization:'O‘zbekiston Raqamli texnologiyalar vazirligi',type:'Grant',location:'O‘zbekiston',mode:'Masofaviy',category:'IT',experience:'Boshlang‘ich',description:'IT sertifikatsiyasi xarajatlarini qoplash bo‘yicha davlat imkoniyati. Rasmiy davlat xizmatlari orqali shartlar va ariza jarayonini tekshirish mumkin.',deadline:null,url:'https://oldmy.gov.uz/en/service/622',is_verified:true,is_active:true,source:'my.gov.uz',source_url:'https://oldmy.gov.uz/en/service/622'}
];

const aliases: Record<string,string[]> = {
 ml:['machine learning','artificial intelligence','data science','deep learning','pytorch','tensorflow'],
 ai:['artificial intelligence','machine learning','data science','deep learning','pytorch','tensorflow'],
 'data science':['data science','data analyst','data scientist','sql','analytics','machine learning'],
 python:['python','django','fastapi','pandas','data science','machine learning'],
 frontend:['frontend','front-end','react','next.js','javascript','typescript','web developer'],
 backend:['backend','back-end','node.js','python','java','api developer'],
 design:['ui/ux','ux','graphic design','figma','product designer'],
 marketing:['digital marketing','smm','seo','content marketing','social media'],
 finance:['accounting','finance','financial analyst','banking','audit','economics']
};

function termsFor(value:string|null){const n=value?.trim().toLowerCase()||'';return n?[n,...(aliases[n]||[])]:[];}
function matches(o:Opportunity,terms:string[]){if(!terms.length)return true;const text=`${o.title} ${o.organization} ${o.category} ${o.description}`.toLowerCase();return terms.some(t=>text.includes(t));}

export async function GET(request:NextRequest){
 const p=request.nextUrl.searchParams; const q=p.get('q'); const terms=[...new Set(termsFor(q))]; const type=p.get('type'); const mode=p.get('mode'); const category=p.get('category'); const location=p.get('location');
 let dbRows:Opportunity[]=[]; const url=process.env.NEXT_PUBLIC_SUPABASE_URL; const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(url&&key){const supabase=createClient(url,key);let query=supabase.from('opportunities').select('*').eq('is_active',true).eq('is_verified',true);if(type&&type!=='Barchasi')query=query.eq('type',type);if(mode&&mode!=='Farqi yo‘q')query=query.eq('mode',mode);if(category)query=query.ilike('category',`%${category}%`);if(location)query=query.ilike('location',`%${location}%`);if(terms.length){const filters=terms.flatMap(t=>[`title.ilike.%${t}%`,`organization.ilike.%${t}%`,`category.ilike.%${t}%`,`description.ilike.%${t}%`]).join(',');query=query.or(filters);}const {data,error}=await query.order('deadline',{ascending:true,nullsFirst:false});if(error)return NextResponse.json({error:error.message},{status:500});dbRows=(data||[]) as Opportunity[];}
 const curatedRows=curated.filter(o=>(!type||type==='Barchasi'||o.type===type)&&(!mode||mode==='Farqi yo‘q'||o.mode===mode)&&(!category||o.category.toLowerCase().includes(category.toLowerCase()))&&(!location||o.location.toLowerCase().includes(location.toLowerCase()))&&matches(o,terms));
 const unique=[...new Map([...dbRows,...curatedRows].map(o=>[o.url||o.id,o])).values()];
 return NextResponse.json({opportunities:unique,meta:{query:q||null,expandedTerms:terms,count:unique.length,sources:['Supabase','Imkon verified sources']}});
}
