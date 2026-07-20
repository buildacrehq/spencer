# Buildacre Quotation Builder — Technical Handoff

**File:** `buildacre-quotation-builder.html`
**Type:** Single self-contained HTML file (~900 lines). No build step, no bundler, no dependencies to install. Open it directly in a browser.
**Stack:** Vanilla JS, vanilla CSS, no frameworks. Google Fonts loaded via CDN `<link>` tags (Fraunces, Inter, JetBrains Mono).

This doc is written so you (or Claude Code) can resume work on this file with zero missing context. Read it top to bottom once before making changes.

---

## 1. What this tool is

An internal tool for Buildacre (a Bengaluru turnkey construction company) to build client-facing construction quotations. It was reverse-engineered from two real PDF quotations the client uploaded (Mr. Ranjith / Mango Acres, and Mr. Kiran / Nagarabhavi), so the section structure, wording, and line items mirror their actual paper quotation format almost exactly.

It is **one continuously-editable document**, not a form-plus-preview split — every field on the page (client details, floor plan rows, spec tables, cost line items, terms paragraphs) is directly editable in place. There is deliberately no separate "builder" pane and no accordion/toggle UI — a previous iteration had both and the client explicitly rejected them ("don't add toggle", "why 2 tabs, keep it one").

## 2. Document structure (in the DOM, top to bottom)

```
.toolbar (sticky, dark)
  - brand icon + "BUILDACRE" wordmark (embedded base64 image)
  - Saved quotes <select> + Open / Delete
  - Sample: Ranjith / Sample: Kiran  (load prefilled reference quotes)
  - New Blank
  - Save
  - Export / Print PDF
  - live Total pill (always visible regardless of scroll position)

.page > .doc
  .cover           — embedded base64 logo image + "BlackFyre Infra Private Limited" + brand-color bar
  .doc-body
    01 Project Quotation           — client/site info, kv-grid of editable fields
    02 Floor Plan & Slab Area      — editable table, footer row = live total slab area
    03 Foundation Work Includes    — freeform textarea (scope assumptions bullet list)
    04 Base Construction Cost      — rate/sqft input × area = live base cost; "What This Rate Includes" note
    05 Specifications & Materials  — N category cards, each with editable item/spec rows
    06 Client Requirement Cost Break-up — editable table, footer row = live total
    Grand Total box                — base cost + requirements total, live, plus ₹/sqft
    07 Terms, Scope & Process       — 5 subsections, plain textareas (NOT collapsible — see §5)
    08 Design & Execution Workflow  — the 14-step post-advance-payment process, one textarea
```

Section numbers in the `<h2 class="doctitle">` badges are hardcoded in the HTML (`01`…`08`), not generated — if you insert/remove a section, renumber the badges manually.

## 3. Data model

Everything lives in one global `state` object (see `sampleState()` around line 328 for the canonical shape):

```js
state = {
  client: { name, place, location, khatha, siteDim, roadFacing, setback,
            soilCarting, startDate, quoteDate, validity, issuedBy, parentCo },
  floors: [ { id, floor, plan, purpose /* "OWN"|"RENT" */, area /* number */ } ],
  baseRate: number,               // ₹ per sqft
  foundationScope: string,        // freeform, newline-separated bullets
  costIncludes: string,           // freeform, what the per-sqft rate covers
  specs: [
    { id, title, rows: [ { id, item, spec } ] }   // N categories, each N rows
  ],
  requirements: [ { id, item, desc, cost /* number */ } ],
  terms: { freeze, adjust, exec, scope, included },  // all freeform strings
  workflow: string                // freeform, the 14-step process
}
```

Every array item carries a `uid()`-generated id (`'r' + counter`) used for React-less list diffing (find-by-id, filter-out-by-id on delete).

Three state factories:
- `sampleState()` — the Ranjith / Mango Acres reference quote (full data, used as the base template)
- `sampleStateKiran()` — calls `sampleState()` then overrides client/floors/kitchen/bathroom/doors/requirements/terms for the Kiran / Nagarabhavi quote (reuses all the boilerplate spec categories that are identical across both real PDFs — materials, design & drawings, earthwork, RCC & masonry, painting, flooring, electrical, technical info, freeze/adjust/exec policy text, the 14-step workflow)
- `blankState()` — calls `sampleState()` then clears client/floors/baseRate/requirements for a fresh quote, but **keeps** the boilerplate spec categories and terms text since those are standard across all Buildacre quotes

