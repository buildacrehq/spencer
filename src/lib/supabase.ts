import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// `supabase` is null when env vars aren't configured yet (e.g. local dev
// before the project is wired up). Callers must check for null and degrade
// gracefully — see src/lib/quotesRepo.ts.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(supabase);
