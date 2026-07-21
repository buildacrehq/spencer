// Parses the "N. Title — description" numbered-list text format used by
// `workflow` and `terms.exec` (still stored/edited as one plain
// newline-joined string — see useQuoteHandlers.ts) into structured items,
// so the print/preview output can render real numbered rows with a bold
// title instead of one dense wrapped paragraph of "1. ... 2. ... 3. ..."
// text, which read as a textbook page rather than a client-facing
// document (reported 2026-07-21).
//
// Steps can carry extra sub-points — lines starting with "- " right after
// a numbered line (and before the next one) — for content that doesn't
// collapse into a single title/description pair (e.g. a meeting's
// attendee list and agenda). See the reference workflow doc added
// 2026-07-21 for the shape this covers.

export interface NumberedItem {
  num: string;
  title: string;
  desc: string | null;
  subBullets: string[];
}

const LINE_RE = /^(\d+)\.\s*(.+)$/;
const DASH_RE = /^(.*?)\s+[—–-]\s+(.+)$/;
const SUB_BULLET_RE = /^[-•○]\s+(.+)$/;

export function parseNumberedList(text: string): NumberedItem[] {
  const items: NumberedItem[] = [];
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const subMatch = line.match(SUB_BULLET_RE);
    if (subMatch && items.length) {
      items[items.length - 1].subBullets.push(subMatch[1]);
      continue;
    }

    const lineMatch = line.match(LINE_RE);
    if (!lineMatch) {
      items.push({ num: "", title: line, desc: null, subBullets: [] });
      continue;
    }
    const [, num, rest] = lineMatch;
    const dashMatch = rest.match(DASH_RE);
    if (!dashMatch) {
      items.push({ num, title: rest, desc: null, subBullets: [] });
      continue;
    }
    const [, title, desc] = dashMatch;
    items.push({ num, title, desc, subBullets: [] });
  }
  return items;
}
