import { notFound } from "next/navigation";

export default async function OpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  let item: any = null;
  try {
    const res = await fetch(`${base}/api/opportunities`, { cache: "no-store" });
    const data = await res.json();
    item = data.opportunities?.find((x: any) => x.id === id);
  } catch {}
  if (!item) notFound();

  return <main className="mx-auto min-h-screen max-w-3xl px-5 py-10">
    <a href="/" className="text-sm text-slate-500">← Barcha imkoniyatlar</a>
    <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
      <div className="flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{item.type}</span>{item.is_verified && <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">✓ Tekshirilgan</span>}</div>
      <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">{item.title}</h1>
      <p className="mt-2 text-lg text-slate-600">{item.organization}</p>
      <div className="mt-7 grid gap-3 rounded-2xl bg-slate-50 p-5 text-sm md:grid-cols-2"><p>📍 {item.location}</p><p>💼 {item.mode}</p><p>🎯 {item.category}</p><p>⏳ {item.deadline ? new Date(item.deadline).toLocaleDateString("uz-UZ") : "Muddat ko‘rsatilmagan"}</p></div>
      <p className="mt-7 leading-7 text-slate-700">{item.description}</p>
      <a href={item.url} target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white">Rasmiy sahifaga o‘tish ↗</a>
    </article>
  </main>;
}
