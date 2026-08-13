'use client';

import { useEffect, useMemo, useState } from 'react';

type Opportunity = {
  id: string; title: string; organization: string; type: 'Ish'|'Stajirovka'|'Grant'|'Kurs';
  location: string; mode: 'Masofaviy'|'Ofis'|'Gibrid'; category: string; experience: string;
  description: string; deadline: string | null; url: string; is_verified: boolean;
};

const demo: Opportunity[] = [
  {id:'1', title:'Junior SMM Assistant', organization:'Local startup', type:'Ish', location:'Toshkent', mode:'Gibrid', category:'SMM', experience:'Boshlang‘ich', description:'Kontent rejalashtirish va ijtimoiy tarmoqlar bilan ishlash.', deadline:null, url:'#', is_verified:true},
  {id:'2', title:'Frontend Internship', organization:'Tech company', type:'Stajirovka', location:'Toshkent', mode:'Ofis', category:'IT', experience:'Boshlang‘ich', description:'Real product jamoasida frontend tajribasi olish imkoniyati.', deadline:null, url:'#', is_verified:true},
  {id:'3', title:'Digital Skills Scholarship', organization:'Education foundation', type:'Grant', location:'O‘zbekiston', mode:'Masofaviy', category:'Ta’lim', experience:'Boshlang‘ich', description:'Raqamli ko‘nikmalar kurslari uchun to‘liq grant.', deadline:null, url:'#', is_verified:true},
];

const types = ['Barchasi','Ish','Stajirovka','Grant','Kurs'];

export default function Home() {
  const [items, setItems] = useState<Opportunity[]>(demo);
  const [type, setType] = useState('Barchasi');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/opportunities').then(r => r.json()).then(d => {
      if (Array.isArray(d.opportunities) && d.opportunities.length) setItems(d.opportunities);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => items.filter(o =>
    (type === 'Barchasi' || o.type === type) &&
    `${o.title} ${o.organization} ${o.category} ${o.location}`.toLowerCase().includes(query.toLowerCase())
  ), [items, type, query]);

  return <main>
    <section className="hero">
      <div className="container">
        <nav className="nav"><div className="logo">imkon<span>.</span></div><a href="#opportunities">Imkoniyatlar ↓</a></nav>
        <div className="hero-grid">
          <div>
            <div className="pill">✦ O‘zbekiston yoshlari uchun</div>
            <div className="eyebrow" style={{marginTop:22}}>SIZGA MOS IMKONIYATLAR — BIR JOYDA</div>
            <h1>Yaxshi imkoniyatni qidirib <span style={{color:'var(--accent)'}}>vaqt yo‘qotmang.</span></h1>
            <p className="hero-copy">Imkon hududingiz, yo‘nalishingiz va tajribangizga mos ish, stajirovka, grant va bepul kurslarni saralab beradi.</p>
            <div className="actions"><a className="btn btn-primary" href="#opportunities">Imkoniyatlarni topish →</a><a className="btn btn-secondary" href="#how">Qanday ishlaydi?</a></div>
          </div>
          <div className="mock"><div className="phone"><div className="phone-top"><span>IMKON</span><span>● ● ●</span></div><div className="bot-title">Salom 👋</div><div className="bot-sub">Bugun siz uchun mos imkoniyatlar.</div>
            {items.slice(0,3).map(o => <div className="op" key={o.id}><strong>{o.title}</strong><small>{o.location} · {o.mode}</small><span className="tag">{o.type}</span>{o.is_verified && <span className="tag">✓ Tekshirilgan</span>}</div>)}
          </div></div>
        </div>
      </div>
    </section>

    <section className="section" id="how"><div className="container"><div className="section-head"><div className="eyebrow">ODDIY. TEZ. FOYDALI.</div><h2>Telegramdagi shovqinni foydali imkoniyatga aylantiramiz.</h2><p className="muted">Yuzlab kanallarni kuzatish shart emas. Imkon kerakli imkoniyatlarni bir joyga jamlaydi.</p></div>
      <div className="grid3"><div className="card"><div className="number">01</div><h3>Profilingizni belgilang</h3><p className="muted">Hudud, yo‘nalish, tajriba va qidirayotgan imkoniyat turini tanlang.</p></div><div className="card"><div className="number">02</div><h3>Moslarini toping</h3><p className="muted">Ish, stajirovka, grant va bepul kurslarni bitta lentada ko‘ring.</p></div><div className="card"><div className="number">03</div><h3>Imkonni o‘tkazmang</h3><p className="muted">Deadline va yangi imkoniyatlarni vaqtida kuzatib boring.</p></div></div>
    </div></section>

    <section className="section" id="opportunities" style={{paddingTop:20}}><div className="container"><div className="section-head"><div className="eyebrow">IMKONIYATLAR</div><h2>Hozir sizga mos bo‘lishi mumkin.</h2><p className="muted">Tekshirilgan e’lonlarni qidiring va turiga qarab saralang.</p></div>
      <div className="filters"><input aria-label="Qidirish" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Masalan: SMM, IT, Toshkent..." /> <div className="filter-tabs">{types.map(t=><button key={t} className={type===t?'active':''} onClick={()=>setType(t)}>{t}</button>)}</div></div>
      {loading && <p className="muted">Imkoniyatlar yuklanmoqda...</p>}
      <div className="opps">{filtered.map(o=><article className="opportunity" key={o.id}><div className="type">{o.type.toUpperCase()} {o.is_verified && ' · ✓ TEKSHIRILGAN'}</div><h3>{o.title}</h3><div className="meta">{o.organization} · {o.location} · {o.mode}<br/>{o.category} · {o.experience}</div><p className="muted">{o.description}</p><a className="card-link" href={o.url} target="_blank" rel="noreferrer">Batafsil ko‘rish →</a></article>)}</div>
      {!loading && !filtered.length && <div className="empty"><strong>Hozircha mos imkoniyat topilmadi.</strong><p className="muted">Qidiruv yoki filtrni o‘zgartirib ko‘ring.</p></div>}
    </div></section>

    <section className="section"><div className="container"><div className="cta"><div><div className="eyebrow" style={{color:'#8de2bf'}}>IMKONNI O‘TKAZIB YUBORMANG</div><h2>Keyingi yaxshi imkoniyat<br/>sizniki bo‘lishi mumkin.</h2></div><a className="btn" style={{background:'#fff',color:'var(--ink)'}} href="#opportunities">Boshlash →</a></div></div></section>
    <footer><div className="container">© 2026 Imkon · Yaxshi imkoniyatlar hammaga yaqinroq.</div></footer>
  </main>;
}
