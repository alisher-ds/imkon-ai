import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type CuratedOpportunity = {
  id: string; title: string; organization: string; type: 'Ish'|'Stajirovka'|'Grant'|'Kurs'; location: string;
  mode: 'Masofaviy'|'Ofis'|'Gibrid'; category: string; experience: string; description: string;
  deadline: string | null; url: string; is_verified: true; is_active: true; source: string; source_url: string;
};

// Editorial fallback for first launch. These are official Uzbekistan government/public-service
// opportunities and are deliberately small: they supplement the DB until the ingestion pipeline is live.
const curated: CuratedOpportunity[] = [
  { id:'official-itstudy-2026', title:'Raqamlashtirish orqali farovonlik sari — bepul IT ta’lim', organization:'O‘zbekiston Raqamli texnologiyalar vazirligi', type:'Kurs', location:'O‘zbekiston', mode:'Masofaviy', category:'IT', experience:'Boshlang‘ich', description:'2026-yil davomida ijtimoiy himoyaga muhtoj oilalar farzandlari uchun IT, SMM, ingliz tili, e-commerce va marketing yo‘nalishlarida bepul ta’lim. Ro‘yxatdan o‘tish itstudy.uz orqali.', deadline:null, url:'https://itstudy.uz', is_verified:true, is_active:true, source:'Digital.gov.uz', source_url:'https://www.digital.gov.uz/oz/digital/news/view/135005' },
  { id:'official-it-certificate-reimbursement', title:'Xalqaro IT sertifikati xarajatlarini qoplash', organization:'O‘zbekiston Raqamli texnologiyalar vazirligi', type:'Grant', location:'O‘zbekiston', mode:'Masofaviy', category:'IT', experience:'Boshlang‘ich', description:'14–30 yoshdagi O‘zbekiston fuqarolari uchun xalqaro IT sertifikati olish xarajatlarini qoplash bo‘yicha davlat xizmati. Ariza YIDXP orqali beriladi.', deadline:null, url:'https://oldmy.gov.uz/en/service/622', is_verified:true, is_active:true, source:'my.gov.uz', source_url:'https://oldmy.gov.uz/en/service/622' },
  { id:'official-it-town-jizzakh', title:'IT Town — bepul raqamli ta’lim', organization:'IT Park Uzbekistan', type:'Kurs', location:'Jizzax', mode:'Ofis', category:'IT', experience:'Boshlang‘ich', description:'5–11-sinf o‘quvchilari uchun bepul raqamli texnologiyalar va xorijiy tillar: dasturlash, AI, robototexnika, dizayn, ingliz va koreys tillari.', deadline:null, url:'https://www.digital.gov.uz/en/digital/news/view/174031', is_verified:true, is_active:true, source:'Digital.gov.uz', source_url:'https://www.digital.gov.uz/en/digital/news/view/174031' },
  { id:'official-ai-leaders', title:'Five Million Artificial Intelligence Leaders', organization:'O‘zbekiston Raqamli texnologiyalar vazirligi', type:'Kurs', location:'O‘zbekiston', mode:'Masofaviy', category:'AI', experience:'Boshlang‘ich', description:'Yoshlarning AI va raqamli ko‘nikmalarini rivojlantirishga qaratilgan milliy tashabbus; bepul ta’lim va tanlov imkoniyatlari ko‘zda tutilgan.', deadline:null, url:'https://gov.uz/en/digital/news/view/115769', is_verified:true, is_active:true, source:'Gov.uz', source_url:'https://gov.uz/en/digital/news/view/115769' },
  { id:'official-itpark-internship', title:'IT Park Uzbekistan — Internship Application', organization:'IT Park Uzbekistan', type:'Stajirovka', location:'Toshkent', mode:'Ofis', category:'IT', experience:'Boshlang‘ich', description:'IT Parkning rasmiy internship arizasi. Nomzodlardan IT ta’limi, kurslari, qiziqish yo‘nalishi va internship maqsadlari haqida ma’lumot so‘raladi.', deadline:null, url:'https://www.it-park.uz/en/itpark/about/intern-form', is_verified:true, is_active:true, source:'IT Park Uzbekistan', source_url:'https://www.it-park.uz/en/itpark/about/intern-form' },
  { id:'official-itpark-career', title:'IT Park Uzbekistan — Career / Vacancy Application', organization:'IT Park Uzbekistan', type:'Ish', location:'Toshkent', mode:'Ofis', category:'IT', experience:'Boshlang‘ich', description:'IT Parkning rasmiy vakansiya arizasi. Rezyume yuborish orqali IT Park jamoasidagi ish imkoniyatlariga murojaat qilish mumkin.', deadline:null, url:'https://www.it-park.uz/en/itpark/about/vacancy-form', is_verified:true, is_active:true, source:'IT Park Uzbekistan', source_url:'https://www.it-park.uz/en/itpark/about/vacancy-form' },
  { id:'official-corpshore-roles', title:'Corpshore Uzbekistan — Open Roles', organization:'Corpshore Uzbekistan', type:'Ish', location:'Samarqand', mode:'Ofis', category:'IT', experience:'Boshlang‘ich', description:'Corpshore Uzbekistan rasmiy careers sahifasidagi ochiq rollar: customer support, QA, operations, HR, AI/data va boshqa yo‘nalishlar. Har bir rolning talablari va ariza sahifasi alohida ko‘rsatilgan.', deadline:null, url:'https://corpshore.uz/en/careers/roles', is_verified:true, is_active:true, source:'Corpshore Uzbekistan', source_url:'https://corpshore.uz/en/careers/roles' },
];

export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const params = request.nextUrl.searchParams; const type = params.get('type'); const mode = params.get('mode'); const category = params.get('category'); const location = params.get('location'); const q = params.get('q')?.trim().toLowerCase();
  let dbRows:any[]=[];
  if(url&&key){
    const supabase=createClient(url,key); let query=supabase.from('opportunities').select('*').eq('is_active',true);
    if(type&&type!=='Barchasi')query=query.eq('type',type); if(mode)query=query.eq('mode',mode); if(category)query=query.ilike('category',`%${category}%`); if(location)query=query.ilike('location',`%${location}%`); if(q)query=query.or(`title.ilike.%${q}%,organization.ilike.%${q}%,category.ilike.%${q}%,description.ilike.%${q}%`);
    const {data,error}=await query.order('deadline',{ascending:true,nullsFirst:false}); if(error)return NextResponse.json({error:error.message},{status:500}); dbRows=data??[];
  }
  const matches=(o:CuratedOpportunity)=>{if(type&&type!=='Barchasi'&&o.type!==type)return false;if(mode&&o.mode!==mode)return false;if(category&&!o.category.toLowerCase().includes(category.toLowerCase()))return false;if(location&&!o.location.toLowerCase().includes(location.toLowerCase()))return false;if(!q)return true;return `${o.title} ${o.organization} ${o.category} ${o.description} ${o.location}`.toLowerCase().includes(q)};
  const merged=[...dbRows,...curated.filter(matches)]; const unique=[...new Map(merged.map(item=>[item.url||item.id,item])).values()]; return NextResponse.json({opportunities:unique});
}
