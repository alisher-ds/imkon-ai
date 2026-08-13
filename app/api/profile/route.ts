import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const profile = await request.json();
  if (!profile || typeof profile !== 'object') return NextResponse.json({ error: 'Invalid profile' }, { status: 400 });
  return NextResponse.json({ ok: true, profile });
}