import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const reasons = new Set(['expired','wrong_info','broken_link','spam','duplicate','other']);

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Reporting is temporarily unavailable' }, { status: 503 });
  let body: { opportunity_id?: string; reason?: string; note?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!body.opportunity_id || !body.reason || !reasons.has(body.reason)) return NextResponse.json({ error: 'Invalid report' }, { status: 400 });

  const supabase = createClient(url, key);
  const { error } = await supabase.from('opportunity_reports').insert({
    opportunity_id: body.opportunity_id,
    reason: body.reason,
    note: body.note?.slice(0, 500) || null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
