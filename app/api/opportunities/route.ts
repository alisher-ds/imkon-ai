import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type CuratedOpportunity = {
  id: string; title: string; organization: string; type: 'Ish'|'Stajirovka'|'Grant'|'Kurs'; location: string;
  mode: 'Masofaviy'|'Ofis'|'Gibrid'; category: string; experience: string; description: string;
  deadline: string | null; url: string; is_verified: true; is_active: true; source: string; source_url: string;
};

const curated: CuratedOpportunity[] = [
  { id:'official-itstudy-2026', title:'Raqamlashtirish orqali farovonlik sari — bepul IT ta’lim', organization:'O‘zbekiston Raqamli texnologiyalar vazirligi', type:'Kurs', location:'O‘zbekiston', mode:'Masofaviy', category:'IT', experience:'Boshlang‘ich', description:'2026-yil davomida ijtimoiy himoyaga muhtoj oilalar farzandlari uchun IT, SMM, ingliz tili, e-commerce va marketing yo‘nalishlarida bepul ta’lim. Ro‘yxatdan o‘tish itstudy.uz orqali.', deadline:null, url:'https://itstudy.uz', is_verified:true, is_active:true, source:'Digital.gov.uz', source_url:'https://www.digital.gov.uz/oz/digital/news/view/135005' },
  { id:'official-it-certificate-reimbursement', title:'Xalqaro IT sertifikati xarajatlarini qoplash', organization:'O‘zbekiston Raqamli texnologiyalar vazirligi', type:'Grant', location:'O‘zbekiston', mode:'Masofaviy', category:'IT', experience:'Boshlang‘ich', description:'14–30 yoshdagi O‘zbekiston fuqarolari uchun xalqaro IT sertifikati olish xarajatlarini qoplash bo‘yicha davlat xizmati. Ariza YIDXP orqali beriladi.', deadline:null, url:'https://oldmy.gov.uz/en/service/622', is_verified:true, is_active:true, source:'my.gov.uz', source_url:'https://oldmy.gov.uz/en/service/622' },
  { id:'official-it-town-jizzakh', title:'IT Town — bepul raqamli ta’lim', organization:'IT Park Uzbekistan', type:'Kurs', location:'Jizzax', mode:'Ofis', category:'IT', experience:'Boshlang‘ich', description:'5–11-sinf o‘quvchilari uchun bepul raqamli texnologiyalar va xorijiy tillar: dasturlash, AI, robototexnika, dizayn, ingliz va koreys tillari.', deadline:null, url:'https://www.digital.gov.uz/en/digital/news/view/174031', is_verified:true, is_active:true, source:'Digital.gov.uz', source_url:'https://www.digital.gov.uz/en/digital/news/view/174031' },
  { id:'official-ai-leaders', title:'Five Million Artificial Intelligence Leaders', organization:'O‘zbekiston Raqamli texnologiyalar vazirligi', type:'Kurs', location:'O‘zbekiston', mode:'Masofaviy', category:'AI', experience:'Boshlang‘ich', description:'Yoshlarning AI va raqamli ko‘nikmalarini rivojlantirishga qaratilgan milliy tashabbus; bepul ta’lim va tanlov imkoniyatlari ko‘zda tutilgan.', deadline:null, url:'https://gov.uz/en/digital/news/view/115769', is_verified:true, is_active:true, source:'Gov.uz', source_url:'https://gov.uz/en/digital/news/view/115769' },
  { id:'official-itpark-internship', title:'IT Park Uzbekistan — Internship Application', organization:'IT Park Uzbekistan', type:'Stajirovka', location:'Toshkent', mode:'Ofis', category:'IT', experience:'Boshlang‘ich', description:'IT Parkning rasmiy internship arizasi. Nomzodlardan IT ta’limi, kurslari, qiziqish yo‘nalishi va internship maqsadlari haqida ma’lumot so‘raladi.', deadline:null, url:'https://www.it-park.uz/en/itpark/about/intern-form', is_verified:true, is_active:true, source:'IT Park Uzbekistan', source_url:'https://www.it-park.uz/en/itpark/about/intern-form' },
  { id:'official-itpark-career', title:'IT Park Uzbekistan — Career / Vacancy Application', organization:'IT Park Uzbekistan', type:'Ish', location:'Toshkent', mode:'Ofis', category:'IT', experience:'Boshlang‘ich', description:'IT Parkning rasmiy vakansiya arizasi. Rezyume yuborish orqali IT Park jamoasidagi ish imkoniyatlariga murojaat qilish mumkin.', deadline:null, url:'https://www.it-park.uz/en/itpark/about/vacancy-form', is_verified:true, is_active:true, source:'IT Park Uzbekistan', source_url:'https://www.it-park.uz/en/itpark/about/vacancy-form' },
  { id:'official-corpshore-roles', title:'Corpshore Uzbekistan — Open Roles', organization:'Corpshore Uzbekistan', type:'Ish', location:'Samarqand', mode:'Ofis', category:'IT', experience:'Boshlang‘ich', description:'Corpshore Uzbekistan rasmiy careers sahifasidagi ochiq rollar: customer support, QA, operations, HR, AI/data va boshqa yo‘nalishlar. Har bir rolning talablari va ariza sahifasi alohida ko‘rsatilgan.', deadline:null, url:'https://corpshore.uz/en/careers/roles', is_verified:true, is_active:true, source:'Corpshore Uzbekistan', source_url:'https://corpshore.uz/en/careers/roles' },
];