## 4. Rendering approach — important, non-obvious design decision

This is **not** a virtual-DOM / full-rerender-on-every-keystroke app. That was tried and rejected early on because it caused input focus loss while typing.

Instead:
- **Structural changes** (add/remove a floor row, add/remove a spec row, add/remove a category, load a different quote) call a `build*()` function that clears and rebuilds just that section's DOM subtree, attaching fresh event listeners.
- **Plain text edits** (typing in any field) only update the `state` object directly via `oninput` — no DOM rebuild at all, so focus is never lost.
- **Numeric edits that affect totals** (floor area, requirement cost, base rate) call `updateTotals()` after updating state — a lightweight function that only touches the handful of DOM nodes showing computed totals (`#totalAreaCell`, `#baseCostEcho`, `#reqTotalCell`, `#grandTotalEcho`, `#perSqftEcho`, `#pillTotal`). It does not rebuild anything else.

`rebuildDocument()` is the "rebuild everything" entry point, called only on init / load quote / load sample / new blank.

## 5. Deliberate UI decisions (don't "fix" these back)

- **No accordions/toggles anywhere.** Terms section used to be `<details>` elements; client explicitly asked to remove them. All content is always visible.
- **No split builder/preview panes.** Also explicitly rejected. One scrollable editable document only.
- **Totals live inside the tables themselves** (as a `tr.total-row` footer), not just in a separate summary — client complained totals were "not given in table" when they were only in a preview pane elsewhere.
- Bold is used deliberately on: floor names, requirement item names, spec item names (left column), all total-row figures — per client's "where text bold need use bold" request.

## 6. Export / Print — the part that took the most iteration, read carefully

`printQuotation()` (~line 860) is triggered by the **Export / Print PDF** button. Three bugs were found and fixed here, in order — if print output ever looks wrong again, check these first:

1. **Bug: exported layout used a completely different, plainer stylesheet than the live doc.**
   Fix: `buildStaticClone()` (~line 817) now clones the *actual* live `.doc` DOM node and reuses the *actual* `<style>` block, rather than generating a separate hand-written HTML template. Whatever the live page looks like, the export looks like, automatically — including any future style edits.

2. **Bug: text overflowed/got clipped at the page edge instead of wrapping.**
   Root cause was two-fold:
   - `buildStaticClone()` originally froze the *exact pixel width* read via `getComputedStyle` from the live screen onto the printed `<div>` replacements for each `<input>`/`<textarea>`/`<select>` — but a printed page is narrower than a browser window, so fixed-width content had nowhere to go.
   - Even after removing the fixed width, flex children (the two-column spec rows) still didn't wrap. This is the classic CSS flexbox gotcha: flex items default to `min-width: auto`, which prevents them shrinking below their content's natural width. Fix: explicitly set `min-width:0; max-width:100%;` on every frozen field div (see the `div.style.cssText` array in `buildStaticClone()`).

3. **Bug (the sneaky one): print output looked squeezed/cut off no matter what CSS was fixed.**
   Root cause: the hidden `<iframe>` used to trigger `window.print()` without a popup was sized `width:0; height:0`. The entire document was laying out inside a **48px-wide box** before printing — nothing to do with wrapping at all. Fixed by sizing the iframe to a realistic page size (`850px × 1100px`) and moving it off-screen with `left:-10000px` instead of collapsing it to zero. **Verified with an actual headless Chromium render (Playwright), not just reasoning about CSS** — confirmed 0 overflowing elements afterward. If you ever change the print mechanism, re-verify the same way; this bug was invisible from code review alone.

Print flow today: `printQuotation()` → `buildStaticClone()` (swap every input/textarea/select for a plain div carrying its frozen computed style + current value) → inject the clone + the page's own `<style>` into a hidden, realistically-sized iframe → `iframe.contentWindow.print()`.

**A browser's own print header/footer (file path, date, page number) is NOT part of this document** — that's chrome injected by the browser's print dialog. It can only be removed by the person printing, via "More settings → Headers and footers" in the print dialog. Don't try to suppress it from CSS; you can't.

## 7. Branding assets

