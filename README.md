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

- `src/lib/types.ts` — the `QuoteState` shape (client info, floors, specs, requirements, terms, workflow, `template`).
- `src/lib/sampleData.ts` — the three reference quotes (Ranjith, Kiran, Ravi Kumar — the last is the current main content/structure reference) and a blank starter.
- `src/lib/totals.ts` — pure total/₹-per-sqft calculation.
- `src/lib/useQuoteHandlers.ts` — the state-mutation handlers (add/remove/update floor, spec row, requirement, etc.) shared by every template's editable Doc component, so templates only differ in markup, not editing logic.
- `src/lib/quotesRepo.ts` — save/open/delete, Supabase-backed with a localStorage fallback (see its header comment).
- `src/lib/supabase.ts` — the Supabase client (null when unconfigured).
- `src/lib/auth.ts` / `src/proxy.ts` / `src/app/login/` / `src/app/api/{login,logout}/` — the shared-password gate.
- `src/components/Toolbar.tsx` — the sticky top toolbar, including the template switcher.
- `legacy/` — the original single-file HTML prototype and its handoff doc, kept for reference.

### Templates

Each quote has a `template` field (`"classic" | "modern"`), saved as part of the quote data — reopening a saved quote restores whichever template it was saved with.

- **Classic** (`ClassicQuotationDoc.tsx` / `ClassicQuotationPrintView.tsx`) — the original design: serif headings, bordered/colored spec-category cards, teal/gold accents.
- **Modern** (`ModernQuotationDoc.tsx` / `ModernQuotationPrintView.tsx`) — sans-serif only, flat sections instead of cards, single restrained accent color, generous whitespace.

Each template ships an editable Doc component (`.screen-only`) and a read-only PrintView component (`.print-only`, rendered straight from state — see `ClassicQuotationPrintView.tsx`'s header comment for why this is a separate tree rather than DOM-cloning like the legacy version did). `src/app/page.tsx` picks the pair based on `state.template`.

To add another template: create `<Name>QuotationDoc.tsx` / `<Name>QuotationPrintView.tsx` using `useQuoteHandlers`, add its CSS (own class prefix, don't reuse another template's classes), add the option to `TemplateId` and the Toolbar's template `<select>`, and add the pair to the lookup in `page.tsx`.

**Print pagination rule that applies to every template:** each numbered section (01-08) forces a new page (`page-break-before:always` on the section heading) rather than flowing continuously from the previous section — see the print-media comment above each template's heading rule in `globals.css`.

## Live Page Preview

Browsers don't paginate on-screen HTML live — `@media print` / page-break CSS only takes effect during an actual print/PDF action, so pagination bugs were only ever discoverable by exporting and looking. The **Preview Pages** toolbar button (`src/components/PagePreviewModal.tsx`) fixes that: it renders the document as real, on-screen A4 page boxes using [Paged.js](https://pagedjs.org/), so you can see exactly what lands on which page without exporting anything. Not literally live-per-keystroke — it's a real layout pass over the whole document, so it renders on demand (open/Refresh), not on every edit.

Two non-obvious things about this integration, both documented at length in the relevant files — read them before touching this feature:

- Paged.js is loaded as a plain `<script>` tag from `public/vendor/paged.min.js` (global `window.PagedModule`), not via `import("pagedjs")` — the npm package's module entry pulls in an old ES5 polyfill chain that crashes under Turbopack's bundling.
- It's fed `public/print-preview.css`, a manually-synced copy of `globals.css` with `:nth-of-type(6n+N)` rules stripped — Paged.js's bundled CSS parser can't handle that selector microsyntax and throws. **If you edit `globals.css`, regenerate this file** (see the command in its own header comment) or the live preview will silently drift from the real export.

## Deploying

Standard Vercel deployment — connect this repo and set these env vars in the
Vercel project settings:

- `SITE_PASSWORD` — required before the URL is shared/public.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — for cross-device saved quotes.
