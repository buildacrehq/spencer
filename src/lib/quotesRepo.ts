import { supabase } from "./supabase";
import type { QuoteState } from "./types";

// Replaces the Claude.ai-artifact-only `window.storage` API used by the
// legacy single-file build (see legacy/buildacre-quotation-builder-HANDOFF.md §8)
// with a real backing store so saved quotes work everywhere this app runs.
//
// Uses Supabase (see supabase/schema.sql) when NEXT_PUBLIC_SUPABASE_URL /
// NEXT_PUBLIC_SUPABASE_ANON_KEY are configured — quotes then sync across
// devices. Falls back to this browser's localStorage otherwise, so
// Save/Open/Delete work immediately without waiting on that setup (this was
// "Quick fix" option in the legacy handoff doc's §8 — not a permanent
// replacement for Supabase, just makes the tool usable before it's wired up).

export interface QuoteListItem {
  id: string;
  name: string;
  updated_at: string;
}

const LOCAL_PREFIX = "buildacre_quote:";

function localKey(name: string) {
  return LOCAL_PREFIX + name;
}

function listQuotesLocal(): QuoteListItem[] {
  if (typeof window === "undefined") return [];
  const items: QuoteListItem[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith(LOCAL_PREFIX)) continue;
    try {
      const record = JSON.parse(window.localStorage.getItem(key)!);
      items.push({ id: key, name: record.name, updated_at: record.updated_at });
    } catch {
      // ignore corrupt entries
    }
  }
  return items.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
}

function loadQuoteLocal(name: string): QuoteState {
  const raw = window.localStorage.getItem(localKey(name));
  if (!raw) throw new Error(`No saved quote named "${name}"`);
  return JSON.parse(raw).data as QuoteState;
}

function saveQuoteLocal(name: string, state: QuoteState): void {
  window.localStorage.setItem(
    localKey(name),
    JSON.stringify({ name, data: state, updated_at: new Date().toISOString() })
  );
}

function deleteQuoteLocal(name: string): void {
  window.localStorage.removeItem(localKey(name));
}

export async function listQuotes(): Promise<QuoteListItem[]> {
  if (!supabase) return listQuotesLocal();
  const { data, error } = await supabase
    .from("quotes")
    .select("id, name, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function loadQuote(name: string): Promise<QuoteState> {
  if (!supabase) return loadQuoteLocal(name);
  const { data, error } = await supabase.from("quotes").select("data").eq("name", name).single();
  if (error) throw error;
  return data.data as QuoteState;
}

export async function saveQuote(name: string, state: QuoteState): Promise<void> {
  if (!supabase) return saveQuoteLocal(name, state);
  const { error } = await supabase
    .from("quotes")
    .upsert({ name, data: state, updated_at: new Date().toISOString() }, { onConflict: "name" });
  if (error) throw error;
}

export async function deleteQuote(name: string): Promise<void> {
  if (!supabase) return deleteQuoteLocal(name);
  const { error } = await supabase.from("quotes").delete().eq("name", name);
  if (error) throw error;
}
