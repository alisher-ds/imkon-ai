import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ opportunities: [] });

  const supabase = createClient(url, key);
  const params = request.nextUrl.searchParams;
  const type = params.get('type');
  const mode = params.get('mode');
  const category = params.get('category');
  const location = params.get('location');
  const q = params.get('q');

  let query = supabase.from('opportunities').select('*').eq('is_active', true);
  if (type && type !== 'Barchasi') query = query.eq('type', type);
  if (mode) query = query.eq('mode', mode);
  if (category) query = query.ilike('category', `%${category}%`);
  if (location) query = query.ilike('location', `%${location}%`);
  if (q) query = query.or(`title.ilike.%${q}%,organization.ilike.%${q}%,category.ilike.%${q}%,description.ilike.%${q}%`);

  const { data, error } = await query.order('deadline', { ascending: true, nullsFirst: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ opportunities: data ?? [] });
}
