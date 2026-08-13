export function getPublicSupabaseConfig(){
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  };
}

export function hasSupabaseConfig(){
  const {url, anonKey}=getPublicSupabaseConfig();
  return Boolean(url && anonKey);
}
