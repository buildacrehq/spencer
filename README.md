# Buildacre — Quotation Builder

Next.js app for building client-facing construction quotations. Ported from a
single-file HTML prototype — see `legacy/buildacre-quotation-builder-HANDOFF.md`
for the full data model, UI decisions, and history behind this tool.

## Getting started

```bash
npm install
cp env.example .env.local   # optionally fill in SITE_PASSWORD + Supabase creds
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Both `.env.local` values are optional for local dev:

- No `SITE_PASSWORD` set → the app is open, no login screen.
- No Supabase creds set → Save/Open/Delete fall back to this browser's
  localStorage instead of erroring.

Fill both in before deploying somewhere public — see below.

## Access control

The whole app sits behind a single shared team password (`src/proxy.ts` +
`src/lib/auth.ts`) — no per-user accounts. Set `SITE_PASSWORD` in the
environment to turn it on; leave it unset to leave the app open (e.g. local
dev). The cookie stores a SHA-256 hash of the password, not the password
itself.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the project's SQL editor to create the `quotes` table.
3. Copy the project URL and anon key (Project Settings → API) into `.env.local`.

## Project structure

- `src/lib/types.ts` — the `QuoteState` shape (client info, floors, specs, requirements, terms, workflow).
- `src/lib/sampleData.ts` — the two reference quotes (Ranjith, Kiran) and a blank starter, ported verbatim from the legacy file.
- `src/lib/totals.ts` — pure total/₹-per-sqft calculation.
- `src/lib/quotesRepo.ts` — save/open/delete, Supabase-backed with a localStorage fallback (see its header comment).
- `src/lib/supabase.ts` — the Supabase client (null when unconfigured).
- `src/lib/auth.ts` / `src/proxy.ts` / `src/app/login/` / `src/app/api/{login,logout}/` — the shared-password gate.
- `src/components/QuotationDoc.tsx` — the editable document.
- `src/components/QuotationPrintView.tsx` — read-only render of the same state, shown only under `@media print` (see its header comment for why this is a separate tree rather than DOM-cloning like the legacy version did).
- `src/components/Toolbar.tsx` — the sticky top toolbar.
- `legacy/` — the original single-file HTML prototype and its handoff doc, kept for reference.

## Deploying

Standard Vercel deployment — connect this repo and set these env vars in the
Vercel project settings:

- `SITE_PASSWORD` — required before the URL is shared/public.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — for cross-device saved quotes.
