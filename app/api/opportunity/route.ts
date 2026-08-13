import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const id=request.nextUrl.searchParams.get('id');
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!id || !url || !key) return NextResponse.json({opportunity:null},{status:400});
  const supabase=createClient(url,key);
  const {data,error}=await supabase.from('opportunities').select('*').eq('id',id).eq('is_active',true).maybeSingle();
  if(error) return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({opportunity:data});
}
