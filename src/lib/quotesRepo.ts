import { supabase } from "./supabase";
import type { QuoteState } from "./types";

// Replaces the Claude.ai-artifact-only `window.storage` API used by the
// legacy single-file build (see legacy/buildacre-quotation-builder-HANDOFF.md §8)
// with a real Supabase-backed `quotes` table so saved quotes sync across
// devices. Schema: see supabase/schema.sql.

export interface QuoteListItem {
  id: string;
  name: string;
  updated_at: string;
}

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase isn't configured yet — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return supabase;
}

export async function listQuotes(): Promise<QuoteListItem[]> {
  const db = requireSupabase();
  const { data, error } = await db
    .from("quotes")
    .select("id, name, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function loadQuote(name: string): Promise<QuoteState> {
  const db = requireSupabase();
  const { data, error } = await db
    .from("quotes")
    .select("data")
    .eq("name", name)
    .single();
  if (error) throw error;
  return data.data as QuoteState;
}

export async function saveQuote(name: string, state: QuoteState): Promise<void> {
  const db = requireSupabase();
  const { error } = await db
    .from("quotes")
    .upsert({ name, data: state, updated_at: new Date().toISOString() }, { onConflict: "name" });
  if (error) throw error;
}

export async function deleteQuote(name: string): Promise<void> {
  const db = requireSupabase();
  const { error } = await db.from("quotes").delete().eq("name", name);
  if (error) throw error;
}
