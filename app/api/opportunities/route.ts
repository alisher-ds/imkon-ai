import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ opportunities: [] });

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('is_active', true)
    .order('deadline', { ascending: true, nullsFirst: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ opportunities: data ?? [] });
}
