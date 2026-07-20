# Buildacre — Quotation Builder

Next.js app for building client-facing construction quotations. Ported from a
single-file HTML prototype — see `legacy/buildacre-quotation-builder-HANDOFF.md`
for the full data model, UI decisions, and history behind this tool.

## Getting started

```bash
npm install
cp env.example .env.local   # fill in Supabase project URL + anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without `.env.local` configured the app still runs — you can edit and print
quotations — but Save/Open/Delete (which read/write the `quotes` table in
Supabase) will show an error until Supabase is wired up.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the project's SQL editor to create the `quotes` table.
3. Copy the project URL and anon key (Project Settings → API) into `.env.local`.

## Project structure

- `src/lib/types.ts` — the `QuoteState` shape (client info, floors, specs, requirements, terms, workflow).
- `src/lib/sampleData.ts` — the two reference quotes (Ranjith, Kiran) and a blank starter, ported verbatim from the legacy file.
- `src/lib/totals.ts` — pure total/₹-per-sqft calculation.
- `src/lib/quotesRepo.ts` / `src/lib/supabase.ts` — Supabase-backed save/open/delete.
- `src/components/QuotationDoc.tsx` — the editable document.
- `src/components/QuotationPrintView.tsx` — read-only render of the same state, shown only under `@media print` (see its header comment for why this is a separate tree rather than DOM-cloning like the legacy version did).
- `src/components/Toolbar.tsx` — the sticky top toolbar.
- `legacy/` — the original single-file HTML prototype and its handoff doc, kept for reference.

## Deploying

Standard Vercel deployment — connect this repo and set the two
`NEXT_PUBLIC_SUPABASE_*` env vars in the Vercel project settings.
