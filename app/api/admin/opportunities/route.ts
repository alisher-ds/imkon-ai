import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Supabase server credentials are not configured');
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

function authorized(request: NextRequest) {
  const expected = process.env.IMKON_ADMIN_SECRET;
  return Boolean(expected && request.headers.get('x-imkon-admin-secret') === expected);
}

const allowedTypes = new Set(['Ish', 'Stajirovka', 'Grant', 'Kurs']);
const allowedModes = new Set(['Masofaviy', 'Ofis', 'Gibrid']);

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const required = ['title', 'organization', 'type', 'location', 'mode', 'category', 'url'];
  const missing = required.filter((key) => !body[key]);
  if (missing.length) return NextResponse.json({ error: `Missing: ${missing.join(', ')}` }, { status: 400 });
  if (!allowedTypes.has(String(body.type))) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  if (!allowedModes.has(String(body.mode))) return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });

  try {
    const supabase = adminClient();
    const row = {
      title: String(body.title).trim(),
      organization: String(body.organization).trim(),
      type: String(body.type),
      location: String(body.location).trim(),
      mode: String(body.mode),
      category: String(body.category).trim(),
      experience: String(body.experience || 'Boshlang‘ich'),
      description: String(body.description || '').trim(),
      deadline: body.deadline ? String(body.deadline) : null,
      url: String(body.url).trim(),
      is_verified: Boolean(body.is_verified),
      is_active: body.is_active !== false,
      source: body.source ? String(body.source).trim() : null,
      source_url: body.source_url ? String(body.source_url).trim() : null,
      external_id: body.external_id ? String(body.external_id).trim() : null,
      last_verified_at: body.is_verified ? new Date().toISOString() : null,
      verified_by: body.is_verified ? 'admin' : null,
      verification_note: body.verification_note ? String(body.verification_note).trim() : null,
      updated_at: new Date().toISOString(),
    };

    const query = row.source && row.external_id
      ? supabase.from('opportunities').upsert(row, { onConflict: 'source,external_id' }).select().single()
      : supabase.from('opportunities').insert(row).select().single();
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ opportunity: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}
