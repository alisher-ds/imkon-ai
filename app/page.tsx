const opportunities = [
  { type:'STAJIROVKA', title:'Junior SMM Intern', meta:'Toshkent · Remote · Boshlang‘ich', deadline:'Arizalar ochiq' },
  { type:'GRANT', title:'Global Undergraduate Grant', meta:'Xalqaro · Bakalavr · Fully funded', deadline:'Deadline: 42 kun' },
  { type:'KURS', title:'Bepul Data Analytics kursi', meta:'Online · Sertifikat · 0 so‘m', deadline:'Qabul davom etmoqda' },
];

export default function Home() {
  return <main>
    <section className="hero">
      <div className="container">
        <nav className="nav"><div className="logo">imkon<span>.</span></div><a href="#opportunities">Imkoniyatlarni ko‘rish →</a></nav>
        <div className="hero-grid">
          <div>
            <div className="pill">✦ O‘zbekiston yoshlari uchun</div>
            <div className="eyebrow" style={{marginTop:22}}>SIZGA MOS IMKONIYATLAR — BIR JOYDA</div>
            <h1>Yaxshi imkoniyatni qidirib <span style={{color:'var(--accent)'}}>vaqt yo‘qotmang.</span></h1>
            <p className="hero-copy">Imkon sizning hududingiz, yo‘nalishingiz va tajribangizga mos ish, stajirovka, grant va bepul kurslarni saralab beradi.</p>
            <div className="actions"><a className="btn btn-primary" href="#opportunities">Imkoniyatlarni topish →</a><a className="btn btn-secondary" href="#how">Qanday ishlaydi?</a></div>
          </div>
          <div className="mock"><div className="phone"><div className="phone-top"><span>9:41</span><span>● ● ●</span></div><div className="bot-title">Salom, Alisher 👋</div><div className="bot-sub">Bugun siz uchun 3 ta yangi imkoniyat topdik.</div>
            <div className="op"><strong>Junior SMM Intern</strong><small>📍 Toshkent · 🏠 Remote</small><span className="tag">Sizga mos</span><span className="tag">Boshlang‘ich</span></div>
            <div className="op"><strong>Global Undergraduate Grant</strong><small>🎓 Bakalavr · 💰 Fully funded</small><span className="tag">Grant</span><span className="tag">42 kun qoldi</span></div>
            <div className="op"><strong>Data Analytics kursi</strong><small>💻 Online · 0 so‘m · Sertifikat</small><span className="tag">Bepul</span></div>
          </div></div>
        </div>
      </div>
    </section>

    <section className="section" id="how"><div className="container"><div className="section-head"><div className="eyebrow">ODDIY. TEZ. FOYDALI.</div><h2>Telegramdagi shovqinni foydali imkoniyatga aylantiramiz.</h2><p className="muted">Siz yuzlab kanallarni kuzatishingiz shart emas. Imkon sizga kerakli narsalarni saralab beradi.</p></div>
      <div className="grid3"><div className="card"><div className="number">01</div><h3>Profilingizni belgilang</h3><p className="muted">Hudud, yo‘nalish, tajriba va qanday imkoniyat izlayotganingizni tanlang.</p></div><div className="card"><div className="number">02</div><h3>Moslarini oling</h3><p className="muted">Mos ishlar, stajirovkalar, grantlar va bepul kurslar bir joyda chiqadi.</p></div><div className="card"><div className="number">03</div><h3>Muddatni o‘tkazmang</h3><p className="muted">Muhim deadline va yangi imkoniyatlar haqida vaqtida xabar oling.</p></div></div>
    </div></section>

    <section className="section" id="opportunities" style={{paddingTop:20}}><div className="container"><div className="section-head"><div className="eyebrow">HOZIRGI NAMUNALAR</div><h2>Sizga mos bo‘lishi mumkin.</h2><p className="muted">Bu demo ma’lumotlar. Keyingi bosqichda real Supabase ma’lumotlar bazasi bilan almashtiriladi.</p></div><div className="opps">{opportunities.map((o)=><article className="opportunity" key={o.title}><div className="type">{o.type}</div><h3>{o.title}</h3><div className="meta">{o.meta}</div><div className="deadline">{o.deadline}</div></article>)}</div></div></section>

    <section className="section"><div className="container"><div className="cta"><div><div className="eyebrow" style={{color:'#8de2bf'}}>IMKONNI O‘TKAZIB YUBORMANG</div><h2>Keyingi yaxshi imkoniyat<br/>sizniki bo‘lishi mumkin.</h2></div><a className="btn" style={{background:'#fff',color:'var(--ink)'}} href="#opportunities">Boshlash →</a></div></div></section>
    <footer><div className="container">© 2026 Imkon · Yaxshi imkoniyatlar hammaga yaqinroq.</div></footer>
  </main>;
}