- Two real logo files were supplied by the client (`New_BuildAcre_logo_for_website.png` = teal background, white logo; `New_BuildAcre_logo_for_website__1_.png` = white background, dark logo — note the confusing filenames, verify by checking corner pixel color if reusing).
- Both were programmatically cropped (via PIL, using pixel-diff-from-background row/column detection to find exact bounding boxes — not eyeballed) to isolate icon-only and icon+wordmark-only regions, discarding the "Building Your Dream Home" tagline (the doc already shows "BlackFyre Infra Private Limited" under the wordmark, matching the real quotation letterhead convention, so both taglines together would be redundant).
- Both crops are **embedded directly as base64 `data:` URIs** in the HTML (search for `data:image/png;base64,`) — zero external network dependency, works fully offline, can't break if buildacre.in changes hosting.
- Brand colors used throughout: teal `#0f766e` and clay/burnt-orange `#d9622b` — taken from the two-tone bar visible on the client's own real quotation PDF letterhead (I could not pull exact hex values from buildacre.in's live CSS since fetching only returns readable text, not stylesheets — the palette is a close-match reconstruction from the letterhead image, not a scraped exact value).

## 8. ⚠️ Critical compatibility note before you move this to VS Code / Claude Code

**`window.storage` (used by Save / Open / Delete quote, see `refreshQuoteList()` ~line 804 and the save/load button handlers) is a Claude.ai-artifact-only API.** It does not exist in a normal browser, a VS Code Live Server preview, or any other hosting context. Right now those calls are wrapped in try/catch so they fail *silently* (or with an alert) rather than crashing — but the Save/Open/Delete feature will simply do nothing once this file leaves claude.ai.

Before/while moving to VS Code, decide on one of:
- **Quick fix, same-browser-only persistence:** swap `window.storage.get/set/delete/list` for `localStorage` (`JSON.stringify`/`parse` a keyed object). This works in any browser but data won't sync across devices and is lost if the user clears browser data.
- **Proper fix, multi-device persistence:** stand up a tiny backend (even a single-file Node/Express or Flask API with SQLite) and swap those calls for `fetch()` calls. Needed if Yogesh/the sales team want quotes accessible from more than one machine.
- **No persistence, export-only:** rip out Save/Open/Delete entirely and rely purely on Export/Print PDF + the person re-uploading a previous PDF when they need to reference it. Simplest, but loses the "reopen an old quote to duplicate for a new client" workflow that exists today.

Nothing else in the file is Claude.ai-specific — no other Claude platform APIs are used. Once `window.storage` is swapped out, this runs anywhere as a completely static HTML file.

## 9. Known data-accuracy note (not a bug, just worth knowing)

In the original Ranjith PDF, the itemized Client Requirement Cost Break-up sums to ₹4,80,000 but the document states a total of ₹3,85,000 — an arithmetic inconsistency in the client's own source PDF. This tool's `sampleState()` reproduces the itemized figures faithfully and lets the math auto-total correctly (₹4,80,000), rather than forcing an incorrect total to match the original PDF's typo. Worth mentioning to the client if they ask why the sample total differs from their old PDF.

The Kiran sample was cross-checked the same way and its itemized total (₹3,15,000) does reconcile exactly with the stated total in that PDF — including correctly interpreting some garbled OCR text in the source (Staircase Railing = ₹15,000 MS + ₹60,000 SS = ₹75,000; Lift Provision marked "NILL" = ₹0 for that project).

## 10. Suggested next steps if continuing in Claude Code

Roughly in priority order:
1. Resolve the `window.storage` question above (§8) — everything else depends on knowing where this will be hosted/run.
2. Consider splitting into `index.html` / `styles.css` / `app.js` for easier version control and diffing, now that it's ~900 lines in one file. (Kept as a single file so far because Claude.ai's artifact system only renders single HTML files well.)
3. Add a real `.docx` export path (not just print-to-PDF) if the sales team wants an editable Word version to send clients — would need a docx-generation library or a backend endpoint, since this can't be done in-browser with vanilla JS.
4. If more Buildacre business lines get their own quotation format (interiors, real estate), consider whether they're different enough to warrant their own template/state shape, or whether `specs[]` is generic enough to reuse as-is (it likely is — it's just category → item/spec rows).
5. Multi-user considerations if this becomes a shared team tool: right now "Saved quotes" is a flat list with no client/date metadata beyond the key name — will need proper listing/search once there are dozens of saved quotes.
