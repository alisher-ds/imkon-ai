'use client';
import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/browser';

export default function LoginPage(){
 const [email,setEmail]=useState(''); const [sent,setSent]=useState(false); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
 async function submit(e:FormEvent){e.preventDefault();setLoading(true);setError(''); const {error}=await createClient().auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin}}); if(error)setError(error.message); else setSent(true); setLoading(false);}
 return <main className="auth-shell"><div className="auth-card"><a href="/" className="back">← Imkon</a><div className="eyebrow">KIRISH</div><h1>Imkoniyatlaringizni saqlab boring.</h1><p className="muted">Emailingizni kiriting. Parol eslab yurish shart emas — sizga kirish havolasi yuboramiz.</p>{sent?<div className="success-box"><strong>Havola yuborildi.</strong><p className="muted">Emailingizni tekshiring va havolani bosing.</p></div>:<form onSubmit={submit}><label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="siz@example.com"/></label>{error&&<p className="error">{error}</p>}<button className="btn btn-primary full" disabled={loading}>{loading?'Yuborilmoqda…':'Kirish havolasini yuborish'}</button></form>}<p className="tiny">Demo emas: Supabase Auth sozlangach bu haqiqiy passwordless login bo‘ladi.</p></div></main>;
}
