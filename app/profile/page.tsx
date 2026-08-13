"use client";

import { useState } from "react";

const fields = ["IT", "SMM", "Biznes", "Dizayn", "Ta’lim", "Moliya"];

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-10">
      <a href="/" className="text-sm text-slate-500">← Imkon</a>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-blue-600">Sizga moslashtirish</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Profilingizni sozlang</h1>
        <p className="mt-2 text-slate-600">Bir marta tanlang — Imkon keyingi imkoniyatlarni shu ma’lumotlarga qarab saralaydi.</p>
        <div className="mt-8 grid gap-5">
          <label className="grid gap-2 text-sm font-medium">Hudud<input className="rounded-xl border p-3" placeholder="Masalan: Qarshi" /></label>
          <label className="grid gap-2 text-sm font-medium">Tajriba<select className="rounded-xl border p-3"><option>Boshlang‘ich</option><option>1 yilgacha</option><option>1–3 yil</option><option>3+ yil</option></select></label>
          <fieldset><legend className="text-sm font-medium">Yo‘nalish</legend><div className="mt-2 flex flex-wrap gap-2">{fields.map(f => <button type="button" key={f} onClick={() => setSaved(!saved)} className={`rounded-full border px-4 py-2 text-sm ${saved ? "border-blue-600 bg-blue-50 text-blue-700" : ""}`}>{f}</button>)}</div></fieldset>
          <label className="grid gap-2 text-sm font-medium">Format<select className="rounded-xl border p-3"><option>Masofaviy</option><option>Ofis</option><option>Gibrid</option><option>Farqi yo‘q</option></select></label>
          <button className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white">Menga mos imkoniyatlarni ko‘rsatish →</button>
        </div>
      </div>
    </main>
  );
}