const aliases: Record<string,string[]> = {
  ml:['machine learning','ml','ai','artificial intelligence','data science','deep learning','tensorflow','pytorch'],
  ai:['artificial intelligence','ai','machine learning','ml','deep learning','data science'],
  'data science':['data science','data analyst','machine learning','ml','python','ai'],
  python:['python','django','fastapi','data science','machine learning','automation'],
  frontend:['frontend','front-end','react','next.js','javascript','typescript','web developer'],
  backend:['backend','back-end','node.js','python','java','api','server'],
  design:['design','ui','ux','figma','graphic design'],
  marketing:['marketing','smm','digital marketing','content'],
  accounting:['accounting','buxgalter','finance','audit'],
};

function expandQuery(q: string | null): string[] {
  if (!q) return [];
  const normalized = q.trim().toLowerCase();
  return [normalized, ...(aliases[normalized] ?? [])].filter((v,i,a)=>v && a.indexOf(v)===i);
}

function searchable(o: {title:string;organization:string;category:string;description:string;location:string}) {
  return `${o.title} ${o.organization} ${o.category} ${o.description} ${o.location}`.toLowerCase();
}

function matchesText(o: CuratedOpportunity, terms: string[]) {
  if (!terms.length) return true;
  const text = searchable(o);
  return terms.some(term => text.includes(term));
}

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const params = request.nextUrl.searchParams;
  const type = params.get('type');
  const mode = params.get('mode');
  const category = params.get('category');
  const location = params.get('location');
  const q = params.get('q')?.trim().toLowerCase() || '';
  const terms = expandQuery(q);

  let dbRows: any[] = [];
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    let query = supabase.from('opportunities').select('*').eq('is_active', true);
    if (type && type !== 'Barchasi') query = query.eq('type', type);
    if (mode) query = query.eq('mode', mode);
    if (category) query = query.ilike('category', `%${category}%`);
    if (location) query = query.ilike('location', `%${location}%`);
    if (terms.length) {
      const filters = terms.flatMap(term => [
        `title.ilike.%${term}%`, `organization.ilike.%${term}%`,
        `category.ilike.%${term}%`, `description.ilike.%${term}%`
      ]).join(',');
      query = query.or(filters);
    }
    const { data, error } = await query.order('deadline', { ascending: true, nullsFirst: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    dbRows = data ?? [];
  }

  const curatedMatches = curated.filter(o => {
    if (type && type !== 'Barchasi' && o.type !== type) return false;
    if (mode && o.mode !== mode) return false;
    if (category && !o.category.toLowerCase().includes(category.toLowerCase())) return false;
    if (location && !o.location.toLowerCase().includes(location.toLowerCase())) return false;
    return matchesText(o, terms);
  });

  const merged = [...dbRows, ...curatedMatches];
  const unique = [...new Map(merged.map(item => [item.url || item.id, item])).values()];
  return NextResponse.json({ opportunities: unique, meta: { query: q || null, expandedTerms: terms, count: unique.length } });
}
