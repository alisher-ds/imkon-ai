'use client';

import { useEffect, useMemo, useState } from 'react';
import { rankOpportunities } from '@/lib/matching-engine';
import { textMatches } from '@/lib/search';

type Opportunity = {
  id: string;
  title: string;
  organization: string;
  type: 'Ish' | 'Stajirovka' | 'Grant' | 'Kurs';
  location: string;
  mode: string;
  category: string;
  experience: string;
  description: string;
  deadline: string | null;
  url: string;
  is_verified: boolean;
  source?: string;
  source_url?: string;
};

type Profile = {
  location: string;
  category: string;
  experience: string;
  mode: string;
  type: string;
};

const empty: Profile = {
  location: '',
  category: '',
  experience: '',
  mode: '',
  type: 'Barchasi',
};

const types = ['Barchasi', 'Ish', 'Stajirovka', 'Grant', 'Kurs'];
const modes = ['Barchasi', 'Masofaviy', 'Ofis', 'Gibrid'];

export default function OpportunityBoard() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('Barchasi');
  const [mode, setMode] = useState('Barchasi');
  const [profile, setProfile] = useState<Profile>(empty);
  const [onboard, setOnboard] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [live, setLive] = useState(true);

  useEffect(() => {
    try {
      const p = localStorage.getItem('imkon-profile');
      if (p) setProfile(JSON.parse(p));

      const s = localStorage.getItem('imkon-saved');
      if (s) setSaved(JSON.parse(s));
    } catch {}

    load();
  }, []);

  async function load(p = profile, q = query) {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (q) params.set('q', q);
      if (p.location) params.set('location', p.location);
      if (type !== 'Barchasi') params.set('type', type);
      if (mode !== 'Barchasi') params.set('mode', mode);

      const [dbRes, liveRes] = await Promise.all([
        fetch('/api/opportunities?' + params.toString()),
        live
          ? fetch('/api/live-jobs?' + params.toString())
          : Promise.resolve(null),
      ]);

      const db = await dbRes.json();

      const lj = liveRes
        ? await liveRes.json()
        : { jobs: [] };

      const merged = [
        ...(db.opportunities || []),
        ...(lj.jobs || []),
      ];

      setItems(
        [...new Map(
          merged.map((o: any) => [o.url || o.id, o])
        ).values()]
      );
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  const save = (id: string) => {
    setSaved((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];

      localStorage.setItem(
        'imkon-saved',
        JSON.stringify(next)
      );

      return next;
    });
  };

  const ranked = useMemo(
    () => rankOpportunities(profile, items),
    [items, profile]
  );

  const filtered = ranked.filter(
    (o) =>
      (type === 'Barchasi' || o.type === type) &&
      (mode === 'Barchasi' || o.mode === mode) &&
      textMatches(query, [
        o.title,
        o.organization,
        o.category,
        o.location,
        o.description,
      ])
  );

  const submit = () => {
    localStorage.setItem(
      'imkon-profile',
      JSON.stringify(profile)
    );

    setOnboard(false);
    load(profile, profile.category);
  };

  const detailHref = (o: any) => {
    if (o.source_url) return o.source_url;
    if (o.url) return o.url;

    return `/opportunities/${encodeURIComponent(o.id)}`;
  };

  return (
    <section
      className="section"
      id="opportunities"
    >
      <div className="container">

        <div className="section-head">
          <div className="eyebrow">
            IMKONIYATLAR
          </div>

          <h2>
            Haqiqiy manbalardan, sizga moslab.
          </h2>

          <p className="muted">
            Tasdiqlangan mahalliy imkoniyatlar va ochiq
            ish manbalaridan real vaqtda yig‘ilgan
            natijalarni bir joyda ko‘ring.
          </p>
        </div>

        <div className="filters">

          <input
            aria-label="Qidirish"
            value={query}
            onChange={(e) => {
              const value = e.target.value;

              setQuery(value);

              if (
                value.length >= 2 ||
                value.length === 0
              ) {
                load(profile, value);
              }
            }}
            placeholder="Masalan: ML, Python, SMM, Qarshi..."
          />

          <button
            className="btn btn-secondary"
            onClick={() => setOnboard(true)}
          >
            Profilni sozlash
          </button>

          <div className="filter-tabs">
            {types.map((t) => (
              <button
                key={t}
                className={
                  type === t ? 'active' : ''
                }
                onClick={() => {
                  setType(t);

                  setTimeout(
                    () => load(profile, query),
                    0
                  );
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="filter-tabs">
            {modes.map((m) => (
              <button
                key={m}
                className={
                  mode === m ? 'active' : ''
                }
                onClick={() => {
                  setMode(m);

                  setTimeout(
                    () => load(profile, query),
                    0
                  );
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="muted">
            Imkoniyatlar yuklanmoqda…
          </p>
        ) : (
          <>
            <div className="result-count">
              <strong>
                {filtered.length}
              </strong>{' '}
              ta mos imkoniyat topildi
            </div>

            <div className="opps">

              {filtered.map((o: any) => (
                <article
                  className="opportunity"
                  key={o.id}
                >

                  <div className="type">
                    {o.type.toUpperCase()}{' '}
                    {o.is_verified &&
                      ' · ✓ TEKSHIRILGAN'}
                  </div>

                  <h3>
                    {o.title}
                  </h3>

                  <div className="meta">
                    {o.organization} · {o.location} ·{' '}
                    {o.mode}
                    <br />
                    {o.category} · {o.experience}
                  </div>

                  <p className="muted">
                    {o.description}
                  </p>

                  <div className="card-actions">

                    <a
                      className="card-link"
                      href={detailHref(o)}
                      target={
                        o.source_url || o.url
                          ? '_blank'
                          : undefined
                      }
                      rel={
                        o.source_url || o.url
                          ? 'noopener noreferrer'
                          : undefined
                      }
                    >
                      Batafsil →
                    </a>

                    <button
                      className={`save-btn ${
                        saved.includes(o.id)
                          ? 'saved'
                          : ''
                      }`}
                      onClick={() => save(o.id)}
                    >
                      {saved.includes(o.id)
                        ? '♥ Saqlandi'
                        : '♡ Saqlash'}
                    </button>

                  </div>

                  {o.source && (
                    <small className="muted">
                      Manba: {o.source}
                    </small>
                  )}

                  {o._matchScore > 0 && (
                    <small className="muted">
                      Moslik: {o._matchScore}%
                    </small>
                  )}

                </article>
              ))}

            </div>
          </>
        )}

        {!loading && !filtered.length && (
          <div className="empty">

            <strong>
              Hozircha mos imkoniyat topilmadi.
            </strong>

            <p className="muted">
              Masalan, “ML” o‘rniga “Machine Learning”,
              “Python” yoki “Data Science” ham avtomatik
              qidiriladi.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => setOnboard(true)}
            >
              Profilni sozlash →
            </button>

          </div>
        )}

        {onboard && (
          <div className="modal-backdrop">

            <div className="modal">

              <button
                className="modal-close"
                onClick={() => setOnboard(false)}
              >
                ×
              </button>

              <div className="eyebrow">
                SIZGA MOSLASH
              </div>

              <h2>
                Profilingizni belgilang.
              </h2>

              <p className="muted">
                Bu ma’lumotlar natijalarni izohlash
                va tartiblash uchun ishlatiladi.
              </p>

              <div className="form-grid">

                <input
                  placeholder="Hudud: Qarshi"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      location: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Yo‘nalish: ML, IT, SMM..."
                  value={profile.category}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      category: e.target.value,
                    })
                  }
                />

                <select
                  value={profile.experience}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      experience: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Tajriba
                  </option>

                  <option>
                    Boshlang‘ich
                  </option>

                  <option>
                    O‘rta
                  </option>

                  <option>
                    Tajribali
                  </option>
                </select>

                <select
                  value={profile.mode}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      mode: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Format
                  </option>

                  <option>
                    Masofaviy
                  </option>

                  <option>
                    Ofis
                  </option>

                  <option>
                    Gibrid
                  </option>

                  <option>
                    Farqi yo‘q
                  </option>
                </select>

                <select
                  value={profile.type}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      type: e.target.value,
                    })
                  }
                >
                  {types.map((t) => (
                    <option key={t}>
                      {t}
                    </option>
                  ))}
                </select>

              </div>

              <button
                className="btn btn-primary full"
                onClick={submit}
              >
                Mos imkoniyatlarni topish →
              </button>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
